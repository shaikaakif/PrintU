import React, { useState } from 'react';
import { Settings as SettingsIcon, Printer, Palette, Cpu, Check, Sliders, RotateCcw } from 'lucide-react';
import { PrinterProfile, PaperSize, PrintQuality, ColorMode } from '../types/print';
import { PrinterSelector } from '../components/printers/PrinterSelector';
import { CustomSelect } from '../components/common/CustomSelect';
import { useDeviceDetect } from '../hooks/useDeviceDetect';

interface SettingsProps {
  printers: PrinterProfile[];
  onUpdatePrinters: (printers: PrinterProfile[]) => void;
  theme: 'light' | 'dark' | 'system';
  onChangeTheme: (theme: 'light' | 'dark' | 'system') => void;
}

export const SettingsPage: React.FC<SettingsProps> = ({
  printers,
  onUpdatePrinters,
  theme,
  onChangeTheme
}) => {
  const { isMobile } = useDeviceDetect();
  const [selectedPrinterId, setSelectedPrinterId] = useState<string>(printers[0]?.id || 'printer-canon-ts');

  const selectedPrinter = printers.find(p => p.id === selectedPrinterId);

  const handleUpdateSelectedPrinter = (updatedFields: Partial<PrinterProfile>) => {
    const updatedPrinters = printers.map(p =>
      p.id === selectedPrinterId ? { ...p, ...updatedFields } : p
    );
    onUpdatePrinters(updatedPrinters);
  };

  const feedOrientationOptions = [
    { value: 'top-first', label: 'Top edge feeds first' },
    { value: 'bottom-first', label: 'Bottom edge feeds first' },
  ];

  const printedSideOptions = [
    { value: 'face-up', label: 'Printed side faces UP' },
    { value: 'face-down', label: 'Printed side faces DOWN' },
  ];

  return (
    <div style={{
      maxWidth: '800px',
      margin: '0 auto',
      width: '100%',
      padding: isMobile ? '1rem 1rem 5rem 1rem' : '2.5rem 2rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '2rem'
    }}>
      {/* Header */}
      <div>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <SettingsIcon size={24} color="var(--color-wine-deep)" />
          <span>PrintU Settings</span>
        </h2>
        <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
          Manage your connected printers, manual duplex calibration, and display preferences
        </p>
      </div>

      {/* Printer Management Section */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <PrinterSelector
          printers={printers}
          selectedPrinterId={selectedPrinterId}
          onSelectPrinter={setSelectedPrinterId}
        />

        {/* Selected Printer Feed Calibration for Manual Duplex */}
        {selectedPrinter && (
          <div style={{
            borderTop: '1px solid var(--color-border)',
            paddingTop: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.85rem'
          }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sliders size={18} color="var(--color-orange-warm)" />
              <span>Manual Duplex Paper Feed Calibration</span>
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '0.75rem' }}>
              <CustomSelect
                label="Paper Tray Feed Direction"
                options={feedOrientationOptions}
                value={selectedPrinter.feedOrientation}
                onChange={val => handleUpdateSelectedPrinter({ feedOrientation: val as any })}
              />

              <CustomSelect
                label="Output Tray Side"
                options={printedSideOptions}
                value={selectedPrinter.printedSide}
                onChange={val => handleUpdateSelectedPrinter({ printedSide: val as any })}
              />
            </div>
          </div>
        )}
      </div>

      {/* Appearance & Theme Section */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Palette size={20} color="var(--color-wine-deep)" />
          <span>Appearance & Theme</span>
        </h3>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {(['light', 'dark', 'system'] as const).map(mode => (
            <button
              key={mode}
              onClick={() => onChangeTheme(mode)}
              className={`btn ${theme === mode ? 'btn-primary' : 'btn-secondary'}`}
              style={{ flex: 1, textTransform: 'capitalize' }}
            >
              {mode} Theme
            </button>
          ))}
        </div>
      </div>

      {/* Bridge Diagnostics */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Cpu size={20} color="var(--color-wine-deep)" />
          <span>Local Print Pipeline Status</span>
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
          PrintU runs 100% on client-side frontend infrastructure. Uses native browser print engine and client-side PDF export fallback without storing files remotely.
        </p>
        <span style={{ fontSize: '0.8rem', color: 'var(--color-success)', fontWeight: 600 }}>
          ✓ Standalone Web PWA Active & Vercel Ready
        </span>
      </div>
    </div>
  );
};
