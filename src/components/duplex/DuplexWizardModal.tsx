import React, { useState } from 'react';
import { RotateCw, ArrowDown, Check, X, Info } from 'lucide-react';
import { PrinterProfile } from '../../types/print';
import { DuplexCalculator, DuplexInstruction } from '../../services/duplexCalculator';

interface DuplexWizardModalProps {
  totalPages: number;
  selectedPages?: number[];
  printer: PrinterProfile;
  onConfirmFlipped: () => void;
  onCancel: () => void;
}

export const DuplexWizardModal: React.FC<DuplexWizardModalProps> = ({
  totalPages,
  selectedPages,
  printer,
  onConfirmFlipped,
  onCancel
}) => {
  const [hasConfirmedCheckbox, setHasConfirmedCheckbox] = useState<boolean>(false);
  const pagesInput = selectedPages && selectedPages.length > 0 ? selectedPages : totalPages;
  const plan: DuplexInstruction = DuplexCalculator.calculateDuplexPlan(pagesInput, printer);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(26, 18, 20, 0.92)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      padding: '1.25rem'
    }}>
      <div style={{
        background: 'var(--color-surface-white)',
        borderRadius: 'var(--radius-lg)',
        width: '100%',
        maxWidth: '520px',
        boxShadow: 'var(--shadow-lg)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header Bar */}
        <div style={{
          background: 'var(--color-wine-dark)',
          color: '#FFF',
          padding: '1.25rem',
          textAlign: 'center'
        }}>
          <span style={{ fontSize: '0.75rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-orange-warm)', fontWeight: 700 }}>
            Side 1 (Odd Pages: {plan.side1Pages.join(', ') || 'None'}) Printed
          </span>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: '0.2rem', color: '#FFF' }}>
            Flip Paper & Re-insert Tray
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.75)', marginTop: '0.25rem' }}>
            {plan.side2Pages.length > 0
              ? `Next step: Print Side 2 (Even Pages: ${plan.side2Pages.join(', ')})`
              : 'Manual duplex setup complete'}
          </p>
        </div>

        {/* Paper Animation & Physical Guide */}
        <div style={{
          background: '#FAF5F6',
          padding: '2rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.25rem'
        }}>
          {/* Animated 3D Paper Flip Diagram */}
          <div style={{
            position: 'relative',
            width: '130px',
            height: '175px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            perspective: '800px'
          }}>
            <div 
              style={{
                width: '110px',
                height: '150px',
                background: '#FFFFFF',
                borderRadius: '6px',
                border: '2px solid var(--color-wine-deep)',
                boxShadow: 'var(--shadow-md)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                animation: 'duplex3dFlip 3s ease-in-out infinite',
                transformStyle: 'preserve-3d'
              }}
            >
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-wine-deep)' }}>
                SIDE 1
              </span>
              <span style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                (Printed)
              </span>
              <RotateCw size={24} color="var(--color-orange-warm)" style={{ marginTop: '10px' }} />
            </div>
          </div>

          {/* Printer Feed Instruction Card */}
          <div style={{
            background: 'var(--color-surface-white)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.75rem',
            width: '100%'
          }}>
            <Info size={20} color="var(--color-wine-deep)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700 }}>{printer.name} Feed Guide</h4>
              <p style={{ fontSize: '0.83rem', color: 'var(--color-text-muted)', marginTop: '0.2rem', lineHeight: 1.4 }}>
                {plan.feedInstructionText}
              </p>
            </div>
          </div>

          {/* Explicit User Confirmation Checkbox */}
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            cursor: 'pointer',
            fontSize: '0.9rem',
            fontWeight: 600,
            marginTop: '0.5rem',
            userSelect: 'none'
          }}>
            <input
              type="checkbox"
              checked={hasConfirmedCheckbox}
              onChange={e => setHasConfirmedCheckbox(e.target.checked)}
              style={{ width: '18px', height: '18px', accentColor: 'var(--color-wine-deep)' }}
            />
            <span>I have flipped the paper into the tray</span>
          </label>
        </div>

        {/* Footer Controls */}
        <div style={{
          padding: '1rem 1.25rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTop: '1px solid var(--color-border)'
        }}>
          <button onClick={onCancel} className="btn btn-ghost btn-sm">
            <X size={16} />
            <span>Cancel Job</span>
          </button>
          <button
            disabled={!hasConfirmedCheckbox}
            onClick={onConfirmFlipped}
            className="btn btn-primary btn-md"
            style={{ opacity: hasConfirmedCheckbox ? 1 : 0.5 }}
          >
            <Check size={18} />
            <span>Print Side 2 (Even Pages: {plan.side2Pages.join(', ')})</span>
          </button>
        </div>
      </div>

      {/* Keyframe Animation for Duplex Flip */}
      <style>{`
        @keyframes duplex3dFlip {
          0% {
            transform: rotateY(0deg);
          }
          50% {
            transform: rotateY(180deg) scale(1.05);
          }
          100% {
            transform: rotateY(360deg);
          }
        }
      `}</style>
    </div>
  );
};
