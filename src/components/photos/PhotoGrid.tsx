import React, { useRef } from 'react';
import { Upload, X, Sliders, CheckCircle2, Trash2 } from 'lucide-react';
import { PhotoItem } from '../../types/print';

interface PhotoGridProps {
  photos: PhotoItem[];
  selectedPhotoIds: string[];
  onAddPhotos: (files: FileList | File[]) => void;
  onToggleSelectPhoto: (id: string) => void;
  onRemovePhoto: (id: string) => void;
  onOpenEditPhoto: (photo: PhotoItem) => void;
  onClearAllPhotos?: () => void;
}

export const PhotoGrid: React.FC<PhotoGridProps> = ({
  photos,
  selectedPhotoIds,
  onAddPhotos,
  onToggleSelectPhoto,
  onRemovePhoto,
  onOpenEditPhoto,
  onClearAllPhotos
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onAddPhotos(e.target.files);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onAddPhotos(e.dataTransfer.files);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Hidden Native File Input */}
      <input 
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      {/* Drag & Drop Import Header Area */}
      <div 
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
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
          background: 'rgba(84, 24, 39, 0.08)',
          color: 'var(--color-wine-deep)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 0.75rem auto'
        }}>
          <Upload size={24} />
        </div>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Add photos to print</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
          Drag & drop images here or tap to select from your device
        </p>
      </div>

      {/* Thumbnail Selection Grid */}
      {photos.length > 0 && (
        <div style={{ marginTop: '0.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>
              {photos.length} photo{photos.length > 1 ? 's' : ''} imported ({selectedPhotoIds.length} selected)
            </span>
            <button
              onClick={onClearAllPhotos ? onClearAllPhotos : () => photos.forEach(p => onRemovePhoto(p.id))}
              style={{
                background: 'rgba(239, 68, 68, 0.08)',
                color: '#EF4444',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <Trash2 size={13} />
              <span>Clear All</span>
            </button>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
            gap: '0.85rem'
          }}>
            {photos.map((photo) => {
              const isSelected = selectedPhotoIds.includes(photo.id);
              return (
                <div
                  key={photo.id}
                  style={{
                    position: 'relative',
                    aspectRatio: '1',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    border: isSelected ? '3px solid var(--color-wine-deep)' : '1px solid var(--color-border)',
                    boxShadow: isSelected ? 'var(--shadow-md)' : 'var(--shadow-sm)',
                    cursor: 'pointer',
                    background: '#000'
                  }}
                  onClick={() => onToggleSelectPhoto(photo.id)}
                >
                  <img 
                    src={photo.dataUrl}
                    alt={photo.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      opacity: isSelected ? 1 : 0.65,
                      filter: photo.adjustments ? `brightness(${100 + photo.adjustments.brightness}%) contrast(${100 + photo.adjustments.contrast}%)` : 'none',
                      transition: 'all var(--transition-fast)'
                    }}
                  />

                  {/* Selected Check Indicator */}
                  {isSelected && (
                    <div style={{
                      position: 'absolute',
                      top: '6px',
                      left: '6px',
                      color: 'var(--color-orange-warm)',
                      background: '#FFFFFF',
                      borderRadius: '50%',
                      width: '22px',
                      height: '22px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: 'var(--shadow-sm)'
                    }}>
                      <CheckCircle2 size={18} />
                    </div>
                  )}

                  {/* Actions (Edit Filter & Delete) */}
                  <div 
                    style={{
                      position: 'absolute',
                      bottom: '6px',
                      right: '6px',
                      display: 'flex',
                      gap: '4px'
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => onOpenEditPhoto(photo)}
                      title="Adjust brightness & contrast"
                      style={{
                        background: 'rgba(0, 0, 0, 0.65)',
                        color: '#FFF',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      <Sliders size={14} />
                    </button>
                    <button
                      onClick={() => onRemovePhoto(photo.id)}
                      title="Remove photo"
                      style={{
                        background: 'rgba(239, 68, 68, 0.85)',
                        color: '#FFF',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
