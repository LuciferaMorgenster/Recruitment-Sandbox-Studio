import React from 'react';
import { Sparkles, MessageSquare, Briefcase, FileCheck, Layers, Bot, BrainCircuit } from 'lucide-react';

interface HeaderProps {
  activeTab: 'sandbox' | 'jd' | 'guide';
  setActiveTab: (tab: 'sandbox' | 'jd' | 'guide') => void;
  hasGeneratedData: boolean;
  isChatOpen: boolean;
  setIsChatOpen: (open: boolean) => void;
  modelUsed?: string;
  isHighThinkingActive: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  hasGeneratedData,
  isChatOpen,
  setIsChatOpen,
  modelUsed,
  isHighThinkingActive,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Briefcase className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                Recruitment Sandbox
              </span>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                v2.0
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Raw Notes &rarr; LinkedIn Job Description + 10-Skill Behavioral Guide
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center space-x-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800 text-xs sm:text-sm font-medium">
          <button
            onClick={() => setActiveTab('sandbox')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'sandbox'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Raw Notes</span>
          </button>

          <button
            onClick={() => setActiveTab('jd')}
            disabled={!hasGeneratedData}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'jd'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : hasGeneratedData
                ? 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                : 'text-slate-600 cursor-not-allowed opacity-60'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>LinkedIn JD</span>
            {hasGeneratedData && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('guide')}
            disabled={!hasGeneratedData}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'guide'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : hasGeneratedData
                ? 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                : 'text-slate-600 cursor-not-allowed opacity-60'
            }`}
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span>Interview Guide</span>
            {hasGeneratedData && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-purple-500/30 text-purple-200 border border-purple-500/40">
                10 Qs
              </span>
            )}
          </button>
        </div>

        {/* Right side tools: Model pill & Chat Drawer toggle */}
        <div className="flex items-center space-x-2">
          {isHighThinkingActive ? (
            <div className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-violet-950/60 border border-violet-500/40 text-violet-300 text-xs">
              <BrainCircuit className="w-3.5 h-3.5 text-violet-400 animate-pulse" />
              <span>Thinking: HIGH</span>
            </div>
          ) : modelUsed ? (
            <div className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 text-xs border border-slate-700">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span className="truncate max-w-[120px]">{modelUsed}</span>
            </div>
          ) : null}

          <button
            onClick={() => setIsChatOpen(!isChatOpen)}
            className={`relative flex items-center space-x-2 px-3 py-1.5 rounded-xl border text-xs sm:text-sm font-medium transition-all ${
              isChatOpen
                ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30'
                : 'bg-slate-800/80 hover:bg-slate-700 text-slate-200 border-slate-700'
            }`}
          >
            <Bot className="w-4 h-4 text-indigo-400 group-hover:text-white" />
            <span className="hidden sm:inline">Recruitment Copilot</span>
            <span className="sm:hidden">Copilot</span>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
