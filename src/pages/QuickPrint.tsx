import React, { useRef, useState } from 'react';
import { Zap, Upload, ArrowLeft, Printer, CheckCircle } from 'lucide-react';
import { PrinterProfile, PrintJob } from '../types/print';
import { useDeviceDetect } from '../hooks/useDeviceDetect';

interface QuickPrintProps {
  printers: PrinterProfile[];
  onBack: () => void;
  onSubmitJob: (job: PrintJob) => void;
}

export const QuickPrint: React.FC<QuickPrintProps> = ({ printers, onBack, onSubmitJob }) => {
  const { isMobile } = useDeviceDetect();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const defaultPrinter = printers.find(p => p.isDefault) || printers[0];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleQuickSubmit = () => {
    if (!selectedFile) return;

    const isImage = selectedFile.type.startsWith('image/');
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;

      const job: PrintJob = {
        id: `job-${Date.now()}`,
        title: selectedFile.name,
        type: isImage ? 'photo' : 'document',
        photos: isImage ? [{
          id: 'quick-photo-1',
          name: selectedFile.name,
          dataUrl,
          width: 800,
          height: 600,
          adjustments: { brightness: 0, contrast: 0, saturation: 0, sharpness: 0, warmth: 0, preset: 'original' }
        }] : [],
        printerId: defaultPrinter?.id || 'printer-system',
        paperSize: 'A4',
        orientation: 'portrait',
        layoutCount: 1,
        fitMode: 'fit',
        quality: 'high',
        colorMode: 'color',
        copies: 1,
        collate: true,
        duplexMode: 'none',
        status: 'preparing',
        createdAt: new Date().toISOString()
      };

      onSubmitJob(job);
    };
    reader.readAsDataURL(selectedFile);
  };

  return (
    <div style={{
      maxWidth: '680px',
      margin: '0 auto',
      width: '100%',
      padding: isMobile ? '1rem 1rem 5rem 1rem' : '2.5rem 2rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <button onClick={onBack} className="btn btn-ghost btn-sm">
          <ArrowLeft size={18} />
          <span>Back</span>
        </button>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Zap size={22} color="var(--color-orange-warm)" />
          <span>Quick Print</span>
        </h2>
      </div>

      {/* Preset Summary Box */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, var(--color-wine-dark) 0%, var(--color-wine-deep) 100%)',
        color: '#FFF',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem'
      }}>
        <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-orange-warm)', fontWeight: 700 }}>
          Default Preset Active
        </span>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#FFF' }}>{defaultPrinter?.name}</h3>
            <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.8)' }}>
              A4 • Color • High Quality • 1 Copy
            </p>
          </div>
          <Printer size={32} color="var(--color-orange-warm)" />
        </div>
      </div>

      {/* File Dropzone */}
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      <div
        onClick={() => fileInputRef.current?.click()}
        className="card card-interactive"
        style={{
          border: '2px dashed var(--color-border)',
          padding: '2.5rem 1.5rem',
          textAlign: 'center',
          cursor: 'pointer'
        }}
      >
        <div style={{
          width: '54px',
          height: '54px',
          borderRadius: '50%',
          background: 'rgba(242, 139, 69, 0.12)',
          color: 'var(--color-orange-warm)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 0.75rem auto'
        }}>
          <Upload size={28} />
        </div>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>
          {selectedFile ? selectedFile.name : 'Choose file to Quick Print'}
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
          {selectedFile ? `${(selectedFile.size / 1024).toFixed(1)} KB • Tap to change` : 'Select any image or document'}
        </p>
      </div>

      {/* Quick Action */}
      <button
        disabled={!selectedFile}
        onClick={handleQuickSubmit}
        className="btn btn-primary btn-lg"
        style={{ opacity: selectedFile ? 1 : 0.5 }}
      >
        <Printer size={22} />
        <span>Instant Print</span>
      </button>
    </div>
  );
};
