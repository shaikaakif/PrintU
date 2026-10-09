import React, { useState } from 'react';
import { Printer, Sliders, ChevronDown, ChevronUp, Wifi, Check, Loader2, Globe } from 'lucide-react';
import { PrintJob, PrinterProfile, PaperSize, Orientation, PrintQuality, ColorMode, DuplexMode, FitMode } from '../../types/print';
import { PrinterBridge } from '../../services/printerBridge';
import { CustomSelect } from '../common/CustomSelect';
import { useDeviceDetect } from '../../hooks/useDeviceDetect';

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

  const { isMobile } = useDeviceDetect();

  const selectedPrinter = printers.find(p => p.id === job.printerId) || printers[0];

  const handleIpChange = (ip: string) => {
    setPrinterIpState(ip);
    PrinterBridge.setPrinterIp(ip);
  };

  const handleBridgeUrlChange = (url: string) => {
    setBridgeUrlState(url);
    PrinterBridge.setBridgeUrl(url);
  };

  const printerOptions = printers.map(p => ({
    value: p.id,
    label: p.name,
    sublabel: p.connection === 'wifi' ? 'Direct Silent Wi-Fi' : 'System Print Engine',
    icon: Printer
  }));

  const paperSizeOptions = [
    { value: 'A4', label: 'A4 Sheet (210 × 297 mm)' },
    { value: 'A5', label: 'A5 Sheet (148 × 210 mm)' },
    { value: 'Letter', label: 'Letter (8.5 × 11 in)' },
    { value: '4x6', label: '4 × 6 Inch Photo Paper' },
    { value: '5x7', label: '5 × 7 Inch Photo Paper' },
  ];

  const orientationOptions = [
    { value: 'portrait', label: 'Portrait' },
    { value: 'landscape', label: 'Landscape' },
    { value: 'auto', label: 'Auto Detect' },
  ];

  const colorModeOptions = [
    { value: 'color', label: 'Full Color' },
    { value: 'grayscale', label: 'Grayscale / Black & White' },
  ];

  const qualityOptions = [
    { value: 'draft', label: 'Fast Draft' },
    { value: 'standard', label: 'Standard Quality' },
    { value: 'high', label: 'High Quality' },
    { value: 'max', label: 'Maximum Detail' },
  ];

  const duplexOptions = [
    { value: 'none', label: 'One-Sided (Single Sided)' },
    { value: 'manual', label: 'Two-Sided (Manual Duplex - Flip Paper)' },
  ];

  const fitModeOptions = [
    { value: 'fit', label: 'Fit (Contain - Zero Cropping)' },
    { value: 'fill', label: 'Fill (Crop to Cell Boundaries)' },
    { value: 'original', label: 'Original Aspect Ratio' },
  ];

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Printer size={20} color="var(--color-brand-red)" />
        <span>Print Settings</span>
      </h3>

      {/* Printer Selection */}
      <CustomSelect
        label="Destination Printer"
        options={printerOptions}
        value={job.printerId}
        onChange={val => onChangeJob({ printerId: val })}
      />

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
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '0.75rem' }}>
        <CustomSelect
          label="Paper Size"
          options={paperSizeOptions}
          value={job.paperSize}
          onChange={val => onChangeJob({ paperSize: val as PaperSize })}
        />

        <CustomSelect
          label="Orientation"
          options={orientationOptions}
          value={job.orientation}
          onChange={val => onChangeJob({ orientation: val as Orientation })}
        />
      </div>

      {/* Color Mode & Quality */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '0.75rem' }}>
        <CustomSelect
          label="Color Mode"
          options={colorModeOptions}
          value={job.colorMode}
          onChange={val => onChangeJob({ colorMode: val as ColorMode })}
        />

        <CustomSelect
          label="Quality"
          options={qualityOptions}
          value={job.quality}
          onChange={val => onChangeJob({ quality: val as PrintQuality })}
        />
      </div>

      {/* Print Sides (Duplex) */}
      <CustomSelect
        label="Print Sides (Duplex)"
        options={duplexOptions}
        value={job.duplexMode || 'none'}
        onChange={val => onChangeJob({ duplexMode: val as DuplexMode })}
      />

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
              placeholder="https://printu.satvnews.in"
              style={{ width: '100%', marginTop: '4px' }}
            />
          </div>

          <CustomSelect
            label="Image Fit Mode"
            options={fitModeOptions}
            value={job.fitMode || 'fit'}
            onChange={val => onChangeJob({ fitMode: val as FitMode })}
          />
        </div>
      )}

      {/* Action Buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginTop: '0.5rem' }}>
        <button
          disabled={isPrinting}
          onClick={onStartPrint}
          className="btn btn-primary btn-lg"
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            textAlign: 'center',
            whiteSpace: 'normal',
            wordBreak: 'break-word',
            lineHeight: '1.25',
            padding: '0.85rem 1rem'
          }}
        >
          {isPrinting ? (
            <>
              <Loader2 size={20} className="animate-spin" style={{ flexShrink: 0 }} />
              <span>Sending directly to Printer...</span>
            </>
          ) : (
            <>
              <Printer size={22} style={{ flexShrink: 0 }} />
              <span>Direct Print (No Dialog Box)</span>
            </>
          )}
        </button>

        <button
          onClick={onExportPdf}
          className="btn btn-secondary btn-sm"
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.4rem',
            textAlign: 'center',
            whiteSpace: 'normal',
            wordBreak: 'break-word',
            padding: '0.6rem 0.85rem'
          }}
        >
          <span>Save / Export Print-Ready PDF</span>
        </button>
      </div>
    </div>
  );
};
