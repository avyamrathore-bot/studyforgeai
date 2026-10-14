import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  Calendar,
  CheckCircle2,
  Minimize2,
  Maximize2,
  RotateCcw,
  Clock,
  Video,
} from 'lucide-react';
import { StudyDocument, ChatMessage } from '../types/study';

interface SupportAgentChatbotProps {
  isOpen: boolean;
  onClose: () => void;
  activeDoc: StudyDocument | null;
  studentName: string;
}

export const SupportAgentChatbot: React.FC<SupportAgentChatbotProps> = ({
  isOpen,
  onClose,
  activeDoc,
  studentName,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hi ${studentName}! 👋 I'm ForgeBot, your context-aware study assistant & peer booking concierge.\n\nI can help you:\n1. 📅 Book a 1-on-1 Peer Study Session or Tutor Doubt Room (multi-step booking)\n2. 💡 Answer any questions about your active chapter: "${activeDoc?.title || 'Chemical Reactions & Equations'}"\n3. 🛠️ Guide you on StudyForge AI features (PDF export, concept maps, MCQs)\n\nWhat would you like to do?`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (!isOpen) return null;

  const quickPrompts = [
    'Book a 1-on-1 peer study session for Class 10',
    'How do I generate a concept map?',
    'Explain the 5-mark marking scheme for this chapter',
    'Can I study with a friend tonight at 7 PM?',
  ];

  const handleSend = async (messageText?: string) => {
    const text = (messageText || input).trim();
    if (!text || isLoading) return;

    const userMessage: ChatMessage = {
      id: 'user-' + Date.now(),
      role: 'user',
      content: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/study/chat-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newHistory.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          activeDocTitle: activeDoc?.title || '',
          activeDocOverview: activeDoc?.overview || '',
          studentName,
        }),
      });

      const resData = await response.json();
      if (!response.ok || !resData.success) {
        throw new Error(resData.error || 'Failed to get bot reply');
      }

      const botMessage: ChatMessage = {
        id: 'bot-' + Date.now(),
        role: 'assistant',
        content: resData.reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err: any) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: 'err-' + Date.now(),
          role: 'assistant',
          content: 'I apologize, I had trouble processing that request. Please try again or rephrase!',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 'welcome-reset',
        role: 'assistant',
        content: `Chat history cleared! Ready to help you book a study session or answer syllabus doubts. Where shall we start?`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <div className="fixed inset-0 sm:inset-auto sm:bottom-6 sm:right-6 z-50 flex items-end justify-end pointer-events-auto">
      <div
        className={`w-full bg-white shadow-2xl border border-indigo-100 flex flex-col transition-all duration-300 ${
          isExpanded
            ? 'sm:w-[600px] h-full sm:h-[680px] sm:rounded-3xl'
            : 'sm:w-[420px] h-[580px] sm:rounded-3xl'
        }`}
      >
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-700 text-white flex items-center justify-between sm:rounded-t-3xl shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center font-bold">
              <Bot className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-extrabold text-sm tracking-tight">ForgeBot</h3>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              </div>
              <p className="text-[11px] text-indigo-100 font-medium">
                Context-Aware Support & Study Booking
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleResetChat}
              title="Reset conversation"
              className="p-1.5 rounded-lg text-indigo-200 hover:text-white hover:bg-white/10 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              title={isExpanded ? 'Restore' : 'Expand'}
              className="p-1.5 rounded-lg text-indigo-200 hover:text-white hover:bg-white/10 transition-colors hidden sm:block"
            >
              {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-indigo-200 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/50">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-2.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.role === 'assistant' && (
                <div className="w-7 h-7 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 text-xs font-bold shadow-xs">
                  <Bot className="w-3.5 h-3.5" />
                </div>
              )}

              <div
                className={`max-w-[85%] p-3.5 rounded-2xl text-xs sm:text-sm font-medium leading-relaxed whitespace-pre-line ${
                  m.role === 'user'
                    ? 'bg-indigo-600 text-white rounded-br-xs shadow-xs'
                    : 'bg-white text-slate-800 rounded-bl-xs border border-slate-200/80 shadow-xs'
                }`}
              >
                {m.content}
                <div
                  className={`text-[9.5px] mt-1 font-semibold ${
                    m.role === 'user' ? 'text-indigo-200 text-right' : 'text-slate-400'
                  }`}
                >
                  {m.time}
                </div>
              </div>

              {m.role === 'user' && (
                <div className="w-7 h-7 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 text-xs font-bold">
                  <User className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-700 bg-indigo-50 p-3 rounded-2xl w-fit">
              <Sparkles className="w-4 h-4 animate-spin text-indigo-600" />
              <span>ForgeBot is reviewing booking & syllabus context...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion Chips */}
        <div className="p-2.5 bg-white border-t border-slate-100 overflow-x-auto whitespace-nowrap flex gap-1.5 scrollbar-none">
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(p)}
              className="text-[11px] font-semibold text-slate-700 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 rounded-xl px-2.5 py-1.5 transition-colors shrink-0 cursor-pointer"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-slate-100 sm:rounded-b-3xl">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask support or book a study room..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 text-xs sm:text-sm bg-slate-100 border-none rounded-xl px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-40 transition-colors shadow-xs cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
