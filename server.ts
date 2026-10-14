import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isProd = process.env.NODE_ENV === 'production';
const PORT = Number(process.env.PORT) || 3000;

const app = express();
app.use(express.json({ limit: '60mb' }));
app.use(express.urlencoded({ extended: true, limit: '60mb' }));

// Initialize GoogleGenAI SDK
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Helper to strip markdown JSON wrapping
function cleanJsonString(str: string): string {
  let cleaned = str.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }
  return cleaned.trim();
}

// 1. Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

// 2. Process Study Document (Smart Notes, MCQs, Flashcards, Quizzes, Exam Questions)
app.post('/api/study/process-doc', async (req: Request, res: Response) => {
  try {
    const {
      content,
      board = 'cbse', // 'cbse' | 'icse' | 'general'
      grade = 'Class 10',
      language = 'en', // 'en' | 'hi' | 'hinglish'
      documentTitle = 'Study Chapter',
      customInstructions = '',
    } = req.body;

    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return res.status(400).json({ error: 'Text content from document or PDF is required.' });
    }

    const boardGuidelines = {
      cbse: 'Follow CBSE Curriculum & NCERT guidelines closely. Emphasize NCERT key terminology, assertion-reason questions, case-based questions, and 1-mark, 3-mark, and 5-mark marking schemes.',
      icse: 'Follow CISCE / ICSE board standards. Emphasize conceptual depth, precise scientific/technical definitions, Selina/concise reference style questions, and multi-part sub-questions.',
      general: 'Focus on clear conceptual understanding, practical examples, memory retention, and high-yield test preparation.',
    }[board as 'cbse' | 'icse' | 'general'] || 'Follow standard academic syllabus guidelines.';

    const languageInstruction = {
      en: 'Generate all content in clear, student-friendly academic English.',
      hi: 'Generate content primarily in clear modern Hindi (Devanagari script), keeping technical/scientific terms in both Hindi and English for student convenience.',
      hinglish: 'Generate content in natural conversational Hinglish (Roman Hindi + English, e.g., "Yeh concept exam ke liye bahut important hai...") to maximize student recall while keeping academic terms in English.',
    }[language as 'en' | 'hi' | 'hinglish'] || 'Generate content in English.';

    const systemPrompt = `You are StudyForge AI, the top-rated AI academic tutor specializing in CBSE, ICSE, and competitive exam preparation.
Your goal is to transform student notes/PDF excerpts into comprehensive, beautifully structured study materials.
${boardGuidelines}
Target Grade: ${grade}.
Language: ${languageInstruction}
${customInstructions ? `Additional Student Request: ${customInstructions}` : ''}

You must return a valid, strictly formatted JSON object with no preamble or commentary. The JSON must follow this exact structure:
{
  "title": "Clear Topic or Chapter Title",
  "board": "${board}",
  "grade": "${grade}",
  "language": "${language}",
  "overview": "A 2-3 sentence engaging synopsis explaining why this topic matters and its weightage.",
  "smartNotes": [
    {
      "sectionTitle": "Key Concept Header",
      "summary": "Concise high-yield explanation with bullet points if relevant.",
      "keyPoints": ["Important point 1", "Important point 2"],
      "formulasOrDefinitions": ["Important formula or formal rule, if applicable"],
      "examTip": "Board exam specific tip or common pitfall students make in answers"
    }
  ],
  "quickRevisionMnemonic": "A catchy acronym, memory hook, or mnemonic technique to remember difficult parts of this topic",
  "mcqs": [
    {
      "id": "mcq-1",
      "question": "Clear question text?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 0,
      "explanation": "Detailed explanation of why this answer is correct and why other options are wrong.",
      "tag": "CBSE Assertion-Reason / ICSE Application / Direct Concept"
    }
  ],
  "flashcards": [
    {
      "id": "fc-1",
      "front": "Key Question, Definition, or Formula Prompt",
      "back": "Crisp, memorable answer and memory trigger.",
      "difficulty": "Easy"
    }
  ],
  "boardQuestions": [
    {
      "id": "bq-1",
      "type": "Short Answer (3 Marks)",
      "question": "Expected board exam question",
      "modelAnswer": "Step-by-step model answer showing how to score full marks with key keywords underlined or bulleted.",
      "markingSchemeTips": "Where marks are awarded (e.g. 1 mark for formula, 1 mark for substitution, 1 mark for units)."
    }
  ],
  "practiceQuiz": [
    {
      "id": "q-1",
      "question": "Quiz question text?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 1,
      "explanation": "Why this answer is correct."
    }
  ]
}

Ensure high quality, educational rigor, and at least 5 MCQs, 6 Flashcards, 3 Smart Note Sections, 3 Board Exam Questions, and 5 Quiz questions.`;

    const userMessage = `Document Title: ${documentTitle}\n\nDocument Text Content:\n${content.slice(0, 45000)}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        { role: 'user', parts: [{ text: `${systemPrompt}\n\n${userMessage}` }] }
      ],
      config: {
        responseMimeType: 'application/json',
      },
    });

    const rawText = response.text || '{}';
    const cleaned = cleanJsonString(rawText);
    const parsedData = JSON.parse(cleaned);

    res.json({
      success: true,
      data: parsedData,
    });
  } catch (error: any) {
    console.error('Error in /api/study/process-doc:', error);
    res.status(500).json({
      success: false,
      error: error?.message || 'Failed to process document with AI.',
    });
  }
});

// 3. Question Image Solver (Multimodal photo of question paper, handwritten sums, textbook)
app.post('/api/study/solve-question-image', async (req: Request, res: Response) => {
  try {
    const {
      imageBase64,
      mimeType = 'image/jpeg',
      board = 'cbse',
      grade = 'Class 10',
      language = 'en',
      studentQuery = '',
    } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'Image base64 data is required.' });
    }

    const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');

    const promptText = `You are StudyForge AI Question Solver. A student has uploaded a photo of a question or exam problem.
Analyze the image carefully.
Board context: ${board.toUpperCase()} (${grade}).
Language preference: ${language === 'hi' ? 'Hindi (with English technical terms)' : language === 'hinglish' ? 'Hinglish (conversational Hindi-English mix)' : 'English'}.
${studentQuery ? `Student's specific question: "${studentQuery}"` : ''}

Respond in strictly valid JSON format with this exact structure:
{
  "transcribedQuestion": "Exact extracted text of the question from the image, including formulas and subparts",
  "subject": "e.g. Physics / Mathematics / Chemistry / Biology / History / Geography / Computer Science",
  "chapterOrTopic": "Identified chapter or concept name",
  "difficulty": "Easy | Medium | Hard",
  "boardWeightage": "Estimated marks (e.g. 1 Mark MCQ, 2 Marks VSA, 3 Marks SA, or 5 Marks LA)",
  "stepByStepSolution": [
    {
      "stepNumber": 1,
      "title": "Given Data / Concept Identification",
      "explanation": "Detailed breakdown of the step with mathematical/logical working"
    }
  ],
  "finalAnswer": "Concise final result or concluded statement with units if applicable",
  "keyConceptsTested": ["Concept 1", "Concept 2"],
  "commonMistakesToAvoid": "Frequent student errors on this exact question in CBSE/ICSE board exams",
  "similarPracticeQuestion": {
    "question": "A similar practice problem for the student to test their understanding",
    "hint": "Helpful hint without giving away the full answer immediately",
    "answer": "Brief answer for self-checking"
  }
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType,
              data: cleanBase64,
            },
          },
          {
            text: promptText,
          },
        ],
      },
      config: {
        responseMimeType: 'application/json',
      },
    });

    const rawText = response.text || '{}';
    const cleaned = cleanJsonString(rawText);
    const parsed = JSON.parse(cleaned);

    res.json({
      success: true,
      data: parsed,
    });
  } catch (error: any) {
    console.error('Error in /api/study/solve-question-image:', error);
    res.status(500).json({
      success: false,
      error: error?.message || 'Failed to solve question from image.',
    });
  }
});

// 4. Instant Translation between English, Hindi, and Hinglish
app.post('/api/study/translate', async (req: Request, res: Response) => {
  try {
    const { text, targetLanguage = 'hi', context = 'study materials' } = req.body;

    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text is required for translation.' });
    }

    const langName =
      targetLanguage === 'hi'
        ? 'Clear, fluent Hindi (Devanagari script) with difficult technical terms annotated in English brackets'
        : targetLanguage === 'hinglish'
        ? 'Friendly, natural Hinglish (Roman Hindi + English) as spoken by Indian students and top educators'
        : 'Fluent, clear academic English';

    const prompt = `Translate and adapt the following academic study content into ${langName}. Preserve markdown formatting, formulas, and structural lists cleanly.

Content:
${text.slice(0, 15000)}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    res.json({
      success: true,
      translatedText: response.text || '',
      targetLanguage,
    });
  } catch (error: any) {
    console.error('Error in /api/study/translate:', error);
    res.status(500).json({
      success: false,
      error: error?.message || 'Translation failed.',
    });
  }
});

// 5. Ask Doubt / AI Study Tutor
app.post('/api/study/chat-doubt', async (req: Request, res: Response) => {
  try {
    const { question, contextNotes = '', conversationHistory = [], board = 'cbse', language = 'en' } = req.body;

    if (!question) {
      return res.status(400).json({ error: 'Question is required.' });
    }

    const systemInstruction = `You are StudyForge AI Tutor, a warm, patient, and highly knowledgeable teacher specializing in ${board.toUpperCase()} board exams.
Your role is to explain concepts clearly, provide intuition, give real-life analogies, and guide students step-by-step.
Always tailor explanations to the student's level.
Language: ${language === 'hi' ? 'Hindi' : language === 'hinglish' ? 'Hinglish' : 'English'}.
${contextNotes ? `Current study material context: """${contextNotes.slice(0, 8000)}"""` : ''}`;

    const formattedContents = [
      {
        role: 'user',
        parts: [{ text: `${systemInstruction}\n\nStudent Question: ${question}` }],
      },
    ];

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: formattedContents,
    });

    res.json({
      success: true,
      answer: response.text || 'Unable to generate answer.',
    });
  } catch (error: any) {
    console.error('Error in /api/study/chat-doubt:', error);
    res.status(500).json({
      success: false,
      error: error?.message || 'Doubt solver failed.',
    });
  }
});
// 6. Visual Concept Map Generator
app.post('/api/study/concept-map', async (req: Request, res: Response) => {
  try {
    const { content, board = 'cbse', grade = 'Class 10', title = 'Study Chapter' } = req.body;

    if (!content || typeof content !== 'string') {
      return res.status(400).json({ error: 'Content is required to generate concept map.' });
    }

    const prompt = `You are an expert curriculum visualizer for ${board.toUpperCase()} ${grade}.
Analyze the following study material and construct an interconnected visual Concept Map structure.
Identify the Core Central Concept (root node), 6 to 10 Key Sub-concepts / Topic Nodes, and precise connecting relational edges (with verbs like "decomposes into", "produces", "governed by", "measured by", "applies to", "contrasts with").

Respond ONLY with valid JSON with this exact schema:
{
  "title": "${title}",
  "rootNode": {
    "id": "root",
    "label": "Central Chapter Topic",
    "description": "One sentence summary of the overarching theme"
  },
  "nodes": [
    {
      "id": "node-1",
      "label": "Concise Node Title",
      "category": "Definition / Law / Mechanism / Example / Application / Calculation",
      "summary": "1-2 sentence high-yield explanation",
      "keyTerms": ["term1", "term2"],
      "importance": "high"
    }
  ],
  "edges": [
    {
      "id": "edge-1",
      "from": "root",
      "to": "node-1",
      "label": "governed by",
      "relationType": "causes"
    }
  ],
  "crossConnections": [
    {
      "from": "node-1",
      "to": "node-2",
      "relationship": "Explanation of how these two distinct subtopics connect in board exam questions"
    }
  ],
  "studyTakeaways": [
    "Key memory link for exams 1",
    "Key memory link for exams 2"
  ]
}

Content to map:
${content.slice(0, 35000)}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const raw = response.text || '{}';
    const cleaned = cleanJsonString(raw);
    const parsed = JSON.parse(cleaned);

    res.json({
      success: true,
      data: parsed,
    });
  } catch (error: any) {
    console.error('Error in /api/study/concept-map:', error);
    res.status(500).json({
      success: false,
      error: error?.message || 'Failed to generate concept map.',
    });
  }
});

// 7. Context-Aware Support & Multi-Step Study Session Booking Chatbot
app.post('/api/study/chat-assistant', async (req: Request, res: Response) => {
  try {
    const { messages = [], activeDocTitle = '', activeDocOverview = '', studentName = 'Student' } = req.body;

    const systemInstruction = `You are "ForgeBot", the intelligent context-aware support agent and 1-on-1 peer study session concierge for StudyForge AI.
Student Name: ${studentName}.
Active Study Document: ${activeDocTitle ? `"${activeDocTitle}" - ${activeDocOverview}` : 'No document currently selected'}.

Your two primary duties:
1. PLATFORM & STUDY SUPPORT:
   - Provide instant, helpful answers about StudyForge AI features (CBSE/ICSE notes, flashcards, MCQ quizzes, photo solver, concept maps, PDF export, study timer).
   - If the student asks academic questions about their active notes, answer with high-yield board exam clarity.

2. MULTI-STEP STUDY SESSION BOOKING:
   - Help students book collaborative 1-on-1 Peer Study Sessions or Tutor Doubt Rooms.
   - You must remember earlier steps and guide them naturally through this sequence:
     * Step 1: Inquire about the target subject and specific chapter/topic they want to review.
     * Step 2: Confirm their Board (CBSE / ICSE / General) and Grade (e.g. Class 10 / 12).
     * Step 3: Ask for preferred day and time slot (e.g., "Today 6:00 PM", "Tomorrow 4:30 PM").
     * Step 4: Ask for preferred study mode ("Live Video/Audio Room" or "Quiet Pomodoro Co-study").
     * Step 5: FINAL CONFIRMATION: Once all details are gathered, generate an official booking summary with:
       - Session ID: e.g. "SF-PEER-8419"
       - Subject & Topic
       - Date & Time Slot
       - Assigned Peer/Tutor Match Status ("Confirmed • Link Ready")
       - Calendar Reminder link & Study Room Access Code
   - Always be cheerful, encouraging, organized, and remember previous turn inputs in the chat.`;

    const formattedContents = messages.map((m: any) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content || '' }],
    }));

    // If initial turn or empty, add initial prompt
    if (formattedContents.length === 0) {
      formattedContents.push({
        role: 'user',
        parts: [{ text: 'Hello!' }],
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: formattedContents,
      config: {
        systemInstruction,
      },
    });

    res.json({
      success: true,
      reply: response.text || 'I am here to help you study and book study sessions.',
    });
  } catch (error: any) {
    console.error('Error in /api/study/chat-assistant:', error);
    res.status(500).json({
      success: false,
      error: error?.message || 'Chatbot request failed.',
    });
  }
});

// 8. Real-Time Google Search Grounded Agent (Current Events, CBSE/ICSE updates, Fact-Checking)
app.post('/api/study/web-search', async (req: Request, res: Response) => {
  try {
    const { query, topicType = 'board_updates' } = req.body;

    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Search query is required.' });
    }

    const prompt = `You are StudyForge AI Academic Live Search & Fact-Checking Agent.
Using live Google Search data, answer the student's academic inquiry thoroughly with facts, dates, official notifications, and verified citations.

Inquiry Category: ${topicType}
Student Query: "${query}"

Guidelines:
1. Provide up-to-date, accurate information based on real-time search results (e.g., official CBSE cbse.gov.in / CISCE cisce.org announcements, latest sample papers, datesheets, scientific consensus, or current event context).
2. Clearly highlight key dates, official links, or specimen paper changes.
3. State whether rumors (e.g., "Is chapter X deleted for board exams?") are true or false based on official notifications.
4. Keep the tone student-friendly, authoritative, and helpful.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    // Extract search metadata & sources if available
    const candidate = response.candidates?.[0];
    const groundingMetadata = (candidate as any)?.groundingMetadata;
    const searchChunks = groundingMetadata?.groundingChunks || [];
    const webQueries = groundingMetadata?.webSearchQueries || [];

    const sources = searchChunks
      .map((chunk: any) => ({
        title: chunk.web?.title || 'Web Reference',
        url: chunk.web?.uri || '',
      }))
      .filter((s: any) => Boolean(s.url));

    res.json({
      success: true,
      text: response.text || 'No response from search agent.',
      sources,
      webQueries,
    });
  } catch (error: any) {
    console.error('Error in /api/study/web-search:', error);
    res.status(500).json({
      success: false,
      error: error?.message || 'Google search grounding request failed.',
    });
  }
});
// Dev Vite middleware or Production static serving
if (!isProd) {
  const { createServer } = await import('vite');
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.resolve(__dirname, 'dist')));
  app.get('*', (_req: Request, res: Response) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`StudyForge AI server running on http://0.0.0.0:${PORT}`);
});
