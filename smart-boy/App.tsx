import React, { useState } from 'react';
import { AppMode } from './types';
import { PdfFeature } from './components/PdfFeature';
import { YoutubeFeature } from './components/YoutubeFeature';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.HOME);

  return (
    <div className="min-h-screen relative font-sans text-gray-200 selection:bg-brand-start selection:text-white overflow-hidden">
      
      {/* Background Image & Overlay */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1507842217159-a28f26809313?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className="absolute inset-0 bg-gray-950/85 backdrop-blur-sm z-0"></div>

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 h-20 z-50 px-6 flex items-center justify-between border-b border-white/10 bg-gray-950/50 backdrop-blur-md">
        <button 
          onClick={() => setMode(AppMode.HOME)}
          className="flex items-center space-x-3 hover:opacity-80 transition-opacity focus:outline-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-start to-brand-end flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-purple-500/20">
            S
          </div>
          <div className="flex flex-col items-start">
            <span className="font-bold text-xl tracking-tight text-white leading-none">SMART-BOY</span>
            <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">AI Assistant</span>
          </div>
        </button>
        
        {/* Navigation - Only show active toggle if not on home, or show simple menu */}
        <div className="flex items-center space-x-4">
          {mode !== AppMode.HOME && (
            <div className="hidden md:flex items-center p-1 rounded-xl bg-black/40 border border-white/10 backdrop-blur-md">
              <button 
                onClick={() => setMode(AppMode.PDF_CHAT)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  mode === AppMode.PDF_CHAT 
                    ? 'bg-gray-700/80 text-white shadow-sm' 
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                PDF Chat
              </button>
              <button 
                onClick={() => setMode(AppMode.YOUTUBE_NOTES)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  mode === AppMode.YOUTUBE_NOTES 
                    ? 'bg-gray-700/80 text-white shadow-sm' 
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                Video Notes
              </button>
            </div>
          )}
          
          <div className="hidden md:block text-xs text-gray-500 bg-black/30 px-3 py-1.5 rounded-full border border-white/5">
            Gemini 2.5 Flash
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 pt-24 pb-8 px-4 md:px-8 h-screen box-border flex flex-col">
        <div className="flex-1 w-full max-w-7xl mx-auto h-full min-h-0 flex flex-col">
          
          {mode === AppMode.HOME ? (
            <div className="flex-1 flex flex-col items-center justify-center animate-fadeIn">
              <div className="text-center mb-12 max-w-2xl mx-auto">
                <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6 tracking-tight drop-shadow-lg">
                  Research <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-start to-brand-end">Smarter</span>
                </h1>
                <p className="text-lg text-gray-300 leading-relaxed">
                  Unlock the power of your documents and videos. 
                  Upload PDFs to chat with them or paste YouTube links to get instant study notes.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl px-4">
                {/* PDF Option */}
                <button
                  onClick={() => setMode(AppMode.PDF_CHAT)}
                  className="group relative flex flex-col items-center p-8 rounded-3xl bg-gray-800/40 border border-white/10 backdrop-blur-md hover:bg-gray-800/60 hover:scale-[1.02] hover:border-brand-start/50 transition-all duration-300 text-left shadow-2xl"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-start/10 to-transparent opacity-0 group-hover:opacity-100 rounded-3xl transition-opacity duration-300" />
                  
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center mb-6 shadow-lg group-hover:shadow-blue-500/30 transition-shadow">
                    <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-3">PDF Assistant</h3>
                  <p className="text-gray-400 text-center text-sm md:text-base">
                    Chat with your research papers, contracts, or books. Extract citations and key insights instantly using RAG.
                  </p>
                  
                  <div className="mt-8 px-6 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-blue-300 font-medium group-hover:bg-blue-600 group-hover:text-white group-hover:border-transparent transition-colors">
                    Start Chatting &rarr;
                  </div>
                </button>

                {/* Video Option */}
                <button
                  onClick={() => setMode(AppMode.YOUTUBE_NOTES)}
                  className="group relative flex flex-col items-center p-8 rounded-3xl bg-gray-800/40 border border-white/10 backdrop-blur-md hover:bg-gray-800/60 hover:scale-[1.02] hover:border-brand-end/50 transition-all duration-300 text-left shadow-2xl"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-end/10 to-transparent opacity-0 group-hover:opacity-100 rounded-3xl transition-opacity duration-300" />
                  
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center mb-6 shadow-lg group-hover:shadow-purple-500/30 transition-shadow">
                    <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-3">Video Notes</h3>
                  <p className="text-gray-400 text-center text-sm md:text-base">
                    Turn long YouTube lectures into concise study guides. Get summaries, key concepts, and takeaways in seconds.
                  </p>
                  
                  <div className="mt-8 px-6 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-purple-300 font-medium group-hover:bg-purple-600 group-hover:text-white group-hover:border-transparent transition-colors">
                    Generate Notes &rarr;
                  </div>
                </button>
              </div>
            </div>
          ) : (
             <div className="h-full animate-fadeInUp">
               {mode === AppMode.PDF_CHAT ? <PdfFeature /> : <YoutubeFeature />}
             </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;