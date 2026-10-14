import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  Timer,
  CheckCircle2,
  Coffee,
  Sparkles,
} from 'lucide-react';

interface StudyTimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSessionComplete: (minutes: number) => void;
}

export const StudyTimerModal: React.FC<StudyTimerModalProps> = ({
  isOpen,
  onClose,
  onSessionComplete,
}) => {
  const [timerMode, setTimerMode] = useState<'study' | 'shortBreak' | 'longBreak'>('study');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [elapsedMinutes, setElapsedMinutes] = useState(0);

  useEffect(() => {
    if (timerMode === 'study') setTimeLeft(25 * 60);
    else if (timerMode === 'shortBreak') setTimeLeft(5 * 60);
    else setTimeLeft(15 * 60);
    setIsActive(false);
  }, [timerMode]);

  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
        if (timerMode === 'study' && (timeLeft % 60 === 0)) {
          setElapsedMinutes((m) => m + 1);
        }
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      if (timerMode === 'study') {
        confetti({ particleCount: 70, spread: 60 });
        onSessionComplete(25);
      }
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, timerMode]);

  if (!isOpen) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const handleFinishEarly = () => {
    if (elapsedMinutes > 0 && timerMode === 'study') {
      onSessionComplete(elapsedMinutes);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-indigo-100 space-y-6 text-center">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Timer className="w-4 h-4" />
            </div>
            <span className="text-xs font-black uppercase tracking-wider text-slate-800">
              Pomodoro Study Focus
            </span>
          </div>
          <button
            onClick={handleFinishEarly}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center justify-center bg-slate-100 p-1 rounded-2xl text-xs font-bold">
          <button
            onClick={() => setTimerMode('study')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
              timerMode === 'study'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-indigo-600'
            }`}
          >
            25m Focus
          </button>
          <button
            onClick={() => setTimerMode('shortBreak')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
              timerMode === 'shortBreak'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-indigo-600'
            }`}
          >
            5m Break
          </button>
          <button
            onClick={() => setTimerMode('longBreak')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
              timerMode === 'longBreak'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-indigo-600'
            }`}
          >
            15m Break
          </button>
        </div>

        {/* Big Digital Clock */}
        <div className="py-4">
          <div className="text-6xl sm:text-7xl font-black text-slate-900 tracking-tight font-mono select-none">
            {formattedTime}
          </div>
          <p className="text-xs text-slate-400 font-medium mt-2">
            {timerMode === 'study' ? 'Deep focus without notifications' : 'Relax your eyes and hydrate'}
          </p>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => setIsActive(!isActive)}
            className={`px-8 py-3.5 rounded-2xl text-sm font-black flex items-center gap-2 shadow-lg transition-all cursor-pointer ${
              isActive
                ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-200'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-300'
            }`}
          >
            {isActive ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Start Session</span>
              </>
            )}
          </button>

          <button
            onClick={() => {
              setIsActive(false);
              if (timerMode === 'study') setTimeLeft(25 * 60);
              else if (timerMode === 'shortBreak') setTimeLeft(5 * 60);
              else setTimeLeft(15 * 60);
            }}
            title="Reset Timer"
            className="p-3.5 rounded-2xl border border-slate-200 text-slate-500 hover:text-indigo-600 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Tip footer */}
        <div className="p-3 bg-indigo-50/70 rounded-2xl text-xs text-indigo-900 font-medium">
          Completed minutes are automatically logged to your <strong>Study Time Overview</strong>!
        </div>

      </div>
    </div>
  );
};
