import React, { useState } from 'react';
import {
  Sparkles,
  Zap,
  BrainCircuit,
  Sliders,
  Building2,
  DollarSign,
  Briefcase,
  Layers,
  Wand2,
  RotateCcw,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
} from 'lucide-react';
import { ROLE_PRESETS } from '../data/presets.ts';
import { RolePreset } from '../types.ts';

interface RoleInputPanelProps {
  rawNotes: string;
  setRawNotes: (notes: string) => void;
  roleTitle: string;
  setRoleTitle: (title: string) => void;
  seniority: string;
  setSeniority: (s: string) => void;
  workplaceType: string;
  setWorkplaceType: (w: string) => void;
  tone: string;
  setTone: (t: string) => void;
  compensation: string;
  setCompensation: (c: string) => void;
  companyInfo: string;
  setCompanyInfo: (info: string) => void;
  model: string;
  setModel: (m: string) => void;
  enableHighThinking: boolean;
  setEnableHighThinking: (enable: boolean) => void;
  onGenerate: () => void;
  isLoading: boolean;
  loadingStep: string;
}

export const RoleInputPanel: React.FC<RoleInputPanelProps> = ({
  rawNotes,
  setRawNotes,
  roleTitle,
  setRoleTitle,
  seniority,
  setSeniority,
  workplaceType,
  setWorkplaceType,
  tone,
  setTone,
  compensation,
  setCompensation,
  companyInfo,
  setCompanyInfo,
  model,
  setModel,
  enableHighThinking,
  setEnableHighThinking,
  onGenerate,
  isLoading,
  loadingStep,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(true);

  const handleApplyPreset = (preset: RolePreset) => {
    setRoleTitle(preset.title);
    setSeniority(preset.seniority);
    setWorkplaceType(preset.workplaceType);
    setTone(preset.tone);
    setRawNotes(preset.notes);
  };

  const handleClear = () => {
    setRawNotes('');
    setRoleTitle('');
    setCompensation('');
    setCompanyInfo('');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Intro Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium mb-3">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Smart Role Ingestion & Synthesis</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Recruitment Sandbox Studio
            </h1>
            <p className="text-slate-400 text-sm sm:text-base mt-1 max-w-2xl">
              Paste unformatted hiring manager notes, Slack brainstorms, or voice memos.
              The sandbox will extract competencies, craft a viral LinkedIn Job Description,
              and build an exhaustive 10-question behavioral interview guide with STAR rubrics.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-400 font-medium mr-1">Quick Presets:</span>
            {ROLE_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleApplyPreset(preset)}
                className="px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-800/90 hover:bg-indigo-600 hover:text-white text-slate-300 border border-slate-700/80 transition-all flex items-center space-x-1"
              >
                <span>{preset.label.split(' ')[0]} {preset.label.split(' ')[1]}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Notes Scratchpad (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-lg flex flex-col h-full">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Layers className="w-4 h-4 text-indigo-400" />
                <label htmlFor="rawNotes" className="text-sm font-semibold text-slate-200">
                  Raw Role Notes / Brainstorm Scratchpad
                </label>
                <span className="text-xs text-rose-400 font-bold">*Required</span>
              </div>
              <div className="flex items-center space-x-2">
                {rawNotes && (
                  <button
                    onClick={handleClear}
                    type="button"
                    className="text-xs text-slate-400 hover:text-rose-400 transition-colors flex items-center space-x-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Clear</span>
                  </button>
                )}
                <span className="text-xs text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                  {rawNotes.length} chars
                </span>
              </div>
            </div>

            <textarea
              id="rawNotes"
              rows={14}
              value={rawNotes}
              onChange={(e) => setRawNotes(e.target.value)}
              placeholder={`Paste your rough, messy role notes here... For example:
- Need someone who has scaled distributed Kafka pipelines or Redis caches
- 5+ years experience, solid with Go or Rust or Python
- Good team player, mentors juniors, handles high-pressure incident triage
- Must communicate clearly with product managers without engineering jargon
- Location: Remote US or Hybrid Austin
- Salary range $190k - $240k base + equity
- Bonus: experience with CockroachDB and OpenTelemetry...`}
              className="w-full flex-1 bg-slate-950 text-slate-100 placeholder-slate-500 rounded-xl p-4 text-sm font-mono border border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 resize-none transition-all"
            />

            <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Supports unorganized text, Slack dumps, transcriptions, bullet points</span>
              </span>
              <span className="text-slate-400 hidden sm:inline">
                Both Hard & Soft skills will be auto-categorized
              </span>
            </div>
          </div>
        </div>

        {/* Configuration & Model Tuning (1 Col) */}
        <div className="space-y-4">
          <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Sliders className="w-4 h-4 text-indigo-400" />
                <h3 className="text-sm font-semibold text-slate-200">Role Parameters</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                {showAdvanced ? 'Compact' : 'Expand'}
              </button>
            </div>

            {/* Role Title Override */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Role Title (Optional - AI infers if blank)
              </label>
              <div className="relative">
                <Briefcase className="w-4 h-4 text-slate-500 absolute left-3 top-2.5 pointer-events-none" />
                <input
                  type="text"
                  value={roleTitle}
                  onChange={(e) => setRoleTitle(e.target.value)}
                  placeholder="e.g. Staff Backend Engineer"
                  className="w-full bg-slate-950 text-slate-200 text-xs sm:text-sm pl-9 pr-3 py-2 rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Seniority & Workplace Model */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Seniority</label>
                <select
                  value={seniority}
                  onChange={(e) => setSeniority(e.target.value)}
                  className="w-full bg-slate-950 text-slate-200 text-xs sm:text-sm px-3 py-2 rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                >
                  <option value="Entry / Junior">Entry / Junior</option>
                  <option value="Mid-Level">Mid-Level</option>
                  <option value="Senior">Senior</option>
                  <option value="Staff / Principal">Staff / Principal</option>
                  <option value="Engineering Manager / Lead">Manager / Lead</option>
                  <option value="Director / VP / Exec">Director / VP / Exec</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Workplace</label>
                <select
                  value={workplaceType}
                  onChange={(e) => setWorkplaceType(e.target.value)}
                  className="w-full bg-slate-950 text-slate-200 text-xs sm:text-sm px-3 py-2 rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                >
                  <option value="Remote">100% Remote</option>
                  <option value="Hybrid (2-3 days)">Hybrid</option>
                  <option value="On-Site">On-Site</option>
                  <option value="Flexible / Global">Flexible / Global</option>
                </select>
              </div>
            </div>

            {/* Tone Selector */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                LinkedIn Copy Tone
              </label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full bg-slate-950 text-slate-200 text-xs sm:text-sm px-3 py-2 rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              >
                <option value="Bold & High Growth">🚀 Bold & High Growth (Scaleup / Startup)</option>
                <option value="Engineering-Centric & Ambitious">⚡ Engineering-Centric & Technical</option>
                <option value="Refined & Enterprise Corporate">🏛️ Refined & Enterprise Corporate</option>
                <option value="Warm, Inclusive & People-First">🌱 Warm, Inclusive & People-First</option>
                <option value="Concise & Punchy">🎯 Concise & Punchy</option>
              </select>
            </div>

            {showAdvanced && (
              <>
                {/* Compensation & Location */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Target Compensation & Perks
                  </label>
                  <div className="relative">
                    <DollarSign className="w-4 h-4 text-slate-500 absolute left-3 top-2.5 pointer-events-none" />
                    <input
                      type="text"
                      value={compensation}
                      onChange={(e) => setCompensation(e.target.value)}
                      placeholder="e.g. $180k-$220k base + 0.1% equity"
                      className="w-full bg-slate-950 text-slate-200 text-xs sm:text-sm pl-9 pr-3 py-2 rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    />
                  </div>
                </div>

                {/* Company / Team Context */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Company / Mission Context
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-slate-500 absolute left-3 top-2.5 pointer-events-none" />
                    <input
                      type="text"
                      value={companyInfo}
                      onChange={(e) => setCompanyInfo(e.target.value)}
                      placeholder="e.g. Series B Fintech scaling to 50M transactions/day"
                      className="w-full bg-slate-950 text-slate-200 text-xs sm:text-sm pl-9 pr-3 py-2 rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    />
                  </div>
                </div>
              </>
            )}

            {/* AI Engine & Thinking Mode Settings */}
            <div className="pt-2 border-t border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5">
                  <BrainCircuit className="w-3.5 h-3.5 text-purple-400" />
                  <span>Gemini Model & Reasoning</span>
                </span>
                <span className="text-[10px] text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/30">
                  @google/genai
                </span>
              </div>

              {/* Model Choice Buttons */}
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setModel('gemini-3.1-flash-lite');
                    setEnableHighThinking(false);
                  }}
                  className={`p-2 rounded-xl text-left border transition-all ${
                    model === 'gemini-3.1-flash-lite' && !enableHighThinking
                      ? 'bg-amber-500/20 border-amber-500 text-amber-200'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center space-x-1 text-xs font-semibold">
                    <Zap className="w-3 h-3 text-amber-400" />
                    <span>Fast</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-0.5 truncate">3.1 Flash Lite</p>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setModel('gemini-3.8-flash');
                    setEnableHighThinking(false);
                  }}
                  className={`p-2 rounded-xl text-left border transition-all ${
                    model === 'gemini-3.8-flash' && !enableHighThinking
                      ? 'bg-blue-500/20 border-blue-500 text-blue-200'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center space-x-1 text-xs font-semibold">
                    <Sparkles className="w-3 h-3 text-blue-400" />
                    <span>General</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-0.5 truncate">3.8 Flash</p>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setModel('gemini-4-argon');
                    setEnableHighThinking(true);
                  }}
                  className={`p-2 rounded-xl text-left border transition-all ${
                    enableHighThinking || model === 'gemini-4-argon'
                      ? 'bg-purple-500/20 border-purple-500 text-purple-200 ring-1 ring-purple-500/50'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center space-x-1 text-xs font-semibold">
                    <BrainCircuit className="w-3 h-3 text-purple-400" />
                    <span>High Thinking</span>
                  </div>
                  <p className="text-[10px] text-purple-400 mt-0.5 truncate">gemini-4-argon</p>
                </button>
              </div>

              {/* High Thinking Toggle */}
              <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${enableHighThinking ? 'bg-purple-400 animate-ping' : 'bg-slate-600'}`} />
                  <div>
                    <p className="text-xs font-medium text-slate-200">High Reasoning Mode</p>
                    <p className="text-[10px] text-slate-500">
                      Deep behavioral rubric calibration (argon)
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={enableHighThinking}
                    onChange={(e) => {
                      setEnableHighThinking(e.target.checked);
                      if (e.target.checked) setModel('gemini-4-argon');
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>
            </div>

            {/* Primary Action Button */}
            <div className="pt-2">
              <button
                type="button"
                disabled={isLoading || !rawNotes.trim()}
                onClick={onGenerate}
                className={`w-full py-3.5 px-4 rounded-xl font-semibold text-sm shadow-xl flex items-center justify-center space-x-2 transition-all ${
                  isLoading
                    ? 'bg-indigo-700 text-white cursor-wait'
                    : !rawNotes.trim()
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                    : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 text-white shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:scale-[1.01]'
                }`}
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>{loadingStep || 'Synthesizing Role Architecture...'}</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4" />
                    <span>Generate LinkedIn JD & 10 Q Guide</span>
                  </>
                )}
              </button>
              {!rawNotes.trim() && (
                <p className="text-[11px] text-slate-500 text-center mt-2 flex items-center justify-center space-x-1">
                  <AlertCircle className="w-3 h-3 text-amber-500" />
                  <span>Paste raw notes or select a preset to generate</span>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
