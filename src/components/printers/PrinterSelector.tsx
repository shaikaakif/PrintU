import React from 'react';
import { Printer, Wifi, Cpu, Check, AlertCircle, Plus } from 'lucide-react';
import { PrinterProfile } from '../../types/print';

interface PrinterSelectorProps {
  printers: PrinterProfile[];
  selectedPrinterId: string;
  onSelectPrinter: (id: string) => void;
  onAddPrinter?: () => void;
}

export const PrinterSelector: React.FC<PrinterSelectorProps> = ({
  printers,
  selectedPrinterId,
  onSelectPrinter,
  onAddPrinter
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Your Connected Printers</h4>
        {onAddPrinter && (
          <button onClick={onAddPrinter} className="btn btn-ghost btn-sm" style={{ color: 'var(--color-wine-deep)' }}>
            <Plus size={16} />
            <span>Add Printer</span>
          </button>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
        {printers.map(printer => {
          const isSelected = printer.id === selectedPrinterId;
          return (
            <div
              key={printer.id}
              onClick={() => onSelectPrinter(printer.id)}
              className="card card-interactive"
              style={{
                padding: '0.85rem 1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderColor: isSelected ? 'var(--color-wine-deep)' : 'var(--color-border)',
                background: isSelected ? 'var(--color-surface-muted)' : 'var(--color-surface-white)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: 'var(--radius-sm)',
                  background: isSelected ? 'var(--color-wine-dark)' : 'var(--color-surface-muted)',
                  color: isSelected ? '#FFF' : 'var(--color-text-main)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Printer size={20} />
                </div>
                <div>
                  <h5 style={{ fontSize: '0.95rem', fontWeight: 700 }}>{printer.name}</h5>
                  <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                    {printer.model} • {printer.connection === 'wifi' ? 'Wi-Fi' : 'System'} • {printer.status}
                  </p>
                </div>
              </div>

              {isSelected && (
                <div style={{
                  background: 'var(--color-wine-deep)',
                  color: '#FFF',
                  borderRadius: '50%',
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Check size={16} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
