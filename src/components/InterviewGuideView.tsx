import React, { useState } from 'react';
import {
  FileCheck,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Star,
  Copy,
  Check,
  Download,
  Filter,
  Brain,
  MessageSquare,
  Sparkles,
  ClipboardList,
  UserCheck,
  Award,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { InterviewQuestion, CandidateRating, RoleSummary } from '../types.ts';

interface InterviewGuideViewProps {
  questions: InterviewQuestion[];
  roleSummary: RoleSummary;
  onOpenChatWithPrompt: (prompt: string) => void;
}

export const InterviewGuideView: React.FC<InterviewGuideViewProps> = ({
  questions,
  roleSummary,
  onOpenChatWithPrompt,
}) => {
  const [filter, setFilter] = useState<'all' | 'hard' | 'soft'>('all');
  const [expandedQuestions, setExpandedQuestions] = useState<Record<number, boolean>>(() => {
    // Expand the first two by default
    return { 1: true, 2: true };
  });

  // Candidate rating state for interactive scorecard
  const [candidateName, setCandidateName] = useState('');
  const [ratings, setRatings] = useState<Record<number, CandidateRating>>({});
  const [copied, setCopied] = useState(false);

  // AI Evaluation modal/state for a specific question
  const [evaluatingQuestionId, setEvaluatingQuestionId] = useState<number | null>(null);
  const [evalAnswer, setEvalAnswer] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evalResult, setEvalResult] = useState<any>(null);

  const toggleExpand = (id: number) => {
    setExpandedQuestions((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const expandAll = () => {
    const all: Record<number, boolean> = {};
    questions.forEach((q) => {
      all[q.id] = true;
    });
    setExpandedQuestions(all);
  };

  const collapseAll = () => {
    setExpandedQuestions({});
  };

  const handleScoreChange = (qId: number, score: number) => {
    setRatings((prev) => ({
      ...prev,
      [qId]: {
        score,
        notes: prev[qId]?.notes || '',
        checkedGreenFlags: prev[qId]?.checkedGreenFlags || [],
        checkedRedFlags: prev[qId]?.checkedRedFlags || [],
      },
    }));
  };

  const handleNotesChange = (qId: number, notes: string) => {
    setRatings((prev) => ({
      ...prev,
      [qId]: {
        score: prev[qId]?.score || 0,
        notes,
        checkedGreenFlags: prev[qId]?.checkedGreenFlags || [],
        checkedRedFlags: prev[qId]?.checkedRedFlags || [],
      },
    }));
  };

  const toggleFlag = (qId: number, type: 'green' | 'red', index: number) => {
    setRatings((prev) => {
      const current = prev[qId] || {
        score: 0,
        notes: '',
        checkedGreenFlags: [],
        checkedRedFlags: [],
      };
      const key = type === 'green' ? 'checkedGreenFlags' : 'checkedRedFlags';
      const list = [...current[key]];
      const exists = list.indexOf(index);
      if (exists > -1) {
        list.splice(exists, 1);
      } else {
        list.push(index);
      }
      return {
        ...prev,
        [qId]: {
          ...current,
          [key]: list,
        },
      };
    });
  };

  // Compute overall candidate score
  const ratedQuestions = Object.values(ratings).filter((r) => r.score > 0);
  const avgScore =
    ratedQuestions.length > 0
      ? (ratedQuestions.reduce((acc, r) => acc + r.score, 0) / ratedQuestions.length).toFixed(1)
      : null;

  const getRecommendation = (scoreNum: number) => {
    if (scoreNum >= 4.2) return { text: 'Strong Hire', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' };
    if (scoreNum >= 3.5) return { text: 'Hire', color: 'bg-blue-500/20 text-blue-300 border-blue-500/40' };
    if (scoreNum >= 2.8) return { text: 'Leaning No Hire', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40' };
    return { text: 'Strong No Hire', color: 'bg-rose-500/20 text-rose-300 border-rose-500/40' };
  };

  const filteredQuestions = questions.filter((q) => {
    if (filter === 'all') return true;
    return q.skillType.toLowerCase().includes(filter);
  });

  // Export full guide as Markdown
  const handleCopyGuide = () => {
    let md = `# Interview Guide: ${roleSummary.title} (10 Behavioral Questions)\n\n`;
    md += `Department: ${roleSummary.department} | Seniority: ${roleSummary.seniority}\n\n`;
    if (candidateName) {
      md += `Candidate: ${candidateName} | Average Score: ${avgScore || 'Not evaluated'}/5.0\n\n`;
    }

    questions.forEach((q) => {
      md += `## Q${q.id}. [${q.skillType.toUpperCase()}] ${q.skillName}\n`;
      md += `**Question:** "${q.question}"\n\n`;
      md += `**Why It Matters:** ${q.rationale}\n\n`;
      md += `### Positive Indicators (Green Flags):\n`;
      q.greenFlags.forEach((gf) => (md += `- [ ] ${gf}\n`));
      md += `\n### Red Flags:\n`;
      q.redFlags.forEach((rf) => (md += `- [ ] ${rf}\n`));
      md += `\n### Probing Follow-Ups:\n`;
      q.followUpProbes.forEach((probe) => (md += `- ${probe}\n`));
      md += `\n### Scoring Rubric:\n`;
      md += `- 1 (Below Expectations): ${q.rubric.score1}\n`;
      md += `- 3 (Meets Expectations): ${q.rubric.score3}\n`;
      md += `- 5 (Exceeds Expectations): ${q.rubric.score5}\n\n`;

      const rating = ratings[q.id];
      if (rating && rating.score > 0) {
        md += `**Candidate Rating:** ${rating.score}/5\n`;
        if (rating.notes) md += `**Interviewer Notes:** ${rating.notes}\n`;
        md += `\n`;
      }
      md += `---\n\n`;
    });

    navigator.clipboard.writeText(md);
    setCopied(true);
    confetti({ particleCount: 30, spread: 50 });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRunAnswerEvaluation = async (q: InterviewQuestion) => {
    if (!evalAnswer.trim()) return;
    setIsEvaluating(true);
    setEvalResult(null);

    try {
      const response = await fetch('/api/evaluate-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: q.question,
          skillName: q.skillName,
          rubric: q.rubric,
          candidateAnswer: evalAnswer,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setEvalResult(data.evaluation);
        // Automatically populate score if confirmed
        if (data.evaluation.score) {
          handleScoreChange(q.id, data.evaluation.score);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-purple-600/20 text-purple-400 border border-purple-500/30">
              <FileCheck className="w-4 h-4" />
            </span>
            <span className="text-xs font-semibold tracking-wide uppercase text-purple-400">
              Output 2: 10-Question Behavioral Interview Guide
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
            Role Competency Interview Guide
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Strictly derived from the Hard & Soft skills defined in the new Job Description
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={expandAll}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-colors"
          >
            Expand All
          </button>
          <button
            onClick={collapseAll}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-colors"
          >
            Collapse All
          </button>
          <button
            onClick={handleCopyGuide}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center space-x-2 transition-all shadow-md ${
              copied
                ? 'bg-emerald-600 text-white'
                : 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-600/30'
            }`}
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied Guide!' : 'Copy Markdown Guide'}</span>
          </button>
        </div>
      </div>

      {/* Interactive Candidate Scorecard Live Bar */}
      <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 shadow-md">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          {/* Candidate Name Input */}
          <div className="flex items-center space-x-3 w-full lg:w-auto">
            <UserCheck className="w-5 h-5 text-indigo-400" />
            <input
              type="text"
              placeholder="Candidate Name (e.g. Alex Morgan)"
              value={candidateName}
              onChange={(e) => setCandidateName(e.target.value)}
              className="bg-slate-950 text-slate-200 text-xs sm:text-sm px-3 py-1.5 rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/50 w-full sm:w-64"
            />
          </div>

          {/* Real-time Score Counter */}
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <div className="flex items-center space-x-2">
              <span className="text-slate-400">Questions Evaluated:</span>
              <span className="font-bold text-slate-100 bg-slate-800 px-2 py-0.5 rounded">
                {ratedQuestions.length} / {questions.length}
              </span>
            </div>

            {avgScore && (
              <div className="flex items-center space-x-2">
                <span className="text-slate-400">Average Rating:</span>
                <span className="text-sm font-extrabold text-amber-400 flex items-center space-x-1">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>{avgScore} / 5.0</span>
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full font-bold border text-xs ${
                    getRecommendation(parseFloat(avgScore)).color
                  }`}
                >
                  {getRecommendation(parseFloat(avgScore)).text}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filter === 'all'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            All Questions ({questions.length})
          </button>
          <button
            onClick={() => setFilter('hard')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filter === 'hard'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            🛠️ Hard Skills ({questions.filter((q) => q.skillType.toLowerCase().includes('hard')).length})
          </button>
          <button
            onClick={() => setFilter('soft')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filter === 'soft'
                ? 'bg-purple-600 text-white'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            🤝 Soft Skills ({questions.filter((q) => q.skillType.toLowerCase().includes('soft')).length})
          </button>
        </div>

        <p className="text-xs text-slate-400 hidden sm:block">
          Click question cards to expand scoring rubrics and live evaluation
        </p>
      </div>

      {/* Questions List (10 Targeted Items) */}
      <div className="space-y-4">
        {filteredQuestions.map((q) => {
          const isExpanded = !!expandedQuestions[q.id];
          const isHardSkill = q.skillType.toLowerCase().includes('hard');
          const currentRating = ratings[q.id] || {
            score: 0,
            notes: '',
            checkedGreenFlags: [],
            checkedRedFlags: [],
          };

          return (
            <div
              key={q.id}
              className={`rounded-2xl border transition-all ${
                currentRating.score > 0
                  ? 'bg-slate-900/90 border-indigo-500/50 shadow-md shadow-indigo-500/10'
                  : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Question Header Card */}
              <div
                onClick={() => toggleExpand(q.id)}
                className="p-5 cursor-pointer flex items-start justify-between gap-4 select-none"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-slate-800 text-slate-300 text-xs font-bold flex items-center justify-center border border-slate-700">
                      {q.id}
                    </span>
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${
                        isHardSkill
                          ? 'bg-blue-500/10 text-blue-300 border-blue-500/30'
                          : 'bg-purple-500/10 text-purple-300 border-purple-500/30'
                      }`}
                    >
                      {isHardSkill ? '🛠️ Hard Skill' : '🤝 Soft Skill'} &bull; {q.skillName}
                    </span>

                    {currentRating.score > 0 && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center space-x-1 font-bold">
                        <Star className="w-3 h-3 fill-amber-400" />
                        <span>Score: {currentRating.score}/5</span>
                      </span>
                    )}
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
                    "{q.question}"
                  </h3>

                  <p className="text-xs text-slate-400">
                    <strong className="text-slate-300">Why this matters:</strong> {q.rationale}
                  </p>
                </div>

                <div className="flex items-center space-x-3 pt-1">
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  )}
                </div>
              </div>

              {/* Collapsible Content */}
              {isExpanded && (
                <div className="px-5 pb-6 pt-2 border-t border-slate-800/80 space-y-5">
                  {/* Indicators Grid: Green vs Red Flags */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Green Flags */}
                    <div className="bg-emerald-950/20 rounded-xl p-4 border border-emerald-500/30 space-y-2.5">
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <h4 className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                          What To Look For (Green Flags)
                        </h4>
                      </div>
                      <div className="space-y-2">
                        {q.greenFlags?.map((flag, idx) => {
                          const isChecked = currentRating.checkedGreenFlags.includes(idx);
                          return (
                            <label
                              key={idx}
                              onClick={(e) => e.stopPropagation()}
                              className={`flex items-start space-x-2 text-xs cursor-pointer p-1.5 rounded-lg transition-colors ${
                                isChecked ? 'bg-emerald-900/40 text-emerald-100 font-medium' : 'text-slate-300 hover:bg-slate-800/40'
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => toggleFlag(q.id, 'green', idx)}
                                className="mt-0.5 rounded border-emerald-500 text-emerald-500 focus:ring-0"
                              />
                              <span>{flag}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>

                    {/* Red Flags */}
                    <div className="bg-rose-950/20 rounded-xl p-4 border border-rose-500/30 space-y-2.5">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="w-4 h-4 text-rose-400" />
                        <h4 className="text-xs font-bold text-rose-300 uppercase tracking-wider">
                          Warning Signs (Red Flags)
                        </h4>
                      </div>
                      <div className="space-y-2">
                        {q.redFlags?.map((flag, idx) => {
                          const isChecked = currentRating.checkedRedFlags.includes(idx);
                          return (
                            <label
                              key={idx}
                              onClick={(e) => e.stopPropagation()}
                              className={`flex items-start space-x-2 text-xs cursor-pointer p-1.5 rounded-lg transition-colors ${
                                isChecked ? 'bg-rose-900/40 text-rose-100 font-medium' : 'text-slate-300 hover:bg-slate-800/40'
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => toggleFlag(q.id, 'red', idx)}
                                className="mt-0.5 rounded border-rose-500 text-rose-500 focus:ring-0"
                              />
                              <span>{flag}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Follow-up Probing Questions */}
                  <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 space-y-2">
                    <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center space-x-1.5">
                      <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Suggested Follow-Up Probing Questions</span>
                    </h4>
                    <div className="grid grid-cols-1 gap-2">
                      {q.followUpProbes?.map((probe, idx) => (
                        <div
                          key={idx}
                          className="text-xs text-slate-300 flex items-start space-x-2 bg-slate-900/50 p-2 rounded-lg"
                        >
                          <span className="text-indigo-400 font-bold">P{idx + 1}:</span>
                          <span>"{probe}"</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 1-5 Scoring Rubric */}
                  <div className="bg-slate-950/90 rounded-xl p-4 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center space-x-1.5">
                        <Award className="w-3.5 h-3.5 text-amber-400" />
                        <span>Behavioral Scoring Rubric (1 - 5 Scale)</span>
                      </h4>
                      <span className="text-[11px] text-slate-400">STAR Evaluation Standard</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                      <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                        <span className="font-bold text-rose-400">Score 1 (Below Expectations)</span>
                        <p className="text-slate-300 leading-relaxed">{q.rubric.score1}</p>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                        <span className="font-bold text-blue-400">Score 3 (Meets Expectations)</span>
                        <p className="text-slate-300 leading-relaxed">{q.rubric.score3}</p>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                        <span className="font-bold text-emerald-400">Score 5 (Exceeds Expectations)</span>
                        <p className="text-slate-300 leading-relaxed">{q.rubric.score5}</p>
                      </div>
                    </div>
                  </div>

                  {/* Interactive Score Selector & Notes */}
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-slate-200">
                        Candidate Assessment for Q{q.id}:
                      </span>
                      <div className="flex items-center space-x-1.5">
                        {[1, 2, 3, 4, 5].map((val) => (
                          <button
                            key={val}
                            type="button"
                            onClick={() => handleScoreChange(q.id, val)}
                            className={`w-8 h-8 rounded-lg font-bold text-xs transition-all flex items-center justify-center ${
                              currentRating.score === val
                                ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-400 scale-105 shadow-md shadow-amber-500/20'
                                : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-700'
                            }`}
                          >
                            {val}
                          </button>
                        ))}
                        {currentRating.score > 0 && (
                          <button
                            type="button"
                            onClick={() => handleScoreChange(q.id, 0)}
                            className="text-[11px] text-slate-500 hover:text-slate-400 px-2"
                          >
                            Reset
                          </button>
                        )}
                      </div>
                    </div>

                    <textarea
                      rows={2}
                      value={currentRating.notes}
                      onChange={(e) => handleNotesChange(q.id, e.target.value)}
                      placeholder="Take live notes on candidate's STAR story, metrics shared, or demeanor..."
                      className="w-full bg-slate-900 text-slate-100 placeholder-slate-500 rounded-xl p-3 text-xs border border-slate-800 focus:outline-none focus:ring-1 focus:ring-purple-500 resize-none"
                    />

                    {/* AI Candidate Answer Evaluator Trigger */}
                    <div className="flex items-center justify-between pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setEvaluatingQuestionId(evaluatingQuestionId === q.id ? null : q.id);
                          setEvalResult(null);
                        }}
                        className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center space-x-1.5 transition-colors"
                      >
                        <Brain className="w-3.5 h-3.5" />
                        <span>
                          {evaluatingQuestionId === q.id
                            ? 'Close AI Evaluator'
                            : '⚡ Grade Candidate Answer with AI Rubric'}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          onOpenChatWithPrompt(
                            `Simulate a top candidate answering question #${q.id}: "${q.question}". Provide a realistic 5-star STAR response so I can test my interviewing team's evaluation skills.`
                          )
                        }
                        className="text-xs text-purple-400 hover:text-purple-300 flex items-center space-x-1 transition-colors"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Simulate Candidate in Chat</span>
                      </button>
                    </div>

                    {/* AI Answer Evaluator Drawer */}
                    {evaluatingQuestionId === q.id && (
                      <div className="mt-3 p-4 rounded-xl bg-slate-900 border border-indigo-500/30 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-indigo-300">
                            Paste Candidate's Answer or Transcript:
                          </span>
                          <span className="text-[10px] text-slate-400">
                            Evaluated using gemini-3.8-flash & question rubric
                          </span>
                        </div>
                        <textarea
                          rows={3}
                          value={evalAnswer}
                          onChange={(e) => setEvalAnswer(e.target.value)}
                          placeholder="Candidate said: 'In my last role at Stripe, we faced a cascading deadlock issue on our ledger database during Black Friday...'"
                          className="w-full bg-slate-950 text-slate-200 text-xs p-3 rounded-xl border border-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                        <button
                          type="button"
                          disabled={isEvaluating || !evalAnswer.trim()}
                          onClick={() => handleRunAnswerEvaluation(q)}
                          className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold flex items-center space-x-1.5"
                        >
                          {isEvaluating ? (
                            <>
                              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              <span>Analyzing STAR Breakdown...</span>
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-3.5 h-3.5" />
                              <span>Evaluate & Score Response</span>
                            </>
                          )}
                        </button>

                        {evalResult && (
                          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-white flex items-center space-x-1.5">
                                <Award className="w-4 h-4 text-amber-400" />
                                <span>AI Score: {evalResult.score}/5</span>
                              </span>
                              <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-semibold">
                                {evalResult.hiringRecommendation}
                              </span>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px]">
                              <div className="bg-slate-900 p-2 rounded">
                                <strong className="text-indigo-300">Situation:</strong>
                                <p className="text-slate-300 mt-0.5">{evalResult.starBreakdown?.situation}</p>
                              </div>
                              <div className="bg-slate-900 p-2 rounded">
                                <strong className="text-indigo-300">Task:</strong>
                                <p className="text-slate-300 mt-0.5">{evalResult.starBreakdown?.task}</p>
                              </div>
                              <div className="bg-slate-900 p-2 rounded">
                                <strong className="text-indigo-300">Action:</strong>
                                <p className="text-slate-300 mt-0.5">{evalResult.starBreakdown?.action}</p>
                              </div>
                              <div className="bg-slate-900 p-2 rounded">
                                <strong className="text-indigo-300">Result:</strong>
                                <p className="text-slate-300 mt-0.5">{evalResult.starBreakdown?.result}</p>
                              </div>
                            </div>

                            {evalResult.suggestedFollowUp && (
                              <div className="pt-1 text-[11px] text-amber-300">
                                <strong>Recommended Probing Question:</strong> "{evalResult.suggestedFollowUp}"
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
