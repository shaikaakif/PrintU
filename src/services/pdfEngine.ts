import * as pdfjsLib from 'pdfjs-dist';

// Set up PDF.js Global Worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export interface RenderedPdfPage {
  pageNumber: number;
  dataUrl: string;
  width: number;
  height: number;
}

export const PdfEngine = {
  // Load PDF document from ArrayBuffer / Base64 / File
  async getPdfDocument(file: File): Promise<pdfjsLib.PDFDocumentProxy> {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    return await loadingTask.promise;
  },

  // Extract page count
  async getPageCount(file: File): Promise<number> {
    try {
      const doc = await this.getPdfDocument(file);
      return doc.numPages;
    } catch (err) {
      console.error('Failed to parse PDF document:', err);
      return 1;
    }
  },

  // Render a specific page to a data URL canvas representation
  async renderPageToDataUrl(
    file: File | pdfjsLib.PDFDocumentProxy,
    pageNumber: number,
    scale: number = 1.0
  ): Promise<RenderedPdfPage> {
    const doc = file instanceof File ? await this.getPdfDocument(file) : file;
    const page = await doc.getPage(pageNumber);

    const viewport = page.getViewport({ scale });
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    if (!context) {
      throw new Error('Canvas 2D context unavailable');
    }

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    await page.render({
      canvasContext: context,
      viewport: viewport,
    }).promise;

    return {
      pageNumber,
      dataUrl: canvas.toDataURL('image/png'),
      width: viewport.width,
      height: viewport.height,
    };
  },

  // Render thumbnails for all pages of a PDF
  async renderAllThumbnails(
    file: File,
    maxPages: number = 20,
    thumbScale: number = 0.3
  ): Promise<RenderedPdfPage[]> {
    const doc = await this.getPdfDocument(file);
    const pageCount = Math.min(doc.numPages, maxPages);
    const pages: RenderedPdfPage[] = [];

    for (let i = 1; i <= pageCount; i++) {
      const page = await this.renderPageToDataUrl(doc, i, thumbScale);
      pages.push(page);
    }

    return pages;
  }
};
