import * as pdfjsLib from 'pdfjs-dist';

// Configure the worker for pdfjs-dist
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs`;
}

/**
 * Extracts plain text from an uploaded PDF File in the browser.
 */
export async function extractTextFromPdf(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;

    let fullText = '';
    const maxPages = Math.min(pdf.numPages, 30); // Read up to 30 pages to stay well within limits

    for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      const pageItems = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      
      fullText += `\n--- Page ${pageNum} ---\n` + pageItems + '\n';
    }

    if (!fullText.trim()) {
      throw new Error('No readable text found in this PDF. It may contain scanned images or be password-protected.');
    }

    return fullText.trim();
  } catch (error: any) {
    console.error('PDF extraction failed:', error);
    throw new Error(error?.message || 'Failed to extract text from PDF.');
  }
}

/**
 * Extracts text from standard .txt, .md, or .json file
 */
export async function extractTextFromFile(file: File): Promise<string> {
  if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
    return extractTextFromPdf(file);
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result as string);
    };
    reader.onerror = () => {
      reject(new Error('Failed to read text file.'));
    };
    reader.readAsText(file);
  });
}
