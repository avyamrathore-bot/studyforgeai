export type BoardMode = 'cbse' | 'icse' | 'general';
export type GradeLevel = 'Class 9' | 'Class 10' | 'Class 11' | 'Class 12' | 'College / Prep';
export type StudyLanguage = 'en' | 'hi' | 'hinglish';

export interface SmartNoteSection {
  sectionTitle: string;
  summary: string;
  keyPoints: string[];
  formulasOrDefinitions?: string[];
  examTip?: string;
}

export interface MCQ {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  tag?: string;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  mastered?: boolean;
}

export interface BoardQuestion {
  id: string;
  type: string;
  question: string;
  modelAnswer: string;
  markingSchemeTips?: string;
}

export interface PracticeQuizItem {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface ConceptMapNode {
  id: string;
  label: string;
  category: string;
  summary: string;
  keyTerms?: string[];
  importance: 'high' | 'medium' | 'low';
  x?: number;
  y?: number;
}

export interface ConceptMapEdge {
  id: string;
  from: string;
  to: string;
  label: string;
  relationType: 'causes' | 'contains' | 'derives' | 'applies_to' | 'contrasts_with' | 'connects';
}

export interface ConceptMapData {
  title: string;
  rootNode: {
    id: string;
    label: string;
    description: string;
  };
  nodes: ConceptMapNode[];
  edges: ConceptMapEdge[];
  crossConnections?: Array<{
    from: string;
    to: string;
    relationship: string;
  }>;
  studyTakeaways?: string[];
}

export interface StudyDocument {
  id: string;
  title: string;
  board: BoardMode;
  grade: GradeLevel;
  language: StudyLanguage;
  overview: string;
  smartNotes: SmartNoteSection[];
  quickRevisionMnemonic?: string;
  mcqs: MCQ[];
  flashcards: Flashcard[];
  boardQuestions: BoardQuestion[];
  practiceQuiz: PracticeQuizItem[];
  conceptMap?: ConceptMapData;
  createdAt: string;
  originalText?: string;
  shareCode?: string;
}

export interface QuestionSolutionStep {
  stepNumber: number;
  title: string;
  explanation: string;
}

export interface QuestionSolution {
  id: string;
  transcribedQuestion: string;
  subject: string;
  chapterOrTopic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  boardWeightage: string;
  stepByStepSolution: QuestionSolutionStep[];
  finalAnswer: string;
  keyConceptsTested: string[];
  commonMistakesToAvoid: string;
  similarPracticeQuestion?: {
    question: string;
    hint: string;
    answer: string;
  };
  imageUrl?: string;
  createdAt: string;
  board: BoardMode;
}

export interface SubjectBreakdown {
  subject: string;
  minutes: number;
  color: string;
  sessions: number;
}

export interface StudyStats {
  totalStudyMinutes: number;
  sessionsCount: number;
  focusScore: number;
  streakDays: number;
  quizzesTaken: number;
  mcqsSolved: number;
  flashcardsMastered: number;
  subjectBreakdown: SubjectBreakdown[];
  dailyStudyHours: { day: string; hours: number }[];
}

// Gamification Types
export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  xpValue: number;
}

export interface DailyQuest {
  id: string;
  title: string;
  rewardXp: number;
  progress: number;
  target: number;
  completed: boolean;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  avatar: string;
  board: string;
  grade: string;
  xp: number;
  streak: number;
  isUser?: boolean;
}

export interface GamificationState {
  xp: number;
  level: number;
  rankTitle: string;
  nextLevelXp: number;
  badges: Badge[];
  quests: DailyQuest[];
}

// Collaborative Study Squad Types
export interface StudySquad {
  id: string;
  name: string;
  board: BoardMode;
  subject: string;
  description: string;
  membersCount: number;
  code: string;
  sharedDecks: number;
  activeSession?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  time: string;
}
