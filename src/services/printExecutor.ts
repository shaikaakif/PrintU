import { jsPDF } from 'jspdf';
import { PrintJob, PaperSize } from '../types/print';
import { PAPER_DIMENSIONS_MM, PhotoEngine } from './photoEngine';

export const PrintExecutor = {
  // Generates print-ready PDF file for download
  async exportPdf(job: PrintJob): Promise<void> {
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

    if (job.type === 'photo' && job.photos.length > 0) {
      const photosPerPage = job.layoutCount;
      const totalPages = Math.ceil(job.photos.length / photosPerPage);

      for (let p = 0; p < totalPages; p++) {
        if (p > 0) doc.addPage(pdfFormat, isLandscape ? 'landscape' : 'portrait');

        const pagePhotos = job.photos.slice(p * photosPerPage, (p + 1) * photosPerPage);
        
        // Calculate cells in MM
        const { cells, pageWidth, pageHeight } = PhotoEngine.calculatePageCells(
          photosPerPage,
          job.paperSize,
          job.orientation,
          10,
          pdfFormat[0]
        );

        for (let i = 0; i < pagePhotos.length; i++) {
          const photo = pagePhotos[i];
          const cell = cells[i];

          if (photo && cell) {
            try {
              doc.addImage(
                photo.dataUrl,
                'JPEG',
                cell.x,
                cell.y,
                cell.width,
                cell.height
              );
            } catch {
              // Fallback for png/webp dataUrls
              doc.addImage(
                photo.dataUrl,
                'PNG',
                cell.x,
                cell.y,
                cell.width,
                cell.height
              );
            }
          }
        }
      }
    } else if (job.document) {
      // Document fallback export page notice or rendered canvas image
      doc.setFontSize(16);
      doc.text(`PrintU Document Export: ${job.document.name}`, 15, 20);
      doc.setFontSize(12);
      doc.text(`Page Count: ${job.document.pageCount}`, 15, 30);
      doc.text(`Paper Size: ${job.paperSize} | Orientation: ${job.orientation}`, 15, 38);
      doc.text(`Color Mode: ${job.colorMode} | Quality: ${job.quality}`, 15, 46);
    }

    const filename = `PrintU_${job.title.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}.pdf`;
    doc.save(filename);
  },

  // Triggers browser system window.print()
  triggerSystemPrint(): void {
    window.print();
  }
};
