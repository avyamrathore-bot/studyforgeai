import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Award,
  Zap,
  Flame,
  CheckCircle2,
  Lock,
  Trophy,
  Star,
  Sparkles,
  TrendingUp,
  Medal,
  Users,
  Clock,
  ArrowUpRight,
} from 'lucide-react';
import { GamificationState, LeaderboardEntry } from '../types/study';
import { SAMPLE_LEADERBOARD } from '../data/sampleStudyData';

interface GamificationViewProps {
  gamification: GamificationState;
  onClaimQuest: (questId: string, rewardXp: number) => void;
  onNavigateTab: (tab: 'notes' | 'mcq' | 'flashcards' | 'solver' | 'concept') => void;
}

export const GamificationView: React.FC<GamificationViewProps> = ({
  gamification,
  onClaimQuest,
  onNavigateTab,
}) => {
  const [boardFilter, setBoardFilter] = useState<'all' | 'cbse' | 'icse'>('all');
  const [timeFilter, setTimeFilter] = useState<'weekly' | 'allTime'>('weekly');

  const { xp, level, rankTitle, nextLevelXp, badges, quests } = gamification;
  const prevLevelXp = (level - 1) * 400;
  const progressPercent = Math.min(
    100,
    Math.round(((xp - prevLevelXp) / (nextLevelXp - prevLevelXp)) * 100)
  );

  const filteredLeaderboard = SAMPLE_LEADERBOARD.filter((entry) => {
    if (boardFilter === 'cbse') return entry.board.toUpperCase() === 'CBSE';
    if (boardFilter === 'icse') return entry.board.toUpperCase() === 'ICSE';
    return true;
  });

  const handleClaim = (questId: string, rewardXp: number) => {
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 },
    });
    onClaimQuest(questId, rewardXp);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fade-in">
      
      {/* Top Banner: Level, Rank, XP Progress */}
      <div className="bg-gradient-to-br from-indigo-700 via-indigo-600 to-purple-700 text-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-indigo-200 relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-400 to-yellow-200 text-indigo-950 flex flex-col items-center justify-center font-black shadow-lg shadow-amber-400/30">
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-amber-900">
                  Level
                </span>
                <span className="text-3xl leading-none">{level}</span>
              </div>
              <div className="absolute -bottom-1 -right-1 bg-white text-indigo-700 p-1 rounded-full shadow-md">
                <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-extrabold uppercase tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>{rankTitle}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                {xp.toLocaleString()} <span className="text-lg text-indigo-200 font-bold">XP Earned</span>
              </h1>
              <p className="text-xs text-indigo-100 font-medium">
                {nextLevelXp - xp} XP needed to reach <span className="font-bold text-white">Level {level + 1} (Syllabus Titan)</span>
              </p>
            </div>
          </div>

          {/* XP Progress Bar */}
          <div className="w-full md:max-w-xs space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-indigo-100">
              <span>Level {level}</span>
              <span>{progressPercent}% Complete</span>
              <span>Level {level + 1}</span>
            </div>
            <div className="w-full bg-black/20 rounded-full h-3 overflow-hidden p-0.5 border border-white/20">
              <div
                className="bg-gradient-to-r from-amber-300 to-yellow-400 h-2 rounded-full transition-all duration-700 shadow-sm"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Quests Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-amber-100 text-amber-800">
              DAILY STUDY CHALLENGES
            </span>
            <h2 className="text-xl font-black text-slate-900 tracking-tight mt-1">
              Today's XP Quests
            </h2>
          </div>
          <span className="text-xs font-bold text-slate-400">
            Resets in 14h 22m
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quests.map((quest) => (
            <div
              key={quest.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
                quest.completed
                  ? 'bg-emerald-50/50 border-emerald-200'
                  : 'bg-white hover:border-indigo-200 border-slate-200'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg">
                    +{quest.rewardXp} XP
                  </span>
                  <span className="text-xs font-bold text-slate-500">
                    {quest.progress}/{quest.target}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-slate-900 leading-snug">
                  {quest.title}
                </h4>

                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      quest.completed ? 'bg-emerald-500' : 'bg-indigo-600'
                    }`}
                    style={{ width: `${Math.min(100, (quest.progress / quest.target) * 100)}%` }}
                  ></div>
                </div>
              </div>

              <div>
                {quest.completed ? (
                  <button
                    onClick={() => handleClaim(quest.id, quest.rewardXp)}
                    className="w-full py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs shadow-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Claim +{quest.rewardXp} XP</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      if (quest.id === 'q-1') onNavigateTab('flashcards');
                      else if (quest.id === 'q-3') onNavigateTab('solver');
                    }}
                    className="w-full py-2 rounded-xl bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 font-bold text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span>Continue Quest</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Badges & Achievements Grid */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-6">
        <div>
          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-purple-100 text-purple-700">
            ACHIEVEMENTS
          </span>
          <h2 className="text-xl font-black text-slate-900 tracking-tight mt-1">
            Study Badges & Honors ({badges.filter((b) => b.unlocked).length}/{badges.length} Unlocked)
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className={`p-5 rounded-2xl border transition-all flex items-start gap-4 ${
                badge.unlocked
                  ? 'bg-gradient-to-br from-indigo-50/40 via-purple-50/20 to-white border-indigo-200'
                  : 'bg-slate-50/70 border-slate-200/80 opacity-60'
              }`}
            >
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
                  badge.unlocked
                    ? 'bg-gradient-to-tr from-indigo-600 to-violet-600 text-white'
                    : 'bg-slate-200 text-slate-400'
                }`}
              >
                {badge.unlocked ? <Award className="w-6 h-6" /> : <Lock className="w-5 h-5" />}
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-extrabold text-slate-900">
                    {badge.title}
                  </h4>
                  <span className="text-[10px] font-black text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded-md">
                    +{badge.xpValue} XP
                  </span>
                </div>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  {badge.description}
                </p>
                {badge.unlocked && badge.unlockedAt && (
                  <div className="text-[10px] font-semibold text-emerald-600">
                    Unlocked: {badge.unlockedAt}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Board Toppers Leaderboard */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                Board Exam Toppers Leaderboard
              </h2>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Rankings calculated by active recall accuracy, streak days, and chapter mastery
            </p>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold">
              <button
                onClick={() => setBoardFilter('all')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  boardFilter === 'all' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setBoardFilter('cbse')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  boardFilter === 'cbse' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600'
                }`}
              >
                CBSE
              </button>
              <button
                onClick={() => setBoardFilter('icse')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  boardFilter === 'icse' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600'
                }`}
              >
                ICSE
              </button>
            </div>
          </div>
        </div>

        {/* Top 3 Podium Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-2">
          {filteredLeaderboard.slice(0, 3).map((topper, tIdx) => {
            const isFirst = topper.rank === 1;
            const isSecond = topper.rank === 2;
            const isThird = topper.rank === 3;

            return (
              <div
                key={topper.rank}
                className={`p-6 rounded-3xl border text-center space-y-3 transition-all relative ${
                  isFirst
                    ? 'bg-gradient-to-b from-amber-50/70 to-white border-amber-300 shadow-md ring-2 ring-amber-200'
                    : 'bg-slate-50/50 border-slate-200'
                }`}
              >
                <div className="relative inline-block mx-auto">
                  <img
                    src={topper.avatar}
                    alt={topper.name}
                    className="w-16 h-16 rounded-2xl object-cover shadow-md mx-auto"
                  />
                  <div
                    className={`absolute -bottom-2 -right-2 w-7 h-7 rounded-xl font-black text-xs flex items-center justify-center text-white shadow-md ${
                      isFirst ? 'bg-amber-500' : isSecond ? 'bg-slate-400' : 'bg-amber-700'
                    }`}
                  >
                    #{topper.rank}
                  </div>
                </div>

                <div>
                  <h4 className="font-extrabold text-base text-slate-900">
                    {topper.name}
                  </h4>
                  <div className="text-xs text-slate-500 font-medium">
                    {topper.board} • {topper.grade}
                  </div>
                </div>

                <div className="flex items-center justify-center gap-3 pt-1">
                  <span className="text-xs font-black text-indigo-700 bg-indigo-50 px-3 py-1 rounded-lg">
                    {topper.xp.toLocaleString()} XP
                  </span>
                  <span className="text-xs font-bold text-orange-600 flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 fill-current" />
                    <span>{topper.streak}d</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Full Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Rank</th>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Board & Grade</th>
                <th className="py-3 px-4">Streak</th>
                <th className="py-3 px-4 text-right">Total XP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLeaderboard.map((entry) => (
                <tr
                  key={entry.rank}
                  className={`hover:bg-slate-50/80 transition-colors ${
                    entry.isUser ? 'bg-indigo-50/60 font-bold' : ''
                  }`}
                >
                  <td className="py-3.5 px-4 font-black text-slate-700">
                    #{entry.rank}
                  </td>
                  <td className="py-3.5 px-4 flex items-center gap-3 font-bold text-slate-900">
                    <img
                      src={entry.avatar}
                      alt={entry.name}
                      className="w-8 h-8 rounded-xl object-cover"
                    />
                    <span>{entry.name}</span>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-600">
                    {entry.board} • {entry.grade}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-orange-600">
                    🔥 {entry.streak} days
                  </td>
                  <td className="py-3.5 px-4 text-right font-black text-indigo-700">
                    {entry.xp.toLocaleString()} XP
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
