/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  BoardMode,
  GradeLevel,
  StudyLanguage,
  StudyDocument,
  StudyStats,
  GamificationState,
  ConceptMapData,
} from './types/study';
import {
  SAMPLE_DOCUMENTS,
  INITIAL_STATS,
  INITIAL_GAMIFICATION,
} from './data/sampleStudyData';
import { Navbar, AppTab } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { SmartNotesView } from './components/SmartNotesView';
import { ConceptMapView } from './components/ConceptMapView';
import { MCQQuizEngine } from './components/MCQQuizEngine';
import { FlashcardDeck } from './components/FlashcardDeck';
import { QuestionSolverView } from './components/QuestionSolverView';
import { CollaborativeStudyView } from './components/CollaborativeStudyView';
import { GamificationView } from './components/GamificationView';
import { WebSearchGroundingView } from './components/WebSearchGroundingView';
import { SupportAgentChatbot } from './components/SupportAgentChatbot';
import { UploadModal } from './components/UploadModal';
import { DoubtTutorDrawer } from './components/DoubtTutorDrawer';
import { StudyTimerModal } from './components/StudyTimerModal';
import { exportStudyGuideToPdf } from './utils/exportPdf';

export default function App() {
  const [board, setBoard] = useState<BoardMode>('cbse');
  const [grade, setGrade] = useState<GradeLevel>('Class 10');
  const [language, setLanguage] = useState<StudyLanguage>('en');
  const [activeTab, setActiveTab] = useState<AppTab>('dashboard');

  const [documents, setDocuments] = useState<StudyDocument[]>(SAMPLE_DOCUMENTS);
  const [activeDoc, setActiveDoc] = useState<StudyDocument | null>(SAMPLE_DOCUMENTS[0]);
  const [stats, setStats] = useState<StudyStats>(INITIAL_STATS);
  const [gamification, setGamification] = useState<GamificationState>(INITIAL_GAMIFICATION);

  // Modals & Chatbot Drawers
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isTimerOpen, setIsTimerOpen] = useState(false);
  const [isDoubtOpen, setIsDoubtOpen] = useState(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [doubtContext, setDoubtContext] = useState('');

  // Helper to add XP and handle level up
  const addXp = (amount: number) => {
    setGamification((prev) => {
      const newXp = prev.xp + amount;
      const leveledUp = newXp >= prev.nextLevelXp;
      const newLevel = leveledUp ? prev.level + 1 : prev.level;
      const newNextLevelXp = leveledUp ? prev.nextLevelXp + 700 : prev.nextLevelXp;

      if (leveledUp) {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.5 },
        });
      }

      return {
        ...prev,
        xp: newXp,
        level: newLevel,
        nextLevelXp: newNextLevelXp,
      };
    });
  };

  // Handle new document from AI generation
  const handleDocumentCreated = (newDoc: StudyDocument) => {
    const withCode: StudyDocument = {
      ...newDoc,
      shareCode: newDoc.shareCode || `SF-${newDoc.board.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
    };

    setDocuments((prev) => [withCode, ...prev]);
    setActiveDoc(withCode);
    setBoard(withCode.board);
    setGrade(withCode.grade);
    setActiveTab('notes');

    // Update stats & XP
    setStats((prev) => ({
      ...prev,
      sessionsCount: prev.sessionsCount + 1,
      totalStudyMinutes: prev.totalStudyMinutes + 15,
    }));
    addXp(150);
  };

  // Update concept map for active doc
  const handleUpdateDocConceptMap = (mapData: ConceptMapData) => {
    if (!activeDoc) return;
    const updated: StudyDocument = {
      ...activeDoc,
      conceptMap: mapData,
    };
    setActiveDoc(updated);
    setDocuments((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));
    addXp(120);
  };

  // Switch board mode updates both state and active document filter if available
  const handleSetBoard = (newBoard: BoardMode) => {
    setBoard(newBoard);
    const matched = documents.find((d) => d.board === newBoard);
    if (matched) {
      setActiveDoc(matched);
    }
  };

  const handleExportPdf = () => {
    if (activeDoc) {
      exportStudyGuideToPdf(activeDoc);
      addXp(50);
    }
  };

  const handleRecordQuizCompletion = (score: number, total: number) => {
    setStats((prev) => ({
      ...prev,
      quizzesTaken: prev.quizzesTaken + 1,
      mcqsSolved: prev.mcqsSolved + total,
      focusScore: Math.min(99, prev.focusScore + Math.round((score / total) * 3)),
    }));
    addXp(score * 30 + 50);
  };

  const handleRecordFlashcardsMastered = (count: number) => {
    setStats((prev) => ({
      ...prev,
      flashcardsMastered: Math.max(prev.flashcardsMastered, count),
    }));
    addXp(40);
  };

  const handleSessionComplete = (minutes: number) => {
    setStats((prev) => {
      const updatedTotal = prev.totalStudyMinutes + minutes;
      const updatedDaily = [...prev.dailyStudyHours];
      const todayIdx = updatedDaily.length - 1;
      if (todayIdx >= 0) {
        updatedDaily[todayIdx] = {
          ...updatedDaily[todayIdx],
          hours: Number((updatedDaily[todayIdx].hours + minutes / 60).toFixed(1)),
        };
      }
      return {
        ...prev,
        totalStudyMinutes: updatedTotal,
        sessionsCount: prev.sessionsCount + 1,
        dailyStudyHours: updatedDaily,
      };
    });
    addXp(minutes * 6);
  };

  const handleClaimQuest = (questId: string, rewardXp: number) => {
    setGamification((prev) => ({
      ...prev,
      quests: prev.quests.map((q) =>
        q.id === questId ? { ...q, completed: true, progress: q.target } : q
      ),
    }));
    addXp(rewardXp);
  };

  const handleImportDocumentByCode = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    const existing = documents.find(
      (d) => d.shareCode?.toUpperCase() === cleanCode || d.id.toUpperCase().includes(cleanCode)
    );

    if (existing) {
      setActiveDoc(existing);
      setBoard(existing.board);
      setGrade(existing.grade);
      setActiveTab('notes');
      addXp(80);
      return;
    }

    // If it's a sample code like SF-ICSE-4912
    if (cleanCode.includes('ICSE')) {
      const icseSample = SAMPLE_DOCUMENTS[1];
      setActiveDoc(icseSample);
      setBoard('icse');
      setGrade(icseSample.grade);
      setActiveTab('notes');
      addXp(80);
    } else {
      const cbseSample = SAMPLE_DOCUMENTS[0];
      setActiveDoc(cbseSample);
      setBoard('cbse');
      setGrade(cbseSample.grade);
      setActiveTab('notes');
      addXp(80);
    }
  };

  const handleOpenDoubtWithContext = (context: string) => {
    setDoubtContext(context);
    setIsDoubtOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        board={board}
        setBoard={handleSetBoard}
        grade={grade}
        setGrade={setGrade}
        language={language}
        setLanguage={setLanguage}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenUpload={() => setIsUploadOpen(true)}
        onExportPdf={handleExportPdf}
        hasActiveDoc={Boolean(activeDoc)}
        streakDays={stats.streakDays}
        userLevel={gamification.level}
        userXp={gamification.xp}
        onOpenTimer={() => setIsTimerOpen(true)}
        onOpenChatbot={() => setIsChatbotOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {activeTab === 'dashboard' && (
          <DashboardView
            stats={stats}
            activeDoc={activeDoc}
            documents={documents}
            onSelectDoc={(doc) => {
              setActiveDoc(doc);
              setBoard(doc.board);
              setGrade(doc.grade);
              setActiveTab('notes');
            }}
            onOpenUpload={() => setIsUploadOpen(true)}
            onNavigateTab={(tab) => setActiveTab(tab)}
            board={board}
            onOpenTimer={() => setIsTimerOpen(true)}
            onOpenChatbot={() => setIsChatbotOpen(true)}
            onExportPdf={handleExportPdf}
          />
        )}

        {activeTab === 'notes' && activeDoc && (
          <SmartNotesView
            doc={activeDoc}
            onOpenDoubtWithContext={handleOpenDoubtWithContext}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'concept' && activeDoc && (
          <ConceptMapView
            doc={activeDoc}
            onUpdateDocConceptMap={handleUpdateDocConceptMap}
            onOpenDoubtWithContext={handleOpenDoubtWithContext}
          />
        )}

        {activeTab === 'mcq' && activeDoc && (
          <MCQQuizEngine
            doc={activeDoc}
            onRecordQuizCompletion={handleRecordQuizCompletion}
          />
        )}

        {activeTab === 'flashcards' && activeDoc && (
          <FlashcardDeck
            doc={activeDoc}
            onRecordFlashcardsMastered={handleRecordFlashcardsMastered}
          />
        )}

        {activeTab === 'solver' && (
          <QuestionSolverView
            board={board}
            grade={grade}
            language={language}
          />
        )}

        {activeTab === 'collaborate' && (
          <CollaborativeStudyView
            activeDoc={activeDoc}
            documents={documents}
            onImportDocumentByCode={handleImportDocumentByCode}
            onOpenBookingAssistant={() => setIsChatbotOpen(true)}
          />
        )}

        {activeTab === 'gamify' && (
          <GamificationView
            gamification={gamification}
            onClaimQuest={handleClaimQuest}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'search' && (
          <WebSearchGroundingView
            board={board}
          />
        )}
      </main>

      {/* Upload PDF & Chapter Modal */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onDocumentCreated={handleDocumentCreated}
        defaultBoard={board}
        defaultGrade={grade}
        defaultLanguage={language}
      />

      {/* AI Doubt Tutor Drawer */}
      <DoubtTutorDrawer
        isOpen={isDoubtOpen}
        onClose={() => setIsDoubtOpen(false)}
        contextNotes={doubtContext || (activeDoc ? `${activeDoc.title}\n${activeDoc.overview}` : '')}
        board={board}
        language={language}
      />

      {/* Context-Aware ForgeBot Chatbot & Multi-step Booking Concierge */}
      <SupportAgentChatbot
        isOpen={isChatbotOpen}
        onClose={() => setIsChatbotOpen(false)}
        activeDoc={activeDoc}
        studentName="Martin Butler"
      />

      {/* Pomodoro Study Timer Modal */}
      <StudyTimerModal
        isOpen={isTimerOpen}
        onClose={() => setIsTimerOpen(false)}
        onSessionComplete={handleSessionComplete}
      />
    </div>
  );
}
