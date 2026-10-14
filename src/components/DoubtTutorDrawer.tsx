import React, { useState } from 'react';
import {
  X,
  Send,
  Sparkles,
  HelpCircle,
  Brain,
  MessageSquare,
  Bot,
  User,
  ArrowRight,
} from 'lucide-react';
import { BoardMode, StudyLanguage } from '../types/study';

interface DoubtMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  time: string;
}

interface DoubtTutorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  contextNotes: string;
  board: BoardMode;
  language: StudyLanguage;
}

export const DoubtTutorDrawer: React.FC<DoubtTutorDrawerProps> = ({
  isOpen,
  onClose,
  contextNotes,
  board,
  language,
}) => {
  const [messages, setMessages] = useState<DoubtMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: `Hello! I'm your StudyForge AI Tutor for ${board.toUpperCase()} boards. What concept or problem can I help you understand right now?`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const quickPrompts = [
    'Explain this concept with a simple real-life analogy',
    'What are the most common mistakes students make in board exams?',
    'Give me a 3-mark sample board exam question on this',
    'How do I remember this formula easily?',
  ];

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    const userMsg: DoubtMessage = {
      id: 'user-' + Date.now(),
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/study/chat-doubt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: text,
          contextNotes,
          board,
          language,
        }),
      });

      const resData = await response.json();
      const aiMsg: DoubtMessage = {
        id: 'ai-' + Date.now(),
        sender: 'ai',
        text: resData.answer || 'I could not generate an answer at this moment.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: 'ai-err-' + Date.now(),
          sender: 'ai',
          text: 'Sorry, I encountered an issue connecting to the AI Tutor service. Please try again.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-900/50 backdrop-blur-xs">
      <div className="w-full max-w-lg h-full bg-white shadow-2xl flex flex-col border-l border-slate-200 animate-slide-left">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-violet-50 to-indigo-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-violet-200">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-extrabold text-base text-slate-900">
                  AI Doubt Solver
                </h3>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-indigo-100 text-indigo-700 uppercase">
                  {board}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                Trained on your chapter notes & board syllabus
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'ai' && (
                <div className="w-8 h-8 rounded-xl bg-violet-600 text-white flex items-center justify-center shrink-0 text-xs font-bold shadow-xs">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] p-4 rounded-2xl text-xs sm:text-sm font-medium leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-indigo-600 text-white rounded-br-xs shadow-xs'
                    : 'bg-slate-100 text-slate-800 rounded-bl-xs'
                }`}
              >
                <div className="whitespace-pre-line">{msg.text}</div>
                <div
                  className={`text-[10px] mt-1.5 font-semibold ${
                    msg.sender === 'user' ? 'text-indigo-200 text-right' : 'text-slate-400'
                  }`}
                >
                  {msg.time}
                </div>
              </div>

              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 text-xs font-bold">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs font-bold text-violet-700 bg-violet-50 p-3 rounded-2xl w-fit">
              <Sparkles className="w-4 h-4 animate-spin" />
              <span>StudyForge AI Tutor is thinking...</span>
            </div>
          )}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 overflow-x-auto whitespace-nowrap flex gap-2 scrollbar-none">
          {quickPrompts.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="text-[11px] font-semibold text-slate-700 bg-white hover:bg-indigo-50 hover:text-indigo-700 border border-slate-200 rounded-xl px-3 py-1.5 transition-all shrink-0 cursor-pointer"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 border-t border-slate-100 bg-white">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask anything about this chapter..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 text-xs sm:text-sm bg-slate-100 border-none rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <button
              type="submit"
              disabled={isLoading || !inputText.trim()}
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
