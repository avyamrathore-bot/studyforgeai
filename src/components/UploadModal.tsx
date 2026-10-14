import React, { useState, useRef } from 'react';
import {
  X,
  Upload,
  FileText,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  Layers,
  Globe,
} from 'lucide-react';
import { BoardMode, GradeLevel, StudyLanguage, StudyDocument } from '../types/study';
import { extractTextFromFile } from '../utils/pdfExtractor';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDocumentCreated: (doc: StudyDocument) => void;
  defaultBoard: BoardMode;
  defaultGrade: GradeLevel;
  defaultLanguage: StudyLanguage;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onDocumentCreated,
  defaultBoard,
  defaultGrade,
  defaultLanguage,
}) => {
  const [board, setBoard] = useState<BoardMode>(defaultBoard);
  const [grade, setGrade] = useState<GradeLevel>(defaultGrade);
  const [language, setLanguage] = useState<StudyLanguage>(defaultLanguage);
  const [title, setTitle] = useState('');
  const [textContent, setTextContent] = useState('');
  const [customInstructions, setCustomInstructions] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    if (!title) {
      const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      setTitle(cleanName);
    }

    try {
      setLoadingStep('Extracting text from file...');
      const extracted = await extractTextFromFile(file);
      setTextContent(extracted);
      setLoadingStep('');
    } catch (err: any) {
      setError(err?.message || 'Failed to extract text. You can paste text directly.');
      setLoadingStep('');
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    if (!title) {
      const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      setTitle(cleanName);
    }

    try {
      setLoadingStep('Extracting text from file...');
      const extracted = await extractTextFromFile(file);
      setTextContent(extracted);
      setLoadingStep('');
    } catch (err: any) {
      setError(err?.message || 'Failed to extract text from dropped file.');
      setLoadingStep('');
    }
  };

  const loadPreset = (presetType: 'cbse10' | 'icse10' | 'cbse12') => {
    if (presetType === 'cbse10') {
      setTitle('Acids, Bases & Salts (NCERT Class 10 Science)');
      setBoard('cbse');
      setGrade('Class 10');
      setTextContent(`Chapter 2: Acids, Bases and Salts (CBSE Class 10 NCERT)
Acids turn blue litmus red. They produce H+ (aq) ions in water. Examples: HCl, H2SO4, CH3COOH.
Bases turn red litmus blue. They produce OH- (aq) ions in water. Soluble bases are called alkalis. Examples: NaOH, KOH, Ca(OH)2.
Neutralisation Reaction: Acid + Base -> Salt + Water. Example: HCl + NaOH -> NaCl + H2O.
Reaction of Acids with Metals: Acid + Metal -> Salt + Hydrogen gas. Test: Burning candle burns with a 'pop' sound.
Reaction with Metal Carbonates: Metal carbonate + Acid -> Salt + CO2 + Water. Passing CO2 gas through lime water turns it milky due to CaCO3 precipitate. Prolonged passing makes it soluble Ca(HCO3)2.
pH Scale: Ranges from 0 (very acidic) to 14 (very alkaline). pH 7 is neutral. Gastric juice pH ~ 1.2, Pure water ~ 7, Tooth decay starts below pH 5.5.
Important Salts:
1. Bleaching Powder (CaOCl2): Ca(OH)2 + Cl2 -> CaOCl2 + H2O. Used as disinfectant and bleaching agent.
2. Baking Soda (NaHCO3): NaCl + H2O + CO2 + NH3 -> NH4Cl + NaHCO3. Antacid, ingredient in baking powder (with mild edible tartaric acid).
3. Washing Soda (Na2CO3.10H2O): Recrystallisation of sodium carbonate. Used for removing permanent hardness of water.
4. Plaster of Paris (CaSO4.1/2H2O): Obtained by heating gypsum (CaSO4.2H2O) at 373K. Used for fractured bone setting and toys.`);
    } else if (presetType === 'icse10') {
      setTitle('Photosynthesis: Light & Dark Reactions (ICSE Class 10)');
      setBoard('icse');
      setGrade('Class 10');
      setTextContent(`ICSE Class 10 Biology: Chapter - Photosynthesis
Definition: The physiological process by which green plant cells containing chlorophyll synthesize glucose from carbon dioxide and water using light energy, releasing oxygen as a byproduct.
Balanced Chemical Equation: 6CO2 + 12H2O --[Light / Chlorophyll]--> C6H12O6 + 6H2O + 6O2.
Site of Photosynthesis: Chloroplasts. Grana (thylakoids) contain chlorophyll for light reactions; Stroma contains enzymes for dark reactions.
Two Phases:
1. Light-Dependent Phase (Photochemical Phase in Grana):
- Activation of chlorophyll by absorbing light photons.
- Photolysis of water: 2H2O -> 4H+ + 4e- + O2 (Liberation of oxygen).
- Formation of assimilatory power: Photophosphorylation generates ATP from ADP + Pi, and reduction of NADP+ to NADPH.
2. Light-Independent Phase (Biosynthetic / Dark Phase in Stroma):
- RuBP carboxylase (Rubisco) fixes CO2 into 3-PGA, converted to glucose using ATP and NADPH via Calvin cycle.
Adaptations of Leaf for Photosynthesis: Large surface area, thinness, extensive stomatal distribution, thin cuticle.
Experiments: Destarching of leaves, Ganong's respirometer / light screen experiment, KOH to absorb CO2.`);
    } else {
      setTitle('Electric Charges and Coulomb\'s Law (CBSE Class 12)');
      setBoard('cbse');
      setGrade('Class 12');
      setTextContent(`Physics Class 12: Chapter 1 - Electric Charges and Fields
Properties of Electric Charge:
1. Additivity of charges: Q = q1 + q2 + ... + qn.
2. Conservation of charge: Total charge in an isolated system remains constant.
3. Quantization of charge: Q = ±ne, where e = 1.6 x 10^-19 C and n is an integer.
Coulomb's Law: The electrostatic force between two point charges q1 and q2 separated by distance r in vacuum is given by: F = (1 / 4πε0) * (|q1 * q2| / r^2).
Where ε0 = 8.854 x 10^-12 C^2 N^-1 m^-2 (permittivity of free space), and 1/(4πε0) = 9 x 10^9 N m^2 C^-2.
Vector form of Coulomb's law: F12 = - F21 (Obeys Newton's third law).
Electric Field: Force experienced per unit positive test charge: E = F / q0. For a point charge E = (1 / 4πε0) * (q / r^2) * r_hat.
Electric Dipole and Dipole Moment: Pair of equal and opposite charges separated by 2a: p = q * (2a). Direction is from negative charge to positive charge.`);
    }
  };

  const handleProcess = async () => {
    if (!textContent.trim()) {
      setError('Please upload a PDF or enter study text to process.');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      setLoadingStep('Synthesizing syllabus with Gemini 3.8 Flash...');

      const response = await fetch('/api/study/process-doc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: textContent,
          board,
          grade,
          language,
          documentTitle: title || 'Study Chapter',
          customInstructions,
        }),
      });

      const resData = await response.json();

      if (!response.ok || !resData.success) {
        throw new Error(resData.error || 'Failed to process document');
      }

      const generated = resData.data;
      const newDoc: StudyDocument = {
        id: 'doc-' + Date.now(),
        title: generated.title || title || 'Study Chapter',
        board: (generated.board as BoardMode) || board,
        grade: (generated.grade as GradeLevel) || grade,
        language: (generated.language as StudyLanguage) || language,
        overview: generated.overview || '',
        smartNotes: generated.smartNotes || [],
        quickRevisionMnemonic: generated.quickRevisionMnemonic || '',
        mcqs: generated.mcqs || [],
        flashcards: generated.flashcards || [],
        boardQuestions: generated.boardQuestions || [],
        practiceQuiz: generated.practiceQuiz || [],
        createdAt: new Date().toISOString(),
        originalText: textContent.slice(0, 5000),
      };

      onDocumentCreated(newDoc);
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Error communicating with AI tutor service.');
    } finally {
      setIsLoading(false);
      setLoadingStep('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-indigo-100 my-8 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-200">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                Upload & Synthesize Study Material
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Upload PDFs or notes to generate smart summaries, MCQs, flashcards & board Q&As
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Sample Presets */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Quick Presets (1-Click Test)
          </span>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => loadPreset('cbse10')}
              className="text-xs font-bold px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200/80 transition-all cursor-pointer"
            >
              CBSE 10: Acids, Bases & Salts
            </button>
            <button
              onClick={() => loadPreset('icse10')}
              className="text-xs font-bold px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200/80 transition-all cursor-pointer"
            >
              ICSE 10: Photosynthesis
            </button>
            <button
              onClick={() => loadPreset('cbse12')}
              className="text-xs font-bold px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200/80 transition-all cursor-pointer"
            >
              CBSE 12: Coulomb's Law
            </button>
          </div>
        </div>

        {/* Board & Grade Configuration */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Curriculum Board
            </label>
            <select
              value={board}
              onChange={(e) => setBoard(e.target.value as BoardMode)}
              className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <option value="cbse">CBSE (NCERT Oriented)</option>
              <option value="icse">ICSE (CISCE Oriented)</option>
              <option value="general">General Academic</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Class / Grade Level
            </label>
            <select
              value={grade}
              onChange={(e) => setGrade(e.target.value as GradeLevel)}
              className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <option value="Class 9">Class 9</option>
              <option value="Class 10">Class 10 (Board Exam)</option>
              <option value="Class 11">Class 11</option>
              <option value="Class 12">Class 12 (Board Exam)</option>
              <option value="College / Prep">Competitive / College</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Language Output
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as StudyLanguage)}
              className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <option value="en">English (Standard)</option>
              <option value="hi">हिन्दी (Hindi Devanagari)</option>
              <option value="hinglish">Hinglish (Mix)</option>
            </select>
          </div>
        </div>

        {/* Document Title */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Topic or Chapter Title
          </label>
          <input
            type="text"
            placeholder="e.g. Life Processes or Trigonometric Identities"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-sm font-medium bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        {/* Drag & Drop File Box */}
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-indigo-200 hover:border-indigo-400 bg-indigo-50/30 hover:bg-indigo-50/60 rounded-2xl p-5 text-center cursor-pointer transition-all"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.txt,.md"
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="w-10 h-10 rounded-xl bg-white shadow-xs text-indigo-600 flex items-center justify-center mx-auto mb-2">
            <Upload className="w-5 h-5" />
          </div>
          <p className="text-xs font-bold text-slate-800">
            {selectedFile ? (
              <span className="text-indigo-600 font-extrabold">{selectedFile.name}</span>
            ) : (
              'Click to upload PDF or text file, or drag and drop'
            )}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Supports textbook chapters, lecture notes, syllabus sheets (.pdf, .txt)
          </p>
        </div>

        {/* Textarea for Direct Content / Extracted Preview */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-bold text-slate-700">
              Study Content Text (Extracted or Paste directly)
            </label>
            <span className="text-[11px] text-slate-400 font-semibold">
              {textContent.length} characters
            </span>
          </div>
          <textarea
            rows={5}
            placeholder="Paste raw textbook text, notes, or chapter excerpts here..."
            value={textContent}
            onChange={(e) => setTextContent(e.target.value)}
            className="w-full text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        {/* Optional Custom Instructions */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Special Instructions (Optional)
          </label>
          <input
            type="text"
            placeholder="e.g. Include 5-mark numerical problems, emphasize Assertion-Reason MCQs"
            value={customInstructions}
            onChange={(e) => setCustomInstructions(e.target.value)}
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        {/* Error message */}
        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-indigo-700">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600 animate-spin" />
                <span>{loadingStep || 'Processing your chapter with Gemini 3.8 Flash...'}</span>
              </div>
              <span>75%</span>
            </div>
            <div className="w-full bg-indigo-200 rounded-full h-1.5 overflow-hidden">
              <div className="bg-indigo-600 h-1.5 rounded-full animate-pulse" style={{ width: '80%' }}></div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleProcess}
            disabled={isLoading || !textContent.trim()}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white text-xs font-extrabold shadow-md shadow-indigo-300 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isLoading ? 'Synthesizing...' : 'Generate Smart Materials'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
