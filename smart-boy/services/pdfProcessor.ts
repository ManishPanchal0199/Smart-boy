import { PdfDocument } from '../types';

export const extractTextFromPdf = async (file: File): Promise<PdfDocument> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async (event) => {
      try {
        const typedarray = new Uint8Array(event.target?.result as ArrayBuffer);
        
        if (!window.pdfjsLib) {
          reject(new Error("PDF.js library not loaded"));
          return;
        }

        const loadingTask = window.pdfjsLib.getDocument(typedarray);
        const pdf = await loadingTask.promise;
        
        let fullText = '';
        const numPages = pdf.numPages;

        for (let i = 1; i <= numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items
            .map((item: any) => item.str)
            .join(' ');
          
          // We add page markers so the model can cite sources, simulating RAG behavior
          fullText += `[Page ${i}] ${pageText}\n\n`;
        }

        resolve({
          name: file.name,
          text: fullText,
          pageCount: numPages
        });

      } catch (error) {
        console.error("Error parsing PDF:", error);
        reject(error);
      }
    };

    reader.onerror = (err) => reject(err);
    reader.readAsArrayBuffer(file);
  });
};