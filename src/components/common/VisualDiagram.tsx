import React from 'react';
import { PhotoLayoutCount, Orientation } from '../../types/print';
import { PhotoEngine } from '../../services/photoEngine';

interface VisualDiagramProps {
  count: PhotoLayoutCount;
  orientation?: Orientation;
  selected?: boolean;
  onClick?: () => void;
  label?: string;
}

export const VisualDiagram: React.FC<VisualDiagramProps> = ({
  count,
  orientation = 'portrait',
  selected = false,
  onClick,
  label
}) => {
  const { cols, rows } = PhotoEngine.getGridDimensions(count, orientation);

  return (
    <div 
      onClick={onClick}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.4rem',
        cursor: 'pointer',
        padding: '0.5rem',
        borderRadius: 'var(--radius-md)',
        background: selected ? 'var(--color-surface-muted)' : 'transparent',
        border: selected ? '2px solid var(--color-wine-deep)' : '1px solid var(--color-border)',
        transition: 'all var(--transition-fast)'
      }}
    >
      {/* Page Sheet Outline */}
      <div style={{
        width: '56px',
        height: '76px',
        background: '#FFFFFF',
        borderRadius: '4px',
        border: '1px solid #D0C6C8',
        boxShadow: selected ? 'var(--shadow-md)' : 'var(--shadow-sm)',
        padding: '4px',
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        gap: '3px'
      }}>
        {Array.from({ length: cols * rows }).map((_, idx) => (
          <div
            key={idx}
            style={{
              background: selected ? 'var(--color-orange-warm)' : 'rgba(84, 24, 39, 0.25)',
              borderRadius: '2px',
              transition: 'background var(--transition-fast)'
            }}
          />
        ))}
      </div>

      <span style={{
        fontSize: '0.75rem',
        fontWeight: selected ? 700 : 500,
        color: selected ? 'var(--color-wine-deep)' : 'var(--color-text-muted)'
      }}>
        {label || `${count} per page`}
      </span>
    </div>
  );
};
