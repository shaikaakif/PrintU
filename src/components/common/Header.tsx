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

  const navItems = [
    { id: 'home', label: 'Home', icon: Printer },
    { id: 'photos', label: 'Photos', icon: Image },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'quick-print', label: 'Quick Print', icon: Zap },
    { id: 'queue', label: 'Queue', icon: ListFilter, badge: queuedJobsCount > 0 ? queuedJobsCount : undefined },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <header className="header-container" style={{
      background: 'var(--color-wine-dark)',
      color: '#FFFFFF',
      padding: isMobile ? '0.75rem 1rem' : '0.85rem 2rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      boxShadow: 'var(--shadow-md)',
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
          style={{ width: '36px', height: '36px', borderRadius: '8px', objectFit: 'contain' }}
        />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '1.35rem', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1 }}>
            Print<span style={{ color: 'var(--color-orange-warm)' }}>U</span>
          </span>
          <span style={{ fontSize: '0.68rem', color: 'rgba(255, 255, 255, 0.7)', fontWeight: 400 }}>
            Simple printing
          </span>
        </div>
      </div>

      {/* Desktop Navigation */}
      {!isMobile && (
        <nav style={{ display: 'flex', gap: '0.5rem' }}>
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`btn btn-sm ${isActive ? 'btn-primary' : 'btn-ghost'}`}
                style={{
                  color: isActive ? '#FFFFFF' : 'rgba(255, 255, 255, 0.85)',
                  backgroundColor: isActive ? 'var(--color-wine-deep)' : 'transparent',
                  padding: '0.5rem 0.9rem',
                  borderRadius: 'var(--radius-md)',
                  position: 'relative'
                }}
              >
                <Icon size={16} />
                <span>{item.label}</span>
                {item.badge !== undefined && (
                  <span style={{
                    background: 'var(--color-orange-warm)',
                    color: '#FFF',
                    fontSize: '0.7rem',
                    fontWeight: 700,
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
          background: 'rgba(255, 255, 255, 0.1)',
          padding: '0.3rem 0.65rem',
          borderRadius: 'var(--radius-full)',
          fontSize: '0.75rem',
          color: 'rgba(255, 255, 255, 0.9)'
        }}>
          {isMobile ? <Smartphone size={14} /> : <Monitor size={14} />}
          <span style={{ textTransform: 'capitalize' }}>{device}</span>
        </div>

        {deferredPrompt && (
          <button 
            onClick={handleInstallClick}
            className="btn btn-sm btn-orange"
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
