import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  RotateCw,
  CheckCircle2,
  HelpCircle,
  Shuffle,
  RotateCcw,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  BookOpen,
  Award,
} from 'lucide-react';
import { Flashcard, StudyDocument } from '../types/study';

interface FlashcardDeckProps {
  doc: StudyDocument;
  onRecordFlashcardsMastered: (count: number) => void;
}

export const FlashcardDeck: React.FC<FlashcardDeckProps> = ({
  doc,
  onRecordFlashcardsMastered,
}) => {
  const [cards, setCards] = useState<Flashcard[]>(doc.flashcards || []);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredIds, setMasteredIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    setCards(doc.flashcards || []);
    setCurrentIdx(0);
    setIsFlipped(false);
    setMasteredIds(new Set());
  }, [doc]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        setIsFlipped((f) => !f);
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIdx, cards.length]);

  if (cards.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
          <BookOpen className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-slate-800">
          No Flashcards in this topic
        </h3>
        <p className="text-xs text-slate-500">
          Upload a chapter to automatically generate high-yield active recall flashcards.
        </p>
      </div>
    );
  }

  const currentCard = cards[currentIdx];
  const isMastered = masteredIds.has(currentCard.id);

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIdx((i) => (i + 1) % cards.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIdx((i) => (i - 1 + cards.length) % cards.length);
  };

  const toggleMastered = () => {
    const nextSet = new Set(masteredIds);
    if (nextSet.has(currentCard.id)) {
      nextSet.delete(currentCard.id);
    } else {
      nextSet.add(currentCard.id);
      if (nextSet.size === cards.length) {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 },
        });
      }
    }
    setMasteredIds(nextSet);
    onRecordFlashcardsMastered(nextSet.size);
  };

  const handleShuffle = () => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setCurrentIdx(0);
    setIsFlipped(false);
  };

  const handleResetProgress = () => {
    setMasteredIds(new Set());
    setCurrentIdx(0);
    setIsFlipped(false);
  };

  const masteredCount = masteredIds.size;
  const progressPercent = Math.round((masteredCount / cards.length) * 100);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fade-in">
      
      {/* Deck Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-purple-100 text-purple-700">
              {doc.board.toUpperCase()} FLASHCARDS
            </span>
            <span className="text-xs font-bold text-slate-400">
              {doc.title}
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
            Active Recall Deck
          </h1>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleShuffle}
            title="Shuffle Deck"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>Shuffle</span>
          </button>
          <button
            onClick={handleResetProgress}
            title="Reset Mastered"
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-600">
          <span>Card {currentIdx + 1} of {cards.length}</span>
          <span className="text-indigo-600 font-extrabold">
            {masteredCount} of {cards.length} Mastered ({progressPercent}%)
          </span>
        </div>
        <div className="w-full bg-slate-200/80 rounded-full h-2 overflow-hidden">
          <div
            className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>

      {/* 3D Flipping Flashcard */}
      <div
        className="w-full h-80 sm:h-96 perspective-1000 cursor-pointer select-none"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div
          className={`relative w-full h-full duration-500 transform-style-preserve-3d transition-transform ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
        >
          {/* Card Front (Question / Prompt) */}
          <div className="absolute inset-0 backface-hidden bg-white rounded-3xl p-8 sm:p-12 border-2 border-indigo-100 shadow-xl shadow-indigo-100/50 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
                QUESTION / CONCEPT
              </span>
              <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
                <RotateCw className="w-3 h-3" />
                <span>Click or Space to flip</span>
              </span>
            </div>

            <div className="my-auto text-center space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
                {currentCard.front}
              </h2>
              {currentCard.difficulty && (
                <span className="inline-block text-[11px] font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
                  Difficulty: {currentCard.difficulty}
                </span>
              )}
            </div>

            <div className="text-center text-xs font-bold text-indigo-600">
              Tap to see answer & memory trigger →
            </div>
          </div>

          {/* Card Back (Answer / Solution) */}
          <div className="absolute inset-0 backface-hidden rotate-y-180 bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md bg-white/20 text-indigo-200">
                ANSWER & REVISION TRIGGER
              </span>
              <span className="text-xs text-indigo-200/70 font-semibold flex items-center gap-1">
                <RotateCw className="w-3 h-3" />
                <span>Click to flip back</span>
              </span>
            </div>

            <div className="my-auto text-center space-y-3">
              <p className="text-lg sm:text-xl font-medium text-white leading-relaxed">
                {currentCard.back}
              </p>
            </div>

            <div className="text-center text-xs font-medium text-indigo-300">
              ← Tap to flip back to question
            </div>
          </div>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Previous & Next */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Prev</span>
          </button>
          <button
            onClick={handleNext}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <span>Next</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Mastered Toggle Button */}
        <button
          onClick={toggleMastered}
          className={`px-6 py-2.5 rounded-2xl text-xs font-extrabold flex items-center gap-2 shadow-sm transition-all cursor-pointer ${
            isMastered
              ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>{isMastered ? 'Mastered ✓' : 'Mark as Mastered'}</span>
        </button>

        {/* Keyboard shortcut hint */}
        <div className="hidden md:flex items-center gap-2 text-[11px] text-slate-400 font-medium">
          <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded text-slate-600">Space</kbd> Flip
          <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded text-slate-600 ml-1">←</kbd>
          <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded text-slate-600">→</kbd> Navigate
        </div>
      </div>

    </div>
  );
};
