import express from 'express';
import cors from 'cors';
import net from 'net';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'PrintU Bridge Server', time: new Date() });
});

// Direct Silent Print API
app.post('/api/print', async (req, res) => {
  const { jobId, title, printerIp, pages, copies = 1 } = req.body;

  if (!printerIp) {
    return res.status(400).json({ success: false, error: 'Printer IP address required' });
  }

  console.log(`[PrintU Bridge] Receiving silent print job "${title}" for printer ${printerIp}`);

  try {
    const client = new net.Socket();
    
    client.connect(9100, printerIp, () => {
      console.log(`[PrintU Bridge] Connected to printer ${printerIp}:9100`);

      const pjlHeader = 
        `\x1B%-12345X@PJL JOB NAME="${title || 'PrintU Job'}"\r\n` +
        `@PJL SET COPIES=${copies}\r\n` +
        `@PJL ENTER LANGUAGE=PCL\r\n`;

      client.write(pjlHeader);

      if (pages && pages.length > 0) {
        pages.forEach((pageDataUrl) => {
          const base64Data = pageDataUrl.replace(/^data:image\/\w+;base64,/, '');
          const buffer = Buffer.from(base64Data, 'base64');
          client.write(buffer);
        });
      }

      const pjlTrailer = `\x1B%-12345X@PJL EOJ\r\n\x1B%-12345X`;
      client.write(pjlTrailer);

      client.end();
      console.log(`[PrintU Bridge] Job "${title}" sent successfully to ${printerIp}`);
      res.json({ success: true, message: `Print job sent directly to ${printerIp}` });
    });

    client.on('error', (err) => {
      console.error(`[PrintU Bridge Error] Failed to connect to ${printerIp}:`, err.message);
      res.status(500).json({ 
        success: false, 
        error: `Could not reach printer at ${printerIp}:9100. Ensure printer is powered on and connected to local Wi-Fi.` 
      });
    });

  } catch (err) {
    console.error('[PrintU Bridge Exception]:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`=================================================`);
  console.log(` PrintU Direct Printer Bridge running on port ${PORT}`);
  console.log(` Send POST requests to http://localhost:${PORT}/api/print`);
  console.log(`=================================================`);
});
