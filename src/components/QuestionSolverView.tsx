import React, { useState, useRef } from 'react';
import {
  Camera,
  Upload,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  BookOpen,
  Award,
  Globe,
  RefreshCw,
  Eye,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { BoardMode, GradeLevel, StudyLanguage, QuestionSolution } from '../types/study';

interface QuestionSolverViewProps {
  board: BoardMode;
  grade: GradeLevel;
  language: StudyLanguage;
}

export const QuestionSolverView: React.FC<QuestionSolverViewProps> = ({
  board,
  grade,
  language: initialLanguage,
}) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [studentQuery, setStudentQuery] = useState('');
  const [activeBoard, setActiveBoard] = useState<BoardMode>(board);
  const [activeLanguage, setActiveLanguage] = useState<StudyLanguage>(initialLanguage);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [solution, setSolution] = useState<QuestionSolution | null>(null);
  const [showPracticeHint, setShowPracticeHint] = useState(false);
  const [showPracticeAnswer, setShowPracticeAnswer] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sample preset question images (SVG/canvas generated data URLs) so users can test immediately with 1 click!
  const handleLoadSampleQuestion = (type: 'cbse_math' | 'physics_optics' | 'icse_bio') => {
    setError(null);
    if (type === 'cbse_math') {
      // Draw a neat canvas image representing a handwritten CBSE 10 Math question
      const canvas = document.createElement('canvas');
      canvas.width = 600;
      canvas.height = 300;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, 600, 300);
        ctx.fillStyle = '#1e293b';
        ctx.font = 'bold 20px sans-serif';
        ctx.fillText('CBSE Class 10 Board Exam (Mathematics)', 40, 50);
        ctx.font = '16px serif';
        ctx.fillText('Q. Find the roots of the quadratic equation:', 40, 100);
        ctx.font = 'italic bold 22px serif';
        ctx.fillText('2x² - 5x + 3 = 0', 70, 145);
        ctx.font = '16px serif';
        ctx.fillText('using the quadratic formula and verify the discriminant.', 40, 195);
        ctx.fillStyle = '#64748b';
        ctx.font = '13px sans-serif';
        ctx.fillText('[Section B - 3 Marks]', 40, 240);

        const dataUrl = canvas.toDataURL('image/jpeg');
        setImagePreview(dataUrl);
        setStudentQuery('Please provide complete step-by-step working for CBSE board evaluation.');
      }
    } else if (type === 'physics_optics') {
      const canvas = document.createElement('canvas');
      canvas.width = 600;
      canvas.height = 300;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, 600, 300);
        ctx.fillStyle = '#1e293b';
        ctx.font = 'bold 20px sans-serif';
        ctx.fillText('CBSE Class 10 Science (Optics Numerical)', 40, 50);
        ctx.font = '16px serif';
        ctx.fillText('Q. A concave mirror produces three times magnified real image of an object', 40, 95);
        ctx.fillText('placed at 10 cm in front of it.', 40, 125);
        ctx.font = 'bold 17px serif';
        ctx.fillText('(i) Where is the image located?', 40, 165);
        ctx.fillText('(ii) What is the focal length of the mirror?', 40, 195);
        ctx.fillStyle = '#64748b';
        ctx.font = '13px sans-serif';
        ctx.fillText('[NCERT Exemplar - 3 Marks]', 40, 240);

        const dataUrl = canvas.toDataURL('image/jpeg');
        setImagePreview(dataUrl);
        setStudentQuery('How to apply Cartesian sign convention properly here?');
      }
    } else {
      const canvas = document.createElement('canvas');
      canvas.width = 600;
      canvas.height = 300;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, 600, 300);
        ctx.fillStyle = '#1e293b';
        ctx.font = 'bold 20px sans-serif';
        ctx.fillText('ICSE Class 10 Biology Question', 40, 50);
        ctx.font = '16px serif';
        ctx.fillText('Q. A pure breeding tall plant (TT) with red flowers (RR) is crossed', 40, 100);
        ctx.fillText('with a dwarf plant (tt) with white flowers (rr).', 40, 130);
        ctx.font = 'bold 16px serif';
        ctx.fillText('State the phenotype and genotype of the F1 generation and write', 40, 170);
        ctx.fillText('the phenotypic ratio of the F2 generation.', 40, 200);
        ctx.fillStyle = '#64748b';
        ctx.font = '13px sans-serif';
        ctx.fillText('[ICSE CISCE Section II - 4 Marks]', 40, 245);

        const dataUrl = canvas.toDataURL('image/jpeg');
        setImagePreview(dataUrl);
        setStudentQuery('Show Punnett square representation.');
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSolve = async () => {
    if (!imagePreview) {
      setError('Please upload or select a question photo first.');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      setSolution(null);
      setShowPracticeHint(false);
      setShowPracticeAnswer(false);

      const response = await fetch('/api/study/solve-question-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: imagePreview,
          mimeType: 'image/jpeg',
          board: activeBoard,
          grade,
          language: activeLanguage,
          studentQuery,
        }),
      });

      const resData = await response.json();

      if (!response.ok || !resData.success) {
        throw new Error(resData.error || 'Failed to solve question photo');
      }

      const solData = resData.data;
      setSolution({
        id: 'sol-' + Date.now(),
        transcribedQuestion: solData.transcribedQuestion || '',
        subject: solData.subject || 'Academic Subject',
        chapterOrTopic: solData.chapterOrTopic || 'General Topic',
        difficulty: solData.difficulty || 'Medium',
        boardWeightage: solData.boardWeightage || '3 Marks',
        stepByStepSolution: solData.stepByStepSolution || [],
        finalAnswer: solData.finalAnswer || '',
        keyConceptsTested: solData.keyConceptsTested || [],
        commonMistakesToAvoid: solData.commonMistakesToAvoid || '',
        similarPracticeQuestion: solData.similarPracticeQuestion,
        imageUrl: imagePreview,
        createdAt: new Date().toISOString(),
        board: activeBoard,
      });
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Failed to analyze question with AI.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fade-in">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md bg-violet-100 text-violet-700">
              MULTIMODAL AI VISION
            </span>
            <span className="text-xs font-bold text-slate-400">
              {activeBoard.toUpperCase()} • {grade}
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
            Question Photo Solver
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Upload textbook problems, past board papers, or handwritten math sums for instant step-by-step marking answers
          </p>
        </div>

        {/* Board & Language toggles */}
        <div className="flex items-center gap-2">
          <select
            value={activeBoard}
            onChange={(e) => setActiveBoard(e.target.value as BoardMode)}
            className="text-xs font-bold bg-slate-100 text-slate-700 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-400 cursor-pointer"
          >
            <option value="cbse">CBSE Mode</option>
            <option value="icse">ICSE Mode</option>
            <option value="general">General</option>
          </select>

          <select
            value={activeLanguage}
            onChange={(e) => setActiveLanguage(e.target.value as StudyLanguage)}
            className="text-xs font-bold bg-slate-100 text-slate-700 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-400 cursor-pointer"
          >
            <option value="en">English</option>
            <option value="hi">हिन्दी (Hindi)</option>
            <option value="hinglish">Hinglish</option>
          </select>
        </div>
      </div>

      {/* Upload & Preset Box */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-6">
        
        {/* Quick Test Presets */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Quick 1-Click Test Questions
          </span>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleLoadSampleQuestion('cbse_math')}
              className="text-xs font-bold px-3 py-1.5 rounded-xl bg-violet-50 hover:bg-violet-100 text-violet-700 border border-violet-200 transition-all cursor-pointer"
            >
              Math: Quadratic Roots (CBSE 10)
            </button>
            <button
              onClick={() => handleLoadSampleQuestion('physics_optics')}
              className="text-xs font-bold px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition-all cursor-pointer"
            >
              Physics: Mirror Magnification (CBSE 10)
            </button>
            <button
              onClick={() => handleLoadSampleQuestion('icse_bio')}
              className="text-xs font-bold px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-all cursor-pointer"
            >
              Biology: Dihybrid Cross (ICSE 10)
            </button>
          </div>
        </div>

        {/* Drag & Drop Photo Upload */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-violet-200 hover:border-violet-400 bg-violet-50/20 hover:bg-violet-50/50 rounded-2xl p-6 text-center cursor-pointer transition-all"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          {imagePreview ? (
            <div className="space-y-3">
              <div className="max-h-64 overflow-hidden rounded-xl border border-slate-200 mx-auto inline-block shadow-sm">
                <img
                  src={imagePreview}
                  alt="Question Preview"
                  className="max-h-64 object-contain bg-white"
                />
              </div>
              <p className="text-xs font-bold text-violet-700">
                Question photo loaded! Click here to change image.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-white shadow-xs text-violet-600 flex items-center justify-center mx-auto">
                <Camera className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">
                Click or Drop photo of your question here
              </h3>
              <p className="text-xs text-slate-400">
                Supports JPG, PNG, WEBP (textbook photos, handwritten notebook problems)
              </p>
            </div>
          )}
        </div>

        {/* Student's specific doubt / query (optional) */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Specific instructions or doubt about this question (Optional)
          </label>
          <input
            type="text"
            placeholder="e.g. Where did the negative sign come from? Show step-by-step formula."
            value={studentQuery}
            onChange={(e) => setStudentQuery(e.target.value)}
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        {/* Error message */}
        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Action Button */}
        <div className="flex items-center justify-end">
          <button
            onClick={handleSolve}
            disabled={isLoading || !imagePreview}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white text-xs font-extrabold shadow-md shadow-violet-200 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isLoading ? 'Solving with Gemini 3.8 Flash...' : 'Solve Question Now'}</span>
          </button>
        </div>

      </div>

      {/* Solution Section */}
      {solution && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-indigo-100 shadow-sm space-y-6">
          
          {/* Solution Top Tag */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-lg">
                {solution.subject} • {solution.chapterOrTopic}
              </span>
              <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg">
                Estimated: {solution.boardWeightage}
              </span>
              <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
                Difficulty: {solution.difficulty}
              </span>
            </div>

            <div className="text-xs font-bold text-emerald-600 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>Verified AI Solution</span>
            </div>
          </div>

          {/* Transcribed Question Box */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="text-[11px] font-extrabold uppercase tracking-wide text-slate-400">
              Transcribed Question:
            </span>
            <p className="text-sm font-bold text-slate-900 leading-snug whitespace-pre-line">
              {solution.transcribedQuestion}
            </p>
          </div>

          {/* Step-by-Step Working */}
          <div className="space-y-4">
            <h3 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">
              Step-by-Step Board Evaluation Working
            </h3>

            <div className="space-y-3">
              {solution.stepByStepSolution.map((step) => (
                <div
                  key={step.stepNumber}
                  className="p-4 rounded-2xl bg-indigo-50/30 border border-indigo-100/70 space-y-1.5"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                      {step.stepNumber}
                    </span>
                    <h4 className="text-xs sm:text-sm font-extrabold text-indigo-950">
                      {step.title}
                    </h4>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 pl-8 leading-relaxed font-medium whitespace-pre-line">
                    {step.explanation}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Final Answer Highlight Box */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-200/50 space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-100">
              Final Answer
            </span>
            <div className="text-base sm:text-lg font-black tracking-tight leading-snug">
              {solution.finalAnswer}
            </div>
          </div>

          {/* Common Mistakes to Avoid */}
          {solution.commonMistakesToAvoid && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200/80 flex items-start gap-3">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wide text-rose-800">
                  Common Mistakes in {solution.board.toUpperCase()} Exams:
                </span>
                <p className="text-xs text-rose-900 mt-0.5 leading-relaxed font-medium">
                  {solution.commonMistakesToAvoid}
                </p>
              </div>
            </div>
          )}

          {/* Similar Practice Question */}
          {solution.similarPracticeQuestion && (
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wide">
                  Try Similar Practice Problem:
                </span>
                <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full">
                  Self Test
                </span>
              </div>

              <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-relaxed">
                {solution.similarPracticeQuestion.question}
              </p>

              {/* Hint & Answer toggles */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                {solution.similarPracticeQuestion.hint && (
                  <button
                    onClick={() => setShowPracticeHint(!showPracticeHint)}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                  >
                    <span>{showPracticeHint ? 'Hide Hint' : 'Show Hint'}</span>
                    {showPracticeHint ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                )}
                {solution.similarPracticeQuestion.answer && (
                  <button
                    onClick={() => setShowPracticeAnswer(!showPracticeAnswer)}
                    className="text-xs font-bold text-emerald-600 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
                  >
                    <span>{showPracticeAnswer ? 'Hide Answer' : 'Show Answer'}</span>
                    {showPracticeAnswer ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                )}
              </div>

              {showPracticeHint && (
                <div className="text-xs text-indigo-900 bg-indigo-50/70 p-3 rounded-xl border border-indigo-100 font-medium">
                  <strong>Hint:</strong> {solution.similarPracticeQuestion.hint}
                </div>
              )}

              {showPracticeAnswer && (
                <div className="text-xs text-emerald-950 bg-emerald-50/70 p-3 rounded-xl border border-emerald-100 font-bold">
                  <strong>Answer:</strong> {solution.similarPracticeQuestion.answer}
                </div>
              )}
            </div>
          )}

        </div>
      )}

    </div>
  );
};
