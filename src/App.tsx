import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Header } from './components/common/Header';
import { MobileBottomBar } from './components/common/MobileBottomBar';
import { PwaInstallBanner } from './components/common/PwaInstallBanner';
import { Home } from './pages/Home';
import { PhotosWorkflow } from './pages/PhotosWorkflow';
import { DocumentsWorkflow } from './pages/DocumentsWorkflow';
import { QuickPrint } from './pages/QuickPrint';
import { SettingsPage } from './pages/Settings';
import { QueuePage } from './pages/Queue';
import { DuplexWizardModal } from './components/duplex/DuplexWizardModal';
import { PrintProgressModal, PrintStep } from './components/common/PrintProgressModal';
import { StorageService, DEFAULT_PRINTERS } from './services/storage';
import { PrintExecutor } from './services/printExecutor';
import { PrinterBridge } from './services/printerBridge';
import { PrintJob, PrinterProfile, RecentItem } from './types/print';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [printers, setPrinters] = useState<PrinterProfile[]>([]);
  const [jobs, setJobs] = useState<PrintJob[]>([]);
  const [recents, setRecents] = useState<RecentItem[]>([]);
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('light');
  const [isPrinting, setIsPrinting] = useState<boolean>(false);
  const [printStep, setPrintStep] = useState<PrintStep>('idle');
  const [printMessage, setPrintMessage] = useState<string>('');

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
    setTheme(prefs.theme || 'light');
  }, []);

  // Sync theme changes to HTML element
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
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

  // Submit & Execute Direct Silent Print Job Pipeline
  const handleSubmitJob = async (job: PrintJob) => {
    setIsPrinting(true);
    setPrintStep('rendering');
    setPrintMessage('Preparing & rendering high-resolution print pages...');

    const updatedJob: PrintJob = {
      ...job,
      fitMode: job.fitMode || 'fit',
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
      jobSnapshot: updatedJob
    };
    StorageService.addRecent(recent);
    setRecents(StorageService.getRecents());

    const selectedPages = job.type === 'document' && job.document?.selectedPages
      ? job.document.selectedPages
      : Array.from({ length: job.type === 'photo' ? Math.ceil(job.photos.length / job.layoutCount) : job.document?.pageCount || 1 }, (_, i) => i + 1);

    // Lightning-fast delay for instant visual feedback
    await new Promise(r => setTimeout(r, 120));
    setPrintStep('connecting');
    setPrintMessage('Sending print payload to Canon TS3370s printer bridge...');

    // Manual Duplex Printing Flow (Side 1: Odd pages -> Flip Prompt -> Side 2: Even pages)
    if (job.duplexMode === 'manual') {
      const side1Pages = selectedPages.filter(p => p % 2 !== 0);
      const side2Pages = selectedPages.filter(p => p % 2 === 0);

      if (side1Pages.length > 0) {
        const bridgeResult = await PrinterBridge.sendDirectPrintJob(updatedJob, side1Pages);
        if (!bridgeResult.success) {
          setPrintStep('fallback');
          setPrintMessage('Opening wireless print dialog for Canon TS3370s...');
          await PrintExecutor.executeSystemPrint(updatedJob, side1Pages);
        }
      }

      if (side2Pages.length > 0) {
        const waitingJob: PrintJob = {
          ...updatedJob,
          status: 'waiting_flip',
          manualDuplexStage: 'side1'
        };
        StorageService.saveJob(waitingJob);
        setJobs(prev => [waitingJob, ...prev.filter(j => j.id !== waitingJob.id)]);
        setDuplexActiveJob(waitingJob);
        setIsPrinting(false);
        setPrintStep('idle');
        return;
      }
    } else {
      // Single-Sided Printing Pass
      const bridgeResult = await PrinterBridge.sendDirectPrintJob(updatedJob, selectedPages);
      if (bridgeResult.success) {
        setPrintStep('success');
        setPrintMessage('Print job delivered directly to Canon TS3370s printer tray!');
      } else {
        setPrintStep('fallback');
        setPrintMessage('Opening wireless print dialog for Canon TS3370s...');
        await PrintExecutor.executeSystemPrint(updatedJob, selectedPages);
      }
    }

    setIsPrinting(false);

    // Mark Completed
    const completedJob: PrintJob = {
      ...updatedJob,
      status: 'completed'
    };
    StorageService.saveJob(completedJob);
    setJobs(prev => [completedJob, ...prev.filter(j => j.id !== completedJob.id)]);

    confetti({
      particleCount: 80,
      spread: 80,
      origin: { y: 0.7 }
    });

    setTimeout(() => {
      setPrintStep('idle');
    }, 3500);
  };

  // Confirm Manual Duplex Paper Flip (Print Side 2: Even Pages)
  const handleConfirmDuplexFlipped = async () => {
    if (!duplexActiveJob) return;

    setIsPrinting(true);
    setPrintStep('connecting');
    setPrintMessage('Sending Side 2 (Even Pages) payload to Canon TS3370s printer...');

    const selectedPages = duplexActiveJob.document?.selectedPages || Array.from({ length: duplexActiveJob.document?.pageCount || 1 }, (_, i) => i + 1);
    const side2Pages = selectedPages.filter(p => p % 2 === 0);

    if (side2Pages.length > 0) {
      const bridgeResult = await PrinterBridge.sendDirectPrintJob(duplexActiveJob, side2Pages);
      if (bridgeResult.success) {
        setPrintStep('success');
        setPrintMessage('Side 2 (Even Pages) delivered successfully to printer!');
      } else {
        setPrintStep('fallback');
        setPrintMessage('Bridge offline — Launching System Print Engine for Side 2...');
        await PrintExecutor.executeSystemPrint(duplexActiveJob, side2Pages);
      }
    }

    setIsPrinting(false);

    const completedJob: PrintJob = {
      ...duplexActiveJob,
      status: 'completed',
      manualDuplexStage: 'complete'
    };

    StorageService.saveJob(completedJob);
    setJobs(prev => [completedJob, ...prev.filter(j => j.id !== completedJob.id)]);
    setDuplexActiveJob(null);

    confetti({
      particleCount: 100,
      spread: 90,
      origin: { y: 0.7 }
    });

    setTimeout(() => {
      setPrintStep('idle');
    }, 3500);
  };

  const handleExportPdf = (job: PrintJob) => {
    PrintExecutor.exportPdf(job);
  };

  return (
    <div className="app-shell" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      {/* Ambient Sunset Aurora Glowing Background Layers */}
      <div className="aurora-glow-1" />
      <div className="aurora-glow-2" />
      <div className="aurora-glow-3" />

      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        queuedJobsCount={jobs.filter(j => j.status === 'printing' || j.status === 'waiting_flip').length}
      />

      {/* Main Content Router View */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', zIndex: 1 }}>
        {activeTab === 'home' && (
          <Home
            onSelectFlow={flow => setActiveTab(flow)}
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

        {activeTab === 'settings' && (
          <SettingsPage
            printers={printers}
            onUpdatePrinters={handleUpdatePrinters}
            theme={theme}
            onChangeTheme={handleThemeChange}
            recentItems={recents}
            onRePrintRecent={item => {
              if (item.jobSnapshot) {
                handleSubmitJob({ ...item.jobSnapshot, id: `job-${Date.now()}` } as PrintJob);
              }
            }}
          />
        )}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        queuedJobsCount={jobs.filter(j => j.status === 'printing' || j.status === 'waiting_flip').length}
      />

      {/* Live Printing Progress & Status Modal */}
      <PrintProgressModal
        step={printStep}
        message={printMessage}
        printerName="Canon TS3370s"
      />

      {/* Apple-style PWA Installation Banner */}
      <PwaInstallBanner />

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
