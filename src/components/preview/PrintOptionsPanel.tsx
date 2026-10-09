import React, { useState } from 'react';
import { Printer, Sliders, ChevronDown, ChevronUp, Wifi, Check, Loader2, Globe } from 'lucide-react';
import { PrintJob, PrinterProfile, PaperSize, Orientation, PrintQuality, ColorMode, DuplexMode, FitMode } from '../../types/print';
import { PrinterBridge } from '../../services/printerBridge';

interface PrintOptionsPanelProps {
  job: PrintJob;
  printers: PrinterProfile[];
  onChangeJob: (updated: Partial<PrintJob>) => void;
  onStartPrint: () => void;
  onExportPdf: () => void;
  isPrinting?: boolean;
}

export const PrintOptionsPanel: React.FC<PrintOptionsPanelProps> = ({
  job,
  printers,
  onChangeJob,
  onStartPrint,
  onExportPdf,
  isPrinting = false
}) => {
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [printerIp, setPrinterIpState] = useState<string>(PrinterBridge.getPrinterIp());
  const [bridgeUrl, setBridgeUrlState] = useState<string>(PrinterBridge.getBridgeUrl());

  const selectedPrinter = printers.find(p => p.id === job.printerId) || printers[0];

  const handleIpChange = (ip: string) => {
    setPrinterIpState(ip);
    PrinterBridge.setPrinterIp(ip);
  };

  const handleBridgeUrlChange = (url: string) => {
    setBridgeUrlState(url);
    PrinterBridge.setBridgeUrl(url);
  };

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Printer size={20} color="var(--color-brand-red)" />
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
              {p.name} {p.connection === 'wifi' ? '(Direct Wi-Fi)' : '(System)'}
            </option>
          ))}
        </select>
      </div>

      {/* Wi-Fi Printer Target IP Address */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
        <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Wifi size={14} color="var(--color-brand-red)" />
          <span>Printer Local IP Address (Direct Silent Print)</span>
        </label>
        <input
          type="text"
          value={printerIp}
          onChange={e => handleIpChange(e.target.value)}
          placeholder="e.g. 192.168.1.100"
        />
        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
          Sends print payload directly to this Wi-Fi IP address without opening Chrome dialog box
        </span>
      </div>

      {/* Paper Size & Orientation */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Paper Size</label>
          <select
            value={job.paperSize}
            onChange={e => onChangeJob({ paperSize: e.target.value as PaperSize })}
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

      {/* Advanced Settings Toggle */}
      <button
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="btn btn-ghost btn-sm"
        style={{ alignSelf: 'flex-start', color: 'var(--color-text-muted)', fontSize: '0.8rem', padding: 0 }}
      >
        <span>{showAdvanced ? 'Hide advanced settings' : 'Bridge URL & Image Fit settings'}</span>
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
            <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Globe size={14} color="var(--color-brand-red)" />
              <span>Backend Bridge Server URL</span>
            </label>
            <input
              type="text"
              value={bridgeUrl}
              onChange={e => handleBridgeUrlChange(e.target.value)}
              placeholder="http://localhost:3001 or Cloudflare Tunnel URL"
              style={{ width: '100%', marginTop: '4px' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Image Fit Mode</label>
            <select
              value={job.fitMode || 'fit'}
              onChange={e => onChangeJob({ fitMode: e.target.value as FitMode })}
              style={{ width: '100%', marginTop: '4px' }}
            >
              <option value="fit">Fit (Contain - Zero Cropping)</option>
              <option value="fill">Fill (Crop to Cell Boundaries)</option>
              <option value="original">Original Aspect Ratio</option>
            </select>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginTop: '0.5rem' }}>
        <button
          disabled={isPrinting}
          onClick={onStartPrint}
          className="btn btn-primary btn-lg"
          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
        >
          {isPrinting ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              <span>Sending directly to Printer...</span>
            </>
          ) : (
            <>
              <Printer size={22} />
              <span>Direct Print (No Dialog Box)</span>
            </>
          )}
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
