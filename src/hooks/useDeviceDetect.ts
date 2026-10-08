import { useState, useEffect } from 'react';
import { DeviceType } from '../types/print';

export function useDeviceDetect(): { device: DeviceType; isMobile: boolean; isTablet: boolean; isDesktop: boolean; width: number } {
  const [windowWidth, setWindowWidth] = useState<number>(typeof window !== 'undefined' ? window.innerWidth : 1200);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  let device: DeviceType = 'desktop';
  if (windowWidth < 640) {
    device = 'mobile';
  } else if (windowWidth <= 1024) {
    device = 'tablet';
  } else {
    device = 'desktop';
  }

  return {
    device,
    isMobile: device === 'mobile',
    isTablet: device === 'tablet',
    isDesktop: device === 'desktop',
    width: windowWidth,
  };
}
