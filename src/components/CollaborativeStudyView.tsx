import React, { useState } from 'react';
import {
  Users,
  Share2,
  Copy,
  Check,
  Plus,
  BookOpen,
  ArrowRight,
  Sparkles,
  MessageSquare,
  Lock,
  Globe,
  Radio,
  QrCode,
  ThumbsUp,
  Award,
} from 'lucide-react';
import { StudyDocument, StudySquad } from '../types/study';
import { SAMPLE_STUDY_SQUADS } from '../data/sampleStudyData';

interface CollaborativeStudyViewProps {
  activeDoc: StudyDocument | null;
  documents: StudyDocument[];
  onImportDocumentByCode: (code: string) => void;
  onOpenBookingAssistant: () => void;
}

export const CollaborativeStudyView: React.FC<CollaborativeStudyViewProps> = ({
  activeDoc,
  documents,
  onImportDocumentByCode,
  onOpenBookingAssistant,
}) => {
  const [squads, setSquads] = useState<StudySquad[]>(SAMPLE_STUDY_SQUADS);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [joinCodeInput, setJoinCodeInput] = useState('');
  const [joinStatus, setJoinStatus] = useState<string | null>(null);

  // New squad modal state
  const [isCreatingSquad, setIsCreatingSquad] = useState(false);
  const [newSquadName, setNewSquadName] = useState('');
  const [newSquadSubject, setNewSquadSubject] = useState('');

  // Classmate Discussion comments
  const [comments, setComments] = useState([
    {
      id: 'c-1',
      author: 'Aarav Sharma',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=128&q=80',
      time: '12 mins ago',
      content: 'In 2025 CBSE sample paper, question 4 on electrolysis of water deducted marks if you didn\'t state the 2:1 volume ratio. Check the smart note section 2!',
      likes: 8,
      liked: false,
    },
    {
      id: 'c-2',
      author: 'Ananya Deshmukh',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=128&q=80',
      time: '45 mins ago',
      content: 'Just practiced the 6 flashcards in this deck! The OIL RIG mnemonic made redox super easy to remember.',
      likes: 5,
      liked: true,
    },
  ]);
  const [newComment, setNewComment] = useState('');

  const shareCode = activeDoc?.shareCode || 'SF-CBSE-9481';
  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}?code=${shareCode}` : `https://studyforge.ai?code=${shareCode}`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(shareCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleJoinByCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCodeInput.trim()) return;

    onImportDocumentByCode(joinCodeInput.trim().toUpperCase());
    setJoinStatus(`Successfully loaded shared study deck [${joinCodeInput.toUpperCase()}]!`);
    setJoinCodeInput('');
    setTimeout(() => setJoinStatus(null), 4000);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setComments((prev) => [
      {
        id: 'c-' + Date.now(),
        author: 'Martin Butler (You)',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=128&q=80',
        time: 'Just now',
        content: newComment.trim(),
        likes: 1,
        liked: true,
      },
      ...prev,
    ]);
    setNewComment('');
  };

  const toggleLike = (id: string) => {
    setComments((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              likes: c.liked ? c.likes - 1 : c.likes + 1,
              liked: !c.liked,
            }
          : c
      )
    );
  };

  const handleCreateSquad = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSquadName.trim()) return;

    const newSquad: StudySquad = {
      id: 'squad-' + Date.now(),
      name: newSquadName.trim(),
      board: activeDoc?.board || 'cbse',
      subject: newSquadSubject.trim() || 'General Study',
      description: 'Peer study group for collaborating on shared notes, flashcard reviews, and practice tests.',
      membersCount: 1,
      code: 'SQUAD-' + Math.floor(100 + Math.random() * 900),
      sharedDecks: 1,
    };

    setSquads([newSquad, ...squads]);
    setIsCreatingSquad(false);
    setNewSquadName('');
    setNewSquadSubject('');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fade-in">
      
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md bg-indigo-100 text-indigo-700">
              PEER LEARNING & SQUADS
            </span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
              <Radio className="w-3 h-3 animate-pulse" />
              <span>Live Study Active</span>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Collaborative Study Forge
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Share smart notes, flashcard decks, and quiz battles with classmates and study squads
          </p>
        </div>

        {/* 1-on-1 Booking button */}
        <button
          onClick={onOpenBookingAssistant}
          className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-black text-xs shadow-md shadow-violet-200 transition-all flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Users className="w-4 h-4" />
          <span>Book 1-on-1 Peer Study Room</span>
        </button>
      </div>

      {/* Main Row: Share Current Chapter + Join by Code */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Share Active Chapter Card (7 cols) */}
        <div className="lg:col-span-7 bg-gradient-to-br from-indigo-700 via-indigo-600 to-purple-700 text-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-indigo-200 space-y-5">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-extrabold uppercase tracking-wide">
              <Share2 className="w-3.5 h-3.5 text-amber-300" />
              <span>Share Active Material with Classmates</span>
            </div>
            <span className="text-xs text-indigo-200 font-medium">
              {activeDoc?.board.toUpperCase() || 'CBSE'}
            </span>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight leading-snug">
              {activeDoc ? activeDoc.title : 'Chemical Reactions & Equations'}
            </h2>
            <p className="text-xs text-indigo-100 mt-1">
              Includes {activeDoc?.smartNotes.length || 3} Note Modules • {activeDoc?.flashcards.length || 6} Flashcards • {activeDoc?.mcqs.length || 5} MCQs
            </p>
          </div>

          {/* Share Code & Link Box */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold text-indigo-200 uppercase tracking-wider">
                  Classroom Share Code:
                </span>
                <div className="text-2xl font-black font-mono tracking-widest text-amber-300">
                  {shareCode}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyCode}
                  className="px-4 py-2 rounded-xl bg-white text-indigo-700 hover:bg-indigo-50 text-xs font-extrabold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedCode ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedCode ? 'Code Copied!' : 'Copy Code'}</span>
                </button>
                <button
                  onClick={handleCopyLink}
                  className="px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedLink ? <Check className="w-4 h-4 text-emerald-300" /> : <Share2 className="w-4 h-4" />}
                  <span>{copiedLink ? 'Link Copied!' : 'Copy Link'}</span>
                </button>
              </div>
            </div>

            <p className="text-[11px] text-indigo-200">
              Classmates can paste this code into StudyForge AI to immediately clone and revise these exact notes & flashcards!
            </p>
          </div>
        </div>

        {/* Join by Code Card (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-5 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <QrCode className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-black text-slate-900 tracking-tight">
              Import Classmate's Notes
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Have a code from a teacher, friend, or topper? Enter it below to load their chapter instantly.
            </p>
          </div>

          <form onSubmit={handleJoinByCode} className="space-y-3">
            <div>
              <input
                type="text"
                placeholder="e.g. SF-ICSE-4912 or CBSE-TOP-10"
                value={joinCodeInput}
                onChange={(e) => setJoinCodeInput(e.target.value)}
                className="w-full text-sm font-mono font-bold uppercase tracking-wider bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            <button
              type="submit"
              disabled={!joinCodeInput.trim()}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-200 transition-all cursor-pointer disabled:opacity-40"
            >
              Load Shared Study Material
            </button>
          </form>

          {joinStatus && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{joinStatus}</span>
            </div>
          )}

          <div className="text-[11px] text-slate-400">
            Tip: Try loading preset code <span className="font-mono font-bold text-indigo-600">SF-ICSE-4912</span> to see Genetics!
          </div>
        </div>

      </div>

      {/* Study Squads Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              Active Collaborative Study Squads
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Join peer groups to review past board papers, solve doubts together, and share revision decks
            </p>
          </div>

          <button
            onClick={() => setIsCreatingSquad(!isCreatingSquad)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition-all cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Squad</span>
          </button>
        </div>

        {/* Create Squad Form if toggled */}
        {isCreatingSquad && (
          <form onSubmit={handleCreateSquad} className="p-5 rounded-2xl bg-indigo-50/50 border border-indigo-200 space-y-3">
            <h4 className="text-xs font-extrabold text-indigo-900 uppercase tracking-wide">
              Start a New Study Squad
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Squad Name (e.g. Class 10 Math Warriors)"
                value={newSquadName}
                onChange={(e) => setNewSquadName(e.target.value)}
                className="text-xs bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <input
                type="text"
                placeholder="Subject Focus (e.g. Science & Trigonometry)"
                value={newSquadSubject}
                onChange={(e) => setNewSquadSubject(e.target.value)}
                className="text-xs bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsCreatingSquad(false)}
                className="px-3 py-1.5 text-xs font-bold text-slate-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-bold"
              >
                Launch Squad
              </button>
            </div>
          </form>
        )}

        {/* Squad Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {squads.map((squad) => (
            <div
              key={squad.id}
              className="p-5 rounded-2xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/20 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-700">
                    {squad.board.toUpperCase()} • {squad.subject}
                  </span>
                  <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    <span>{squad.membersCount}</span>
                  </span>
                </div>

                <h3 className="text-base font-extrabold text-slate-900">
                  {squad.name}
                </h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  {squad.description}
                </p>

                {squad.activeSession && (
                  <div className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                    {squad.activeSession}
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold text-slate-400">
                  Code: {squad.code}
                </span>
                <button
                  onClick={onOpenBookingAssistant}
                  className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                >
                  <span>Join Session</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Peer Discussion & Insights Forum */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-black text-slate-900">
              Classroom Discussion & Memory Hooks
            </h3>
            <p className="text-xs text-slate-500">
              Leave helpful study tips or questions on "{activeDoc?.title || 'This Chapter'}"
            </p>
          </div>
          <span className="text-xs font-bold text-slate-400">
            {comments.length} Contributions
          </span>
        </div>

        {/* Input box */}
        <form onSubmit={handleAddComment} className="flex gap-2">
          <input
            type="text"
            placeholder="Share a board exam tip, mnemonic, or question with your classmates..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="flex-1 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <button
            type="submit"
            disabled={!newComment.trim()}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all cursor-pointer disabled:opacity-40"
          >
            Post
          </button>
        </form>

        {/* Comments Feed */}
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="p-4 rounded-2xl bg-slate-50/80 border border-slate-100 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img
                    src={comment.avatar}
                    alt={comment.author}
                    className="w-7 h-7 rounded-full object-cover"
                  />
                  <div>
                    <h5 className="text-xs font-extrabold text-slate-900">
                      {comment.author}
                    </h5>
                    <span className="text-[10px] text-slate-400">{comment.time}</span>
                  </div>
                </div>

                <button
                  onClick={() => toggleLike(comment.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    comment.liked
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'bg-white text-slate-500 hover:text-slate-700 border border-slate-200'
                  }`}
                >
                  <ThumbsUp className="w-3 h-3" />
                  <span>{comment.likes}</span>
                </button>
              </div>

              <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed pl-9">
                {comment.content}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
