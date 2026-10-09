import { PrintJob } from '../types/print';
import { PrintExecutor } from './printExecutor';

export interface DirectPrintResponse {
  success: boolean;
  message: string;
  jobId?: string;
}

export const PrinterBridge = {
  // Get stored Bridge URL (e.g., Cloudflare Tunnel URL or Local Bridge Endpoint)
  getBridgeUrl(): string {
    return localStorage.getItem('printu_bridge_url') || 'http://localhost:3001';
  },

  setBridgeUrl(url: string): void {
    localStorage.setItem('printu_bridge_url', url);
  },

  getPrinterIp(): string {
    return localStorage.getItem('printu_printer_ip') || '192.168.1.100';
  },

  setPrinterIp(ip: string): void {
    localStorage.setItem('printu_printer_ip', ip);
  },

  // Sends job directly to backend print API bypassing window.print()
  async sendDirectPrintJob(job: PrintJob): Promise<DirectPrintResponse> {
    const bridgeUrl = this.getBridgeUrl();
    const printerIp = this.getPrinterIp();

    try {
      // Generate high-resolution print pages as PNG/PDF data URLs
      const pageDataUrls = await PrintExecutor.renderJobPagesToDataUrls(job);

      const response = await fetch(`${bridgeUrl}/api/print`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobId: job.id,
          title: job.title,
          printerIp: printerIp,
          pages: pageDataUrls,
          paperSize: job.paperSize,
          copies: job.copies,
          colorMode: job.colorMode,
          quality: job.quality,
        }),
      });

      if (!response.ok) {
        throw new Error(`Printer bridge returned HTTP status ${response.status}`);
      }

      const result = await response.json();
      return {
        success: true,
        message: result.message || 'Job sent directly to printer via network bridge',
        jobId: job.id,
      };
    } catch (err: any) {
      console.warn('Direct network bridge offline or unreachable:', err);
      return {
        success: false,
        message: err.message || 'Direct network bridge unreachable',
      };
    }
  }
};
