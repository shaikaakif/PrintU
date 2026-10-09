import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { DocumentFile, PrintJob, PrinterProfile } from '../types/print';
import { DocumentShelf } from '../components/documents/DocumentShelf';
import { PrintPreviewCanvas } from '../components/preview/PrintPreviewCanvas';
import { PrintOptionsPanel } from '../components/preview/PrintOptionsPanel';
import { useDeviceDetect } from '../hooks/useDeviceDetect';

interface DocumentsWorkflowProps {
  printers: PrinterProfile[];
  onBack: () => void;
  onSubmitJob: (job: PrintJob) => void;
  onExportPdf: (job: PrintJob) => void;
}

export const DocumentsWorkflow: React.FC<DocumentsWorkflowProps> = ({
  printers,
  onBack,
  onSubmitJob,
  onExportPdf
}) => {
  const { isMobile, isDesktop } = useDeviceDetect();

  const [document, setDocument] = useState<DocumentFile | null>(null);
  const [job, setJob] = useState<PrintJob>({
    id: `job-${Date.now()}`,
    title: 'Document Print Job',
    type: 'document',
    photos: [],
    printerId: printers[0]?.id || 'printer-system',
    paperSize: 'A4',
    orientation: 'portrait',
    layoutCount: 1,
    fitMode: 'fit',
    quality: 'standard',
    colorMode: 'color',
    copies: 1,
    collate: true,
    duplexMode: 'manual', // Default to manual duplex for documents!
    status: 'preparing',
    createdAt: new Date().toISOString()
  });

  const handleSelectDocument = (doc: DocumentFile | null) => {
    setDocument(doc);
    setJob(prev => ({ ...prev, document: doc || undefined, title: doc ? doc.name : 'Document Print Job' }));
  };

  const handlePageRangeChange = (selectedPages: number[]) => {
    if (document) {
      const updatedDoc = { ...document, selectedPages };
      setDocument(updatedDoc);
      setJob(prev => ({ ...prev, document: updatedDoc }));
    }
  };

  const activeJob: PrintJob = {
    ...job,
    document: document || undefined
  };

  return (
    <div style={{
      maxWidth: '1280px',
      margin: '0 auto',
      width: '100%',
      padding: isMobile ? '1rem 1rem 5rem 1rem' : '2rem'
    }}>
      {/* Back Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <button onClick={onBack} className="btn btn-ghost btn-sm">
          <ArrowLeft size={18} />
          <span>Back</span>
        </button>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Document Print Workflow</h2>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: isDesktop ? '1fr 1fr' : '1fr',
        gap: '2rem'
      }}>
        {/* Left Column: PDF Import & Page Range Selector */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <DocumentShelf
            document={document}
            onSelectDocument={handleSelectDocument}
            onPageRangeChange={handlePageRangeChange}
          />
        </div>

        {/* Right Column: Live Paper Preview & Settings Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <PrintPreviewCanvas job={activeJob} />

          <PrintOptionsPanel
            job={activeJob}
            printers={printers}
            onChangeJob={updated => setJob(prev => ({ ...prev, ...updated }))}
            onStartPrint={() => onSubmitJob(activeJob)}
            onExportPdf={() => onExportPdf(activeJob)}
          />
        </div>
      </div>
    </div>
  );
};
