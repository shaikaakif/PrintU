import { jsPDF } from 'jspdf';
import { PrintJob } from '../types/print';
import { PAPER_DIMENSIONS_MM, PhotoEngine } from './photoEngine';

export const PrintExecutor = {
  // Generates high-resolution data URLs for all pages of a print job
  async renderJobPagesToDataUrls(job: PrintJob, targetPagesOverride?: number[]): Promise<string[]> {
    const pageDataUrls: string[] = [];
    const photosPerPage = job.layoutCount;
    const printCanvasWidth = 1600;

    if (job.type === 'document' && job.document) {
      const selectedPages = targetPagesOverride || job.document.selectedPages || Array.from({ length: job.document.pageCount }, (_, i) => i + 1);
      
      for (const pageNum of selectedPages) {
        const { pageWidth, pageHeight } = PhotoEngine.calculatePageCells(
          1,
          job.paperSize,
          job.orientation,
          0,
          printCanvasWidth
        );

        const canvas = document.createElement('canvas');
        canvas.width = pageWidth;
        canvas.height = pageHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) continue;

        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, pageWidth, pageHeight);

        const renderedPageUrl = job.document.renderedPages?.[pageNum - 1];
        if (renderedPageUrl) {
          await new Promise<void>((resolve) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => {
              ctx.drawImage(img, 0, 0, pageWidth, pageHeight);
              resolve();
            };
            img.onerror = () => resolve();
            img.src = renderedPageUrl;
          });
        } else {
          ctx.fillStyle = '#0F172A';
          ctx.font = 'bold 36px Outfit, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(job.document.name, pageWidth / 2, 100);
          ctx.font = '24px Outfit, sans-serif';
          ctx.fillStyle = '#475569';
          ctx.fillText(`Page ${pageNum} of ${job.document.pageCount}`, pageWidth / 2, 150);
        }

        pageDataUrls.push(canvas.toDataURL('image/png', 1.0));
      }
      return pageDataUrls;
    }

    const totalPages = Math.max(1, Math.ceil(job.photos.length / photosPerPage));

    for (let p = 0; p < totalPages; p++) {
      const { cells, pageWidth, pageHeight } = PhotoEngine.calculatePageCells(
        photosPerPage,
        job.paperSize,
        job.orientation,
        10, // 10mm margin
        printCanvasWidth
      );

      const canvas = document.createElement('canvas');
      canvas.width = pageWidth;
      canvas.height = pageHeight;
      const ctx = canvas.getContext('2d');

      if (!ctx) continue;

      // Draw Paper Background
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, pageWidth, pageHeight);

      if (job.photos.length > 0) {
        const pagePhotos = job.photos.slice(p * photosPerPage, (p + 1) * photosPerPage);
        
        // Wait for all images on page to load & render into cell
        const drawPromises = pagePhotos.map((photo, idx) => {
          return new Promise<void>((resolve) => {
            const cell = cells[idx];
            if (!cell || !photo) return resolve();

            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => {
              PhotoEngine.drawPhotoInCell(ctx, img, cell, job.fitMode || 'fit', photo.adjustments);
              resolve();
            };
            img.onerror = () => resolve();
            img.src = photo.dataUrl;
          });
        });

        await Promise.all(drawPromises);
      }

      pageDataUrls.push(canvas.toDataURL('image/png', 1.0));
    }

    return pageDataUrls;
  },

  // Renders pages into DOM and triggers browser system print (window.print())
  async executeSystemPrint(job: PrintJob, targetPagesOverride?: number[]): Promise<void> {
    // Remove existing printable area if present
    const existing = document.getElementById('printu-printable-area');
    if (existing) existing.remove();

    // Render high-res pages
    const pageDataUrls = await this.renderJobPagesToDataUrls(job, targetPagesOverride);

    // Create printable DOM mount
    const printArea = document.createElement('div');
    printArea.id = 'printu-printable-area';
    printArea.className = 'printable-area';
    printArea.style.cssText = `
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      background: #ffffff;
      z-index: 999999;
    `;

    pageDataUrls.forEach((dataUrl, idx) => {
      const pageDiv = document.createElement('div');
      pageDiv.style.cssText = `
        width: 100%;
        page-break-after: always;
        break-after: page;
        display: flex;
        justify-content: center;
        align-items: center;
        background: #ffffff;
        margin: 0;
        padding: 0;
      `;

      const img = document.createElement('img');
      img.src = dataUrl;
      img.style.cssText = `
        width: 100%;
        height: auto;
        max-width: 100%;
        display: block;
      `;

      pageDiv.appendChild(img);
      printArea.appendChild(pageDiv);
    });

    document.body.appendChild(printArea);

    // Give browser brief tick to layout images before opening print dialog
    setTimeout(() => {
      window.print();
      
      // Cleanup after print dialog closes
      setTimeout(() => {
        const mount = document.getElementById('printu-printable-area');
        if (mount) mount.remove();
      }, 2000);
    }, 250);
  },

  // Generates print-ready PDF file for download
  async exportPdf(job: PrintJob): Promise<void> {
    const pageDataUrls = await this.renderJobPagesToDataUrls(job);
    const paper = PAPER_DIMENSIONS_MM[job.paperSize] || PAPER_DIMENSIONS_MM['A4'];
    const isLandscape = job.orientation === 'landscape';
    const pdfFormat: [number, number] = isLandscape
      ? [paper.height, paper.width]
      : [paper.width, paper.height];

    const doc = new jsPDF({
      orientation: isLandscape ? 'landscape' : 'portrait',
      unit: 'mm',
      format: pdfFormat,
    });

    pageDataUrls.forEach((dataUrl, idx) => {
      if (idx > 0) doc.addPage(pdfFormat, isLandscape ? 'landscape' : 'portrait');
      doc.addImage(dataUrl, 'PNG', 0, 0, pdfFormat[0], pdfFormat[1]);
    });

    const filename = `PrintU_${job.title.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}.pdf`;
    doc.save(filename);
  }
};
