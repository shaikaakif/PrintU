import React from 'react';
import { ListFilter, Printer, CheckCircle2, AlertTriangle, Download, RotateCcw, XCircle } from 'lucide-react';
import { PrintJob } from '../types/print';
import { useDeviceDetect } from '../hooks/useDeviceDetect';

interface QueueProps {
  jobs: PrintJob[];
  onRetryJob: (job: PrintJob) => void;
  onCancelJob: (jobId: string) => void;
  onExportPdf: (job: PrintJob) => void;
}

export const QueuePage: React.FC<QueueProps> = ({ jobs, onRetryJob, onCancelJob, onExportPdf }) => {
  const { isMobile } = useDeviceDetect();

  return (
    <div style={{
      maxWidth: '840px',
      margin: '0 auto',
      width: '100%',
      padding: isMobile ? '1rem 1rem 5rem 1rem' : '2.5rem 2rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ListFilter size={24} color="var(--color-wine-deep)" />
          <span>Print Queue & History</span>
        </h2>
        <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
          {jobs.length} Job{jobs.length !== 1 ? 's' : ''}
        </span>
      </div>

      {jobs.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
          <Printer size={40} color="var(--color-text-subtle)" style={{ marginBottom: '0.75rem' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>No print jobs in queue</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
            Submitted print jobs will appear here with live status updates.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {jobs.map(job => (
            <div
              key={job.id}
              className="card"
              style={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                alignItems: isMobile ? 'flex-start' : 'center',
                justifyContent: 'space-between',
                gap: '1rem',
                borderLeft: job.status === 'completed' 
                  ? '4px solid var(--color-success)' 
                  : job.status === 'failed' 
                  ? '4px solid var(--color-error)' 
                  : '4px solid var(--color-orange-warm)'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{job.title}</h4>
                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '999px',
                    textTransform: 'capitalize',
                    background: job.status === 'completed' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(242, 139, 69, 0.15)',
                    color: job.status === 'completed' ? 'var(--color-success)' : 'var(--color-wine-deep)'
                  }}>
                    {job.status.replace('_', ' ')}
                  </span>
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                  {job.paperSize} • {job.colorMode} • {job.copies} Cop{job.copies > 1 ? 'ies' : 'y'} • {new Date(job.createdAt).toLocaleTimeString()}
                </p>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '0.5rem', width: isMobile ? '100%' : 'auto' }}>
                <button
                  onClick={() => onExportPdf(job)}
                  className="btn btn-secondary btn-sm"
                  title="Download print-ready PDF file"
                  style={{ flex: isMobile ? 1 : 'initial' }}
                >
                  <Download size={14} />
                  <span>PDF</span>
                </button>

                {job.status === 'failed' ? (
                  <button
                    onClick={() => onRetryJob(job)}
                    className="btn btn-primary btn-sm"
                    style={{ flex: isMobile ? 1 : 'initial' }}
                  >
                    <RotateCcw size={14} />
                    <span>Retry</span>
                  </button>
                ) : job.status !== 'completed' ? (
                  <button
                    onClick={() => onCancelJob(job.id)}
                    className="btn btn-ghost btn-sm"
                    style={{ color: 'var(--color-error)', flex: isMobile ? 1 : 'initial' }}
                  >
                    <XCircle size={14} />
                    <span>Cancel</span>
                  </button>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
