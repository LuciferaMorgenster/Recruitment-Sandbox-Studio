import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Send,
  Bot,
  User,
  Sparkles,
  Zap,
  BrainCircuit,
  RotateCcw,
  Copy,
  Check,
  ChevronDown,
  ShieldAlert,
  Lightbulb,
  MessageSquare,
  HelpCircle,
} from 'lucide-react';
import { ChatMessage, BotRole, RecruitmentData } from '../types.ts';

interface ChatbotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  recruitmentData: RecruitmentData | null;
  externalPrompt?: string;
  onClearExternalPrompt?: () => void;
}

export const ChatbotDrawer: React.FC<ChatbotDrawerProps> = ({
  isOpen,
  onClose,
  recruitmentData,
  externalPrompt,
  onClearExternalPrompt,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hello! I'm your **Recruitment Copilot & Interview Strategist**. 

I have full visibility into your active role notes, LinkedIn Job Description, and 10-Question Behavioral Guide. 

How can I assist you right now?
- ✉️ **Draft cold LinkedIn InMails** or recruiter outreach for passive talent
- 🎭 **Simulate a candidate** so you can test your 10 interview questions live
- 🔍 **Calibrate your scoring rubric** or audit the JD for inclusive language
- 💡 **Adjust role requirements**, compensation bands, or interview stage structure`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      modelUsed: 'gemini-3.8-flash',
    },
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<BotRole>('recruiter_copilot');
  const [selectedModel, setSelectedModel] = useState<'gemini-4-argon' | 'gemini-3.8-flash' | 'gemini-3.1-flash-lite'>('gemini-3.8-flash');
  const [enableHighThinking, setEnableHighThinking] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Handle external prompts passed from JD or Guide view
  useEffect(() => {
    if (externalPrompt && externalPrompt.trim()) {
      handleSendMessage(externalPrompt);
      if (onClearExternalPrompt) onClearExternalPrompt();
    }
  }, [externalPrompt]);

  const getSystemInstruction = () => {
    if (selectedRole === 'candidate_simulator') {
      return `You are a world-class, authentic senior candidate interviewing for the role of ${
        recruitmentData?.roleSummary.title || 'this position'
      }.
When the user asks you interview questions (such as from the 10-question guide), answer in first person with a rich, realistic STAR story (Situation, Task, Action, Result) with specific technical trade-offs, measurable business impact, and candid self-awareness. Never say you are an AI.`;
    }

    if (selectedRole === 'rubric_evaluator') {
      return `You are a Chief Talent Officer and Calibration Auditor.
Your job is to objectively score candidate interview answers against 1-5 rubrics, flag vague claims or missing STAR components, check for unconscious bias, and make definitive hire/no-hire recommendations based on the role competencies.`;
    }

    // Default: recruiter_copilot
    return `You are an elite Recruitment Copilot, Executive Search Partner, and Talent Acquisition Strategist.
You advise hiring managers and talent leaders on refining Job Descriptions, drafting high-converting cold LinkedIn InMail messages, benchmarking market compensation, structuring interview loops, and eliminating hiring bottlenecks. Be concise, actionable, and sophisticated.`;
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            content: m.content,
          })),
          systemInstruction: getSystemInstruction(),
          model: enableHighThinking ? 'gemini-4-argon' : selectedModel,
          enableHighThinking: enableHighThinking || selectedModel === 'gemini-4-argon',
          context: recruitmentData || {},
        }),
      });

      const data = await response.json();

      if (data.success) {
        const botMessage: ChatMessage = {
          id: `bot-${Date.now()}`,
          role: 'assistant',
          content: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          modelUsed: data.modelUsed || selectedModel,
          isHighThinking: enableHighThinking || selectedModel === 'gemini-4-argon',
        };
        setMessages((prev) => [...prev, botMessage]);
      } else {
        throw new Error(data.error || 'Chat request failed');
      }
    } catch (err: any) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-err-${Date.now()}`,
          role: 'assistant',
          content: `⚠️ Error: ${err?.message || 'Could not reach Gemini service. Please verify your connection.'}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'reset',
        role: 'assistant',
        content: 'Conversation history reset. What role strategy or candidate evaluation can I assist you with?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: selectedModel,
      },
    ]);
  };

  if (!isOpen) return null;

  return (
    <aside
      aria-label="Recruitment Copilot Chat"
      className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out"
    >
      {/* Drawer Header */}
      <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center space-x-1.5">
              <span>Recruitment Copilot</span>
              {enableHighThinking && (
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-purple-500/20 text-purple-300 border border-purple-500/40 font-mono">
                  HIGH THINKING
                </span>
              )}
            </h3>
            <p className="text-[11px] text-slate-400">
              Multi-turn hiring strategist & interview simulator
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-1">
          <button
            onClick={handleClearChat}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Clear Chat History"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Close Drawer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Role & Model Controls Toolbar */}
      <div className="p-3 bg-slate-950 border-b border-slate-800 space-y-2 text-xs">
        {/* Role Selector Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1">
          <button
            onClick={() => setSelectedRole('recruiter_copilot')}
            className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors flex items-center space-x-1 ${
              selectedRole === 'recruiter_copilot'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <span>🧑‍💼 Hiring Copilot</span>
          </button>
          <button
            onClick={() => setSelectedRole('candidate_simulator')}
            className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors flex items-center space-x-1 ${
              selectedRole === 'candidate_simulator'
                ? 'bg-purple-600 text-white'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <span>🎭 Candidate Simulator</span>
          </button>
          <button
            onClick={() => setSelectedRole('rubric_evaluator')}
            className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors flex items-center space-x-1 ${
              selectedRole === 'rubric_evaluator'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <span>⚖️ Scorecard Auditor</span>
          </button>
        </div>

        {/* Model Selection Bar */}
        <div className="flex items-center justify-between pt-1 border-t border-slate-900">
          <div className="flex items-center space-x-1 text-[11px]">
            <span className="text-slate-400">Model:</span>
            <button
              onClick={() => {
                setSelectedModel('gemini-3.1-flash-lite');
                setEnableHighThinking(false);
              }}
              className={`px-1.5 py-0.5 rounded text-[10px] font-medium transition-colors ${
                selectedModel === 'gemini-3.1-flash-lite' && !enableHighThinking
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Ultra-fast generation"
            >
              ⚡ Fast
            </button>
            <button
              onClick={() => {
                setSelectedModel('gemini-3.8-flash');
                setEnableHighThinking(false);
              }}
              className={`px-1.5 py-0.5 rounded text-[10px] font-medium transition-colors ${
                selectedModel === 'gemini-3.8-flash' && !enableHighThinking
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Balanced general model"
            >
              🎯 Standard
            </button>
            <button
              onClick={() => {
                setSelectedModel('gemini-4-argon');
                setEnableHighThinking(true);
              }}
              className={`px-1.5 py-0.5 rounded text-[10px] font-medium transition-colors ${
                enableHighThinking || selectedModel === 'gemini-4-argon'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Complex queries with high reasoning"
            >
              🧠 High Thinking
            </button>
          </div>

          <span className="text-[10px] text-slate-400 font-mono">
            {enableHighThinking ? 'gemini-4-argon' : selectedModel}
          </span>
        </div>
      </div>

      {/* Messages Thread (Scrollable) */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs sm:text-sm">
        {messages.map((m) => {
          const isUser = m.role === 'user';
          return (
            <div
              key={m.id}
              className={`flex items-start space-x-2.5 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-white ${
                  isUser
                    ? 'bg-blue-600'
                    : 'bg-gradient-to-tr from-indigo-600 to-purple-600 shadow-md shadow-indigo-600/20'
                }`}
              >
                {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
              </div>

              <div
                className={`group relative max-w-[85%] rounded-2xl p-3.5 shadow-sm leading-relaxed ${
                  isUser
                    ? 'bg-blue-600 text-white rounded-tr-none'
                    : 'bg-slate-800 text-slate-100 rounded-tl-none border border-slate-700/80'
                }`}
              >
                <div className="whitespace-pre-wrap">{m.content}</div>

                <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-slate-700/50 text-[10px] text-slate-400">
                  <span>{m.timestamp}</span>
                  {!isUser && (
                    <div className="flex items-center space-x-2">
                      {m.modelUsed && <span className="font-mono text-slate-400">{m.modelUsed}</span>}
                      <button
                        onClick={() => handleCopyMessage(m.id, m.content)}
                        className="hover:text-white transition-colors"
                        title="Copy message"
                      >
                        {copiedId === m.id ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-start space-x-2.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <Bot className="w-3.5 h-3.5 animate-pulse" />
            </div>
            <div className="bg-slate-800 border border-slate-700 rounded-2xl rounded-tl-none p-3.5 text-xs text-slate-300 flex items-center space-x-2 shadow-sm">
              <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" />
              <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce [animation-delay:0.2s]" />
              <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce [animation-delay:0.4s]" />
              <span className="text-slate-400 ml-1">
                {enableHighThinking
                  ? 'Reasoning with High Thinking (gemini-4-argon)...'
                  : 'Synthesizing response...'}
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompt Suggestion Chips */}
      <div className="p-2.5 bg-slate-950/70 border-t border-slate-800/80 overflow-x-auto">
        <div className="flex items-center space-x-1.5 text-[11px] whitespace-nowrap">
          <button
            onClick={() =>
              handleSendMessage(
                'Draft a personalized 3-paragraph cold LinkedIn InMail message to pitch this role to an experienced passive candidate.'
              )
            }
            className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors"
          >
            ✉️ LinkedIn InMail Pitch
          </button>

          <button
            onClick={() =>
              handleSendMessage(
                'Simulate a strong candidate answering Question #1 from the interview guide using the STAR framework with concrete metrics.'
              )
            }
            className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors"
          >
            🎭 Simulate Candidate Q1
          </button>

          <button
            onClick={() =>
              handleSendMessage(
                'Suggest 3 realistic compensation and equity structures for this role across US Tier 1, Tier 2, and Western European markets.'
              )
            }
            className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors"
          >
            💰 Comp Benchmarks
          </button>
        </div>
      </div>

      {/* Input Form */}
      <div className="p-3 bg-slate-950 border-t border-slate-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center space-x-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              selectedRole === 'candidate_simulator'
                ? 'Ask a behavioral interview question...'
                : 'Ask Copilot to refine JD, draft outreach, evaluate answers...'
            }
            className="flex-1 bg-slate-900 text-slate-100 placeholder-slate-500 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm border border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-medium transition-colors shadow-md shadow-indigo-600/30"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </aside>
  );
};
