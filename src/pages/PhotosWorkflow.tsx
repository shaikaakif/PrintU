import React, { useState } from 'react';
import { ArrowLeft, Sparkles, Image as ImageIcon } from 'lucide-react';
import { PhotoItem, PhotoLayoutCount, PrintJob, PrinterProfile, ImageAdjustment } from '../types/print';
import { PhotoGrid } from '../components/photos/PhotoGrid';
import { ImageEditorModal } from '../components/photos/ImageEditorModal';
import { VisualDiagram } from '../components/common/VisualDiagram';
import { PrintPreviewCanvas } from '../components/preview/PrintPreviewCanvas';
import { PrintOptionsPanel } from '../components/preview/PrintOptionsPanel';
import { useDeviceDetect } from '../hooks/useDeviceDetect';

interface PhotosWorkflowProps {
  printers: PrinterProfile[];
  onBack: () => void;
  onSubmitJob: (job: PrintJob) => void;
  onExportPdf: (job: PrintJob) => void;
}

export const PhotosWorkflow: React.FC<PhotosWorkflowProps> = ({
  printers,
  onBack,
  onSubmitJob,
  onExportPdf
}) => {
  const { isMobile, isDesktop } = useDeviceDetect();

  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [selectedPhotoIds, setSelectedPhotoIds] = useState<string[]>([]);
  const [editingPhoto, setEditingPhoto] = useState<PhotoItem | null>(null);

  const [job, setJob] = useState<PrintJob>({
    id: `job-${Date.now()}`,
    title: 'Photo Sheet Job',
    type: 'photo',
    photos: [],
    printerId: printers[0]?.id || 'printer-system',
    paperSize: 'A4',
    orientation: 'portrait',
    layoutCount: 4,
    fitMode: 'fill',
    quality: 'high',
    colorMode: 'color',
    copies: 1,
    collate: true,
    duplexMode: 'none',
    status: 'preparing',
    createdAt: new Date().toISOString()
  });

  const handleAddPhotos = (files: FileList | File[]) => {
    const newPhotos: PhotoItem[] = [];
    Array.from(files).forEach((file, index) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const dataUrl = e.target?.result as string;
          const photo: PhotoItem = {
            id: `photo-${Date.now()}-${index}`,
            name: file.name,
            dataUrl,
            width: 800,
            height: 600,
            adjustments: {
              brightness: 0,
              contrast: 0,
              saturation: 0,
              sharpness: 0,
              warmth: 0,
              preset: 'original'
            }
          };
          setPhotos(prev => [...prev, photo]);
          setSelectedPhotoIds(prev => [...prev, photo.id]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const handleToggleSelectPhoto = (id: string) => {
    setSelectedPhotoIds(prev =>
      prev.includes(id) ? prev.filter(pId => pId !== id) : [...prev, id]
    );
  };

  const handleRemovePhoto = (id: string) => {
    setPhotos(prev => prev.filter(p => p.id !== id));
    setSelectedPhotoIds(prev => prev.filter(pId => pId !== id));
  };

  const handleSaveAdjustments = (photoId: string, adjustments: ImageAdjustment) => {
    setPhotos(prev =>
      prev.map(p => (p.id === photoId ? { ...p, adjustments } : p))
    );
  };

  // Sync selected photos with print job
  const activePhotos = photos.filter(p => selectedPhotoIds.includes(p.id));
  const activeJob: PrintJob = {
    ...job,
    photos: activePhotos,
    title: activePhotos.length > 0 ? `${activePhotos.length} Photos Sheet` : 'Photo Sheet Job'
  };

  const layoutOptions: PhotoLayoutCount[] = [1, 2, 4, 6, 9];

  return (
    <div style={{
      maxWidth: '1280px',
      margin: '0 auto',
      width: '100%',
      padding: isMobile ? '1rem 1rem 5rem 1rem' : '2rem'
    }}>
      {/* Back Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <button onClick={onBack} className="btn btn-ghost btn-sm">
          <ArrowLeft size={18} />
          <span>Back</span>
        </button>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Photo Print Workflow</h2>
      </div>

      {/* Responsive Multi-Pane Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isDesktop ? '1fr 1fr' : '1fr',
        gap: '2rem'
      }}>
        {/* Left Column: Photo Selection & Layout Selector */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Photo Import & Grid */}
          <PhotoGrid
            photos={photos}
            selectedPhotoIds={selectedPhotoIds}
            onAddPhotos={handleAddPhotos}
            onToggleSelectPhoto={handleToggleSelectPhoto}
            onRemovePhoto={handleRemovePhoto}
            onOpenEditPhoto={setEditingPhoto}
          />

          {/* Photos per page diagram selection */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Choose Layout (Photos per Page)</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.5rem' }}>
              {layoutOptions.map(cnt => (
                <VisualDiagram
                  key={cnt}
                  count={cnt}
                  orientation={job.orientation}
                  selected={job.layoutCount === cnt}
                  onClick={() => setJob(prev => ({ ...prev, layoutCount: cnt }))}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Live Paper Preview & Settings Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Live Preview Canvas */}
          <PrintPreviewCanvas job={activeJob} />

          {/* Print Options Panel */}
          <PrintOptionsPanel
            job={activeJob}
            printers={printers}
            onChangeJob={updated => setJob(prev => ({ ...prev, ...updated }))}
            onStartPrint={() => onSubmitJob(activeJob)}
            onExportPdf={() => onExportPdf(activeJob)}
          />
        </div>
      </div>

      {/* Image Editor Filter Modal */}
      {editingPhoto && (
        <ImageEditorModal
          photo={editingPhoto}
          onSave={handleSaveAdjustments}
          onClose={() => setEditingPhoto(null)}
        />
      )}
    </div>
  );
};
