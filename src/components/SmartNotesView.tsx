import React, { useState } from 'react';
import {
  BookOpen,
  FileDown,
  Globe,
  Sparkles,
  HelpCircle,
  Copy,
  Check,
  Award,
  Lightbulb,
  Bookmark,
  Share2,
  Maximize2,
} from 'lucide-react';
import { StudyDocument, StudyLanguage } from '../types/study';
import { exportStudyGuideToPdf } from '../utils/exportPdf';

interface SmartNotesViewProps {
  doc: StudyDocument;
  onOpenDoubtWithContext: (context: string) => void;
  onNavigateTab: (tab: 'mcq' | 'flashcards' | 'solver') => void;
}

export const SmartNotesView: React.FC<SmartNotesViewProps> = ({
  doc,
  onOpenDoubtWithContext,
  onNavigateTab,
}) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [activeLang, setActiveLang] = useState<StudyLanguage>(doc.language || 'en');
  const [translatedSections, setTranslatedSections] = useState<Record<string, string>>({});
  const [isTranslating, setIsTranslating] = useState(false);

  const handleCopySection = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleTranslateLanguage = async (targetLang: StudyLanguage) => {
    if (targetLang === activeLang) return;
    try {
      setIsTranslating(true);
      setActiveLang(targetLang);

      // Collect sections text to translate
      const contentToTranslate = doc.smartNotes
        .map(
          (s, i) =>
            `Section ${i + 1}: ${s.sectionTitle}\nSummary: ${s.summary}\nKey Points:\n${s.keyPoints.join(
              '\n'
            )}\nTip: ${s.examTip || ''}`
        )
        .join('\n\n');

      const response = await fetch('/api/study/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: contentToTranslate,
          targetLanguage: targetLang,
        }),
      });

      const data = await response.json();
      if (data.success && data.translatedText) {
        setTranslatedSections({ [targetLang]: data.translatedText });
      }
    } catch (err) {
      console.error('Translation failed', err);
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fade-in">
      
      {/* Top Banner with Actions */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md bg-indigo-100 text-indigo-700">
              {doc.board.toUpperCase()} BOARD MODE
            </span>
            <span className="text-xs font-bold text-slate-500">
              {doc.grade}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {doc.title}
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            AI-generated revision notes • {doc.smartNotes.length} Core Concept Modules
          </p>
        </div>

        {/* Translation & PDF Export Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          
          {/* Hindi-English Translation Toggle Bar */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => handleTranslateLanguage('en')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeLang === 'en'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-indigo-600'
              }`}
            >
              English
            </button>
            <button
              onClick={() => handleTranslateLanguage('hi')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeLang === 'hi'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-indigo-600'
              }`}
            >
              हिन्दी (Hindi)
            </button>
            <button
              onClick={() => handleTranslateLanguage('hinglish')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeLang === 'hinglish'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-indigo-600'
              }`}
            >
              Hinglish
            </button>
          </div>

          {/* Export PDF Button */}
          <button
            onClick={() => exportStudyGuideToPdf(doc)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold shadow-md shadow-indigo-300 transition-all cursor-pointer"
          >
            <FileDown className="w-4 h-4" />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* Chapter Overview Box */}
      {doc.overview && (
        <div className="bg-gradient-to-r from-indigo-50/80 via-purple-50/50 to-white rounded-3xl p-6 border border-indigo-100 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-indigo-700 text-xs font-bold uppercase tracking-wider">
            <BookOpen className="w-4 h-4" />
            <span>Chapter Synopsis & Syllabus Context</span>
          </div>
          <p className="text-sm text-slate-700 leading-relaxed font-medium">
            {doc.overview}
          </p>
        </div>
      )}

      {/* Quick Revision Mnemonic / Memory Hack Box */}
      {doc.quickRevisionMnemonic && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50/70 rounded-3xl p-6 border border-amber-200/80 shadow-xs flex items-start gap-4">
          <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-amber-200">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2 text-xs font-extrabold text-amber-800 uppercase tracking-wide">
              <span>Exam Recall Mnemonic & Hook</span>
            </div>
            <p className="text-sm font-semibold text-amber-950 leading-relaxed">
              {doc.quickRevisionMnemonic}
            </p>
          </div>
        </div>
      )}

      {/* Live Translation Indicator if translating */}
      {isTranslating && (
        <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold flex items-center gap-2">
          <Sparkles className="w-4 h-4 animate-spin text-indigo-600" />
          <span>Translating notes to {activeLang === 'hi' ? 'Hindi (Devanagari)' : 'Hinglish'} with Gemini 3.8 Flash...</span>
        </div>
      )}

      {/* If translated text is available, show the translated view */}
      {activeLang !== 'en' && translatedSections[activeLang] ? (
        <div className="bg-white rounded-3xl p-8 border border-indigo-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-xs font-extrabold text-indigo-700 uppercase tracking-wider flex items-center gap-1.5">
              <Globe className="w-4 h-4" />
              <span>Translated Study Notes ({activeLang.toUpperCase()})</span>
            </span>
            <button
              onClick={() => setActiveLang('en')}
              className="text-xs font-bold text-slate-500 hover:text-indigo-600"
            >
              Switch back to English
            </button>
          </div>
          <div className="text-sm font-medium text-slate-800 whitespace-pre-line leading-relaxed">
            {translatedSections[activeLang]}
          </div>
        </div>
      ) : (
        /* Standard Concept Modules */
        <div className="space-y-6">
          {doc.smartNotes.map((section, idx) => {
            const sectionText = `${section.sectionTitle}\n${section.summary}\n${section.keyPoints.join('\n')}`;

            return (
              <div
                key={idx}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm hover:border-indigo-100 transition-all space-y-5"
              >
                {/* Header & Quick Actions */}
                <div className="flex items-start justify-between gap-4 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 font-extrabold text-xs flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                      {section.sectionTitle}
                    </h2>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Ask AI Tutor for this section */}
                    <button
                      onClick={() => onOpenDoubtWithContext(sectionText)}
                      title="Ask AI Doubt on this topic"
                      className="p-2 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
                    >
                      <HelpCircle className="w-4 h-4" />
                    </button>
                    {/* Copy Section */}
                    <button
                      onClick={() => handleCopySection(sectionText, idx)}
                      title="Copy notes"
                      className="p-2 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
                    >
                      {copiedIndex === idx ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Summary */}
                <p className="text-sm text-slate-700 leading-relaxed font-medium">
                  {section.summary}
                </p>

                {/* Key Points list */}
                {section.keyPoints && section.keyPoints.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Key Exam Points
                    </h3>
                    <ul className="space-y-2">
                      {section.keyPoints.map((point, pIdx) => (
                        <li key={pIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 shrink-0"></span>
                          <span className="leading-relaxed">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Formulas or Definitions Highlight Box */}
                {section.formulasOrDefinitions && section.formulasOrDefinitions.length > 0 && (
                  <div className="p-4 rounded-2xl bg-purple-50/80 border border-purple-200/80 space-y-1.5">
                    <div className="text-[11px] font-extrabold uppercase tracking-wider text-purple-700">
                      Formulas & Official Definitions
                    </div>
                    <div className="space-y-1">
                      {section.formulasOrDefinitions.map((f, fIdx) => (
                        <div key={fIdx} className="font-mono text-xs sm:text-sm font-semibold text-purple-950">
                          {f}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Board Exam Tip Callout */}
                {section.examTip && (
                  <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/70 flex items-start gap-3">
                    <Award className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[11px] font-extrabold uppercase tracking-wide text-amber-800">
                        {doc.board.toUpperCase()} Marking Tip
                      </span>
                      <p className="text-xs text-amber-900 mt-0.5 leading-relaxed font-medium">
                        {section.examTip}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Expected Board Questions Section */}
      {doc.boardQuestions && doc.boardQuestions.length > 0 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-700">
                HIGH-YIELD BOARD QUESTIONS
              </span>
              <h2 className="text-xl font-black text-slate-900 tracking-tight mt-1">
                Expected 3-Mark & 5-Mark Questions with Model Answers
              </h2>
            </div>
            <span className="text-xs font-bold text-slate-400">
              {doc.boardQuestions.length} Questions
            </span>
          </div>

          <div className="space-y-5">
            {doc.boardQuestions.map((bq, bIdx) => (
              <div key={bIdx} className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-lg">
                    {bq.type}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-400">
                    Q{bIdx + 1}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 leading-snug">
                  {bq.question}
                </h3>

                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                    Model Marking Answer:
                  </div>
                  <div className="text-xs sm:text-sm text-slate-800 whitespace-pre-line leading-relaxed font-medium">
                    {bq.modelAnswer}
                  </div>
                </div>

                {bq.markingSchemeTips && (
                  <div className="text-xs text-amber-800 bg-amber-50 p-3 rounded-xl border border-amber-200/80 font-medium">
                    <strong>Marking Breakdown:</strong> {bq.markingSchemeTips}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Navigation CTA */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl shadow-indigo-200">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-lg font-black">
            Ready to test your knowledge?
          </h3>
          <p className="text-xs text-indigo-100 font-medium">
            Take the chapter MCQ Quiz or practice active recall with flashcards.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigateTab('flashcards')}
            className="px-4 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition-all cursor-pointer"
          >
            Practice Flashcards
          </button>
          <button
            onClick={() => onNavigateTab('mcq')}
            className="px-5 py-2.5 rounded-xl bg-white text-indigo-700 hover:bg-indigo-50 text-xs font-black shadow-md transition-all cursor-pointer"
          >
            Start Chapter MCQs
          </button>
        </div>
      </div>

    </div>
  );
};
