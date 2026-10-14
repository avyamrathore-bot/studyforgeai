import {
  StudyDocument,
  StudyStats,
  GamificationState,
  LeaderboardEntry,
  StudySquad,
} from '../types/study';

export const INITIAL_STATS: StudyStats = {
  totalStudyMinutes: 765, // 12h 45m
  sessionsCount: 18,
  focusScore: 86,
  streakDays: 7,
  quizzesTaken: 14,
  mcqsSolved: 92,
  flashcardsMastered: 48,
  subjectBreakdown: [
    { subject: 'Science / Physics', minutes: 270, color: '#6366f1', sessions: 6 },
    { subject: 'Mathematics', minutes: 225, color: '#a855f7', sessions: 5 },
    { subject: 'Chemistry', minutes: 165, color: '#ec4899', sessions: 4 },
    { subject: 'Biology', minutes: 105, color: '#10b981', sessions: 3 },
  ],
  dailyStudyHours: [
    { day: 'Sun', hours: 1.5 },
    { day: 'Mon', hours: 2.0 },
    { day: 'Tue', hours: 1.8 },
    { day: 'Wed', hours: 3.2 },
    { day: 'Thu', hours: 2.5 },
    { day: 'Fri', hours: 1.0 },
    { day: 'Sat', hours: 0.7 },
  ],
};

export const INITIAL_GAMIFICATION: GamificationState = {
  xp: 1840,
  level: 6,
  rankTitle: 'Board Exam Contender',
  nextLevelXp: 2500,
  badges: [
    {
      id: 'b-1',
      title: 'NCERT Prodigy',
      description: 'Solved 50+ NCERT exemplar questions with 80%+ accuracy',
      icon: 'GraduationCap',
      unlocked: true,
      unlockedAt: '2 days ago',
      xpValue: 250,
    },
    {
      id: 'b-2',
      title: '7-Day Streak Master',
      description: 'Maintained an unbroken daily focus streak for one full week',
      icon: 'Flame',
      unlocked: true,
      unlockedAt: 'Yesterday',
      xpValue: 300,
    },
    {
      id: 'b-3',
      title: 'Concept Cartographer',
      description: 'Generated and explored 3 interactive concept knowledge maps',
      icon: 'Network',
      unlocked: true,
      unlockedAt: 'Today',
      xpValue: 200,
    },
    {
      id: 'b-4',
      title: 'Quiz Ace (100% Score)',
      description: 'Scored full marks on a timed board exam MCQ practice test',
      icon: 'Award',
      unlocked: false,
      xpValue: 350,
    },
    {
      id: 'b-5',
      title: 'Doubt Smasher',
      description: 'Cleared 10 tricky syllabus doubts using the AI tutor & web grounding',
      icon: 'Zap',
      unlocked: true,
      unlockedAt: '3 days ago',
      xpValue: 150,
    },
    {
      id: 'b-6',
      title: 'Collaborative Study Host',
      description: 'Shared revision notes or flashcards with your study squad',
      icon: 'Users',
      unlocked: false,
      xpValue: 400,
    },
  ],
  quests: [
    {
      id: 'q-1',
      title: 'Master 6 Flashcards today',
      rewardXp: 120,
      progress: 4,
      target: 6,
      completed: false,
    },
    {
      id: 'q-2',
      title: 'Complete 1 Pomodoro 25m Focus Session',
      rewardXp: 150,
      progress: 1,
      target: 1,
      completed: true,
    },
    {
      id: 'q-3',
      title: 'Solve 1 Question Photo with step-by-step working',
      rewardXp: 100,
      progress: 0,
      target: 1,
      completed: false,
    },
  ],
};

export const SAMPLE_LEADERBOARD: LeaderboardEntry[] = [
  {
    rank: 1,
    name: 'Aarav Sharma',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=128&q=80',
    board: 'CBSE',
    grade: 'Class 10',
    xp: 3420,
    streak: 18,
  },
  {
    rank: 2,
    name: 'Ananya Deshmukh',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=128&q=80',
    board: 'ICSE',
    grade: 'Class 10',
    xp: 2980,
    streak: 14,
  },
  {
    rank: 3,
    name: 'Martin Butler (You)',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=128&q=80',
    board: 'CBSE',
    grade: 'Class 10',
    xp: 1840,
    streak: 7,
    isUser: true,
  },
  {
    rank: 4,
    name: 'Rohan Verma',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=128&q=80',
    board: 'CBSE',
    grade: 'Class 12',
    xp: 1690,
    streak: 9,
  },
  {
    rank: 5,
    name: 'Ishita Sen',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=128&q=80',
    board: 'ICSE',
    grade: 'Class 10',
    xp: 1450,
    streak: 6,
  },
  {
    rank: 6,
    name: 'Devansh Patel',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=128&q=80',
    board: 'CBSE',
    grade: 'Class 10',
    xp: 1320,
    streak: 5,
  },
];

export const SAMPLE_STUDY_SQUADS: StudySquad[] = [
  {
    id: 'squad-1',
    name: 'CBSE 10 Toppers Club',
    board: 'cbse',
    subject: 'Science & Math Focus',
    description: 'Daily NCERT problem solving, 5-mark answer reviews, and specimen paper practice.',
    membersCount: 24,
    code: 'CBSE-TOP-10',
    sharedDecks: 12,
    activeSession: 'Active Now • 4 members reviewing Redox Reactions',
  },
  {
    id: 'squad-2',
    name: 'ICSE Bio & Chem Squad',
    board: 'icse',
    subject: 'Biology & Chemistry',
    description: 'Selina questions, precise definitions, Punnett squares, and chemical equations.',
    membersCount: 18,
    code: 'ICSE-BIO-20',
    sharedDecks: 8,
  },
  {
    id: 'squad-3',
    name: 'Night Owl Physics Sprint',
    board: 'cbse',
    subject: 'Class 12 Physics & JEE',
    description: 'Electric Charges, Coulomb\'s law, Gauss theorem derivations, and numericals.',
    membersCount: 31,
    code: 'NIGHT-PHY-12',
    sharedDecks: 15,
    activeSession: 'Focus Session • Starts at 9:00 PM',
  },
];

export const SAMPLE_DOCUMENTS: StudyDocument[] = [
  {
    id: 'doc-cbse-chem-1',
    title: 'Chemical Reactions & Equations (NCERT Ch 1)',
    board: 'cbse',
    grade: 'Class 10',
    language: 'en',
    shareCode: 'SF-CBSE-9481',
    overview: 'High-weightage foundational chapter for CBSE Class 10 Science board examinations. Focuses on balancing redox reactions, types of chemical combinations, decomposition, and thermal dissociation.',
    quickRevisionMnemonic: 'OIL RIG: Oxidation Is Loss of electrons, Reduction Is Gain of electrons. For combinations: "A + B makes Together!"',
    createdAt: new Date().toISOString(),
    conceptMap: {
      title: 'Chemical Reactions & Equations',
      rootNode: {
        id: 'root',
        label: 'Chemical Reactions & Equations',
        description: 'Transformation of chemical substances with rearrangement of bonds and atoms.',
      },
      nodes: [
        {
          id: 'node-1',
          label: 'Law of Conservation of Mass',
          category: 'Fundamental Law',
          summary: 'Atoms cannot be created or destroyed. Reactant mass must equal product mass.',
          keyTerms: ['Balancing', 'Stoichiometry', 'State Symbols'],
          importance: 'high',
          x: 200,
          y: 80,
        },
        {
          id: 'node-2',
          label: 'Combination Reactions',
          category: 'Reaction Type',
          summary: 'Two or more reactants fuse into a single product (A + B -> AB).',
          keyTerms: ['Exothermic', 'Slaked Lime', 'CaO + H2O'],
          importance: 'medium',
          x: 60,
          y: 200,
        },
        {
          id: 'node-3',
          label: 'Decomposition Reactions',
          category: 'Reaction Type',
          summary: 'Single reactant breaks down using Thermal, Photolytic, or Electrolytic energy.',
          keyTerms: ['Endothermic', 'AgCl photolysis', '2:1 H2/O2 ratio'],
          importance: 'high',
          x: 340,
          y: 200,
        },
        {
          id: 'node-4',
          label: 'Displacement & Precipitation',
          category: 'Reaction Type',
          summary: 'More reactive metal displaces weaker metal. Double displacement forms insoluble precipitate.',
          keyTerms: ['Reactivity Series', 'BaSO4 White ppt', 'FeSO4 Green'],
          importance: 'high',
          x: 90,
          y: 340,
        },
        {
          id: 'node-5',
          label: 'Redox & Corrosion',
          category: 'Mechanism & Application',
          summary: 'Simultaneous Oxidation (Loss of e-) and Reduction (Gain of e-). Prevention of Rancidity.',
          keyTerms: ['Oxidizing Agent', 'Rancidity', 'Rusting', 'N2 flushing'],
          importance: 'high',
          x: 310,
          y: 340,
        },
      ],
      edges: [
        { id: 'e1', from: 'root', to: 'node-1', label: 'governed by', relationType: 'causes' },
        { id: 'e2', from: 'root', to: 'node-2', label: 'categorized into', relationType: 'contains' },
        { id: 'e3', from: 'root', to: 'node-3', label: 'categorized into', relationType: 'contains' },
        { id: 'e4', from: 'node-2', to: 'node-3', label: 'opposite process of', relationType: 'contrasts_with' },
        { id: 'e5', from: 'root', to: 'node-4', label: 'manifests as', relationType: 'contains' },
        { id: 'e6', from: 'root', to: 'node-5', label: 'electronic exchange in', relationType: 'applies_to' },
        { id: 'e7', from: 'node-3', to: 'node-5', label: 'often involves redox in', relationType: 'connects' },
      ],
      crossConnections: [
        {
          from: 'Decomposition Reactions',
          to: 'Redox Reactions',
          relationship: 'Electrolysis of water is both an electrolytic decomposition and a redox reaction.',
        },
        {
          from: 'Displacement',
          to: 'Reactivity Series',
          relationship: 'Fe displacing Cu in CuSO4 relies directly on iron being positioned higher than copper in the reactivity series.',
        },
      ],
      studyTakeaways: [
        'Always balance equations by equalizing atoms of the element with largest count first.',
        'Specify physical states (s, l, g, aq) to secure full marks in 3-mark CBSE board questions.',
      ],
    },
    smartNotes: [
      {
        sectionTitle: 'Law of Conservation of Mass & Balancing Reactions',
        summary: 'Mass can neither be created nor destroyed in a chemical reaction. The total number of atoms of each element remains identical on both sides of the equation.',
        keyPoints: [
          'Count individual elements systematically starting with the compound having the highest number of atoms.',
          'Physical states must be specified: (s) solid, (l) liquid, (g) gas, (aq) aqueous solution.',
          'Balanced example: 3Fe(s) + 4H2O(g) -> Fe3O4(s) + 4H2(g).'
        ],
        formulasOrDefinitions: [
          'Balanced Equation: Total mass of reactants = Total mass of products',
          'Law of Conservation of Mass (Antoine Lavoisier)'
        ],
        examTip: 'CBSE often awards 1 full mark for specifying physical states (s, l, g, aq) in reaction questions.'
      },
      {
        sectionTitle: 'Types of Reactions: Combination vs Decomposition',
        summary: 'Combination synthesizes one single product from two or more reactants. Decomposition breaks down one reactant into two or more simpler substances requiring heat, light, or electricity.',
        keyPoints: [
          'Thermal Decomposition: CaCO3(s) --[Heat]--> CaO(s) + CO2(g) (Quicklime production).',
          'Electrolytic Decomposition: 2H2O(l) --[Electricity]--> 2H2(g) + O2(g) (Ratio of H2 to O2 is 2:1 by volume).',
          'Photolytic Decomposition: 2AgCl(s) --[Sunlight]--> 2Ag(s) + Cl2(g) (White turns grey, used in black-and-white photography).'
        ],
        formulasOrDefinitions: [
          'Combination: A + B -> AB',
          'Decomposition: AB -> A + B'
        ],
        examTip: 'The 2:1 volume ratio of hydrogen to oxygen in electrolysis of water is a favorite 1-mark CBSE board question.'
      },
      {
        sectionTitle: 'Displacement, Double Displacement & Precipitation',
        summary: 'A more reactive element displaces a less reactive element from its aqueous salt solution. Double displacement involves an exchange of ions between reactants to form a precipitate.',
        keyPoints: [
          'Fe(s) + CuSO4(aq) [Blue] -> FeSO4(aq) [Pale Green] + Cu(s) [Brown deposit].',
          'Precipitation reaction: Na2SO4(aq) + BaCl2(aq) -> BaSO4(s) [White precipitate] + 2NaCl(aq).'
        ],
        formulasOrDefinitions: [
          'Precipitate: Insoluble solid formed during double displacement reaction'
        ],
        examTip: 'Always mention the color change (Blue CuSO4 to pale green FeSO4) for full marks in observation questions.'
      }
    ],
    mcqs: [
      {
        id: 'mcq-1',
        question: 'Which of the following gases is liberated when dilute hydrochloric acid is added to reactive iron filings?',
        options: [
          'Hydrogen gas and Iron(II) chloride are produced',
          'Chlorine gas and Iron hydroxide are produced',
          'No reaction takes place',
          'Iron salt and water only are produced'
        ],
        correctIndex: 0,
        explanation: 'Fe + 2HCl -> FeCl2 + H2(g). Reactive metals liberate hydrogen gas upon reacting with dilute mineral acids.',
        tag: 'CBSE Direct NCERT'
      },
      {
        id: 'mcq-2',
        question: 'Assertion (A): Silver chloride turns grey when kept in sunlight for some time.\nReason (R): It undergoes photolytic decomposition to form silver metal and chlorine gas.',
        options: [
          'Both A and R are true, and R is the correct explanation of A',
          'Both A and R are true, but R is NOT the correct explanation of A',
          'A is true, but R is false',
          'A is false, but R is true'
        ],
        correctIndex: 0,
        explanation: '2AgCl(s) undergoes photolysis in the presence of sunlight forming metallic silver (grey) and chlorine gas.',
        tag: 'CBSE Assertion-Reason'
      },
      {
        id: 'mcq-3',
        question: 'What is the volume ratio of gases collected at the cathode and anode respectively during the electrolysis of acidified water?',
        options: [
          '1 : 2 (Oxygen : Hydrogen)',
          '2 : 1 (Hydrogen : Oxygen)',
          '1 : 1 (Equal volumes)',
          '4 : 1'
        ],
        correctIndex: 1,
        explanation: 'Water molecule has H2O formula (2 parts hydrogen to 1 part oxygen). At cathode, H2 gas is collected; at anode, O2 is collected, giving a 2:1 ratio.',
        tag: 'CBSE Exemplar'
      },
      {
        id: 'mcq-4',
        question: 'Barium chloride on reacting with ammonium sulphate forms barium sulphate and ammonium chloride. Which type of reaction is this?',
        options: [
          'Displacement reaction',
          'Precipitation and Double displacement reaction',
          'Decomposition reaction',
          'Combination reaction'
        ],
        correctIndex: 1,
        explanation: 'An exchange of ions occurs between Ba2+ and NH4+ accompanied by formation of insoluble BaSO4 white precipitate.',
        tag: 'CBSE Board'
      },
      {
        id: 'mcq-5',
        question: 'When lead nitrate powder is heated in a boiling tube, brown fumes are observed. These brown fumes belong to which gas?',
        options: [
          'Nitric oxide (NO)',
          'Nitrogen dioxide (NO2)',
          'Lead monoxide (PbO)',
          'Dinitrogen pentoxide (N2O5)'
        ],
        correctIndex: 1,
        explanation: '2Pb(NO3)2(s) -> 2PbO(s) + 4NO2(g) [Brown fumes] + O2(g).',
        tag: 'NCERT Practical'
      }
    ],
    flashcards: [
      {
        id: 'fc-1',
        front: 'What is a Redox reaction?',
        back: 'A chemical reaction where both oxidation (loss of electrons / gain of O2) and reduction (gain of electrons / loss of O2) occur simultaneously.',
        difficulty: 'Easy'
      },
      {
        id: 'fc-2',
        front: 'Color change when Iron nail is dipped in Copper Sulphate solution?',
        back: 'Blue solution turns pale light green (FeSO4 formed), and reddish-brown copper coats the iron nail.',
        difficulty: 'Medium'
      },
      {
        id: 'fc-3',
        front: 'Why is respiration considered an exothermic reaction?',
        back: 'Glucose combines with oxygen in cells to release energy: C6H12O6 + 6O2 -> 6CO2 + 6H2O + Energy (ATP).',
        difficulty: 'Easy'
      },
      {
        id: 'fc-4',
        front: 'Chemical formula of Marble, Limestone, and Quicklime?',
        back: 'Marble & Limestone: CaCO3 (Calcium carbonate). Quicklime: CaO (Calcium oxide). Slaked lime: Ca(OH)2.',
        difficulty: 'Medium'
      },
      {
        id: 'fc-5',
        front: 'Why are chips packets flushed with nitrogen gas?',
        back: 'Nitrogen acts as an inert antioxidant preventing the oxidation and rancidity of oils and fats.',
        difficulty: 'Easy'
      },
      {
        id: 'fc-6',
        front: 'Balanced equation for photosynthesis with physical states?',
        back: '6CO2(aq) + 12H2O(l) --[Sunlight/Chlorophyll]--> C6H12O6(aq) + 6O2(aq) + 6H2O(l).',
        difficulty: 'Hard'
      }
    ],
    boardQuestions: [
      {
        id: 'bq-1',
        type: 'Short Answer (3 Marks)',
        question: 'Identify the substance oxidized, substance reduced, oxidizing agent, and reducing agent in: MnO2 + 4HCl -> MnCl2 + 2H2O + Cl2.',
        modelAnswer: '1. Substance Oxidized: HCl (hydrogen is removed to form Cl2).\n2. Substance Reduced: MnO2 (oxygen is removed to form MnCl2).\n3. Oxidizing Agent: MnO2 (provides oxygen / causes oxidation of HCl).\n4. Reducing Agent: HCl (removes oxygen from MnO2).',
        markingSchemeTips: '1 mark for identifying oxidized & reduced substances, 1 mark for agents, 1 mark for correct chemical reasoning.'
      },
      {
        id: 'bq-2',
        type: 'Case Study / Practical (4 Marks)',
        question: 'A shiny brown-coloured element "X" on heating in air becomes black in colour.\n(a) Name element X and the black coloured compound formed.\n(b) Write the balanced chemical equation.\n(c) How can this black coating be reversed back to brown?',
        modelAnswer: '(a) Element X is Copper (Cu). The black compound is Copper(II) Oxide (CuO).\n(b) Balanced Equation: 2Cu(s) + O2(g) --[Heat]--> 2CuO(s).\n(c) Reversal: By passing Hydrogen gas (H2) over the hot black copper oxide: CuO(s) + H2(g) --[Heat]--> Cu(s) + H2O(g).',
        markingSchemeTips: '1 mark for identifying Cu and CuO, 1.5 marks for equation (b), 1.5 marks for reduction reaction with H2.'
      }
    ],
    practiceQuiz: [
      {
        id: 'pq-1',
        question: 'Which of the following processes is a chemical reaction?',
        options: [
          'Storing oxygen gas under pressure in a cylinder',
          'Liquefaction of air',
          'Keeping petrol in a china dish in the open',
          'Heating copper wire in the presence of air at high temperature'
        ],
        correctIndex: 3,
        explanation: 'Heating copper forms a new chemical compound CuO (Copper oxide), which is an irreversible chemical change.'
      },
      {
        id: 'pq-2',
        question: 'In the reaction: PbO + C -> 2Pb + CO2, carbon acts as:',
        options: [
          'An oxidizing agent',
          'A reducing agent',
          'A catalyst',
          'A dehydrating agent'
        ],
        correctIndex: 1,
        explanation: 'Carbon takes away oxygen from PbO, thereby reducing PbO and acting as a reducing agent.'
      },
      {
        id: 'pq-3',
        question: 'What is the color of ferrous sulphate crystals (FeSO4.7H2O) before heating?',
        options: [
          'Pale green',
          'White',
          'Blue',
          'Brown'
        ],
        correctIndex: 0,
        explanation: 'Hydrated ferrous sulphate crystals are pale green. Upon heating, they lose water of crystallization and turn white, then decompose to reddish-brown Fe2O3.'
      }
    ]
  },
  {
    id: 'doc-icse-bio-1',
    title: 'Genetics: Mendel\'s Laws & Inheritance (ICSE Class 10)',
    board: 'icse',
    grade: 'Class 10',
    language: 'en',
    shareCode: 'SF-ICSE-4912',
    overview: 'Crucial chapter in CISCE ICSE Class 10 Biology. Covers monohybrid and dihybrid cross ratios, sex determination in humans, Mendelian laws, and genetic disorders.',
    quickRevisionMnemonic: 'D-S-I: Mendel\'s 3 Laws = Dominance, Segregation (Purity of gametes), Independent Assortment.',
    createdAt: new Date().toISOString(),
    conceptMap: {
      title: 'Genetics & Inheritance',
      rootNode: {
        id: 'root-bio',
        label: 'Genetics & Heredity',
        description: 'Study of transmission of traits from parents to offspring.',
      },
      nodes: [
        {
          id: 'b-node-1',
          label: 'Mendel\'s Monohybrid Cross',
          category: 'Breeding Experiment',
          summary: 'Inheritance of a single pair of contrasting characters (e.g., Pure Tall x Pure Dwarf).',
          keyTerms: ['3:1 Phenotype', '1:2:1 Genotype', 'F1 Heterozygous'],
          importance: 'high',
          x: 100,
          y: 120,
        },
        {
          id: 'b-node-2',
          label: 'Law of Segregation',
          category: 'Fundamental Law',
          summary: 'Alleles separate during gamete formation; each gamete is pure for a single trait.',
          keyTerms: ['Purity of Gametes', 'Meiosis', 'Monohybrid'],
          importance: 'high',
          x: 320,
          y: 120,
        },
        {
          id: 'b-node-3',
          label: 'Dihybrid Cross & Independent Assortment',
          category: 'Complex Inheritance',
          summary: 'Two pairs of characters assort independently yielding 9:3:3:1 ratio in F2.',
          keyTerms: ['9:3:3:1', 'Round Yellow', 'Wrinkled Green'],
          importance: 'high',
          x: 210,
          y: 280,
        },
        {
          id: 'b-node-4',
          label: 'Sex Determination in Humans',
          category: 'Cytogenetics',
          summary: 'Females have XX (homomorphic), Males have XY (heteromorphic). Father determines sex of child.',
          keyTerms: ['XX / XY', '50% Probability', 'Autosomes vs Allosomes'],
          importance: 'medium',
          x: 80,
          y: 380,
        },
      ],
      edges: [
        { id: 'be1', from: 'root-bio', to: 'b-node-1', label: 'analyzed via', relationType: 'causes' },
        { id: 'be2', from: 'b-node-1', to: 'b-node-2', label: 'leads directly to', relationType: 'derives' },
        { id: 'be3', from: 'root-bio', to: 'b-node-3', label: 'extended to 2 traits in', relationType: 'contains' },
        { id: 'be4', from: 'root-bio', to: 'b-node-4', label: 'governs chromosomal', relationType: 'applies_to' },
      ],
      studyTakeaways: [
        'Always draw neat Punnett squares with circles around gamete symbols in ICSE board answers.',
        'Distinguish clearly between phenotypic ratio (3:1) and genotypic ratio (1:2:1).',
      ],
    },
    smartNotes: [
      {
        sectionTitle: 'Mendel\'s Monohybrid Cross & Ratios',
        summary: 'A cross between two parents considering one pair of contrasting characters (e.g. Pure Tall TT x Pure Dwarf tt).',
        keyPoints: [
          'F1 Generation: All heterozygous Tall (Tt) showing complete dominance.',
          'F2 Phenotypic Ratio: 3 Tall : 1 Dwarf (3:1).',
          'F2 Genotypic Ratio: 1 Homozygous Tall (TT) : 2 Heterozygous Tall (Tt) : 1 Homozygous Dwarf (tt) -> (1:2:1).'
        ],
        formulasOrDefinitions: [
          'Phenotypic Ratio = 3 : 1',
          'Genotypic Ratio = 1 : 2 : 1'
        ],
        examTip: 'ICSE always expects Punnett square grids drawn with gamete circles clearly labeled.'
      },
      {
        sectionTitle: 'Law of Segregation & Independent Assortment',
        summary: 'Alleles separate during gamete formation so each gamete carries only one allele. In dihybrid crosses (9:3:3:1), alleles of two different genes assort independently.',
        keyPoints: [
          'Law of Purity of Gametes: A gamete can carry either T or t, never both.',
          'Dihybrid Phenotypic ratio: 9 Round Yellow : 3 Round Green : 3 Wrinkled Yellow : 1 Wrinkled Green.'
        ],
        examTip: 'State the law in verbatim standard biological terminology for full ICSE marks.'
      }
    ],
    mcqs: [
      {
        id: 'mcq-icse-1',
        question: 'What is the phenotypic ratio obtained in the F2 generation of a Mendelian dihybrid cross?',
        options: ['3 : 1', '1 : 2 : 1', '9 : 3 : 3 : 1', '1 : 1 : 1 : 1'],
        correctIndex: 2,
        explanation: 'Mendel dihybrid cross gives 9 Round Yellow, 3 Round Green, 3 Wrinkled Yellow, 1 Wrinkled Green.',
        tag: 'ICSE Standard'
      }
    ],
    flashcards: [
      {
        id: 'fc-icse-1',
        front: 'Define Allele or Allelomorph.',
        back: 'Alternative forms of a gene occupying the same position (locus) on homologous chromosomes.',
        difficulty: 'Medium'
      }
    ],
    boardQuestions: [
      {
        id: 'bq-icse-1',
        type: 'Structured Question (5 Marks)',
        question: 'Differentiate between Genotype and Phenotype with one suitable example.',
        modelAnswer: 'Genotype: The genetic complement or genetic makeup of an organism (e.g. TT or Tt).\nPhenotype: The observable physical or morphological expression of an organism determined by its genotype (e.g. Tall plant).',
        markingSchemeTips: '2 marks for precise definitions, 2 marks for example, 1 mark for neat tabular layout.'
      }
    ],
    practiceQuiz: [
      {
        id: 'pq-icse-1',
        question: 'Human male sex chromosomes are represented as:',
        options: ['XX', 'XY', 'YY', 'XO'],
        correctIndex: 1,
        explanation: 'Human males possess heteromorphic sex chromosomes XY; females possess homomorphic XX.'
      }
    ]
  }
];
