import { PrintJob } from '../types/print';
import { PrintExecutor } from './printExecutor';

export interface CompiledBinaryPayload {
  jobId: string;
  title: string;
  totalSize: number;
  pagesCount: number;
  mimeType: string;
  formData: FormData;
}

export const BinaryEncoder = {
  // Converts Canvas data URLs into raw binary Blobs
  dataUrlToBlob(dataUrl: string): Blob {
    const arr = dataUrl.split(',');
    const mimeMatch = arr[0].match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : 'image/png';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  },

  // Compiles print job into clean multipart binary FormData payload
  async compileJobToBinaryPayload(job: PrintJob): Promise<CompiledBinaryPayload> {
    const pageDataUrls = await PrintExecutor.renderJobPagesToDataUrls(job);
    const formData = new FormData();

    let totalSize = 0;
    pageDataUrls.forEach((dataUrl, idx) => {
      const blob = this.dataUrlToBlob(dataUrl);
      totalSize += blob.size;
      formData.append(`page_${idx + 1}`, blob, `page_${idx + 1}.png`);
    });

    formData.append('jobId', job.id);
    formData.append('title', job.title);
    formData.append('paperSize', job.paperSize);
    formData.append('copies', String(job.copies));
    formData.append('colorMode', job.colorMode);
    formData.append('quality', job.quality);

    return {
      jobId: job.id,
      title: job.title,
      totalSize,
      pagesCount: pageDataUrls.length,
      mimeType: 'multipart/form-data',
      formData,
    };
  }
};
