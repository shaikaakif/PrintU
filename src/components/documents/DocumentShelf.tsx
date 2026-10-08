import React, { useRef, useState } from 'react';
import { FileUp, FileText, Search, CheckCircle2, Layers } from 'lucide-react';
import { DocumentFile } from '../../types/print';
import { PdfEngine, RenderedPdfPage } from '../../services/pdfEngine';

interface DocumentShelfProps {
  document: DocumentFile | null;
  onSelectDocument: (doc: DocumentFile) => void;
  onPageRangeChange: (pages: number[]) => void;
}

export const DocumentShelf: React.FC<DocumentShelfProps> = ({
  document,
  onSelectDocument,
  onPageRangeChange
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [thumbnails, setThumbnails] = useState<RenderedPdfPage[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [pageRangeText, setPageRangeText] = useState<string>('All');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const pageCount = await PdfEngine.getPageCount(file);
      const thumbs = await PdfEngine.renderAllThumbnails(file, 20, 0.25);
      setThumbnails(thumbs);

      const allPages = Array.from({ length: pageCount }, (_, i) => i + 1);

      const newDoc: DocumentFile = {
        id: `doc-${Date.now()}`,
        name: file.name,
        size: file.size,
        type: file.type,
        dataUrl: URL.createObjectURL(file),
        pageCount,
        selectedPages: allPages
      };

      onSelectDocument(newDoc);
      setPageRangeText('All');
    } catch (err) {
      console.error('Document import error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCustomPageRange = (text: string) => {
    setPageRangeText(text);
    if (!document) return;

    if (text.toLowerCase() === 'all' || !text.trim()) {
      onPageRangeChange(Array.from({ length: document.pageCount }, (_, i) => i + 1));
      return;
    }

    // Parse e.g. "1-3, 5"
    const pagesSet = new Set<number>();
    const parts = text.split(',');
    for (const part of parts) {
      const range = part.trim().split('-');
      if (range.length === 2) {
        const start = parseInt(range[0], 10);
        const end = parseInt(range[1], 10);
        if (!isNaN(start) && !isNaN(end)) {
          for (let p = Math.max(1, start); p <= Math.min(document.pageCount, end); p++) {
            pagesSet.add(p);
          }
        }
      } else if (range.length === 1) {
        const p = parseInt(range[0], 10);
        if (!isNaN(p) && p >= 1 && p <= document.pageCount) {
          pagesSet.add(p);
        }
      }
    }

    if (pagesSet.size > 0) {
      onPageRangeChange(Array.from(pagesSet).sort((a, b) => a - b));
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      {/* Document Import Dropzone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        style={{
          border: '2px dashed var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          padding: '2rem 1.5rem',
          textAlign: 'center',
          background: 'var(--color-surface-white)',
          cursor: 'pointer',
          transition: 'all var(--transition-normal)'
        }}
        className="card-interactive"
      >
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          background: 'rgba(242, 139, 69, 0.12)',
          color: 'var(--color-orange-warm)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 0.75rem auto'
        }}>
          <FileUp size={24} />
        </div>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Import PDF Document</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
          Select any PDF file or paper document to prepare for print
        </p>
      </div>

      {loading && (
        <div style={{ textAlign: 'center', padding: '1.5rem' }}>
          <p style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-wine-deep)' }}>
            Reading document structure...
          </p>
        </div>
      )}

      {/* Selected Document Details & Page Range */}
      {document && !loading && (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--color-wine-dark)',
              color: '#FFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <FileText size={22} />
            </div>
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {document.name}
              </h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                {document.pageCount} page{document.pageCount > 1 ? 's' : ''} • {(document.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
            <span style={{ fontSize: '0.75rem', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--color-success)', padding: '4px 8px', borderRadius: '999px', fontWeight: 600 }}>
              Ready
            </span>
          </div>

          {/* Page Range Selector */}
          <div style={{
            borderTop: '1px solid var(--color-border)',
            paddingTop: '0.85rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>
              Pages to Print ({document.selectedPages.length} of {document.pageCount} selected)
            </label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => handleCustomPageRange('All')}
                className={`btn btn-sm ${pageRangeText === 'All' ? 'btn-primary' : 'btn-secondary'}`}
              >
                All Pages
              </button>
              <input
                type="text"
                value={pageRangeText}
                onChange={e => handleCustomPageRange(e.target.value)}
                placeholder="Custom e.g. 1-3, 5"
                style={{
                  flex: 1,
                  padding: '0.4rem 0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--color-border)',
                  fontSize: '0.85rem',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          {/* Page Thumbnail Strip */}
          {thumbnails.length > 0 && (
            <div style={{ marginTop: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '0.5rem', display: 'block' }}>
                PAGE PREVIEWS
              </span>
              <div style={{
                display: 'flex',
                gap: '0.65rem',
                overflowX: 'auto',
                paddingBottom: '0.5rem'
              }}>
                {thumbnails.map(thumb => {
                  const isSelected = document.selectedPages.includes(thumb.pageNumber);
                  return (
                    <div
                      key={thumb.pageNumber}
                      onClick={() => {
                        let newSelected: number[];
                        if (isSelected) {
                          newSelected = document.selectedPages.filter(p => p !== thumb.pageNumber);
                        } else {
                          newSelected = [...document.selectedPages, thumb.pageNumber].sort((a, b) => a - b);
                        }
                        onPageRangeChange(newSelected);
                      }}
                      style={{
                        position: 'relative',
                        minWidth: '70px',
                        height: '95px',
                        borderRadius: '4px',
                        overflow: 'hidden',
                        border: isSelected ? '2px solid var(--color-wine-deep)' : '1px solid var(--color-border)',
                        boxShadow: 'var(--shadow-sm)',
                        cursor: 'pointer',
                        background: '#FFF'
                      }}
                    >
                      <img
                        src={thumb.dataUrl}
                        alt={`Page ${thumb.pageNumber}`}
                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                      />
                      <div style={{
                        position: 'absolute',
                        bottom: '2px',
                        right: '4px',
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        background: 'rgba(0,0,0,0.6)',
                        color: '#FFF',
                        padding: '1px 4px',
                        borderRadius: '3px'
                      }}>
                        P{thumb.pageNumber}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
