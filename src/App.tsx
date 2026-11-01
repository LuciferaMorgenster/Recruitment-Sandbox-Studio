/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Header } from './components/Header.tsx';
import { RoleInputPanel } from './components/RoleInputPanel.tsx';
import { JobDescriptionView } from './components/JobDescriptionView.tsx';
import { InterviewGuideView } from './components/InterviewGuideView.tsx';
import { ChatbotDrawer } from './components/ChatbotDrawer.tsx';
import { ROLE_PRESETS } from './data/presets.ts';
import { RecruitmentData } from './types.ts';
import { Sparkles, ArrowRight, Briefcase, FileCheck, AlertCircle } from 'lucide-react';

export default function App() {
  const initialPreset = ROLE_PRESETS[0];

  const [rawNotes, setRawNotes] = useState(initialPreset.notes);
  const [roleTitle, setRoleTitle] = useState(initialPreset.title);
  const [seniority, setSeniority] = useState(initialPreset.seniority);
  const [workplaceType, setWorkplaceType] = useState(initialPreset.workplaceType);
  const [tone, setTone] = useState(initialPreset.tone);
  const [compensation, setCompensation] = useState('$210k - $260k base + equity grant');
  const [companyInfo, setCompanyInfo] = useState('Fintech scaleup handling 45k tx/sec migrating to distributed Go & Rust');

  const [model, setModel] = useState('gemini-3.8-flash');
  const [enableHighThinking, setEnableHighThinking] = useState(false);

  const [activeTab, setActiveTab] = useState<'sandbox' | 'jd' | 'guide'>('sandbox');
  const [recruitmentData, setRecruitmentData] = useState<RecruitmentData | null>(null);
  const [modelUsed, setModelUsed] = useState<string>('');

  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [error, setError] = useState<string | null>(null);

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [externalChatPrompt, setExternalChatPrompt] = useState<string>('');

  const handleGenerate = async () => {
    if (!rawNotes.trim()) return;

    setIsLoading(true);
    setError(null);
    setLoadingStep('Extracting hard & soft competencies...');

    // Progress updates for perceived responsiveness
    const stepTimer1 = setTimeout(() => {
      setLoadingStep('Architecting LinkedIn Job Description...');
    }, 1800);

    const stepTimer2 = setTimeout(() => {
      setLoadingStep('Formulating 10 behavioral questions & rubrics...');
    }, 3800);

    try {
      const response = await fetch('/api/generate-recruitment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rawNotes,
          roleTitle,
          seniority,
          workplaceType,
          tone,
          compensation,
          companyInfo,
          model: enableHighThinking ? 'gemini-4-argon' : model,
          enableHighThinking: enableHighThinking || model === 'gemini-4-argon',
        }),
      });

      const json = await response.json();

      if (!response.ok || !json.success) {
        throw new Error(json.error || 'Failed to generate recruitment assets.');
      }

      setRecruitmentData(json.data);
      setModelUsed(json.modelUsed || model);
      setActiveTab('jd');

      confetti({
        particleCount: 75,
        spread: 80,
        origin: { y: 0.6 },
      });
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Generation failed. Please try again or switch model.');
    } finally {
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      setIsLoading(false);
      setLoadingStep('');
    }
  };

  const handleOpenChatWithPrompt = (prompt: string) => {
    setExternalChatPrompt(prompt);
    setIsChatOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased selection:bg-indigo-500 selection:text-white">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        hasGeneratedData={!!recruitmentData}
        isChatOpen={isChatOpen}
        setIsChatOpen={setIsChatOpen}
        modelUsed={modelUsed}
        isHighThinkingActive={enableHighThinking || model === 'gemini-4-argon'}
      />

      {/* Main Workspace Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Error Notification */}
        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-950/80 border border-rose-500/40 text-rose-200 text-sm flex items-start justify-between shadow-lg">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-rose-400 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold">Generation Notice</p>
                <p className="text-rose-300 mt-0.5 text-xs sm:text-sm">{error}</p>
              </div>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-xs text-rose-400 hover:text-rose-200 underline ml-4"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Tab 1: Raw Notes & Sandbox Generation */}
        {activeTab === 'sandbox' && (
          <RoleInputPanel
            rawNotes={rawNotes}
            setRawNotes={setRawNotes}
            roleTitle={roleTitle}
            setRoleTitle={setRoleTitle}
            seniority={seniority}
            setSeniority={setSeniority}
            workplaceType={workplaceType}
            setWorkplaceType={setWorkplaceType}
            tone={tone}
            setTone={setTone}
            compensation={compensation}
            setCompensation={setCompensation}
            companyInfo={companyInfo}
            setCompanyInfo={setCompanyInfo}
            model={model}
            setModel={setModel}
            enableHighThinking={enableHighThinking}
            setEnableHighThinking={setEnableHighThinking}
            onGenerate={handleGenerate}
            isLoading={isLoading}
            loadingStep={loadingStep}
          />
        )}

        {/* Tab 2: LinkedIn Job Description */}
        {activeTab === 'jd' && recruitmentData && (
          <div className="space-y-6">
            <JobDescriptionView
              jobDescription={recruitmentData.jobDescription}
              roleSummary={recruitmentData.roleSummary}
              onOpenChatWithPrompt={handleOpenChatWithPrompt}
            />

            {/* Banner navigating to Output 2 */}
            <div className="max-w-6xl mx-auto bg-gradient-to-r from-indigo-950/60 to-purple-950/60 p-4 rounded-2xl border border-indigo-500/30 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-purple-600/30 text-purple-300">
                  <FileCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">
                    Ready to interview candidates for this role?
                  </h4>
                  <p className="text-xs text-slate-300">
                    Explore the 10 behavioral interview questions targeting these exact JD competencies.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('guide')}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs sm:text-sm font-semibold flex items-center space-x-1.5 transition-all shadow-md shadow-purple-600/30"
              >
                <span>View Interview Guide (10 Qs)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Tab 3: 10-Question Behavioral Interview Guide */}
        {activeTab === 'guide' && recruitmentData && (
          <div className="space-y-6">
            <InterviewGuideView
              questions={recruitmentData.interviewGuide}
              roleSummary={recruitmentData.roleSummary}
              onOpenChatWithPrompt={handleOpenChatWithPrompt}
            />

            {/* Banner navigating to Output 1 */}
            <div className="max-w-6xl mx-auto bg-gradient-to-r from-blue-950/60 to-indigo-950/60 p-4 rounded-2xl border border-blue-500/30 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-blue-600/30 text-blue-300">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">
                    Need to review the LinkedIn Job Post?
                  </h4>
                  <p className="text-xs text-slate-300">
                    Switch back to inspect character count, copy hashtags, or view LinkedIn card formatting.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('jd')}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-semibold flex items-center space-x-1.5 transition-all shadow-md shadow-blue-600/30"
              >
                <span>Back to LinkedIn JD</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Multi-turn Chatbot Drawer */}
      <ChatbotDrawer
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        recruitmentData={recruitmentData}
        externalPrompt={externalChatPrompt}
        onClearExternalPrompt={() => setExternalChatPrompt('')}
      />
    </div>
  );
}
