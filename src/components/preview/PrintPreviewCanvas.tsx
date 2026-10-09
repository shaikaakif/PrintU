import React, { useRef, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { PrintJob } from '../../types/print';
import { PhotoEngine } from '../../services/photoEngine';
import { useDeviceDetect } from '../../hooks/useDeviceDetect';

interface PrintPreviewCanvasProps {
  job: PrintJob;
}

export const PrintPreviewCanvas: React.FC<PrintPreviewCanvasProps> = ({ job }) => {
  const { isMobile } = useDeviceDetect();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activePageIndex, setActivePageIndex] = useState<number>(0);

  const photosPerPage = job.layoutCount;
  const totalPages = job.type === 'photo' 
    ? Math.max(1, Math.ceil(job.photos.length / photosPerPage))
    : job.document?.pageCount || 1;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const containerW = isMobile ? 320 : 540;
    const { cells, pageWidth, pageHeight } = PhotoEngine.calculatePageCells(
      photosPerPage,
      job.paperSize,
      job.orientation,
      10,
      containerW
    );

    canvas.width = pageWidth;
    canvas.height = pageHeight;

    // Draw Paper Sheet
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, pageWidth, pageHeight);

    // Draw Paper Margin Boundary Guide Line
    ctx.strokeStyle = 'rgba(84, 24, 39, 0.12)';
    ctx.setLineDash([4, 4]);
    ctx.strokeRect(10, 10, pageWidth - 20, pageHeight - 20);
    ctx.setLineDash([]);

    if (job.type === 'photo' && job.photos.length > 0) {
      const pagePhotos = job.photos.slice(
        activePageIndex * photosPerPage,
        (activePageIndex + 1) * photosPerPage
      );

      pagePhotos.forEach((photo, idx) => {
        const cell = cells[idx];
        if (cell && photo) {
          const img = new Image();
          img.onload = () => {
            PhotoEngine.drawPhotoInCell(ctx, img, cell, job.fitMode, photo.adjustments);
          };
          img.src = photo.dataUrl;
        }
      });
    } else if (job.document) {
      const pageDataUrl = job.document.renderedPages?.[activePageIndex];
      if (pageDataUrl) {
        const img = new Image();
        img.onload = () => {
          // Draw clean paper background
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, pageWidth, pageHeight);

          // Draw margins guide
          ctx.strokeStyle = 'rgba(84, 24, 39, 0.12)';
          ctx.setLineDash([4, 4]);
          ctx.strokeRect(10, 10, pageWidth - 20, pageHeight - 20);
          ctx.setLineDash([]);

          // Center and fit document page image inside margins
          const targetW = pageWidth - 20;
          const targetH = pageHeight - 20;
          const imgAspect = img.width / img.height;
          const targetAspect = targetW / targetH;

          let drawW = targetW;
          let drawH = targetH;
          let drawX = 10;
          let drawY = 10;

          if (imgAspect > targetAspect) {
            drawH = targetW / imgAspect;
            drawY = 10 + (targetH - drawH) / 2;
          } else {
            drawW = targetH * imgAspect;
            drawX = 10 + (targetW - drawW) / 2;
          }

          ctx.drawImage(img, drawX, drawY, drawW, drawH);
        };
        img.src = pageDataUrl;
      } else {
        // Fallback document info text if page rendering
        ctx.fillStyle = '#FAF5F6';
        ctx.fillRect(20, 20, pageWidth - 40, pageHeight - 40);
        ctx.fillStyle = 'var(--color-text-main)';
        ctx.font = 'bold 16px Outfit, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`Document: ${job.document.name}`, pageWidth / 2, pageHeight / 2 - 10);
        ctx.font = '14px Outfit, sans-serif';
        ctx.fillStyle = 'var(--color-text-muted)';
        ctx.fillText(`Page ${activePageIndex + 1} of ${job.document.pageCount}`, pageWidth / 2, pageHeight / 2 + 15);
      }
    }
  }, [job, activePageIndex, isMobile, photosPerPage]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '0.85rem',
      width: '100%'
    }}>
      {/* Paper Sheet Preview Container */}
      <div style={{
        background: '#1A1214',
        padding: '1.5rem',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-lg)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        position: 'relative'
      }}>
        {/* Paper Canvas */}
        <canvas
          ref={canvasRef}
          style={{
            maxWidth: '100%',
            height: 'auto',
            borderRadius: '4px',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.45)'
          }}
        />
      </div>

      {/* Page Pagination Controls */}
      {totalPages > 1 && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          background: 'var(--color-surface-white)',
          padding: '0.4rem 0.85rem',
          borderRadius: 'var(--radius-full)',
          boxShadow: 'var(--shadow-sm)',
          border: '1px solid var(--color-border)'
        }}>
          <button
            disabled={activePageIndex === 0}
            onClick={() => setActivePageIndex(prev => Math.max(0, prev - 1))}
            className="btn btn-ghost btn-sm"
            style={{ padding: '4px' }}
          >
            <ChevronLeft size={18} />
          </button>
          <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>
            Page {activePageIndex + 1} of {totalPages}
          </span>
          <button
            disabled={activePageIndex >= totalPages - 1}
            onClick={() => setActivePageIndex(prev => Math.min(totalPages - 1, prev + 1))}
            className="btn btn-ghost btn-sm"
            style={{ padding: '4px' }}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
};
