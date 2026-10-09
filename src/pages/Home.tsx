import React from 'react';
import { Image, FileText, ArrowRight, Printer } from 'lucide-react';
import { RecentItem } from '../types/print';
import { useDeviceDetect } from '../hooks/useDeviceDetect';

interface HomeProps {
  onSelectFlow: (flow: 'photos' | 'documents') => void;
  recentItems?: RecentItem[];
  onRePrintRecent?: (item: RecentItem) => void;
}

export const Home: React.FC<HomeProps> = ({ onSelectFlow }) => {
  const { isMobile } = useDeviceDetect();

  return (
    <div style={{
      maxWidth: '900px',
      margin: '0 auto',
      width: '100%',
      padding: isMobile ? '1.5rem 1rem 5rem 1rem' : '3.5rem 2rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '2.5rem'
    }}>
      {/* Ultra Clean Hero Header */}
      <div style={{ textAlign: 'center', maxWidth: '540px', margin: '0 auto' }}>
        <h1 style={{
          fontSize: isMobile ? '2.1rem' : '3rem',
          fontWeight: 800,
          letterSpacing: '-0.03em',
          lineHeight: 1.1,
          color: 'var(--color-text-main)'
        }}>
          Simple Printing.<br />
          <span style={{ color: 'var(--color-brand-red)' }}>Properly Designed.</span>
        </h1>
        <p style={{
          fontSize: isMobile ? '0.95rem' : '1.1rem',
          color: 'var(--color-text-muted)',
          marginTop: '0.85rem',
          fontWeight: 500
        }}>
          Select your files and print directly to your wireless printer.
        </p>
      </div>

      {/* Primary Action Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
        gap: '1.5rem'
      }}>
        {/* Photos Card */}
        <div
          onClick={() => onSelectFlow('photos')}
          className="card card-interactive glass-card"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
            padding: '2rem',
            cursor: 'pointer',
            transition: 'all 200ms cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            background: 'rgba(198, 40, 40, 0.1)',
            color: 'var(--color-brand-red)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Image size={28} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-text-main)' }}>Photos</h3>
            <p style={{ fontSize: '0.92rem', color: 'var(--color-text-muted)', marginTop: '0.35rem', lineHeight: 1.4 }}>
              Print photo sheets, 4×6" prints, multi-photo layouts & color filters.
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-brand-red)', fontWeight: 700, marginTop: 'auto' }}>
            <span>Start Photo Print</span>
            <ArrowRight size={18} />
          </div>
        </div>

        {/* Documents Card */}
        <div
          onClick={() => onSelectFlow('documents')}
          className="card card-interactive glass-card"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
            padding: '2rem',
            cursor: 'pointer',
            transition: 'all 200ms cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            background: 'rgba(242, 139, 69, 0.12)',
            color: 'var(--color-orange-warm)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <FileText size={28} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-text-main)' }}>Documents</h3>
            <p style={{ fontSize: '0.92rem', color: 'var(--color-text-muted)', marginTop: '0.35rem', lineHeight: 1.4 }}>
              Upload PDF files, select page ranges, and preview before sending.
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-orange-warm)', fontWeight: 700, marginTop: 'auto' }}>
            <span>Start Document Print</span>
            <ArrowRight size={18} />
          </div>
        </div>
      </div>
    </div>
  );
};

