import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  Award,
  RotateCcw,
  Clock,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Layers,
  Check,
} from 'lucide-react';
import { MCQ, StudyDocument } from '../types/study';

interface MCQQuizEngineProps {
  doc: StudyDocument;
  onRecordQuizCompletion: (score: number, total: number) => void;
}

export const MCQQuizEngine: React.FC<MCQQuizEngineProps> = ({
  doc,
  onRecordQuizCompletion,
}) => {
  const mcqs = doc.mcqs || [];

  const [mode, setMode] = useState<'practice' | 'exam'>('practice');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [scoreReport, setScoreReport] = useState<{ score: number; total: number } | null>(null);

  // If no MCQs
  if (mcqs.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
          <HelpCircle className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-slate-800">
          No MCQs found for this chapter
        </h3>
        <p className="text-xs text-slate-500">
          Upload a PDF or paste notes to generate fresh board MCQs.
        </p>
      </div>
    );
  }

  const currentMCQ = mcqs[currentIdx];
  const selectedForCurrent = selectedAnswers[currentIdx];
  const isCurrentAnswered = selectedForCurrent !== undefined;

  const handleSelectOption = (optIdx: number) => {
    if (mode === 'practice' && isCurrentAnswered) return; // In practice mode, lock once selected
    if (isSubmitted) return;

    setSelectedAnswers((prev) => ({
      ...prev,
      [currentIdx]: optIdx,
    }));
  };

  const handleFinishExam = () => {
    let score = 0;
    mcqs.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctIndex) {
        score++;
      }
    });

    const report = { score, total: mcqs.length };
    setScoreReport(report);
    setIsSubmitted(true);
    onRecordQuizCompletion(score, mcqs.length);

    // Fire celebratory confetti if scored >= 70%
    if (score / mcqs.length >= 0.7) {
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  };

  const handleRestart = () => {
    setSelectedAnswers({});
    setIsSubmitted(false);
    setScoreReport(null);
    setCurrentIdx(0);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fade-in">
      
      {/* Top Controls Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-700">
              {doc.board.toUpperCase()} QUESTION BANK
            </span>
            <span className="text-xs font-bold text-slate-400">
              {doc.title}
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
            MCQ & Quiz Engine
          </h1>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => {
                setMode('practice');
                handleRestart();
              }}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                mode === 'practice'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-indigo-600'
              }`}
            >
              Practice Mode
            </button>
            <button
              onClick={() => {
                setMode('exam');
                handleRestart();
              }}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                mode === 'exam'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-indigo-600'
              }`}
            >
              Timed Exam Mode
            </button>
          </div>

          <button
            onClick={handleRestart}
            title="Restart quiz"
            className="p-2 rounded-xl text-slate-500 hover:text-indigo-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Exam Result Report if submitted */}
      {isSubmitted && scoreReport && (
        <div className="bg-gradient-to-br from-indigo-700 via-indigo-600 to-purple-700 text-white rounded-3xl p-8 shadow-xl shadow-indigo-200 text-center space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center mx-auto shadow-inner">
            <Award className="w-8 h-8 text-amber-300" />
          </div>
          <div className="space-y-1">
            <h2 className="text-3xl font-black tracking-tight">
              {scoreReport.score === scoreReport.total
                ? 'Outstanding! 100% Full Marks!'
                : scoreReport.score >= scoreReport.total * 0.7
                ? 'Great Job! High Board Readiness!'
                : 'Good Attempt! Review Mistakes Below'}
            </h2>
            <p className="text-indigo-100 text-sm font-medium">
              You scored <span className="text-white font-bold">{scoreReport.score}</span> out of{' '}
              <span className="text-white font-bold">{scoreReport.total}</span> questions ({Math.round(
                (scoreReport.score / scoreReport.total) * 100
              )}
              %)
            </p>
          </div>

          <div className="pt-2 flex items-center justify-center gap-3">
            <button
              onClick={handleRestart}
              className="px-6 py-2.5 rounded-xl bg-white text-indigo-700 hover:bg-indigo-50 text-xs font-black shadow-md transition-all cursor-pointer"
            >
              Retake Exam
            </button>
            <button
              onClick={() => {
                setMode('practice');
                setIsSubmitted(false);
              }}
              className="px-5 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold backdrop-blur-sm transition-all cursor-pointer"
            >
              Review Explanations
            </button>
          </div>
        </div>
      )}

      {/* Main Question Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-6">
        
        {/* Progress & Tag Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 font-extrabold text-xs flex items-center justify-center">
              {currentIdx + 1}/{mcqs.length}
            </span>
            {currentMCQ.tag && (
              <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
                {currentMCQ.tag}
              </span>
            )}
          </div>

          {mode === 'exam' && (
            <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg">
              <Clock className="w-3.5 h-3.5" />
              <span>Exam Mode</span>
            </div>
          )}
        </div>

        {/* Question Text */}
        <div className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed whitespace-pre-line">
          {currentMCQ.question}
        </div>

        {/* Options List */}
        <div className="space-y-3">
          {currentMCQ.options.map((option, optIdx) => {
            const isSelected = selectedForCurrent === optIdx;
            const isCorrect = optIdx === currentMCQ.correctIndex;
            const optLetter = String.fromCharCode(65 + optIdx);

            let optStyle = 'border-slate-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/20 text-slate-800';

            // Practice mode feedback
            if (mode === 'practice' && isCurrentAnswered) {
              if (isCorrect) {
                optStyle = 'border-emerald-500 bg-emerald-50/80 text-emerald-950 font-bold';
              } else if (isSelected) {
                optStyle = 'border-rose-500 bg-rose-50/80 text-rose-950 font-bold';
              } else {
                optStyle = 'border-slate-200 bg-slate-50 text-slate-400 opacity-60';
              }
            } else if (mode === 'exam' && isSubmitted) {
              // Post exam review
              if (isCorrect) {
                optStyle = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-bold';
              } else if (isSelected) {
                optStyle = 'border-rose-500 bg-rose-50 text-rose-950 font-bold';
              }
            } else if (isSelected) {
              optStyle = 'border-indigo-600 bg-indigo-50/80 text-indigo-950 font-bold ring-2 ring-indigo-200';
            }

            return (
              <button
                key={optIdx}
                type="button"
                onClick={() => handleSelectOption(optIdx)}
                className={`w-full text-left p-4 rounded-2xl border transition-all flex items-start gap-3.5 cursor-pointer ${optStyle}`}
              >
                <span
                  className={`w-6 h-6 rounded-lg text-xs font-black flex items-center justify-center shrink-0 mt-0.5 ${
                    mode === 'practice' && isCurrentAnswered
                      ? isCorrect
                        ? 'bg-emerald-600 text-white'
                        : isSelected
                        ? 'bg-rose-600 text-white'
                        : 'bg-slate-200 text-slate-500'
                      : isSelected
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {optLetter}
                </span>

                <div className="flex-1 text-sm font-medium leading-relaxed">
                  {option}
                </div>

                {mode === 'practice' && isCurrentAnswered && (
                  <div className="shrink-0 mt-0.5">
                    {isCorrect ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    ) : isSelected ? (
                      <XCircle className="w-5 h-5 text-rose-600" />
                    ) : null}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Practice Mode Explanation Box */}
        {((mode === 'practice' && isCurrentAnswered) || isSubmitted) && currentMCQ.explanation && (
          <div className="p-5 rounded-2xl bg-indigo-50/80 border border-indigo-200/80 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-extrabold text-indigo-700 uppercase tracking-wide">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Explanation & Concept Working</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
              {currentMCQ.explanation}
            </p>
          </div>
        )}

        {/* Navigation Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <button
            type="button"
            disabled={currentIdx === 0}
            onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-30 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          {/* Question Dots indicator */}
          <div className="hidden sm:flex items-center gap-1.5">
            {mcqs.map((_, dotIdx) => {
              const isAnswered = selectedAnswers[dotIdx] !== undefined;
              const isCur = dotIdx === currentIdx;

              return (
                <button
                  key={dotIdx}
                  onClick={() => setCurrentIdx(dotIdx)}
                  className={`w-3 h-3 rounded-full transition-all cursor-pointer ${
                    isCur
                      ? 'bg-indigo-600 ring-2 ring-indigo-200 scale-125'
                      : isAnswered
                      ? 'bg-indigo-300'
                      : 'bg-slate-200'
                  }`}
                  title={`Question ${dotIdx + 1}`}
                />
              );
            })}
          </div>

          {currentIdx === mcqs.length - 1 ? (
            mode === 'exam' && !isSubmitted ? (
              <button
                type="button"
                onClick={handleFinishExam}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-extrabold shadow-md shadow-emerald-200 transition-all cursor-pointer"
              >
                <span>Submit Exam</span>
                <Check className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setCurrentIdx(0)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
              >
                <span>Back to First</span>
              </button>
            )
          ) : (
            <button
              type="button"
              onClick={() => setCurrentIdx((i) => Math.min(mcqs.length - 1, i + 1))}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-colors cursor-pointer"
            >
              <span>Next Question</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>

    </div>
  );
};
