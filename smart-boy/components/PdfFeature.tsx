import React, { useState, useRef, useEffect } from 'react';
import { PdfDocument, ChatMessage } from '../types';
import { extractTextFromPdf } from '../services/pdfProcessor';
import { generatePdfResponse } from '../services/geminiService';
import { Button } from './Button';
import { Spinner } from './Spinner';

export const PdfFeature: React.FC = () => {
  const [document, setDocument] = useState<PdfDocument | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setError('Please upload a valid PDF file.');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const doc = await extractTextFromPdf(file);
      setDocument(doc);
      setMessages([{
        id: 'init',
        role: 'model',
        text: `I've analyzed **${doc.name}** (${doc.pageCount} pages).\n\nAsk me anything about it!`,
        timestamp: Date.now()
      }]);
    } catch (err) {
      setError('Failed to process PDF. Please try again.');
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() || !document) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      // Convert current chat history to API format (excluding the very latest user message which is passed separately)
      const historyForApi = messages.map(m => ({ role: m.role, text: m.text }));
      
      const responseText = await generatePdfResponse(historyForApi, document.text, userMsg.text);

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'model',
        text: "Sorry, I encountered an error answering that. Please try again.",
        timestamp: Date.now()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // --- Helper Functions for Rendering Markdown ---
  const parseInlineStyles = (text: string) => {
    const parts = text.split('**');
    return parts.map((part, index) => {
      if (index % 2 === 1) {
        return <strong key={index} className="text-white font-extrabold">{part}</strong>;
      }
      return part;
    });
  };

  const renderMessageContent = (text: string) => {
    return text.split('\n').map((line, i) => {
      // H3 / H2 / H1
      if (line.startsWith('### ')) {
        return <h3 key={i} className="text-white font-bold text-lg mt-3 mb-2">{line.replace('### ', '')}</h3>;
      }
      if (line.startsWith('## ')) {
        return <h2 key={i} className="text-brand-start font-bold text-xl mt-4 mb-2 pb-1 border-b border-white/5">{line.replace('## ', '')}</h2>;
      }
      if (line.startsWith('# ')) {
        return <h1 key={i} className="text-2xl font-extrabold text-white mt-4 mb-4">{line.replace('# ', '')}</h1>;
      }

      // Lists
      if (line.trim().startsWith('- ')) {
        return (
          <div key={i} className="flex items-start ml-1 mb-2">
            <span className="text-brand-start mr-2 mt-1.5">•</span>
            <div className="text-gray-300 leading-relaxed flex-1">
              {parseInlineStyles(line.replace('- ', ''))}
            </div>
          </div>
        );
      }
      
      // Numbered Lists
      if (line.match(/^\d+\./)) {
        return <div key={i} className="ml-2 mb-2 pl-3 border-l-2 border-brand-start/30 text-gray-300">{parseInlineStyles(line)}</div>;
      }

      // Empty Lines
      if (!line.trim()) return <div key={i} className="h-3" />;

      // Standard Paragraphs
      return (
        <p key={i} className="text-gray-300 leading-relaxed mb-2">
          {parseInlineStyles(line)}
        </p>
      );
    });
  };

  // Render Uploader if no document
  if (!document) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-gray-900/60 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl animate-fadeIn">
        <div className="w-24 h-24 bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl flex items-center justify-center mb-8 shadow-inner border border-white/5">
          <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold mb-4 text-white">Upload a PDF</h2>
        <p className="text-gray-400 mb-10 max-w-lg text-lg leading-relaxed">
          SMART-BOY will read your document page-by-page so you can chat with it using RAG-powered intelligence.
        </p>
        
        <input 
          type="file" 
          accept="application/pdf" 
          onChange={handleFileUpload} 
          className="hidden" 
          ref={fileInputRef}
        />
        
        <Button 
          onClick={() => fileInputRef.current?.click()} 
          isLoading={isProcessing}
          className="w-56 h-14 text-lg shadow-blue-500/25"
        >
          Select PDF File
        </Button>

        {error && (
          <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 text-red-300 rounded-xl flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}
      </div>
    );
  }

  // Render Chat Interface
  return (
    <div className="flex flex-col h-full bg-gray-900/80 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
      {/* Header */}
      <div className="p-5 bg-black/20 border-b border-white/5 flex justify-between items-center backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 border border-blue-500/10">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div className="flex flex-col">
             <span className="font-semibold text-gray-100 truncate max-w-[250px]">{document.name}</span>
             <span className="text-xs text-gray-400">{document.pageCount} pages • PDF Assistant</span>
          </div>
        </div>
        <button 
          onClick={() => setDocument(null)}
          className="px-3 py-1.5 text-xs font-medium text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors border border-white/5"
        >
          Close File
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[90%] md:max-w-[80%] rounded-2xl p-6 shadow-lg transition-all ${
                msg.role === 'user' 
                  ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-br-sm' 
                  : 'bg-[#1a1a1a] border border-gray-700/50 text-gray-200 rounded-bl-sm backdrop-blur-md'
              }`}
            >
              {msg.role === 'user' ? (
                <div className="whitespace-pre-wrap text-[15px]">{msg.text}</div>
              ) : (
                // Structured output box for Model
                <div className="prose prose-invert max-w-none">
                  <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-start"></span>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-gray-500">Smart-Boy Answer</span>
                  </div>
                  {renderMessageContent(msg.text)}
                </div>
              )}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start animate-fadeIn">
            <div className="bg-[#1a1a1a] rounded-2xl rounded-bl-sm p-5 border border-white/5 flex items-center space-x-2 backdrop-blur-md">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-5 bg-black/20 border-t border-white/5 backdrop-blur-md">
        <div className="relative max-w-4xl mx-auto">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a question about this document..."
            className="w-full bg-gray-900/50 text-white border border-gray-600/50 rounded-2xl pl-5 pr-14 py-4 focus:outline-none focus:ring-2 focus:ring-brand-start focus:border-transparent resize-none h-16 shadow-inner placeholder-gray-500"
          />
          <button 
            onClick={handleSendMessage}
            disabled={!input.trim() || isTyping}
            className="absolute right-3 top-3 p-2.5 bg-brand-start text-white rounded-xl hover:bg-brand-end disabled:opacity-50 disabled:hover:bg-brand-start transition-all shadow-lg"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
        <div className="text-center mt-3">
          <p className="text-[11px] text-gray-500 uppercase tracking-widest font-semibold">AI generated content can be inaccurate</p>
        </div>
      </div>
    </div>
  );
};