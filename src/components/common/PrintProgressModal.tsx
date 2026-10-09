import React from 'react';
import { Printer, Loader2, CheckCircle2, AlertTriangle, Wifi, FileText } from 'lucide-react';

export type PrintStep = 'idle' | 'rendering' | 'connecting' | 'printing' | 'success' | 'fallback';

interface PrintProgressModalProps {
  step: PrintStep;
  message: string;
  printerName?: string;
  onClose?: () => void;
}

export const PrintProgressModal: React.FC<PrintProgressModalProps> = ({
  step,
  message,
  printerName = 'Canon TS3370s',
  onClose
}) => {
  if (step === 'idle') return null;

  const isSuccess = step === 'success';
  const isFallback = step === 'fallback';

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '1.25rem',
      animation: 'fadeIn 200ms ease'
    }}>
      <div style={{
        background: '#FFFFFF',
        borderRadius: '24px',
        padding: '2rem 1.75rem',
        maxWidth: '420px',
        width: '100%',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: '1.25rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Animated Icon Ring */}
        <div style={{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          background: isSuccess 
            ? 'rgba(16, 185, 129, 0.12)' 
            : isFallback 
              ? 'rgba(245, 158, 11, 0.12)' 
              : 'rgba(198, 40, 40, 0.1)',
          color: isSuccess 
            ? '#10B981' 
            : isFallback 
              ? '#F59E0B' 
              : 'var(--color-brand-red)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative'
        }}>
          {isSuccess ? (
            <CheckCircle2 size={38} className="animate-bounce" />
          ) : isFallback ? (
            <AlertTriangle size={36} />
          ) : (
            <>
              <Printer size={34} />
              <Loader2 
                size={72} 
                className="animate-spin" 
                style={{ 
                  position: 'absolute', 
                  inset: 0, 
                  opacity: 0.6,
                  color: 'var(--color-brand-red)' 
                }} 
              />
            </>
          )}
        </div>

        {/* Title & Status Message */}
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A' }}>
            {isSuccess 
              ? 'Print Job Sent Successfully!' 
              : isFallback 
                ? 'Opening System Print Engine' 
                : 'Processing Print Job'}
          </h3>
          <p style={{ fontSize: '0.9rem', color: '#475569', marginTop: '0.35rem', lineHeight: 1.4 }}>
            {message || 'Communicating with printer hardware...'}
          </p>
        </div>

        {/* Real-Time Progress Steps Indicator */}
        {!isSuccess && !isFallback && (
          <div style={{
            width: '100%',
            background: '#F8FAFC',
            padding: '0.85rem 1rem',
            borderRadius: '12px',
            border: '1px solid #E2E8F0',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            fontSize: '0.8rem',
            textAlign: 'left'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: step === 'rendering' ? 'var(--color-brand-red)' : '#10B981', fontWeight: 600 }}>
              {step === 'rendering' ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
              <span>1. Preparing & Rendering Document Pages</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: step === 'connecting' ? 'var(--color-brand-red)' : step === 'printing' ? '#10B981' : '#94A3B8', fontWeight: 600 }}>
              {step === 'connecting' ? <Loader2 size={14} className="animate-spin" /> : step === 'printing' ? <CheckCircle2 size={14} /> : <Wifi size={14} />}
              <span>2. Connecting to Printer Bridge ({printerName})</span>
            </div>
          </div>
        )}

        {/* Target Printer Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          background: 'rgba(198, 40, 40, 0.08)',
          padding: '4px 12px',
          borderRadius: '999px',
          fontSize: '0.78rem',
          fontWeight: 700,
          color: 'var(--color-brand-red)'
        }}>
          <Wifi size={13} />
          <span>Target: {printerName}</span>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.96); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};
