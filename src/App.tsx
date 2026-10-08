import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Header } from './components/common/Header';
import { MobileBottomBar } from './components/common/MobileBottomBar';
import { Home } from './pages/Home';
import { PhotosWorkflow } from './pages/PhotosWorkflow';
import { DocumentsWorkflow } from './pages/DocumentsWorkflow';
import { QuickPrint } from './pages/QuickPrint';
import { SettingsPage } from './pages/Settings';
import { QueuePage } from './pages/Queue';
import { DuplexWizardModal } from './components/duplex/DuplexWizardModal';
import { StorageService, DEFAULT_PRINTERS } from './services/storage';
import { PrintExecutor } from './services/printExecutor';
import { PrintJob, PrinterProfile, RecentItem } from './types/print';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [printers, setPrinters] = useState<PrinterProfile[]>([]);
  const [jobs, setJobs] = useState<PrintJob[]>([]);
  const [recents, setRecents] = useState<RecentItem[]>([]);
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');

  // Active Manual Duplex Job awaiting paper flip
  const [duplexActiveJob, setDuplexActiveJob] = useState<PrintJob | null>(null);

  // Load initial local data
  useEffect(() => {
    const loadedPrinters = StorageService.getPrinters();
    setPrinters(loadedPrinters);

    const loadedJobs = StorageService.getJobs();
    setJobs(loadedJobs);

    const loadedRecents = StorageService.getRecents();
    setRecents(loadedRecents);

    const prefs = StorageService.getPreferences();
    setTheme(prefs.theme);
  }, []);

  // Sync theme changes to HTML element
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else if (theme === 'light') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        document.documentElement.removeAttribute('data-theme');
      }
    }
  }, [theme]);

  const handleUpdatePrinters = (newPrinters: PrinterProfile[]) => {
    setPrinters(newPrinters);
    StorageService.savePrinters(newPrinters);
  };

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    const prefs = StorageService.getPreferences();
    StorageService.savePreferences({ ...prefs, theme: newTheme });
  };

  // Submit & Execute Print Job Pipeline
  const handleSubmitJob = async (job: PrintJob) => {
    const updatedJob: PrintJob = {
      ...job,
      status: 'printing'
    };

    StorageService.saveJob(updatedJob);
    setJobs(prev => [updatedJob, ...prev.filter(j => j.id !== updatedJob.id)]);

    // Record in Recent Items
    const recent: RecentItem = {
      id: `recent-${Date.now()}`,
      title: job.title,
      type: job.type,
      date: new Date().toLocaleDateString(),
      itemCount: job.type === 'photo' ? job.photos.length : job.document?.pageCount || 1,
      jobSnapshot: job
    };
    StorageService.addRecent(recent);
    setRecents(StorageService.getRecents());

    // Check if Manual Duplex is required (e.g. document > 1 page or duplex mode manual)
    const pageCount = job.type === 'photo' ? Math.ceil(job.photos.length / job.layoutCount) : job.document?.pageCount || 1;
    
    if (job.duplexMode === 'manual' && pageCount > 1) {
      // Trigger Manual Duplex Flip Wizard
      const waitingJob: PrintJob = {
        ...updatedJob,
        status: 'waiting_flip',
        manualDuplexStage: 'side1'
      };
      StorageService.saveJob(waitingJob);
      setJobs(prev => [waitingJob, ...prev.filter(j => j.id !== waitingJob.id)]);
      setDuplexActiveJob(waitingJob);
      return;
    }

    // Execute System Print
    PrintExecutor.triggerSystemPrint();

    // Mark Completed
    setTimeout(() => {
      const completedJob: PrintJob = {
        ...updatedJob,
        status: 'completed'
      };
      StorageService.saveJob(completedJob);
      setJobs(prev => [completedJob, ...prev.filter(j => j.id !== completedJob.id)]);

      // Confetti feedback
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 }
      });
    }, 1200);
  };

  // Confirm Manual Duplex Paper Flip (Continue Side 2)
  const handleConfirmDuplexFlipped = () => {
    if (!duplexActiveJob) return;

    // Trigger System Print for Side 2
    PrintExecutor.triggerSystemPrint();

    const completedJob: PrintJob = {
      ...duplexActiveJob,
      status: 'completed',
      manualDuplexStage: 'complete'
    };

    StorageService.saveJob(completedJob);
    setJobs(prev => [completedJob, ...prev.filter(j => j.id !== completedJob.id)]);
    setDuplexActiveJob(null);

    confetti({
      particleCount: 70,
      spread: 80,
      origin: { y: 0.7 }
    });
  };

  const handleExportPdf = (job: PrintJob) => {
    PrintExecutor.exportPdf(job);
  };

  const handleCancelJob = (jobId: string) => {
    setJobs(prev =>
      prev.map(j => (j.id === jobId ? { ...j, status: 'cancelled' } : j))
    );
  };

  return (
    <div className="app-shell" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        queuedJobsCount={jobs.filter(j => j.status === 'printing' || j.status === 'waiting_flip').length}
      />

      {/* Main Content Router View */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {activeTab === 'home' && (
          <Home
            onSelectFlow={flow => setActiveTab(flow)}
            recentItems={recents}
            onRePrintRecent={item => {
              if (item.jobSnapshot) {
                handleSubmitJob({ ...item.jobSnapshot, id: `job-${Date.now()}` } as PrintJob);
              }
            }}
          />
        )}

        {activeTab === 'photos' && (
          <PhotosWorkflow
            printers={printers}
            onBack={() => setActiveTab('home')}
            onSubmitJob={handleSubmitJob}
            onExportPdf={handleExportPdf}
          />
        )}

        {activeTab === 'documents' && (
          <DocumentsWorkflow
            printers={printers}
            onBack={() => setActiveTab('home')}
            onSubmitJob={handleSubmitJob}
            onExportPdf={handleExportPdf}
          />
        )}

        {activeTab === 'quick-print' && (
          <QuickPrint
            printers={printers}
            onBack={() => setActiveTab('home')}
            onSubmitJob={handleSubmitJob}
          />
        )}

        {activeTab === 'queue' && (
          <QueuePage
            jobs={jobs}
            onRetryJob={handleSubmitJob}
            onCancelJob={handleCancelJob}
            onExportPdf={handleExportPdf}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsPage
            printers={printers}
            onUpdatePrinters={handleUpdatePrinters}
            theme={theme}
            onChangeTheme={handleThemeChange}
          />
        )}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        queuedJobsCount={jobs.filter(j => j.status === 'printing' || j.status === 'waiting_flip').length}
      />

      {/* Manual Duplex Flipping Wizard Modal */}
      {duplexActiveJob && (
        <DuplexWizardModal
          totalPages={duplexActiveJob.type === 'photo' ? Math.ceil(duplexActiveJob.photos.length / duplexActiveJob.layoutCount) : duplexActiveJob.document?.pageCount || 1}
          printer={printers.find(p => p.id === duplexActiveJob.printerId) || DEFAULT_PRINTERS[0]}
          onConfirmFlipped={handleConfirmDuplexFlipped}
          onCancel={() => setDuplexActiveJob(null)}
        />
      )}
    </div>
  );
};

export default App;
