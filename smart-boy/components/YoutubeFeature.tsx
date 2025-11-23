import React, { useState } from 'react';
import { generateVideoNotes } from '../services/geminiService';
import { Button } from './Button';

export const YoutubeFeature: React.FC = () => {
  const [url, setUrl] = useState('');
  const [notes, setNotes] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!url.includes('youtube.com') && !url.includes('youtu.be')) {
      setError('Please enter a valid YouTube URL');
      return;
    }

    setLoading(true);
    setError(null);
    setNotes(null);

    try {
      const result = await generateVideoNotes(url);
      setNotes(result);
    } catch (err) {
      setError('Failed to generate notes. The video might be restricted or unavailable.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
      
      {/* Input Section */}
      <div className="p-6 bg-black/40 border-b border-white/10 shadow-md z-10">
        <h2 className="text-xl font-bold mb-4 flex items-center text-white">
          <div className="p-2 bg-red-600/20 rounded-lg mr-3 shadow-sm border border-red-500/10">
            <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
            </svg>
          </div>
          YouTube Notes Generator
        </h2>
        
        <div className="flex flex-col md:flex-row gap-3">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste YouTube URL here..."
            className="flex-1 bg-gray-900/80 border border-gray-600/50 rounded-xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-brand-start focus:border-transparent text-gray-200 placeholder-gray-500 shadow-inner"
          />
          <Button 
            onClick={handleGenerate} 
            isLoading={loading} 
            disabled={!url}
            className="h-12 px-6 shadow-lg shadow-purple-900/20 font-semibold tracking-wide"
          >
            Generate Notes
          </Button>
        </div>
        {error && (
          <div className="mt-3 text-sm text-red-400 bg-red-500/10 p-2 rounded-lg border border-red-500/20 inline-flex items-center animate-fadeIn">
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            {error}
          </div>
        )}
      </div>

      {/* Results Section */}
      <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent bg-gradient-to-b from-transparent to-black/20">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full space-y-8 animate-fadeIn">
             <div className="relative w-24 h-24">
                <div className="absolute top-0 left-0 w-full h-full border-4 border-gray-700/30 rounded-full"></div>
                <div className="absolute top-0 left-0 w-full h-full border-4 border-t-brand-start border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                   <svg className="w-8 h-8 text-brand-start opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                   </svg>
                </div>
             </div>
             <div className="text-center">
               <p className="text-white font-bold text-xl mb-2 tracking-wide">Researching Video...</p>
               <p className="text-gray-400 text-sm max-w-xs mx-auto leading-relaxed">Reading context, searching for transcripts, and synthesizing key insights.</p>
             </div>
          </div>
        ) : notes ? (
          <div className="animate-fadeInUp">
            {/* The Box Container */}
            <div className="max-w-4xl mx-auto bg-[#1a1a1a] rounded-xl border border-gray-700/50 shadow-2xl overflow-hidden relative">
              
              {/* Box Header */}
              <div className="px-8 py-4 bg-gradient-to-r from-gray-800 to-gray-900 border-b border-gray-700 flex justify-between items-center">
                 <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                    <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    <span className="ml-3 text-xs font-mono text-gray-400 uppercase tracking-widest">Smart-Boy Output</span>
                 </div>
                 <div className="px-3 py-1 bg-brand-start/10 text-brand-start border border-brand-start/20 rounded-full text-xs font-bold">
                   AI Generated
                 </div>
              </div>

              {/* Box Content */}
              <div className="p-8 md:p-10 text-gray-200">
                <div className="space-y-6">
                  {notes.split('\n').map((line, i) => {
                    // H1 - Title
                    if (line.startsWith('# ')) {
                      return (
                        <h1 key={i} className="text-3xl md:text-4xl font-extrabold text-white mb-8 border-b border-gray-700 pb-4">
                          {line.replace('# ', '')}
                        </h1>
                      );
                    }
                    // H2 - Main Sections
                    if (line.startsWith('## ')) {
                      return (
                        <h2 key={i} className="text-2xl font-bold mt-10 mb-4 text-brand-start flex items-center">
                          <span className="bg-brand-start/20 p-1.5 rounded-lg mr-3 text-brand-start">
                             <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                             </svg>
                          </span>
                          {line.replace('## ', '')}
                        </h2>
                      );
                    }
                    // H3 - Subsections
                    if (line.startsWith('### ')) {
                      return (
                        <h3 key={i} className="text-xl font-bold mt-6 mb-2 text-white/90">
                          {line.replace('### ', '')}
                        </h3>
                      );
                    }
                    // List Items
                    if (line.startsWith('- ')) {
                      const content = line.replace('- ', '');
                      // Check for bold parts
                      if (content.includes('**')) {
                         const parts = content.split('**');
                         return (
                           <div key={i} className="flex items-start ml-2 mb-3">
                             <span className="text-brand-end mr-3 mt-1.5">•</span>
                             <p className="flex-1 text-gray-300 leading-relaxed">
                               {parts.map((part, idx) => 
                                 idx % 2 === 1 
                                 ? <strong key={idx} className="text-white font-bold">{part}</strong> 
                                 : part
                               )}
                             </p>
                           </div>
                         );
                      }
                      return (
                        <div key={i} className="flex items-start ml-2 mb-2">
                          <span className="text-brand-end mr-3 mt-1.5">•</span>
                          <span className="flex-1 text-gray-300">{content}</span>
                        </div>
                      );
                    }
                    // Numbered Lists
                    if (line.match(/^\d+\./)) {
                       return <div key={i} className="mb-2 font-medium text-white ml-2 pl-4 border-l-2 border-brand-start/50">{line}</div>;
                    }
                    // Horizontal Rule
                    if (line.includes('---')) {
                       return <hr key={i} className="border-gray-700 my-8" />;
                    }
                    // Standard Paragraphs
                    if (line.trim().length > 0) {
                      if (line.includes('**')) {
                          const parts = line.split('**');
                          return <p key={i} className="mb-4 text-gray-300 leading-relaxed">
                            {parts.map((part, idx) => idx % 2 === 1 ? <strong key={idx} className="text-white font-bold">{part}</strong> : part)}
                          </p>;
                      }
                      return <p key={i} className="mb-4 text-gray-300 leading-relaxed">{line}</p>;
                    }
                    return null;
                  })}
                </div>
              </div>

            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 opacity-60">
            <div className="w-32 h-32 bg-gray-800/50 rounded-full flex items-center justify-center mb-6 border border-white/5 shadow-2xl">
              <svg className="w-14 h-14 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-lg font-bold text-gray-400">Ready to take notes?</p>
            <p className="text-sm">Paste a YouTube URL above to begin.</p>
          </div>
        )}
      </div>
    </div>
  );
};
