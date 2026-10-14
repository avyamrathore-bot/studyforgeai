import React from 'react';
import {
  GraduationCap,
  Sparkles,
  Flame,
  Globe,
  Timer,
  FileDown,
  Upload,
  Camera,
  Layers,
  HelpCircle,
  Network,
  Users,
  Trophy,
  Bot,
  Search,
} from 'lucide-react';
import { BoardMode, GradeLevel, StudyLanguage } from '../types/study';

export type AppTab =
  | 'dashboard'
  | 'notes'
  | 'concept'
  | 'mcq'
  | 'flashcards'
  | 'solver'
  | 'collaborate'
  | 'gamify'
  | 'search';

interface NavbarProps {
  board: BoardMode;
  setBoard: (b: BoardMode) => void;
  grade: GradeLevel;
  setGrade: (g: GradeLevel) => void;
  language: StudyLanguage;
  setLanguage: (l: StudyLanguage) => void;
  activeTab: AppTab;
  setActiveTab: (t: AppTab) => void;
  onOpenUpload: () => void;
  onExportPdf: () => void;
  hasActiveDoc: boolean;
  streakDays: number;
  userLevel: number;
  userXp: number;
  onOpenTimer: () => void;
  onOpenChatbot: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  board,
  setBoard,
  grade,
  setGrade,
  language,
  setLanguage,
  activeTab,
  setActiveTab,
  onOpenUpload,
  onExportPdf,
  hasActiveDoc,
  streakDays,
  userLevel,
  userXp,
  onOpenTimer,
  onOpenChatbot,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-indigo-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center gap-2.5 group text-left cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-indigo-900 via-indigo-700 to-violet-700 bg-clip-text text-transparent">
                    StudyForge
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-indigo-100 text-indigo-700">
                    AI
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                  CBSE • ICSE Smart Revision
                </p>
              </div>
            </button>

            {/* Board Selector Switcher */}
            <div className="hidden xl:flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setBoard('cbse')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  board === 'cbse'
                    ? 'bg-indigo-600 text-white shadow-xs font-bold'
                    : 'text-slate-600 hover:text-indigo-600'
                }`}
              >
                CBSE
              </button>
              <button
                onClick={() => setBoard('icse')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  board === 'icse'
                    ? 'bg-indigo-600 text-white shadow-xs font-bold'
                    : 'text-slate-600 hover:text-indigo-600'
                }`}
              >
                ICSE
              </button>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-indigo-50 text-indigo-700 font-extrabold'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('notes')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                activeTab === 'notes'
                  ? 'bg-indigo-50 text-indigo-700 font-extrabold'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Notes
            </button>
            <button
              onClick={() => setActiveTab('concept')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer ${
                activeTab === 'concept'
                  ? 'bg-indigo-50 text-indigo-700 font-extrabold'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Network className="w-3.5 h-3.5 text-indigo-600" />
              <span>Concept Map</span>
            </button>
            <button
              onClick={() => setActiveTab('mcq')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                activeTab === 'mcq'
                  ? 'bg-indigo-50 text-indigo-700 font-extrabold'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              MCQs
            </button>
            <button
              onClick={() => setActiveTab('flashcards')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                activeTab === 'flashcards'
                  ? 'bg-indigo-50 text-indigo-700 font-extrabold'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Flashcards
            </button>
            <button
              onClick={() => setActiveTab('solver')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer ${
                activeTab === 'solver'
                  ? 'bg-indigo-50 text-indigo-700 font-extrabold'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Camera className="w-3.5 h-3.5 text-violet-600" />
              <span>Solver</span>
            </button>
            <button
              onClick={() => setActiveTab('collaborate')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer ${
                activeTab === 'collaborate'
                  ? 'bg-indigo-50 text-indigo-700 font-extrabold'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-purple-600" />
              <span>Squads</span>
            </button>
            <button
              onClick={() => setActiveTab('gamify')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer ${
                activeTab === 'gamify'
                  ? 'bg-indigo-50 text-indigo-700 font-extrabold'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              <span>Leaderboard</span>
            </button>
            <button
              onClick={() => setActiveTab('search')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer ${
                activeTab === 'search'
                  ? 'bg-indigo-50 text-indigo-700 font-extrabold'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Globe className="w-3.5 h-3.5 text-blue-600" />
              <span>Live Search</span>
            </button>
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Level & XP Pill */}
            <button
              onClick={() => setActiveTab('gamify')}
              title={`Level ${userLevel} • ${userXp} XP`}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-800 text-xs font-extrabold cursor-pointer hover:bg-amber-100 transition-colors"
            >
              <span>⭐ Lv.{userLevel}</span>
            </button>

            {/* Streak Counter */}
            <div
              title={`${streakDays} days study streak!`}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-orange-50 border border-orange-200/80 text-orange-700 text-xs font-bold"
            >
              <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500 animate-pulse" />
              <span>{streakDays}d</span>
            </div>

            {/* Study Timer Pomodoro */}
            <button
              onClick={onOpenTimer}
              title="Focus Timer"
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-indigo-600 transition-colors cursor-pointer"
            >
              <Timer className="w-4 h-4" />
            </button>

            {/* ForgeBot Context Chatbot trigger */}
            <button
              onClick={onOpenChatbot}
              title="Open ForgeBot Concierge & Bookings"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white text-xs font-extrabold shadow-sm shadow-violet-200 transition-all cursor-pointer"
            >
              <Bot className="w-4 h-4 text-amber-300" />
              <span className="hidden sm:inline">ForgeBot</span>
            </button>

            {/* Upload PDF Button */}
            <button
              onClick={onOpenUpload}
              className="hidden sm:flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload</span>
            </button>
          </div>

        </div>

        {/* Mobile Submenu for active tabs */}
        <div className="flex lg:hidden overflow-x-auto py-2 gap-1.5 border-t border-slate-100 scrollbar-none text-xs font-semibold">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3 py-1 rounded-lg shrink-0 ${
              activeTab === 'dashboard' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`px-3 py-1 rounded-lg shrink-0 ${
              activeTab === 'notes' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            Notes
          </button>
          <button
            onClick={() => setActiveTab('concept')}
            className={`px-3 py-1 rounded-lg shrink-0 ${
              activeTab === 'concept' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            Concept Map
          </button>
          <button
            onClick={() => setActiveTab('mcq')}
            className={`px-3 py-1 rounded-lg shrink-0 ${
              activeTab === 'mcq' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            MCQs
          </button>
          <button
            onClick={() => setActiveTab('flashcards')}
            className={`px-3 py-1 rounded-lg shrink-0 ${
              activeTab === 'flashcards' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            Flashcards
          </button>
          <button
            onClick={() => setActiveTab('solver')}
            className={`px-3 py-1 rounded-lg shrink-0 ${
              activeTab === 'solver' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            Photo Solver
          </button>
          <button
            onClick={() => setActiveTab('collaborate')}
            className={`px-3 py-1 rounded-lg shrink-0 ${
              activeTab === 'collaborate' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            Squads
          </button>
          <button
            onClick={() => setActiveTab('gamify')}
            className={`px-3 py-1 rounded-lg shrink-0 ${
              activeTab === 'gamify' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            Leaderboard
          </button>
          <button
            onClick={() => setActiveTab('search')}
            className={`px-3 py-1 rounded-lg shrink-0 ${
              activeTab === 'search' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            Live Search
          </button>
        </div>
      </div>
    </header>
  );
};
