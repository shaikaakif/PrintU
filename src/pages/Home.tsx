import React from 'react';
import { Image, FileText, Zap, Clock, ArrowRight, Printer } from 'lucide-react';
import { RecentItem } from '../types/print';
import { useDeviceDetect } from '../hooks/useDeviceDetect';

interface HomeProps {
  onSelectFlow: (flow: 'photos' | 'documents' | 'quick-print') => void;
  recentItems: RecentItem[];
  onRePrintRecent: (item: RecentItem) => void;
}

export const Home: React.FC<HomeProps> = ({ onSelectFlow, recentItems, onRePrintRecent }) => {
  const { isMobile } = useDeviceDetect();

  return (
    <div style={{
      maxWidth: '1000px',
      margin: '0 auto',
      width: '100%',
      padding: isMobile ? '1.25rem 1rem 5rem 1rem' : '2.5rem 2rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '2.5rem'
    }}>
      {/* Hero Header */}
      <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
        <span style={{
          fontSize: '0.8rem',
          fontWeight: 700,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: 'var(--color-orange-warm)'
        }}>
          PrintU Utility
        </span>
        <h1 style={{
          fontSize: isMobile ? '1.85rem' : '2.6rem',
          fontWeight: 800,
          marginTop: '0.3rem',
          lineHeight: 1.15
        }}>
          What would you like to print?
        </h1>
        <p style={{
          fontSize: isMobile ? '0.95rem' : '1.1rem',
          color: 'var(--color-text-muted)',
          marginTop: '0.5rem'
        }}>
          No printer jargon. Pick your file, choose a simple layout, and print.
        </p>
      </div>

      {/* Primary Action Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
        gap: '1.25rem'
      }}>
        {/* Photos Card */}
        <div
          onClick={() => onSelectFlow('photos')}
          className="card card-interactive"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            background: 'var(--color-surface-white)',
            border: '1px solid var(--color-border)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{
            width: '54px',
            height: '54px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(84, 24, 39, 0.08)',
            color: 'var(--color-wine-deep)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Image size={28} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700 }}>Photos</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>
              Pictures, family photo sheets (1, 2, 4, 6, 9 per page) & adjustments
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--color-wine-deep)', fontWeight: 600, marginTop: 'auto' }}>
            <span>Print Photos</span>
            <ArrowRight size={16} />
          </div>
        </div>

        {/* Documents Card */}
        <div
          onClick={() => onSelectFlow('documents')}
          className="card card-interactive"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            background: 'var(--color-surface-white)',
            border: '1px solid var(--color-border)'
          }}
        >
          <div style={{
            width: '54px',
            height: '54px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(242, 139, 69, 0.12)',
            color: 'var(--color-orange-warm)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <FileText size={28} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700 }}>Documents</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>
              PDFs, school & office files with manual duplex flipping guidance
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--color-orange-warm)', fontWeight: 600, marginTop: 'auto' }}>
            <span>Print Documents</span>
            <ArrowRight size={16} />
          </div>
        </div>

        {/* Quick Print Card */}
        <div
          onClick={() => onSelectFlow('quick-print')}
          className="card card-interactive"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            background: 'linear-gradient(135deg, var(--color-wine-dark) 0%, var(--color-wine-deep) 100%)',
            color: '#FFFFFF',
            border: 'none'
          }}
        >
          <div style={{
            width: '54px',
            height: '54px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(255, 255, 255, 0.15)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Zap size={28} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#FFFFFF' }}>Quick Print</h3>
            <p style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.8)', marginTop: '0.2rem' }}>
              Instant 1-click print using your saved default settings
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--color-orange-warm)', fontWeight: 600, marginTop: 'auto' }}>
            <span>Quick Start</span>
            <ArrowRight size={16} />
          </div>
        </div>
      </div>

      {/* Recent Items Shelf */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Clock size={20} color="var(--color-wine-deep)" />
            <span>Recent Prints</span>
          </h3>
          {recentItems.length > 0 && (
            <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
              {recentItems.length} saved
            </span>
          )}
        </div>

        {recentItems.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '2rem 1.5rem' }}>
            <p style={{ fontSize: '0.95rem', color: 'var(--color-text-muted)' }}>
              Your recent document and photo prints will appear here for fast re-printing.
            </p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1rem'
          }}>
            {recentItems.map(item => (
              <div
                key={item.id}
                onClick={() => onRePrintRecent(item)}
                className="card card-interactive"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: 'var(--radius-sm)',
                    background: item.type === 'photo' ? 'rgba(84, 24, 39, 0.08)' : 'rgba(242, 139, 69, 0.12)',
                    color: item.type === 'photo' ? 'var(--color-wine-deep)' : 'var(--color-orange-warm)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {item.type === 'photo' ? <Image size={20} /> : <FileText size={20} />}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>{item.title}</h4>
                    <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                      {item.itemCount} {item.type === 'photo' ? 'photos' : 'pages'} • {item.date}
                    </p>
                  </div>
                </div>
                <button className="btn btn-ghost btn-sm" style={{ padding: '6px' }}>
                  <Printer size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
