import React, { useState } from 'react';
import { X, Check, RotateCcw, Sparkles } from 'lucide-react';
import { PhotoItem, ImageAdjustment, FilterPreset } from '../../types/print';
import { PhotoEngine } from '../../services/photoEngine';

interface ImageEditorModalProps {
  photo: PhotoItem | null;
  onSave: (photoId: string, adjustments: ImageAdjustment) => void;
  onClose: () => void;
}

export const ImageEditorModal: React.FC<ImageEditorModalProps> = ({ photo, onSave, onClose }) => {
  if (!photo) return null;

  const [adjustments, setAdjustments] = useState<ImageAdjustment>(
    photo.adjustments || {
      brightness: 0,
      contrast: 0,
      saturation: 0,
      sharpness: 0,
      warmth: 0,
      preset: 'original'
    }
  );

  const presets: { id: FilterPreset; label: string }[] = [
    { id: 'original', label: 'Original' },
    { id: 'natural', label: 'Natural' },
    { id: 'vivid', label: 'Vivid' },
    { id: 'bw', label: 'B&W' },
  ];

  const handleReset = () => {
    setAdjustments({
      brightness: 0,
      contrast: 0,
      saturation: 0,
      sharpness: 0,
      warmth: 0,
      preset: 'original'
    });
  };

  const handleSave = () => {
    onSave(photo.id, adjustments);
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem'
    }}>
      <div style={{
        background: 'var(--color-surface-white)',
        borderRadius: 'var(--radius-lg)',
        width: '100%',
        maxWidth: '540px',
        maxHeight: '90vh',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: 'var(--shadow-lg)'
      }}>
        {/* Header */}
        <div style={{
          padding: '1rem 1.25rem',
          borderBottom: '1px solid var(--color-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={18} color="var(--color-wine-deep)" />
            <span>Image Adjustments</span>
          </h3>
          <button onClick={onClose} className="btn btn-ghost btn-sm">
            <X size={18} />
          </button>
        </div>

        {/* Live Image Preview Frame */}
        <div style={{
          background: '#0F0B0C',
          padding: '1.5rem',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '220px'
        }}>
          <img
            src={photo.dataUrl}
            alt="Preview"
            style={{
              maxHeight: '240px',
              maxWidth: '100%',
              objectFit: 'contain',
              borderRadius: 'var(--radius-sm)',
              boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
              filter: PhotoEngine.getCanvasFilterString(adjustments)
            }}
          />
        </div>

        {/* Adjustments Controls */}
        <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Preset Chips */}
          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '0.5rem', display: 'block' }}>
              PRESETS
            </label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {presets.map(p => (
                <button
                  key={p.id}
                  onClick={() => setAdjustments(prev => ({ ...prev, preset: p.id }))}
                  className={`btn btn-sm ${adjustments.preset === p.id ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ flex: 1 }}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sliders */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                <span>Brightness</span>
                <span>{adjustments.brightness > 0 ? `+${adjustments.brightness}` : adjustments.brightness}</span>
              </div>
              <input
                type="range"
                min="-50"
                max="50"
                value={adjustments.brightness}
                onChange={e => setAdjustments({ ...adjustments, brightness: Number(e.target.value) })}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                <span>Contrast</span>
                <span>{adjustments.contrast > 0 ? `+${adjustments.contrast}` : adjustments.contrast}</span>
              </div>
              <input
                type="range"
                min="-50"
                max="50"
                value={adjustments.contrast}
                onChange={e => setAdjustments({ ...adjustments, contrast: Number(e.target.value) })}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                <span>Saturation</span>
                <span>{adjustments.saturation > 0 ? `+${adjustments.saturation}` : adjustments.saturation}</span>
              </div>
              <input
                type="range"
                min="-50"
                max="50"
                value={adjustments.saturation}
                onChange={e => setAdjustments({ ...adjustments, saturation: Number(e.target.value) })}
              />
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div style={{
          padding: '1rem 1.25rem',
          borderTop: '1px solid var(--color-border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <button onClick={handleReset} className="btn btn-ghost btn-sm" style={{ color: 'var(--color-text-muted)' }}>
            <RotateCcw size={16} />
            <span>Reset</span>
          </button>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={onClose} className="btn btn-secondary btn-sm">Cancel</button>
            <button onClick={handleSave} className="btn btn-primary btn-sm">
              <Check size={16} />
              <span>Apply</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
