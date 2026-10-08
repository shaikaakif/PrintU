import React from 'react';
import { Printer, Image, FileText, Zap, ListFilter, Settings } from 'lucide-react';
import { useDeviceDetect } from '../../hooks/useDeviceDetect';

interface MobileBottomBarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  queuedJobsCount: number;
}

export const MobileBottomBar: React.FC<MobileBottomBarProps> = ({ activeTab, setActiveTab, queuedJobsCount }) => {
  const { isMobile } = useDeviceDetect();

  if (!isMobile) return null;

  const items = [
    { id: 'home', label: 'Home', icon: Printer },
    { id: 'photos', label: 'Photos', icon: Image },
    { id: 'documents', label: 'Docs', icon: FileText },
    { id: 'quick-print', label: 'Quick', icon: Zap },
    { id: 'queue', label: 'Queue', icon: ListFilter, badge: queuedJobsCount > 0 ? queuedJobsCount : undefined },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      height: '62px',
      background: 'var(--color-wine-dark)',
      borderTop: '1px solid rgba(255, 255, 255, 0.1)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-around',
      zIndex: 200,
      boxShadow: '0 -4px 16px rgba(0,0,0,0.2)'
    }}>
      {items.map(item => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            style={{
              background: 'transparent',
              border: 'none',
              color: isActive ? 'var(--color-orange-warm)' : 'rgba(255, 255, 255, 0.65)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '2px',
              cursor: 'pointer',
              padding: '6px 4px',
              position: 'relative',
              flex: 1
            }}
          >
            <Icon size={20} />
            <span style={{ fontSize: '0.68rem', fontWeight: isActive ? 700 : 400 }}>{item.label}</span>
            {item.badge !== undefined && (
              <span style={{
                position: 'absolute',
                top: '2px',
                right: '18%',
                background: 'var(--color-orange-warm)',
                color: '#FFF',
                fontSize: '0.6rem',
                fontWeight: 700,
                width: '14px',
                height: '14px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {item.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
