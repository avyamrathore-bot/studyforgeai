import React, { useState } from 'react';
import {
  Sparkles,
  BookOpen,
  CheckCircle2,
  Clock,
  Flame,
  ArrowRight,
  TrendingUp,
  Brain,
  Award,
  Upload,
  Camera,
  Layers,
  ChevronRight,
  Edit2,
  Calendar,
  Zap,
  Network,
  Users,
  Globe,
  Bot,
  Trophy,
  FileDown,
} from 'lucide-react';
import { StudyDocument, StudyStats, BoardMode } from '../types/study';

interface DashboardViewProps {
  stats: StudyStats;
  activeDoc: StudyDocument | null;
  documents: StudyDocument[];
  onSelectDoc: (doc: StudyDocument) => void;
  onOpenUpload: () => void;
  onNavigateTab: (tab: 'notes' | 'mcq' | 'flashcards' | 'solver' | 'concept' | 'collaborate' | 'gamify' | 'search') => void;
  board: BoardMode;
  onOpenTimer: () => void;
  onOpenChatbot: () => void;
  onExportPdf: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  stats,
  activeDoc,
  documents,
  onSelectDoc,
  onOpenUpload,
  onNavigateTab,
  board,
  onOpenTimer,
  onOpenChatbot,
  onExportPdf,
}) => {
  const [studentName, setStudentName] = useState('Martin Butler');
  const [isEditingName, setIsEditingName] = useState(false);
  const [timeframe, setTimeframe] = useState<'day' | 'week' | 'month' | 'all'>('week');

  const [todoTasks, setTodoTasks] = useState([
    {
      id: 't-1',
      title: activeDoc ? activeDoc.title : 'Chemical Reactions & Equations',
      duration: '1h 30m',
      type: 'Study Notes & Formulas',
      progress: 65,
      completed: false,
      tab: 'notes' as const,
    },
    {
      id: 't-2',
      title: 'Assertion-Reason & Exemplar MCQs',
      duration: '45m',
      type: 'Review & Quiz',
      progress: 40,
      completed: false,
      tab: 'mcq' as const,
    },
    {
      id: 't-3',
      title: 'High-Yield Formula Flashcards',
      duration: '25m',
      type: 'Active Recall',
      progress: 80,
      completed: true,
      tab: 'flashcards' as const,
    },
    {
      id: 't-4',
      title: 'Past Board 5-Mark Numerical Practice',
      duration: '30m',
      type: 'Problem Solving',
      progress: 20,
      completed: false,
      tab: 'solver' as const,
    },
  ]);

  const toggleTask = (id: string) => {
    setTodoTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? {
              ...task,
              completed: !task.completed,
              progress: !task.completed ? 100 : 30,
            }
          : task
      )
    );
  };

  const totalHours = (stats.totalStudyMinutes / 60).toFixed(1);
  const hoursOnly = Math.floor(stats.totalStudyMinutes / 60);
  const minutesOnly = stats.totalStudyMinutes % 60;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* Top Greeting & User Row matching mockup */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-indigo-50/70 via-purple-50/50 to-white p-5 rounded-3xl border border-indigo-100/70 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-0.5 shadow-md shadow-indigo-200">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80"
                alt="Student Profile"
                className="w-full h-full object-cover rounded-[14px]"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-2 border-white rounded-full flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
                Good morning!
              </span>
              <button
                onClick={() => setIsEditingName(!isEditingName)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
                title="Edit name"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            </div>
            {isEditingName ? (
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                onBlur={() => setIsEditingName(false)}
                onKeyDown={(e) => e.key === 'Enter' && setIsEditingName(false)}
                className="text-xl font-extrabold text-slate-800 bg-white border border-indigo-200 rounded-lg px-2 py-0.5 outline-none focus:ring-2 focus:ring-indigo-400"
                autoFocus
              />
            ) : (
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                {studentName}
              </h1>
            )}
            <p className="text-xs text-slate-500">
              Targeting <span className="font-bold text-indigo-600">{board.toUpperCase()}</span> Board Exams • {stats.streakDays} Days Daily Streak
            </p>
          </div>
        </div>

        {/* Quick actions on top */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenTimer}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold shadow-xs transition-all cursor-pointer"
          >
            <Clock className="w-4 h-4 text-indigo-600" />
            <span>Start Focus Session</span>
          </button>
          <button
            onClick={onOpenUpload}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-300 transition-all cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            <span>Process New PDF</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left side Active Topic & Today's Plan; Right side Overview Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column (7 cols): Hero Course Card, Plan, and Mascot Tips */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Active Highlight Card matching the Mockup hero banner */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-700 via-indigo-600 to-purple-700 text-white p-7 shadow-xl shadow-indigo-200/50">
            {/* Background glowing circles */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none transform translate-x-16 -translate-y-16"></div>
            <div className="absolute bottom-0 left-1/3 w-40 h-40 bg-purple-400/20 rounded-full blur-xl pointer-events-none"></div>

            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="space-y-3 max-w-sm">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-bold tracking-wide uppercase">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Current Subject Focus</span>
                </div>
                <h2 className="text-2xl font-black tracking-tight leading-tight">
                  {activeDoc ? activeDoc.title : 'Chemical Reactions & Equations'}
                </h2>
                <p className="text-indigo-100 text-xs font-medium">
                  Today's Focus: <span className="font-bold text-white">3 of 5 Sessions</span> Completed Successfully
                </p>

                {/* Progress bar */}
                <div className="w-full bg-black/20 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-amber-300 to-emerald-300 h-2.5 rounded-full transition-all duration-700"
                    style={{ width: '68%' }}
                  ></div>
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <button
                    onClick={() => onNavigateTab('notes')}
                    className="px-5 py-2.5 rounded-xl bg-white text-indigo-700 hover:bg-indigo-50 font-extrabold text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5 group"
                  >
                    <span>Continue Study</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button
                    onClick={() => onNavigateTab('mcq')}
                    className="px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs backdrop-blur-sm transition-all cursor-pointer"
                  >
                    Take Chapter Quiz
                  </button>
                  <button
                    onClick={onExportPdf}
                    className="px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs backdrop-blur-sm transition-all cursor-pointer flex items-center gap-1.5"
                    title="Download offline PDF revision booklet"
                  >
                    <FileDown className="w-3.5 h-3.5" />
                    <span>Download PDF</span>
                  </button>
                </div>
              </div>

              {/* 3D Stacked Book Illustration */}
              <div className="shrink-0 flex items-center justify-center p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-inner">
                <div className="text-center space-y-2">
                  <div className="w-24 h-24 relative mx-auto flex items-center justify-center">
                    <div className="absolute inset-0 bg-indigo-400/30 rounded-2xl animate-pulse"></div>
                    <BookOpen className="w-14 h-14 text-white drop-shadow-lg" />
                  </div>
                  <div className="text-[11px] font-bold text-indigo-100">
                    {activeDoc?.board.toUpperCase() || 'CBSE'} Syllabus
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Today's Plan Section matching mockup */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-lg text-slate-900 tracking-tight">
                  Today's Plan
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Personalized revision schedule for maximum board exam score
                </p>
              </div>
              <button
                onClick={() => onNavigateTab('notes')}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                See All
              </button>
            </div>

            <div className="space-y-3">
              {todoTasks.map((task) => (
                <div
                  key={task.id}
                  className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                    task.completed
                      ? 'bg-slate-50/70 border-slate-200/60 opacity-80'
                      : 'bg-white hover:bg-indigo-50/30 border-slate-100 shadow-xs hover:border-indigo-200'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <button
                      onClick={() => toggleTask(task.id)}
                      className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                        task.completed
                          ? 'bg-emerald-500 text-white'
                          : 'border-2 border-slate-300 hover:border-indigo-500 text-transparent'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4 fill-current" />
                    </button>
                    <div>
                      <h4
                        className={`text-sm font-bold ${
                          task.completed
                            ? 'line-through text-slate-400'
                            : 'text-slate-800'
                        }`}
                      >
                        {task.title}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                        <span className="font-medium">{task.duration}</span>
                        <span>•</span>
                        <span className="text-indigo-600 font-semibold">{task.type}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-black text-slate-700">
                      {task.progress}%
                    </span>
                    <button
                      onClick={() => onNavigateTab(task.tab)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* StudyForge AI Tip Mascot Card matching mockup */}
          <div className="bg-gradient-to-r from-violet-50 to-indigo-50/80 rounded-3xl p-5 border border-indigo-100/80 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white shrink-0 shadow-md shadow-violet-200">
              <Brain className="w-6 h-6 animate-pulse" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-1.5 text-xs font-extrabold text-violet-700">
                <Sparkles className="w-3.5 h-3.5" />
                <span>StudyForge AI Tutor Tip</span>
              </div>
              <p className="text-xs text-slate-700 mt-0.5 font-medium leading-relaxed">
                In CBSE Class 10 Chemistry, <strong className="text-indigo-900 font-semibold">electrolysis of water (2:1 volume ratio)</strong> and <strong className="text-indigo-900 font-semibold">photolytic decomposition of AgCl</strong> appear in 85% of board question papers. Test yourself on these MCQs today!
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('mcq')}
              className="px-3 py-1.5 rounded-xl bg-violet-600 text-white text-xs font-bold hover:bg-violet-700 shrink-0 shadow-xs transition-all cursor-pointer"
            >
              Practice
            </button>
          </div>

          {/* Quick Access Documents List */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-base text-slate-900">
                Your Saved Study Materials ({documents.length})
              </h3>
              <button
                onClick={onOpenUpload}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
              >
                + New Document
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {documents.map((doc) => {
                const isSelected = activeDoc?.id === doc.id;
                return (
                  <div
                    key={doc.id}
                    onClick={() => onSelectDoc(doc)}
                    className={`p-4 rounded-2xl border text-left cursor-pointer transition-all ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-50/50 ring-2 ring-indigo-200'
                        : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-700">
                        {doc.board.toUpperCase()} • {doc.grade}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {doc.mcqs?.length || 0} MCQs
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 line-clamp-1">
                      {doc.title}
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                      {doc.overview}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Access Feature Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button
              onClick={() => onNavigateTab('concept')}
              className="p-4 rounded-2xl bg-white hover:bg-indigo-50/50 border border-slate-200 hover:border-indigo-300 text-left transition-all shadow-xs group cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                <Network className="w-5 h-5" />
              </div>
              <div className="text-xs font-black text-slate-900">Concept Map</div>
              <div className="text-[10px] text-slate-400 font-medium mt-0.5">Visual Graph</div>
            </button>

            <button
              onClick={() => onNavigateTab('collaborate')}
              className="p-4 rounded-2xl bg-white hover:bg-purple-50/50 border border-slate-200 hover:border-purple-300 text-left transition-all shadow-xs group cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                <Users className="w-5 h-5" />
              </div>
              <div className="text-xs font-black text-slate-900">Study Squads</div>
              <div className="text-[10px] text-slate-400 font-medium mt-0.5">Share Notes</div>
            </button>

            <button
              onClick={() => onNavigateTab('gamify')}
              className="p-4 rounded-2xl bg-white hover:bg-amber-50/50 border border-slate-200 hover:border-amber-300 text-left transition-all shadow-xs group cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                <Trophy className="w-5 h-5" />
              </div>
              <div className="text-xs font-black text-slate-900">Leaderboard</div>
              <div className="text-[10px] text-slate-400 font-medium mt-0.5">XP & Badges</div>
            </button>

            <button
              onClick={() => onNavigateTab('search')}
              className="p-4 rounded-2xl bg-white hover:bg-blue-50/50 border border-slate-200 hover:border-blue-300 text-left transition-all shadow-xs group cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                <Globe className="w-5 h-5" />
              </div>
              <div className="text-xs font-black text-slate-900">Live Search</div>
              <div className="text-[10px] text-slate-400 font-medium mt-0.5">Fact-Check</div>
            </button>
          </div>
        </div>

        {/* Right Column (5 cols): Overview Analytics Panel matching mockup right phone */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-6">
            
            {/* Overview Header & Filter */}
            <div className="flex items-center justify-between">
              <h3 className="font-black text-xl text-slate-900 tracking-tight">
                Overview
              </h3>
              <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold">
                <button
                  onClick={() => setTimeframe('day')}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    timeframe === 'day' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Day
                </button>
                <button
                  onClick={() => setTimeframe('week')}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    timeframe === 'week' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Week
                </button>
                <button
                  onClick={() => setTimeframe('month')}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    timeframe === 'month' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Month
                </button>
                <button
                  onClick={() => setTimeframe('all')}
                  className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                    timeframe === 'all' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600'
                  }`}
                >
                  All
                </button>
              </div>
            </div>

            {/* 4 Stat Cards matching mockup grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-3">
              
              {/* Stat 1: Study Time */}
              <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100/80">
                <div className="flex items-center justify-between text-indigo-600 mb-1">
                  <Clock className="w-4 h-4" />
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded-full">
                    +18%
                  </span>
                </div>
                <div className="text-xl font-black text-slate-900">
                  {hoursOnly}h {minutesOnly}m
                </div>
                <div className="text-[11px] font-semibold text-slate-500">
                  Study Time
                </div>
              </div>

              {/* Stat 2: Sessions */}
              <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-100/80">
                <div className="flex items-center justify-between text-purple-600 mb-1">
                  <Calendar className="w-4 h-4" />
                  <span className="text-[10px] font-bold text-purple-600 bg-purple-100 px-1.5 py-0.5 rounded-full">
                    12%
                  </span>
                </div>
                <div className="text-xl font-black text-slate-900">
                  {stats.sessionsCount}
                </div>
                <div className="text-[11px] font-semibold text-slate-500">
                  Sessions
                </div>
              </div>

              {/* Stat 3: Focus Score */}
              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100/80">
                <div className="flex items-center justify-between text-emerald-600 mb-1">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded-full">
                    +15%
                  </span>
                </div>
                <div className="text-xl font-black text-slate-900">
                  {stats.focusScore}
                </div>
                <div className="text-[11px] font-semibold text-slate-500">
                  Focus Score
                </div>
              </div>

              {/* Stat 4: Streak */}
              <div className="p-4 rounded-2xl bg-orange-50/60 border border-orange-100/80">
                <div className="flex items-center justify-between text-orange-600 mb-1">
                  <Flame className="w-4 h-4 fill-orange-500" />
                  <span className="text-[10px] font-bold text-orange-700 bg-orange-100 px-1.5 py-0.5 rounded-full">
                    Active
                  </span>
                </div>
                <div className="text-xl font-black text-slate-900">
                  {stats.streakDays}
                </div>
                <div className="text-[11px] font-semibold text-slate-500">
                  Day Streak
                </div>
              </div>
            </div>

            {/* Study Time Chart matching the line/bar chart in mockup */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-extrabold text-slate-900">
                  Study Time (Hours)
                </h4>
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                  2.5 Hours Peak
                </span>
              </div>

              <div className="pt-4 pb-2">
                <div className="h-40 flex items-end justify-between gap-2 px-2 border-b border-slate-100">
                  {stats.dailyStudyHours.map((item, idx) => {
                    const maxH = 4;
                    const heightPercent = Math.min(100, Math.round((item.hours / maxH) * 100));
                    const isPeak = item.hours >= 2.5;

                    return (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 group">
                        <div className="text-[10px] font-bold text-slate-400 group-hover:text-indigo-600 transition-colors">
                          {item.hours}h
                        </div>
                        <div className="w-full bg-slate-100 rounded-t-xl h-28 relative overflow-hidden flex items-end">
                          <div
                            className={`w-full rounded-t-xl transition-all duration-500 ${
                              isPeak
                                ? 'bg-gradient-to-t from-indigo-600 to-violet-500 shadow-md shadow-indigo-300'
                                : 'bg-gradient-to-t from-indigo-300 to-indigo-200 group-hover:from-indigo-400 group-hover:to-indigo-300'
                            }`}
                            style={{ height: `${heightPercent}%` }}
                          ></div>
                        </div>
                        <div className="text-[11px] font-bold text-slate-600">
                          {item.day}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Subject Breakdown with Circular Donut Gauge matching mockup */}
            <div className="space-y-4 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-extrabold text-slate-900">
                  Subject Breakdown
                </h4>
                <span className="text-xs font-semibold text-slate-400">
                  12h 45m Total
                </span>
              </div>

              <div className="flex items-center gap-6">
                {/* Circular Donut ring representation */}
                <div className="relative w-32 h-32 shrink-0 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    {/* Background circle */}
                    <path
                      className="text-slate-100"
                      strokeWidth="3.8"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    {/* Ring Segments */}
                    <path
                      className="text-indigo-600"
                      strokeDasharray="35, 100"
                      strokeWidth="3.8"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-purple-500"
                      strokeDasharray="28, 100"
                      strokeDashoffset="-38"
                      strokeWidth="3.8"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-emerald-500"
                      strokeDasharray="20, 100"
                      strokeDashoffset="-69"
                      strokeWidth="3.8"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-xs font-black text-slate-800">12h 45m</span>
                    <span className="text-[10px] text-slate-400 font-bold">Total</span>
                  </div>
                </div>

                {/* Legend list */}
                <div className="flex-1 space-y-2">
                  {stats.subjectBreakdown.map((subj, sIdx) => {
                    const subH = Math.floor(subj.minutes / 60);
                    const subM = subj.minutes % 60;
                    return (
                      <div key={sIdx} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: subj.color }}
                          ></span>
                          <span className="font-semibold text-slate-700">
                            {subj.subject}
                          </span>
                        </div>
                        <span className="font-extrabold text-slate-900">
                          {subH}h {subM > 0 ? `${subM}m` : ''}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Quick Action Photo Solver Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-700 text-white flex items-center justify-between shadow-md shadow-violet-200">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-violet-200">
                  <Camera className="w-3.5 h-3.5" />
                  <span>Stuck on a tough question?</span>
                </div>
                <h4 className="text-sm font-extrabold">
                  Snap Question Photo
                </h4>
                <p className="text-[11px] text-violet-200">
                  Instant step-by-step CBSE/ICSE board solution
                </p>
              </div>
              <button
                onClick={() => onNavigateTab('solver')}
                className="px-3.5 py-2 rounded-xl bg-white text-indigo-700 hover:bg-violet-50 text-xs font-black shadow-xs transition-all cursor-pointer"
              >
                Solve Photo
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
