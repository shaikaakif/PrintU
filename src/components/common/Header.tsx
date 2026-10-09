import React, { useState, useEffect } from 'react';
import { Printer, Image, FileText, Zap, ListFilter, Settings, Download, Smartphone, Monitor } from 'lucide-react';
import { useDeviceDetect } from '../../hooks/useDeviceDetect';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  queuedJobsCount: number;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, queuedJobsCount }) => {
  const { device, isMobile } = useDeviceDetect();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(() => {
        setDeferredPrompt(null);
      });
    }
  };

  interface NavItem {
    id: string;
    label: string;
    icon: any;
    badge?: number;
  }

  const navItems: NavItem[] = [
    { id: 'home', label: 'Home', icon: Printer },
    { id: 'photos', label: 'Photos', icon: Image },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <header className="header-container" style={{
      background: 'var(--color-surface-white)',
      color: 'var(--color-text-main)',
      padding: isMobile ? '0.75rem 1rem' : '0.85rem 2rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottom: '1px solid var(--color-border)',
      boxShadow: 'var(--shadow-sm)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      {/* Brand Logo & Name */}
      <div 
        className="brand"
        onClick={() => setActiveTab('home')}
        style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}
      >
        <img 
          src="/PrintU.png" 
          alt="PrintU Logo" 
          style={{ width: '38px', height: '38px', borderRadius: '8px', objectFit: 'contain' }}
        />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1, color: 'var(--color-text-main)' }}>
            Print<span style={{ color: 'var(--color-brand-red)' }}>U</span>
          </span>
          <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', fontWeight: 500, marginTop: '2px' }}>
            Simple printing
          </span>
        </div>
      </div>

      {/* Desktop Navigation */}
      {!isMobile && (
        <nav style={{ display: 'flex', gap: '0.35rem' }}>
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`btn btn-sm ${isActive ? 'btn-primary' : 'btn-ghost'}`}
                style={{
                  color: isActive ? '#FFFFFF' : 'var(--color-text-muted)',
                  backgroundColor: isActive ? 'var(--color-brand-red)' : 'transparent',
                  padding: '0.5rem 0.9rem',
                  borderRadius: 'var(--radius-md)',
                  position: 'relative',
                  fontWeight: isActive ? 700 : 500
                }}
              >
                <Icon size={16} />
                <span>{item.label}</span>
                {item.badge !== undefined && (
                  <span style={{
                    background: '#FFFFFF',
                    color: 'var(--color-brand-red)',
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    padding: '2px 6px',
                    borderRadius: '999px',
                    marginLeft: '4px'
                  }}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      )}

      {/* Right Controls (Device Badge + PWA Install) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.35rem',
          background: 'var(--color-surface-muted)',
          border: '1px solid var(--color-border)',
          padding: '0.3rem 0.65rem',
          borderRadius: 'var(--radius-full)',
          fontSize: '0.75rem',
          color: 'var(--color-text-muted)',
          fontWeight: 600
        }}>
          {isMobile ? <Smartphone size={14} color="var(--color-brand-red)" /> : <Monitor size={14} color="var(--color-brand-red)" />}
          <span style={{ textTransform: 'capitalize' }}>{device}</span>
        </div>

        {deferredPrompt && (
          <button 
            onClick={handleInstallClick}
            className="btn btn-sm btn-primary"
            style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
          >
            <Download size={14} />
            <span>Install App</span>
          </button>
        )}
      </div>
    </header>
  );
};
