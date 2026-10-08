import React, { useState } from 'react';
import { Printer, Sliders, ChevronDown, ChevronUp, Copy, Palette, Layers, Sparkles } from 'lucide-react';
import { PrintJob, PrinterProfile, PaperSize, Orientation, PrintQuality, ColorMode, DuplexMode, FitMode } from '../../types/print';

interface PrintOptionsPanelProps {
  job: PrintJob;
  printers: PrinterProfile[];
  onChangeJob: (updated: Partial<PrintJob>) => void;
  onStartPrint: () => void;
  onExportPdf: () => void;
}

export const PrintOptionsPanel: React.FC<PrintOptionsPanelProps> = ({
  job,
  printers,
  onChangeJob,
  onStartPrint,
  onExportPdf
}) => {
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const selectedPrinter = printers.find(p => p.id === job.printerId) || printers[0];

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Printer size={20} color="var(--color-wine-deep)" />
        <span>Print Settings</span>
      </h3>

      {/* Printer Selection */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
        <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Destination Printer</label>
        <select
          value={job.printerId}
          onChange={e => onChangeJob({ printerId: e.target.value })}
          style={{
            padding: '0.65rem 0.85rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border)',
            fontSize: '0.9rem',
            fontWeight: 500,
            background: 'var(--color-surface-white)',
            outline: 'none'
          }}
        >
          {printers.map(p => (
            <option key={p.id} value={p.id}>
              {p.name} {p.connection === 'wifi' ? '(Wi-Fi)' : '(System)'}
            </option>
          ))}
        </select>
        {selectedPrinter && (
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
            {selectedPrinter.supportsAutoDuplex ? '✓ Auto-duplex supported' : 'ℹ Manual duplex supported'}
          </span>
        )}
      </div>

      {/* Paper Size & Orientation */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Paper Size</label>
          <select
            value={job.paperSize}
            onChange={e => onChangeJob({ paperSize: e.target.value as PaperSize })}
            style={{
              padding: '0.55rem 0.75rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              fontSize: '0.85rem',
              background: 'var(--color-surface-white)'
            }}
          >
            <option value="A4">A4 Sheet</option>
            <option value="A5">A5 Sheet</option>
            <option value="Letter">Letter</option>
            <option value="4x6">4 × 6 Inch</option>
            <option value="5x7">5 × 7 Inch</option>
          </select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Orientation</label>
          <select
            value={job.orientation}
            onChange={e => onChangeJob({ orientation: e.target.value as Orientation })}
            style={{
              padding: '0.55rem 0.75rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              fontSize: '0.85rem',
              background: 'var(--color-surface-white)'
            }}
          >
            <option value="portrait">Portrait</option>
            <option value="landscape">Landscape</option>
            <option value="auto">Auto</option>
          </select>
        </div>
      </div>

      {/* Color Mode & Quality */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Color Mode</label>
          <select
            value={job.colorMode}
            onChange={e => onChangeJob({ colorMode: e.target.value as ColorMode })}
            style={{
              padding: '0.55rem 0.75rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              fontSize: '0.85rem',
              background: 'var(--color-surface-white)'
            }}
          >
            <option value="color">Full Color</option>
            <option value="grayscale">Grayscale / Black & White</option>
          </select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Quality</label>
          <select
            value={job.quality}
            onChange={e => onChangeJob({ quality: e.target.value as PrintQuality })}
            style={{
              padding: '0.55rem 0.75rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              fontSize: '0.85rem',
              background: 'var(--color-surface-white)'
            }}
          >
            <option value="draft">Fast Draft</option>
            <option value="standard">Standard</option>
            <option value="high">High Quality</option>
            <option value="max">Maximum Detail</option>
          </select>
        </div>
      </div>

      {/* Copies Counter */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Number of Copies</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            disabled={job.copies <= 1}
            onClick={() => onChangeJob({ copies: Math.max(1, job.copies - 1) })}
            className="btn btn-secondary btn-sm"
            style={{ padding: '4px 10px' }}
          >
            −
          </button>
          <span style={{ fontSize: '1rem', fontWeight: 700, width: '24px', textAlign: 'center' }}>
            {job.copies}
          </span>
          <button
            onClick={() => onChangeJob({ copies: job.copies + 1 })}
            className="btn btn-secondary btn-sm"
            style={{ padding: '4px 10px' }}
          >
            +
          </button>
        </div>
      </div>

      {/* Duplex Mode Switch */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
        <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Print Sides</label>
        <select
          value={job.duplexMode}
          onChange={e => onChangeJob({ duplexMode: e.target.value as DuplexMode })}
          style={{
            padding: '0.55rem 0.75rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border)',
            fontSize: '0.85rem',
            background: 'var(--color-surface-white)'
          }}
        >
          <option value="none">Single-sided (One side)</option>
          <option value="manual">Manual Duplex (PrintU Flip Wizard)</option>
          {selectedPrinter?.supportsAutoDuplex && <option value="auto">Automatic Two-sided</option>}
        </select>
      </div>

      {/* Advanced Settings Toggle */}
      <button
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="btn btn-ghost btn-sm"
        style={{ alignSelf: 'flex-start', color: 'var(--color-text-muted)', fontSize: '0.8rem', padding: 0 }}
      >
        <span>{showAdvanced ? 'Hide advanced settings' : 'More settings (Fit mode, DPI)'}</span>
        {showAdvanced ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>

      {showAdvanced && (
        <div style={{
          background: 'var(--color-surface-muted)',
          padding: '0.85rem',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem'
        }}>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Image Fit Mode</label>
            <select
              value={job.fitMode}
              onChange={e => onChangeJob({ fitMode: e.target.value as FitMode })}
              style={{
                width: '100%',
                padding: '0.45rem',
                fontSize: '0.8rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-border)',
                marginTop: '4px'
              }}
            >
              <option value="fill">Fill (Crop image to fill cell)</option>
              <option value="fit">Fit (Entire image inside cell)</option>
              <option value="crop">Crop Centered</option>
              <option value="original">Original Aspect Ratio</option>
            </select>
          </div>
        </div>
      )}

      {/* Main Print Actions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginTop: '0.5rem' }}>
        <button
          onClick={onStartPrint}
          className="btn btn-primary btn-lg"
          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
        >
          <Printer size={22} />
          <span>Print Now</span>
        </button>

        <button
          onClick={onExportPdf}
          className="btn btn-secondary btn-sm"
          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
        >
          <span>Save / Export Print-Ready PDF</span>
        </button>
      </div>
    </div>
  );
};
