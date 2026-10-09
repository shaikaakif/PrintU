import React, { useState, useEffect } from 'react';
import { Printer, Loader2, CheckCircle2, AlertTriangle, Wifi, Sparkles, XCircle, RefreshCw } from 'lucide-react';

export type PrintStep = 'idle' | 'rendering' | 'connecting' | 'printing' | 'success' | 'fallback' | 'error';

interface PrintProgressModalProps {
  step: PrintStep;
  message: string;
  printerName?: string;
  onClose?: () => void;
}

// Animated Dot Ellipsis Component (. -> .. -> ...)
const AnimatedDots: React.FC = () => {
  const [dotCount, setDotCount] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setDotCount((prev) => (prev >= 3 ? 1 : prev + 1));
    }, 320);
    return () => clearInterval(interval);
  }, []);

  return (
    <span style={{ display: 'inline-block', width: '20px', textAlign: 'left', fontWeight: 700 }}>
      {'.'.repeat(dotCount)}
    </span>
  );
};

export const PrintProgressModal: React.FC<PrintProgressModalProps> = ({
  step,
  message,
  printerName = 'Canon TS3370s',
  onClose
}) => {
  if (step === 'idle') return null;

  const isSuccess = step === 'success';
  const isFallback = step === 'fallback';
  const isError = step === 'error';

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(11, 17, 32, 0.82)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '1.25rem',
      animation: 'fadeInModal 220ms ease-out'
    }}>
      <div style={{
        background: 'linear-gradient(145deg, #FFFFFF 0%, #F8FAFC 100%)',
        borderRadius: '28px',
        padding: '2.25rem 2rem',
        maxWidth: '430px',
        width: '100%',
        boxShadow: '0 30px 60px -15px rgba(0, 0, 0, 0.35), 0 0 40px rgba(220, 38, 38, 0.12)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: '1.25rem',
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid rgba(226, 232, 240, 0.8)'
      }}>

        {/* Breathing Glow Outer Ring */}
        <div style={{
          position: 'relative',
          width: '84px',
          height: '84px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {/* Pulsing Aura */}
          <div style={{
            position: 'absolute',
            inset: -6,
            borderRadius: '50%',
            background: isSuccess
              ? 'radial-gradient(circle, rgba(16, 185, 129, 0.35) 0%, rgba(16, 185, 129, 0) 70%)'
              : isError
                ? 'radial-gradient(circle, rgba(239, 68, 68, 0.4) 0%, rgba(239, 68, 68, 0) 70%)'
                : 'radial-gradient(circle, rgba(220, 38, 38, 0.4) 0%, rgba(220, 38, 38, 0) 70%)',
            animation: 'breathingPulse 1.8s infinite ease-in-out'
          }} />

          {/* Central Icon Circle */}
          <div style={{
            width: '76px',
            height: '76px',
            borderRadius: '50%',
            background: isSuccess
              ? 'linear-gradient(135deg, #10B981, #059669)'
              : isError
                ? 'linear-gradient(135deg, #EF4444, #B91C1C)'
                : 'linear-gradient(135deg, #EF4444, #DC2626)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: isSuccess
              ? '0 10px 25px rgba(16, 185, 129, 0.4)'
              : isError
                ? '0 10px 25px rgba(239, 68, 68, 0.4)'
                : '0 10px 25px rgba(220, 38, 38, 0.4)',
            zIndex: 2,
            position: 'relative',
            animation: !isSuccess && !isError ? 'printerBreathing 1.5s infinite ease-in-out' : 'none'
          }}>
            {isSuccess ? (
              <CheckCircle2 size={42} style={{ animation: 'popIn 300ms cubic-bezier(0.175, 0.885, 0.32, 1.275)' }} />
            ) : isError ? (
              <XCircle size={42} style={{ animation: 'popIn 300ms cubic-bezier(0.175, 0.885, 0.32, 1.275)' }} />
            ) : (
              <>
                <Printer size={36} />
                <Loader2
                  size={84}
                  style={{
                    position: 'absolute',
                    inset: -4,
                    opacity: 0.7,
                    color: 'rgba(255, 255, 255, 0.95)',
                    animation: 'spinFast 800ms linear infinite'
                  }}
                />
              </>
            )}
          </div>
        </div>

        {/* Dynamic Title with Animated Ellipsis */}
        <div>
          <h3 style={{
            fontSize: '1.35rem',
            fontWeight: 800,
            color: isError ? '#991B1B' : '#0F172A',
            letterSpacing: '-0.02em',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px'
          }}>
            <span>
              {isSuccess
                ? 'Print Job Sent!'
                : isError
                  ? 'Silent Print Failed'
                  : 'Processing Silent Print'}
            </span>
            {!isSuccess && !isError && <AnimatedDots />}
          </h3>

          {/* Subtitle / Status Message */}
          <p style={{
            fontSize: '0.92rem',
            color: isError ? '#7F1D1D' : '#475569',
            marginTop: '0.4rem',
            lineHeight: 1.45,
            fontWeight: 500,
            animation: 'fadeInText 300ms ease'
          }}>
            {message || 'Formatting high-resolution pages for printer...'}
          </p>
        </div>

        {/* Real-Time Step Progress Card */}
        {!isSuccess && !isError && (
          <div style={{
            width: '100%',
            background: 'rgba(248, 250, 252, 0.9)',
            padding: '1rem 1.15rem',
            borderRadius: '16px',
            border: '1px solid #E2E8F0',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.65rem',
            fontSize: '0.84rem',
            textAlign: 'left',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)'
          }}>
            {/* Animated Laser Scanner Sweep Line */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              height: '3px',
              width: '40%',
              background: 'linear-gradient(90deg, transparent, #EF4444, #DC2626, transparent)',
              animation: 'laserScan 1.2s infinite ease-in-out',
              borderRadius: '999px',
              boxShadow: '0 0 8px #EF4444'
            }} />

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              color: step === 'rendering' ? '#DC2626' : '#10B981',
              fontWeight: 700
            }}>
              {step === 'rendering' ? (
                <Loader2 size={16} style={{ animation: 'spinFast 600ms linear infinite' }} />
              ) : (
                <CheckCircle2 size={16} />
              )}
              <span>1. Preparing Document Layout</span>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              color: step === 'connecting' || step === 'printing' ? '#DC2626' : '#94A3B8',
              fontWeight: 700
            }}>
              {step === 'connecting' || step === 'printing' ? (
                <Loader2 size={16} style={{ animation: 'spinFast 600ms linear infinite' }} />
              ) : (
                <Wifi size={16} />
              )}
              <span>2. Direct Silent Dispatch ({printerName})</span>
            </div>
          </div>
        )}

        {/* Error Dismiss / Retry Button */}
        {isError && onClose && (
          <button
            onClick={onClose}
            style={{
              width: '100%',
              padding: '0.75rem 1.25rem',
              borderRadius: '14px',
              background: '#DC2626',
              color: '#FFFFFF',
              border: 'none',
              fontWeight: 700,
              fontSize: '0.92rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(220, 38, 38, 0.3)',
              transition: 'transform 150ms ease'
            }}
          >
            <RefreshCw size={16} />
            <span>Close & Try Again</span>
          </button>
        )}

        {/* Target Printer Badge */}
        {!isError && (
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(239, 68, 68, 0.08)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            padding: '6px 14px',
            borderRadius: '999px',
            fontSize: '0.8rem',
            fontWeight: 700,
            color: '#DC2626',
            boxShadow: '0 2px 8px rgba(220, 38, 38, 0.08)'
          }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#DC2626',
              animation: 'breathingDot 1.2s infinite ease-in-out'
            }} />
            <Sparkles size={13} />
            <span>Printer: {printerName}</span>
          </div>
        )}
      </div>

      {/* Embedded CSS Animations */}
      <style>{`
        @keyframes fadeInModal {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes breathingPulse {
          0%, 100% { transform: scale(0.92); opacity: 0.5; }
          50% { transform: scale(1.15); opacity: 0.95; }
        }
        @keyframes printerBreathing {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.06); }
        }
        @keyframes laserScan {
          0% { left: -40%; }
          50% { left: 100%; }
          100% { left: -40%; }
        }
        @keyframes spinFast {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes breathingDot {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        @keyframes popIn {
          0% { transform: scale(0.5); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes fadeInText {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};
