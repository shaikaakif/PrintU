import { PhotoItem, PhotoLayoutCount, PaperSize, Orientation, FitMode, ImageAdjustment } from '../types/print';

export interface CellRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const PAPER_DIMENSIONS_MM: Record<PaperSize, { width: number; height: number }> = {
  'A4': { width: 210, height: 297 },
  'A5': { width: 148, height: 210 },
  'Letter': { width: 215.9, height: 279.4 },
  '4x6': { width: 101.6, height: 152.4 },
  '5x7': { width: 127, height: 177.8 },
};

export const PhotoEngine = {
  // Returns grid columns & rows count for photo count per page
  getGridDimensions(count: PhotoLayoutCount, orientation: Orientation): { cols: number; rows: number } {
    const isLandscape = orientation === 'landscape';
    switch (count) {
      case 1:
        return { cols: 1, rows: 1 };
      case 2:
        return isLandscape ? { cols: 2, rows: 1 } : { cols: 1, rows: 2 };
      case 4:
        return { cols: 2, rows: 2 };
      case 6:
        return isLandscape ? { cols: 3, rows: 2 } : { cols: 2, rows: 3 };
      case 9:
        return { cols: 3, rows: 3 };
      default:
        return { cols: 1, rows: 1 };
    }
  },

  // Calculates exact layout cells for a page
  calculatePageCells(
    count: PhotoLayoutCount,
    paperSize: PaperSize,
    orientation: Orientation,
    marginMm: number = 10,
    containerWidth: number = 800
  ): { cells: CellRect[]; pageWidth: number; pageHeight: number } {
    const paper = PAPER_DIMENSIONS_MM[paperSize] || PAPER_DIMENSIONS_MM['A4'];
    let pageW = paper.width;
    let pageH = paper.height;

    if (orientation === 'landscape' || (orientation === 'auto' && pageW > pageH)) {
      if (pageW < pageH) {
        [pageW, pageH] = [pageH, pageW];
      }
    } else if (orientation === 'portrait') {
      if (pageW > pageH) {
        [pageW, pageH] = [pageH, pageW];
      }
    }

    const scale = containerWidth / pageW;
    const canvasW = containerWidth;
    const canvasH = pageH * scale;

    const marginPx = marginMm * scale;
    const gapPx = 8;

    const { cols, rows } = this.getGridDimensions(count, orientation);

    const availableWidth = canvasW - (marginPx * 2) - (gapPx * (cols - 1));
    const availableHeight = canvasH - (marginPx * 2) - (gapPx * (rows - 1));

    const cellW = availableWidth / cols;
    const cellH = availableHeight / rows;

    const cells: CellRect[] = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        cells.push({
          x: marginPx + c * (cellW + gapPx),
          y: marginPx + r * (cellH + gapPx),
          width: cellW,
          height: cellH,
        });
      }
    }

    return { cells, pageWidth: canvasW, pageHeight: canvasH };
  },

  // Generates canvas image filter string
  getCanvasFilterString(adjustments: ImageAdjustment): string {
    let { brightness, contrast, saturation, preset } = adjustments;

    // Apply preset baseline
    if (preset === 'vivid') {
      contrast += 15;
      saturation += 25;
    } else if (preset === 'natural') {
      brightness += 5;
      saturation -= 5;
    } else if (preset === 'bw') {
      saturation = -100;
    }

    const bVal = 100 + brightness;
    const cVal = 100 + contrast;
    const sVal = 100 + saturation;

    let filterStr = `brightness(${bVal}%) contrast(${cVal}%) saturate(${sVal}%)`;
    if (preset === 'bw') {
      filterStr += ` grayscale(100%)`;
    }
    return filterStr;
  },

  // Draws photo into target cell with specified fit mode
  drawPhotoInCell(
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement,
    cell: CellRect,
    fitMode: FitMode,
    adjustments: ImageAdjustment
  ): void {
    ctx.save();
    
    // Clip to cell boundary
    ctx.beginPath();
    ctx.rect(cell.x, cell.y, cell.width, cell.height);
    ctx.clip();

    // Background fill
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(cell.x, cell.y, cell.width, cell.height);

    // Filter
    ctx.filter = this.getCanvasFilterString(adjustments);

    const imgAspect = img.width / img.height;
    const cellAspect = cell.width / cell.height;

    let drawX = cell.x;
    let drawY = cell.y;
    let drawW = cell.width;
    let drawH = cell.height;

    if (fitMode === 'fill' || fitMode === 'crop') {
      if (imgAspect > cellAspect) {
        drawW = cell.height * imgAspect;
        drawX = cell.x - (drawW - cell.width) / 2;
      } else {
        drawH = cell.width / imgAspect;
        drawY = cell.y - (drawH - cell.height) / 2;
      }
    } else if (fitMode === 'fit' || fitMode === 'original') {
      if (imgAspect > cellAspect) {
        drawH = cell.width / imgAspect;
        drawY = cell.y + (cell.height - drawH) / 2;
      } else {
        drawW = cell.height * imgAspect;
        drawX = cell.x + (cell.width - drawW) / 2;
      }
    }

    ctx.drawImage(img, drawX, drawY, drawW, drawH);
    ctx.restore();

    // Subtle cell border
    ctx.strokeStyle = '#E0D6D8';
    ctx.lineWidth = 1;
    ctx.strokeRect(cell.x, cell.y, cell.width, cell.height);
  }
};
