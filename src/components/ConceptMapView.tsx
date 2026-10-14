import React, { useState } from 'react';
import {
  Network,
  Sparkles,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  BookOpen,
  Info,
  Layers,
  ArrowRight,
  Maximize2,
  FileDown,
  HelpCircle,
  CheckCircle2,
} from 'lucide-react';
import { ConceptMapData, ConceptMapNode, StudyDocument } from '../types/study';

interface ConceptMapViewProps {
  doc: StudyDocument;
  onUpdateDocConceptMap: (mapData: ConceptMapData) => void;
  onOpenDoubtWithContext: (context: string) => void;
}

export const ConceptMapView: React.FC<ConceptMapViewProps> = ({
  doc,
  onUpdateDocConceptMap,
  onOpenDoubtWithContext,
}) => {
  const [selectedNode, setSelectedNode] = useState<ConceptMapNode | null>(null);
  const [zoom, setZoom] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [filterImportance, setFilterImportance] = useState<'all' | 'high'>('all');
  const [activeTab, setActiveTab] = useState<'graph' | 'cross' | 'takeaways'>('graph');

  const conceptMap = doc.conceptMap;

  // Generate concept map with Gemini 3.8 Flash
  const handleGenerateConceptMap = async () => {
    try {
      setIsGenerating(true);
      const textToMap = doc.originalText || doc.smartNotes.map((s) => `${s.sectionTitle}: ${s.summary}`).join('\n\n');

      const response = await fetch('/api/study/concept-map', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: textToMap,
          board: doc.board,
          grade: doc.grade,
          title: doc.title,
        }),
      });

      const resData = await response.json();
      if (!response.ok || !resData.success) {
        throw new Error(resData.error || 'Failed to generate concept map');
      }

      onUpdateDocConceptMap(resData.data);
    } catch (err: any) {
      console.error(err);
      alert(err?.message || 'Error generating concept map.');
    } finally {
      setIsGenerating(false);
    }
  };

  // If no concept map yet, show the generator prompt
  if (!conceptMap) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center mx-auto shadow-xl shadow-indigo-200">
          <Network className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Visual Concept Knowledge Map
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto leading-relaxed">
            Automatically transform this chapter into an interconnected relational map to visualize how key laws, mechanisms, reactions, and formulas connect in board exam questions.
          </p>
        </div>

        <button
          onClick={handleGenerateConceptMap}
          disabled={isGenerating}
          className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-black text-xs sm:text-sm shadow-xl shadow-indigo-200 transition-all cursor-pointer flex items-center gap-2 mx-auto disabled:opacity-50"
        >
          <Sparkles className="w-4 h-4 animate-spin" />
          <span>{isGenerating ? 'Synthesizing Relational Nodes...' : 'Generate Visual Concept Map'}</span>
        </button>
      </div>
    );
  }

  // Filter nodes if needed
  const displayNodes = filterImportance === 'high'
    ? conceptMap.nodes.filter((n) => n.importance === 'high')
    : conceptMap.nodes;

  // Coordinate positioning helper (if nodes lack explicit coordinates)
  const getNodeCoordinates = (node: ConceptMapNode, index: number, total: number) => {
    if (node.x && node.y) return { x: node.x, y: node.y };
    const radius = 180;
    const angle = (index / total) * 2 * Math.PI - Math.PI / 2;
    return {
      x: 350 + radius * Math.cos(angle),
      y: 260 + radius * Math.sin(angle),
    };
  };

  const rootCoord = { x: 350, y: 260 };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6 animate-fade-in">
      
      {/* Header Bar */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md bg-indigo-100 text-indigo-700">
              CONCEPT MAP GENERATOR
            </span>
            <span className="text-xs font-bold text-slate-400">
              {doc.title}
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
            {conceptMap.title}
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Interactive knowledge graph showing how topics, laws, and mechanisms interconnect
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Sub-tabs */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => setActiveTab('graph')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'graph' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600'
              }`}
            >
              Interactive Graph
            </button>
            <button
              onClick={() => setActiveTab('cross')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'cross' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600'
              }`}
            >
              Exam Cross-Links
            </button>
            <button
              onClick={() => setActiveTab('takeaways')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'takeaways' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600'
              }`}
            >
              Key Takeaways
            </button>
          </div>

          {/* Regenerate Button */}
          <button
            onClick={handleGenerateConceptMap}
            disabled={isGenerating}
            title="Regenerate Map with AI"
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
          >
            <RotateCcw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {activeTab === 'graph' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Graph Canvas Container (8 cols) */}
          <div className="lg:col-span-8 bg-slate-900 rounded-3xl p-4 sm:p-6 shadow-xl relative overflow-hidden flex flex-col min-h-[540px]">
            {/* Background grid */}
            <div
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
                backgroundSize: '24px 24px',
              }}
            ></div>

            {/* Top Toolbar */}
            <div className="relative z-10 flex items-center justify-between gap-2 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-300">Importance:</span>
                <button
                  onClick={() => setFilterImportance('all')}
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-lg transition-all ${
                    filterImportance === 'all'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  All ({conceptMap.nodes.length})
                </button>
                <button
                  onClick={() => setFilterImportance('high')}
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-lg transition-all ${
                    filterImportance === 'high'
                      ? 'bg-amber-500 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  High-Yield Only
                </button>
              </div>

              {/* Zoom controls */}
              <div className="flex items-center gap-1 bg-slate-800/80 backdrop-blur-md p-1 rounded-xl text-slate-300">
                <button
                  onClick={() => setZoom((z) => Math.max(0.7, z - 0.1))}
                  className="p-1.5 hover:text-white transition-colors"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="text-[10px] font-bold px-1">{Math.round(zoom * 100)}%</span>
                <button
                  onClick={() => setZoom((z) => Math.min(1.4, z + 0.1))}
                  className="p-1.5 hover:text-white transition-colors"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setZoom(1)}
                  className="p-1.5 hover:text-white transition-colors text-[10px] font-bold"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* SVG Visual Graph */}
            <div className="flex-1 w-full flex items-center justify-center overflow-auto p-2">
              <svg
                viewBox="0 0 700 520"
                className="w-full h-auto max-h-[500px] select-none"
                style={{ transform: `scale(${zoom})`, transformOrigin: 'center' }}
              >
                <defs>
                  {/* Glow filter */}
                  <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="6" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                  {/* Arrow marker */}
                  <marker
                    id="arrow"
                    viewBox="0 0 10 10"
                    refX="24"
                    refY="5"
                    markerWidth="6"
                    markerHeight="6"
                    orient="auto-start-reverse"
                  >
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#818cf8" />
                  </marker>
                </defs>

                {/* Connecting Edges */}
                {conceptMap.edges.map((edge, eIdx) => {
                  let source = rootCoord;
                  let target = rootCoord;

                  if (edge.from !== 'root') {
                    const fromNode = conceptMap.nodes.find((n) => n.id === edge.from);
                    if (fromNode) {
                      const idx = conceptMap.nodes.indexOf(fromNode);
                      source = getNodeCoordinates(fromNode, idx, conceptMap.nodes.length);
                    }
                  }

                  if (edge.to !== 'root') {
                    const toNode = conceptMap.nodes.find((n) => n.id === edge.to);
                    if (toNode) {
                      const idx = conceptMap.nodes.indexOf(toNode);
                      target = getNodeCoordinates(toNode, idx, conceptMap.nodes.length);
                    }
                  }

                  // Midpoint for relationship label
                  const midX = (source.x + target.x) / 2;
                  const midY = (source.y + target.y) / 2;

                  return (
                    <g key={eIdx} className="transition-all duration-300">
                      <line
                        x1={source.x}
                        y1={source.y}
                        x2={target.x}
                        y2={target.y}
                        stroke="#4f46e5"
                        strokeWidth="2"
                        strokeDasharray={edge.relationType === 'contrasts_with' ? '4 4' : 'none'}
                        markerEnd="url(#arrow)"
                        opacity="0.6"
                      />
                      {/* Edge Label Pill */}
                      <rect
                        x={midX - 35}
                        y={midY - 9}
                        width="70"
                        height="18"
                        rx="9"
                        fill="#1e1b4b"
                        stroke="#6366f1"
                        strokeWidth="1"
                        opacity="0.9"
                      />
                      <text
                        x={midX}
                        y={midY + 3.5}
                        textAnchor="middle"
                        fill="#c7d2fe"
                        fontSize="8.5"
                        fontWeight="600"
                      >
                        {edge.label}
                      </text>
                    </g>
                  );
                })}

                {/* Central Root Concept Node */}
                <g
                  className="cursor-pointer group"
                  onClick={() =>
                    setSelectedNode({
                      id: 'root',
                      label: conceptMap.rootNode.label,
                      category: 'Core Chapter Anchor',
                      summary: conceptMap.rootNode.description,
                      importance: 'high',
                    })
                  }
                >
                  <circle
                    cx={rootCoord.x}
                    cy={rootCoord.y}
                    r="48"
                    fill="url(#indigoGrad)"
                    className="drop-shadow-2xl"
                    filter="url(#glow)"
                  />
                  <radialGradient id="indigoGrad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#818cf8" />
                    <stop offset="100%" stopColor="#4338ca" />
                  </radialGradient>
                  <text
                    x={rootCoord.x}
                    y={rootCoord.y - 6}
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="11"
                    fontWeight="800"
                  >
                    {conceptMap.rootNode.label.length > 18
                      ? conceptMap.rootNode.label.slice(0, 18) + '...'
                      : conceptMap.rootNode.label}
                  </text>
                  <text
                    x={rootCoord.x}
                    y={rootCoord.y + 10}
                    textAnchor="middle"
                    fill="#c7d2fe"
                    fontSize="8"
                    fontWeight="600"
                  >
                    [CORE THEME]
                  </text>
                </g>

                {/* Sub-Concept Nodes */}
                {displayNodes.map((node, idx) => {
                  const coord = getNodeCoordinates(node, idx, conceptMap.nodes.length);
                  const isSelected = selectedNode?.id === node.id;
                  const isHigh = node.importance === 'high';

                  return (
                    <g
                      key={node.id}
                      className="cursor-pointer transition-transform duration-200"
                      onClick={() => setSelectedNode(node)}
                    >
                      {/* Node circle */}
                      <circle
                        cx={coord.x}
                        cy={coord.y}
                        r={isSelected ? '36' : '30'}
                        fill={isHigh ? '#312e81' : '#1e293b'}
                        stroke={isSelected ? '#38bdf8' : isHigh ? '#a855f7' : '#64748b'}
                        strokeWidth={isSelected ? '3.5' : '2'}
                        className="transition-all hover:scale-110"
                      />
                      {/* Label inside node */}
                      <text
                        x={coord.x}
                        y={coord.y - 2}
                        textAnchor="middle"
                        fill="#ffffff"
                        fontSize="9"
                        fontWeight="700"
                      >
                        {node.label.length > 12 ? node.label.slice(0, 12) + '..' : node.label}
                      </text>
                      <text
                        x={coord.x}
                        y={coord.y + 10}
                        textAnchor="middle"
                        fill={isHigh ? '#e9d5ff' : '#94a3b8'}
                        fontSize="7"
                        fontWeight="600"
                      >
                        {node.category.slice(0, 10)}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            <div className="relative z-10 text-center text-[11px] text-slate-400 font-medium">
              Click any node to inspect concept summary, formulas, and board exam relevance.
            </div>
          </div>

          {/* Node Inspector Panel (4 cols) */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-5 flex flex-col justify-between">
            {selectedNode ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-700">
                    {selectedNode.category}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      selectedNode.importance === 'high'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {selectedNode.importance === 'high' ? 'High Yield ★' : 'Standard'}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-black text-slate-900 tracking-tight leading-snug">
                    {selectedNode.label}
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed font-medium">
                    {selectedNode.summary}
                  </p>
                </div>

                {selectedNode.keyTerms && selectedNode.keyTerms.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Key Syllabus Terms:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedNode.keyTerms.map((term, tIdx) => (
                        <span
                          key={tIdx}
                          className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700"
                        >
                          {term}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-2">
                  <button
                    onClick={() =>
                      onOpenDoubtWithContext(
                        `Concept: ${selectedNode.label}\nCategory: ${selectedNode.category}\nDetails: ${selectedNode.summary}`
                      )
                    }
                    className="w-full py-2.5 rounded-xl bg-violet-50 hover:bg-violet-100 text-violet-700 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>Ask AI Tutor about this Node</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 space-y-3 my-auto">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
                  <Info className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-slate-800">
                  Concept Inspector
                </h4>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  Select any node on the left visual graph to view full board exam definitions and relationships.
                </p>
              </div>
            )}

            {/* Quick stats footer */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1 text-xs">
              <div className="flex items-center justify-between font-semibold text-slate-600">
                <span>Total Nodes:</span>
                <span className="font-bold text-slate-900">{conceptMap.nodes.length}</span>
              </div>
              <div className="flex items-center justify-between font-semibold text-slate-600">
                <span>Relational Edges:</span>
                <span className="font-bold text-slate-900">{conceptMap.edges.length}</span>
              </div>
              <div className="flex items-center justify-between font-semibold text-slate-600">
                <span>Board Mode:</span>
                <span className="font-bold text-indigo-600">{doc.board.toUpperCase()}</span>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* Cross-Connections Tab */}
      {activeTab === 'cross' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-5">
          <div>
            <h3 className="text-lg font-black text-slate-900">
              Exam Cross-Topic Connections
            </h3>
            <p className="text-xs text-slate-500">
              CBSE and ICSE 5-mark structured questions frequently ask students to connect these two subtopics together:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(conceptMap.crossConnections || []).map((conn, cIdx) => (
              <div key={cIdx} className="p-5 rounded-2xl bg-indigo-50/50 border border-indigo-100/80 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-indigo-700">
                  <span>{conn.from}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                  <span>{conn.to}</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
                  {conn.relationship}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Key Takeaways Tab */}
      {activeTab === 'takeaways' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-4">
          <div>
            <h3 className="text-lg font-black text-slate-900">
              High-Yield Synthesis & Memory Anchors
            </h3>
            <p className="text-xs text-slate-500">
              Key takeaways synthesized from this chapter's concept relationship structure
            </p>
          </div>

          <div className="space-y-3">
            {(conceptMap.studyTakeaways || []).map((point, pIdx) => (
              <div key={pIdx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
                  {point}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
