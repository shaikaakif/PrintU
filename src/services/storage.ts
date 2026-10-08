import { PrinterProfile, SavedPreset, RecentItem, PrintJob } from '../types/print';

const STORAGE_KEYS = {
  PREFERENCES: 'printu_user_prefs',
  PRINTERS: 'printu_printers',
  PRESETS: 'printu_presets',
  RECENTS: 'printu_recents',
  QUEUED_JOBS: 'printu_jobs',
};

// Default Built-in Printers
export const DEFAULT_PRINTERS: PrinterProfile[] = [
  {
    id: 'printer-system',
    name: 'System Default Printer',
    model: 'System Printer / PDF Service',
    connection: 'system',
    status: 'ready',
    isDefault: true,
    supportsColor: true,
    supportsAutoDuplex: true,
    supportsBorderless: true,
    feedOrientation: 'top-first',
    printedSide: 'face-up',
    calibrated: true,
  },
  {
    id: 'printer-canon-ts',
    name: 'Canon TS3370s',
    model: 'Canon PIXMA TS3300 Series',
    connection: 'wifi',
    status: 'ready',
    isDefault: false,
    supportsColor: true,
    supportsAutoDuplex: false, // Manual duplex signature printer!
    supportsBorderless: true,
    feedOrientation: 'top-first',
    printedSide: 'face-up',
    calibrated: true,
  },
  {
    id: 'printer-hp-deskjet',
    name: 'HP DeskJet 2700',
    model: 'HP DeskJet All-in-One',
    connection: 'wifi',
    status: 'ready',
    isDefault: false,
    supportsColor: true,
    supportsAutoDuplex: false,
    supportsBorderless: false,
    feedOrientation: 'top-first',
    printedSide: 'face-down',
    calibrated: false,
  },
];

// Default Saved Presets
export const DEFAULT_PRESETS: SavedPreset[] = [
  {
    id: 'preset-photo-sheet',
    name: 'Photo Sheet (4-up)',
    description: '4 high quality photos per A4 page',
    iconName: 'Grid',
    paperSize: 'A4',
    colorMode: 'color',
    quality: 'high',
    copies: 1,
    duplexMode: 'none',
  },
  {
    id: 'preset-school-doc',
    name: 'School / Office Document',
    description: 'A4, Double-sided, Standard quality',
    iconName: 'FileText',
    paperSize: 'A4',
    colorMode: 'color',
    quality: 'standard',
    copies: 1,
    duplexMode: 'manual',
  },
  {
    id: 'preset-bw-draft',
    name: 'B&W Fast Draft',
    description: 'Save ink with grayscale draft printing',
    iconName: 'Zap',
    paperSize: 'A4',
    colorMode: 'grayscale',
    quality: 'draft',
    copies: 1,
    duplexMode: 'none',
  },
  {
    id: 'preset-hq-photo',
    name: 'High Quality Photo (4x6")',
    description: 'Single 4x6" gloss photo print',
    iconName: 'Image',
    paperSize: '4x6',
    colorMode: 'color',
    quality: 'max',
    copies: 1,
    duplexMode: 'none',
  },
];

// Storage Service API
export const StorageService = {
  // Printers
  getPrinters(): PrinterProfile[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PRINTERS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.PRINTERS, JSON.stringify(DEFAULT_PRINTERS));
        return DEFAULT_PRINTERS;
      }
      return JSON.parse(data);
    } catch {
      return DEFAULT_PRINTERS;
    }
  },

  savePrinters(printers: PrinterProfile[]): void {
    localStorage.setItem(STORAGE_KEYS.PRINTERS, JSON.stringify(printers));
  },

  addPrinter(printer: PrinterProfile): void {
    const printers = this.getPrinters();
    printers.push(printer);
    this.savePrinters(printers);
  },

  // Presets
  getPresets(): SavedPreset[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PRESETS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.PRESETS, JSON.stringify(DEFAULT_PRESETS));
        return DEFAULT_PRESETS;
      }
      return JSON.parse(data);
    } catch {
      return DEFAULT_PRESETS;
    }
  },

  savePresets(presets: SavedPreset[]): void {
    localStorage.setItem(STORAGE_KEYS.PRESETS, JSON.stringify(presets));
  },

  // Recent Items
  getRecents(): RecentItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.RECENTS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  addRecent(item: RecentItem): void {
    const recents = this.getRecents();
    // Keep max 20 recent items
    const filtered = recents.filter(r => r.id !== item.id);
    const updated = [item, ...filtered].slice(0, 20);
    localStorage.setItem(STORAGE_KEYS.RECENTS, JSON.stringify(updated));
  },

  clearRecents(): void {
    localStorage.removeItem(STORAGE_KEYS.RECENTS);
  },

  // Print Queue
  getJobs(): PrintJob[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.QUEUED_JOBS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveJob(job: PrintJob): void {
    const jobs = this.getJobs();
    const index = jobs.findIndex(j => j.id === job.id);
    if (index >= 0) {
      jobs[index] = job;
    } else {
      jobs.unshift(job);
    }
    // Limit stored history to last 30 jobs
    localStorage.setItem(STORAGE_KEYS.QUEUED_JOBS, JSON.stringify(jobs.slice(0, 30)));
  },

  // User Preferences
  getPreferences(): { theme: 'light' | 'dark' | 'system'; defaultPrinterId: string } {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
      return data ? JSON.parse(data) : { theme: 'system', defaultPrinterId: 'printer-system' };
    } catch {
      return { theme: 'system', defaultPrinterId: 'printer-system' };
    }
  },

  savePreferences(prefs: { theme: 'light' | 'dark' | 'system'; defaultPrinterId: string }): void {
    localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(prefs));
  }
};
