import React, { useState } from 'react';
import {
  Copy,
  Check,
  Download,
  Share2,
  Linkedin,
  Sparkles,
  ExternalLink,
  MessageSquare,
  FileText,
  Eye,
  ListFilter,
  CheckCircle2,
  Bookmark,
  Send,
  Zap,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { JobDescription, RoleSummary } from '../types.ts';

interface JobDescriptionViewProps {
  jobDescription: JobDescription;
  roleSummary: RoleSummary;
  onOpenChatWithPrompt: (prompt: string) => void;
}

export const JobDescriptionView: React.FC<JobDescriptionViewProps> = ({
  jobDescription,
  roleSummary,
  onOpenChatWithPrompt,
}) => {
  const [viewMode, setViewMode] = useState<'linkedin' | 'structured' | 'markdown'>('linkedin');
  const [copied, setCopied] = useState(false);
  const [savedJob, setSavedJob] = useState(false);

  const fullText = jobDescription.fullFormattedLinkedInPost || '';
  const charCount = fullText.length;
  const wordCount = fullText.trim().split(/\s+/).length;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.8 },
    });
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = () => {
    const blob = new Blob([fullText], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${roleSummary.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_linkedin_jd.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top Banner / Stats */}
      <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30">
              <Linkedin className="w-4 h-4" />
            </span>
            <span className="text-xs font-semibold tracking-wide uppercase text-blue-400">
              Output 1: LinkedIn-Optimized Job Description
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
            {roleSummary.title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            {roleSummary.department} &bull; {roleSummary.seniority} &bull; {roleSummary.workplaceType}
          </p>
        </div>

        {/* View mode switcher & Export Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {/* View Mode Toggle */}
          <div className="bg-slate-950 p-1 rounded-xl border border-slate-800 flex items-center text-xs">
            <button
              onClick={() => setViewMode('linkedin')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center space-x-1.5 ${
                viewMode === 'linkedin'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>LinkedIn Card</span>
            </button>
            <button
              onClick={() => setViewMode('structured')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center space-x-1.5 ${
                viewMode === 'structured'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ListFilter className="w-3.5 h-3.5" />
              <span>Sections</span>
            </button>
            <button
              onClick={() => setViewMode('markdown')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center space-x-1.5 ${
                viewMode === 'markdown'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Raw Text</span>
            </button>
          </div>

          {/* Copy Button */}
          <button
            onClick={() => handleCopy(fullText)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center space-x-2 transition-all shadow-md ${
              copied
                ? 'bg-emerald-600 text-white ring-2 ring-emerald-400'
                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/30'
            }`}
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy for LinkedIn'}</span>
          </button>

          {/* Download Button */}
          <button
            onClick={handleDownload}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            title="Download Markdown"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800/80 flex items-center justify-between">
          <span className="text-xs text-slate-400">Total Characters</span>
          <span className="text-sm font-bold text-slate-100">{charCount}</span>
        </div>
        <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800/80 flex items-center justify-between">
          <span className="text-xs text-slate-400">Word Count</span>
          <span className="text-sm font-bold text-slate-100">{wordCount}</span>
        </div>
        <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800/80 flex items-center justify-between">
          <span className="text-xs text-slate-400">LinkedIn Length</span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            {charCount > 3500 ? 'Long' : charCount < 1200 ? 'Short' : 'Optimal'}
          </span>
        </div>
        <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800/80 flex items-center justify-between">
          <span className="text-xs text-slate-400">Formatting</span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
            Mobile-Scannable
          </span>
        </div>
      </div>

      {/* VIEW MODE 1: LINKEDIN CARD PREVIEW */}
      {viewMode === 'linkedin' && (
        <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
          {/* LinkedIn Mock Chrome Header */}
          <div className="bg-[#1b2735] px-6 py-4 border-b border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-700 flex items-center justify-center text-white font-bold text-xl shadow-md">
                {roleSummary.title.charAt(0) || 'R'}
              </div>
              <div>
                <h3 className="text-lg font-bold text-white leading-tight">
                  {jobDescription.headline || roleSummary.title}
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  TechScale Innovations &bull; {roleSummary.workplaceType} &bull; Posted just now
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setSavedJob(!savedJob)}
                className={`p-2 rounded-xl border transition-colors ${
                  savedJob
                    ? 'bg-blue-600 text-white border-blue-500'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                }`}
                title="Save Job"
              >
                <Bookmark className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleCopy(fullText)}
                className="px-3 py-1.5 rounded-xl bg-[#0a66c2] hover:bg-[#004182] text-white text-xs font-semibold flex items-center space-x-1.5 transition-colors shadow"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Easy Apply</span>
              </button>
            </div>
          </div>

          {/* LinkedIn Post Content Body */}
          <div className="p-6 sm:p-8 space-y-6 text-slate-200 text-sm leading-relaxed max-w-4xl font-sans">
            {/* Catchy Hook Callout */}
            <div className="p-4 rounded-xl bg-blue-950/40 border-l-4 border-blue-500 text-blue-100 font-medium text-base">
              {jobDescription.hook}
            </div>

            {/* About the role */}
            <div className="space-y-2">
              <h4 className="text-base font-bold text-white flex items-center space-x-2">
                <span>🎯 The Mission & Why This Role Matters</span>
              </h4>
              <p className="text-slate-300 whitespace-pre-line leading-relaxed">
                {jobDescription.roleMission}
              </p>
              {jobDescription.aboutCompanyAndTeam && (
                <p className="text-slate-400 text-xs sm:text-sm mt-1 leading-relaxed">
                  {jobDescription.aboutCompanyAndTeam}
                </p>
              )}
            </div>

            {/* Key Responsibilities */}
            <div className="space-y-2.5">
              <h4 className="text-base font-bold text-white flex items-center space-x-2">
                <span>⚡ What You Will Own & Build</span>
              </h4>
              <ul className="space-y-2">
                {jobDescription.keyResponsibilities?.map((resp, i) => (
                  <li key={i} className="flex items-start space-x-2.5 text-slate-300">
                    <span className="text-blue-400 mt-1">&bull;</span>
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Requirements: Hard & Soft Skills */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
              <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800/80 space-y-2.5">
                <h5 className="font-semibold text-sm text-blue-300 flex items-center space-x-1.5">
                  <span>🛠️ Hard Skills & Technical Depth</span>
                </h5>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
                  {jobDescription.hardSkillsRequirements?.map((skill, i) => (
                    <li key={i} className="flex items-start space-x-2">
                      <span className="text-emerald-400 mt-0.5">&check;</span>
                      <span>{skill}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800/80 space-y-2.5">
                <h5 className="font-semibold text-sm text-purple-300 flex items-center space-x-1.5">
                  <span>🤝 Soft Skills & Leadership DNA</span>
                </h5>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
                  {jobDescription.softSkillsRequirements?.map((skill, i) => (
                    <li key={i} className="flex items-start space-x-2">
                      <span className="text-purple-400 mt-0.5">&check;</span>
                      <span>{skill}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Nice to Haves & Perks */}
            {jobDescription.niceToHaves && jobDescription.niceToHaves.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-amber-300">
                  ✨ Bonus Qualifications (Not Hard Blockers)
                </h4>
                <ul className="space-y-1.5 text-xs sm:text-sm text-slate-300">
                  {jobDescription.niceToHaves.map((nice, i) => (
                    <li key={i} className="flex items-start space-x-2">
                      <span className="text-amber-400">&bull;</span>
                      <span>{nice}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Perks, Comp & Benefits */}
            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-2">
              <h4 className="text-sm font-bold text-white flex items-center space-x-2">
                <span>🎁 What We Offer & Compensation</span>
              </h4>
              {jobDescription.compensationRange && (
                <p className="text-emerald-400 font-semibold text-sm">
                  💰 {jobDescription.compensationRange}
                </p>
              )}
              <div className="flex flex-wrap gap-2 pt-1">
                {jobDescription.perksAndBenefits?.map((perk, i) => (
                  <span
                    key={i}
                    className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 text-slate-200 border border-slate-700/80"
                  >
                    {perk}
                  </span>
                ))}
              </div>
            </div>

            {/* CTA & LinkedIn Hashtags */}
            <div className="pt-3 border-t border-slate-800 space-y-3">
              <p className="font-medium text-slate-200">
                👉 {jobDescription.callToAction || 'Apply now or message our team directly to discuss!'}
              </p>
              <div className="flex flex-wrap gap-1.5 text-xs text-blue-400 font-medium">
                {jobDescription.linkedInHashtags?.map((tag, i) => (
                  <span key={i} className="hover:underline cursor-pointer">
                    {tag.startsWith('#') ? tag : `#${tag}`}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODE 2: STRUCTURED SECTIONS */}
      {viewMode === 'structured' && (
        <div className="space-y-4">
          <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800">
            <h4 className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-1">
              Headline & Hook
            </h4>
            <h3 className="text-lg font-bold text-white">{jobDescription.headline}</h3>
            <p className="text-slate-300 text-sm mt-2">{jobDescription.hook}</p>
          </div>

          <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800">
            <h4 className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-2">
              Key Responsibilities ({jobDescription.keyResponsibilities?.length || 0})
            </h4>
            <div className="space-y-2">
              {jobDescription.keyResponsibilities?.map((resp, i) => (
                <div key={i} className="flex items-start space-x-2 text-sm text-slate-200">
                  <span className="text-indigo-400 font-bold">{i + 1}.</span>
                  <span>{resp}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800">
              <h4 className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-2">
                Hard Skills Required ({jobDescription.hardSkillsRequirements?.length || 0})
              </h4>
              <ul className="space-y-2 text-sm text-slate-200">
                {jobDescription.hardSkillsRequirements?.map((skill, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <span className="text-blue-400 font-bold">&bull;</span>
                    <span>{skill}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800">
              <h4 className="text-xs font-semibold text-purple-400 uppercase tracking-wider mb-2">
                Soft Skills & Culture ({jobDescription.softSkillsRequirements?.length || 0})
              </h4>
              <ul className="space-y-2 text-sm text-slate-200">
                {jobDescription.softSkillsRequirements?.map((skill, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <span className="text-purple-400 font-bold">&bull;</span>
                    <span>{skill}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800">
            <h4 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2">
              Benefits & Compensation
            </h4>
            {jobDescription.compensationRange && (
              <p className="text-sm font-semibold text-emerald-300 mb-2">
                Compensation: {jobDescription.compensationRange}
              </p>
            )}
            <div className="flex flex-wrap gap-2">
              {jobDescription.perksAndBenefits?.map((b, i) => (
                <span key={i} className="px-3 py-1 rounded-xl bg-slate-800 text-xs text-slate-200 border border-slate-700">
                  {b}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODE 3: RAW MARKDOWN / TEXT */}
      {viewMode === 'markdown' && (
        <div className="bg-slate-950 rounded-2xl p-6 border border-slate-800 relative">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
            <span className="text-xs font-mono text-slate-400">Ready-to-paste Plaintext / Markdown</span>
            <button
              onClick={() => handleCopy(fullText)}
              className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center space-x-1"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy full text</span>
            </button>
          </div>
          <pre className="text-xs sm:text-sm font-mono text-slate-200 whitespace-pre-wrap leading-relaxed select-all">
            {fullText}
          </pre>
        </div>
      )}

      {/* Quick AI Refinement Prompts */}
      <div className="bg-slate-900/60 rounded-2xl p-4 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-2 text-xs text-slate-300">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span className="font-medium">Need adjustments? Refine with Copilot:</span>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => onOpenChatWithPrompt('Please make this Job Description 25% shorter and punchier for senior engineering leads.')}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-indigo-600 hover:text-white text-slate-300 text-xs border border-slate-700 transition-colors"
          >
            ⚡ Make Punchier
          </button>
          <button
            onClick={() => onOpenChatWithPrompt('Add an explicit Diversity, Equity & Belonging (DE&I) section tailored to underrepresented engineers.')}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-indigo-600 hover:text-white text-slate-300 text-xs border border-slate-700 transition-colors"
          >
            🌱 Add DE&I Section
          </button>
          <button
            onClick={() => onOpenChatWithPrompt('Generate 3 cold LinkedIn InMail messages for passive candidates for this role.')}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-indigo-600 hover:text-white text-slate-300 text-xs border border-slate-700 transition-colors"
          >
            ✉️ Draft InMail
          </button>
        </div>
      </div>
    </div>
  );
};
