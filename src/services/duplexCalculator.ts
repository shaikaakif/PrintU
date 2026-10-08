import { PrinterProfile } from '../types/print';

export interface DuplexInstruction {
  side1Pages: number[];
  side2Pages: number[];
  totalSheets: number;
  flipAngleDegrees: number; // 180 (flip long edge) or 90
  rotateDirection: 'flip-long-edge' | 'flip-short-edge';
  feedInstructionText: string;
}

export const DuplexCalculator = {
  calculateDuplexPlan(
    totalPages: number,
    printer: PrinterProfile
  ): DuplexInstruction {
    const totalSheets = Math.ceil(totalPages / 2);
    
    // Side 1 (Odd pages): 1, 3, 5, 7...
    const side1Pages: number[] = [];
    for (let p = 1; p <= totalPages; p += 2) {
      side1Pages.push(p);
    }

    // Side 2 (Even pages): 2, 4, 6, 8...
    const side2Pages: number[] = [];
    for (let p = 2; p <= totalPages; p += 2) {
      side2Pages.push(p);
    }

    // If printer prints face-down, side 2 may be printed in reverse order so collation aligns
    if (printer.printedSide === 'face-down') {
      side2Pages.reverse();
    }

    const isTopFirst = printer.feedOrientation === 'top-first';
    const isFaceUp = printer.printedSide === 'face-up';

    let feedInstructionText = 'Take the printed paper stack, flip it long-edge over (top to bottom), and place it back into the paper tray without rotating.';

    if (isTopFirst && isFaceUp) {
      feedInstructionText = 'Pick up the printed stack. Turn it top-to-bottom so the blank side faces up, and insert top-edge first into tray.';
    } else if (!isTopFirst && isFaceUp) {
      feedInstructionText = 'Pick up the printed stack. Rotate 180° so the bottom-edge feeds first, blank side facing up.';
    } else if (printer.printedSide === 'face-down') {
      feedInstructionText = 'Pick up the stack without reordering sheets. Turn it face-up and place back into the tray.';
    }

    return {
      side1Pages,
      side2Pages,
      totalSheets,
      flipAngleDegrees: 180,
      rotateDirection: 'flip-long-edge',
      feedInstructionText,
    };
  }
};
