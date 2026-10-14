import React, { useState } from 'react';
import {
  Globe,
  Search,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Calendar,
  Newspaper,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import { BoardMode } from '../types/study';

interface WebSearchGroundingViewProps {
  board: BoardMode;
}

export const WebSearchGroundingView: React.FC<WebSearchGroundingViewProps> = ({
  board,
}) => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<'board_updates' | 'fact_check' | 'current_affairs'>('board_updates');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    text: string;
    sources: Array<{ title: string; url: string }>;
    webQueries: string[];
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const presets = [
    {
      category: 'board_updates' as const,
      label: 'CBSE 2026/2027 Sample Papers & Datesheet',
      query: 'CBSE Class 10 and 12 official datesheet release date and specimen question papers cbse.gov.in',
    },
    {
      category: 'fact_check' as const,
      label: 'Fact-Check: Are any chapters deleted from NCERT Class 10 Science?',
      query: 'Fact check: deleted chapters and rationalised syllabus for CBSE Class 10 Science board exams',
    },
    {
      category: 'board_updates' as const,
      label: 'ICSE CISCE Class 10 Specimen Papers',
      query: 'CISCE ICSE Class 10 specimen papers and assessment pattern changes cisce.org',
    },
    {
      category: 'current_affairs' as const,
      label: 'Latest Space & Science News (ISRO/NASA)',
      query: 'Latest ISRO space science missions and discoveries for student current affairs',
    },
  ];

  const handleSearch = async (queryToSearch?: string, catToUse?: 'board_updates' | 'fact_check' | 'current_affairs') => {
    const q = (queryToSearch || query).trim();
    const cat = catToUse || category;
    if (!q) return;

    try {
      setIsLoading(true);
      setError(null);
      setResult(null);

      const response = await fetch('/api/study/web-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: q,
          topicType: cat,
        }),
      });

      const resData = await response.json();
      if (!response.ok || !resData.success) {
        throw new Error(resData.error || 'Failed to retrieve grounded search results.');
      }

      setResult({
        text: resData.text,
        sources: resData.sources || [],
        webQueries: resData.webQueries || [],
      });
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Error communicating with Google Search grounding service.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fade-in">
      
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md bg-blue-100 text-blue-700 flex items-center gap-1">
              <Globe className="w-3.5 h-3.5" />
              <span>LIVE GOOGLE SEARCH GROUNDING</span>
            </span>
            <span className="text-xs font-bold text-slate-400">
              Verified Real-Time Citations
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            Academic Live Search & Fact-Checking
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Connect directly to live Google Search data for official CBSE/ICSE notifications, syllabus updates, specimen papers, and scientific fact-checking.
          </p>
        </div>
      </div>

      {/* Preset Buttons */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          Quick Verified Inquiries
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {presets.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => {
                setQuery(preset.query);
                setCategory(preset.category);
                handleSearch(preset.query, preset.category);
              }}
              className="p-3 rounded-2xl bg-white hover:bg-indigo-50/50 border border-slate-200 hover:border-indigo-300 text-left transition-all flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  {preset.category === 'board_updates' ? (
                    <Calendar className="w-4 h-4" />
                  ) : preset.category === 'fact_check' ? (
                    <ShieldCheck className="w-4 h-4" />
                  ) : (
                    <Newspaper className="w-4 h-4" />
                  )}
                </div>
                <span className="text-xs font-bold text-slate-800 group-hover:text-indigo-700 transition-colors">
                  {preset.label}
                </span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 group-hover:text-indigo-600 transition-transform" />
            </button>
          ))}
        </div>
      </div>

      {/* Search Input Box */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-4">
        
        {/* Category selector */}
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-2xl w-fit text-xs font-bold">
          <button
            onClick={() => setCategory('board_updates')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              category === 'board_updates'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-indigo-600'
            }`}
          >
            Board Notifications
          </button>
          <button
            onClick={() => setCategory('fact_check')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              category === 'fact_check'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-indigo-600'
            }`}
          >
            Fact-Check Rumors
          </button>
          <button
            onClick={() => setCategory('current_affairs')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              category === 'current_affairs'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-indigo-600'
            }`}
          >
            Current Affairs & Science
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          className="flex flex-col sm:flex-row gap-2"
        >
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
            <input
              type="text"
              placeholder="Search official board circulars, datesheets, or fact-check a textbook statement..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-2xl pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md shadow-indigo-200 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isLoading ? 'Searching Live Google...' : 'Search & Fact-Check'}</span>
          </button>
        </form>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Results View */}
      {result && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl">
              <CheckCircle2 className="w-4 h-4" />
              <span>Grounded with Live Google Search Data</span>
            </div>
            {result.webQueries.length > 0 && (
              <span className="text-[11px] text-slate-400 font-medium">
                Verified across {result.webQueries.length} search queries
              </span>
            )}
          </div>

          {/* Answer text */}
          <div className="text-sm sm:text-base text-slate-800 font-medium leading-relaxed whitespace-pre-line">
            {result.text}
          </div>

          {/* Sources and Citations Box */}
          {result.sources.length > 0 && (
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-indigo-600" />
                <span>Verified Reference Sources & Official Links:</span>
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {result.sources.map((source, sIdx) => (
                  <a
                    key={sIdx}
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-white hover:bg-indigo-50/50 border border-slate-200 hover:border-indigo-300 transition-all flex items-center justify-between text-xs group"
                  >
                    <span className="font-semibold text-slate-800 group-hover:text-indigo-700 line-clamp-1">
                      {source.title || source.url}
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 shrink-0 ml-2" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
