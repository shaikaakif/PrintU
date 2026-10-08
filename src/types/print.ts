export type JobType = 'photo' | 'document';
export type PaperSize = 'A4' | 'A5' | 'Letter' | '4x6' | '5x7';
export type Orientation = 'portrait' | 'landscape' | 'auto';
export type PhotoLayoutCount = 1 | 2 | 4 | 6 | 9;
export type FitMode = 'fit' | 'fill' | 'crop' | 'original';
export type PrintQuality = 'draft' | 'standard' | 'high' | 'max';
export type ColorMode = 'color' | 'grayscale';
export type DuplexMode = 'none' | 'auto' | 'manual';
export type FilterPreset = 'original' | 'natural' | 'vivid' | 'bw';
export type DeviceType = 'mobile' | 'tablet' | 'desktop';

export interface ImageAdjustment {
  brightness: number; // -100 to 100 (default 0)
  contrast: number;   // -100 to 100 (default 0)
  saturation: number; // -100 to 100 (default 0)
  sharpness: number;  // 0 to 100 (default 0)
  warmth: number;     // -100 to 100 (default 0)
  preset: FilterPreset;
}

export interface PhotoItem {
  id: string;
  name: string;
  dataUrl: string; // Base64 or Blob URL
  width: number;
  height: number;
  adjustments: ImageAdjustment;
}

export interface DocumentFile {
  id: string;
  name: string;
  size: number;
  type: string;
  dataUrl: string;
  pageCount: number;
  selectedPages: number[]; // e.g. [1, 2, 3] (1-indexed)
}

export interface PrinterProfile {
  id: string;
  name: string;
  model: string;
  connection: 'wifi' | 'usb' | 'network' | 'system';
  status: 'ready' | 'offline' | 'busy';
  isDefault?: boolean;
  supportsColor: boolean;
  supportsAutoDuplex: boolean;
  supportsBorderless: boolean;
  feedOrientation: 'top-first' | 'bottom-first';
  printedSide: 'face-up' | 'face-down';
  calibrated: boolean;
}

export interface PrintJob {
  id: string;
  title: string;
  type: JobType;
  photos: PhotoItem[];
  document?: DocumentFile;
  printerId: string;
  paperSize: PaperSize;
  orientation: Orientation;
  layoutCount: PhotoLayoutCount;
  fitMode: FitMode;
  quality: PrintQuality;
  colorMode: ColorMode;
  copies: number;
  collate: boolean;
  duplexMode: DuplexMode;
  manualDuplexStage?: 'side1' | 'side2' | 'complete';
  status: 'preparing' | 'ready' | 'sending' | 'printing' | 'waiting_flip' | 'completed' | 'failed' | 'cancelled';
  errorMessage?: string;
  createdAt: string;
}

export interface SavedPreset {
  id: string;
  name: string;
  description: string;
  iconName: string;
  paperSize: PaperSize;
  colorMode: ColorMode;
  quality: PrintQuality;
  copies: number;
  duplexMode: DuplexMode;
}

export interface RecentItem {
  id: string;
  title: string;
  type: JobType;
  date: string;
  itemCount: number;
  thumbnailUrl?: string;
  jobSnapshot: Partial<PrintJob>;
}
