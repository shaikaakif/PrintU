import React from 'react';

interface PaperAnimationProps {
  statusText?: string;
  subText?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const PaperAnimation: React.FC<PaperAnimationProps> = ({
  statusText = 'Preparing print layout...',
  subText = 'Aligning pages and colors',
  size = 'md'
}) => {
  const containerHeight = size === 'sm' ? '120px' : size === 'lg' ? '240px' : '180px';
  const paperWidth = size === 'sm' ? '70px' : size === 'lg' ? '140px' : '100px';
  const paperHeight = size === 'sm' ? '95px' : size === 'lg' ? '190px' : '135px';

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
      width: '100%'
    }}>
      {/* Animated Printer Tray & Floating Paper */}
      <div style={{
        position: 'relative',
        height: containerHeight,
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
      }}>
        {/* Glow */}
        <div style={{
          position: 'absolute',
          width: '120px',
          height: '120px',
          background: 'var(--color-orange-glow)',
          filter: 'blur(30px)',
          borderRadius: '50%',
          zIndex: 0
        }} />

        {/* Paper Sheet */}
        <div 
          className="animated-paper-sheet"
          style={{
            position: 'relative',
            width: paperWidth,
            height: paperHeight,
            background: '#FFFFFF',
            borderRadius: '6px',
            boxShadow: '0 10px 25px rgba(61, 16, 29, 0.15)',
            border: '1px solid var(--color-border)',
            display: 'flex',
            flexDirection: 'column',
            padding: '10px',
            gap: '6px',
            zIndex: 2,
            animation: 'paperFloat 2.4s ease-in-out infinite'
          }}
        >
          {/* Header Line */}
          <div style={{ height: '6px', background: 'var(--color-wine-deep)', borderRadius: '3px', width: '40%' }} />
          {/* Content Lines */}
          <div style={{ height: '4px', background: 'var(--color-surface-muted)', borderRadius: '2px', width: '90%' }} />
          <div style={{ height: '4px', background: 'var(--color-surface-muted)', borderRadius: '2px', width: '75%' }} />
          <div style={{ height: '4px', background: 'var(--color-surface-muted)', borderRadius: '2px', width: '85%' }} />
          {/* Accent Box */}
          <div style={{
            marginTop: 'auto',
            height: '24px',
            background: 'rgba(242, 139, 69, 0.15)',
            borderRadius: '4px',
            border: '1px dashed var(--color-orange-warm)'
          }} />
        </div>
      </div>

      {/* Text Feedback */}
      {statusText && (
        <h4 style={{ fontSize: '1.05rem', marginTop: '0.75rem', fontWeight: 600, color: 'var(--color-text-main)' }}>
          {statusText}
        </h4>
      )}
      {subText && (
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>
          {subText}
        </p>
      )}

      {/* Keyframe Animation */}
      <style>{`
        @keyframes paperFloat {
          0% {
            transform: translateY(12px) scale(0.96);
            opacity: 0.8;
          }
          50% {
            transform: translateY(-8px) scale(1);
            opacity: 1;
            box-shadow: 0 16px 32px rgba(61, 16, 29, 0.2);
          }
          100% {
            transform: translateY(12px) scale(0.96);
            opacity: 0.8;
          }
        }
      `}</style>
    </div>
  );
};
