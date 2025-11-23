export enum AppMode {
  HOME = 'HOME',
  PDF_CHAT = 'PDF_CHAT',
  YOUTUBE_NOTES = 'YOUTUBE_NOTES'
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
  isThinking?: boolean;
}

export interface PdfDocument {
  name: string;
  text: string;
  pageCount: number;
}

// Augment window to include pdfjsLib from CDN
declare global {
  interface Window {
    pdfjsLib: any;
  }
}