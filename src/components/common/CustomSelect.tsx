import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export interface CustomSelectOption {
  value: string;
  label: string;
  sublabel?: string;
  icon?: React.ComponentType<any>;
}

export interface CustomSelectProps {
  options: CustomSelectOption[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  style?: React.CSSProperties;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  value,
  onChange,
  label,
  placeholder = 'Select an option...',
  disabled = false,
  style
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(opt => opt.value === value) || options[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%', ...style }}>
      {label && (
        <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-main)' }}>
          {label}
        </label>
      )}

      <div ref={containerRef} style={{ position: 'relative', width: '100%' }}>
        {/* Trigger Button */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => setIsOpen(prev => !prev)}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '8px',
            padding: '0.6rem 0.9rem',
            background: '#FFFFFF',
            border: isOpen 
              ? '2px solid var(--color-brand-red)' 
              : '1.5px solid #E2E8F0',
            borderRadius: '12px',
            boxShadow: isOpen 
              ? '0 0 0 3px rgba(198, 40, 40, 0.12)' 
              : '0 1px 2px rgba(0, 0, 0, 0.04)',
            cursor: disabled ? 'not-allowed' : 'pointer',
            opacity: disabled ? 0.6 : 1,
            transition: 'all 180ms ease',
            outline: 'none',
            textAlign: 'left'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
            {selectedOption?.icon && (
              <selectedOption.icon size={16} color="var(--color-brand-red)" />
            )}
            <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <span style={{ 
                fontSize: '0.92rem', 
                fontWeight: 600, 
                color: '#0F172A',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {selectedOption ? selectedOption.label : placeholder}
              </span>
              {selectedOption?.sublabel && (
                <span style={{ fontSize: '0.72rem', color: '#64748B' }}>
                  {selectedOption.sublabel}
                </span>
              )}
            </div>
          </div>

          <ChevronDown 
            size={18} 
            color="#64748B" 
            style={{ 
              transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', 
              transition: 'transform 200ms ease',
              flexShrink: 0
            }} 
          />
        </button>

        {/* Meta Floating Dropdown Menu */}
        {isOpen && (
          <div 
            style={{
              position: 'absolute',
              top: 'calc(100% + 6px)',
              left: 0,
              right: 0,
              background: 'rgba(255, 255, 255, 0.94)',
              backdropFilter: 'blur(20px) saturate(180%)',
              WebkitBackdropFilter: 'blur(20px) saturate(180%)',
              border: '1px solid rgba(226, 232, 240, 0.95)',
              borderRadius: '16px',
              boxShadow: '0 16px 40px -6px rgba(15, 23, 42, 0.16), 0 6px 16px -2px rgba(15, 23, 42, 0.08)',
              padding: '6px',
              zIndex: 9999,
              maxHeight: '240px',
              overflowY: 'auto',
              animation: 'menuSlideDown 150ms cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            {options.map(option => {
              const isSelected = option.value === value;
              const Icon = option.icon;
              return (
                <div
                  key={option.value}
                  onClick={() => handleSelect(option.value)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    background: isSelected ? 'rgba(198, 40, 40, 0.07)' : 'transparent',
                    color: isSelected ? 'var(--color-brand-red)' : '#0F172A',
                    fontWeight: isSelected ? 700 : 500,
                    fontSize: '0.88rem',
                    transition: 'background 120ms ease',
                    marginBottom: '2px'
                  }}
                  onMouseEnter={e => {
                    if (!isSelected) {
                      e.currentTarget.style.background = '#F8FAFC';
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isSelected) {
                      e.currentTarget.style.background = 'transparent';
                    }
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                    {Icon && <Icon size={16} color={isSelected ? 'var(--color-brand-red)' : '#64748B'} />}
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span>{option.label}</span>
                      {option.sublabel && (
                        <span style={{ fontSize: '0.72rem', color: isSelected ? 'var(--color-brand-red)' : '#64748B', opacity: 0.85 }}>
                          {option.sublabel}
                        </span>
                      )}
                    </div>
                  </div>

                  {isSelected && (
                    <Check size={16} color="var(--color-brand-red)" style={{ flexShrink: 0 }} />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <style>{`
        @keyframes menuSlideDown {
          from {
            opacity: 0;
            transform: translateY(-6px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
};
