import express from 'express';
import cors from 'cors';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 8080;
const FREE_CODE_CLI = '/root/.local/bin/free-code';

app.get('/api/info', (req, res) => {
  res.json({ engine: 'free-code', version: 'dev-full' });
});

app.post('/api/execute', async (req, res) => {
  const { code, filename, aiConfig } = req.body;
  if (!code) {
    return res.status(400).json({ error: 'No code provided' });
  }

  // Use Server-Sent Events to stream the output
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const tmpDir = path.join(__dirname, 'tmp');
  if (!fs.existsSync(tmpDir)) {
    fs.mkdirSync(tmpDir, { recursive: true });
  }

  const safeFilename = filename ? path.basename(filename) : 'script.fc';
  const filePath = path.join(tmpDir, safeFilename);
  fs.writeFileSync(filePath, code);

  const prompt = `Please run or analyze the following file and provide the output: ${filePath}`;
  
  const env = {
    ...process.env,
    CLAUDE_CODE_USE_OPENAI: '1',
    OPENAI_API_KEY: aiConfig?.apiKey || process.env.OPENAI_API_KEY || '',
    OPENAI_BASE_URL: aiConfig?.baseUrl || process.env.OPENAI_BASE_URL || '',
    OPENAI_MODEL: aiConfig?.model || process.env.OPENAI_MODEL || '',
  };

  const child = spawn(FREE_CODE_CLI, ['-p', prompt], {
    cwd: tmpDir,
    env
  });

  child.stdout.on('data', (data) => {
    res.write(`data: ${JSON.stringify({ type: 'stdout', content: data.toString() })}\n\n`);
  });

  child.stderr.on('data', (data) => {
    res.write(`data: ${JSON.stringify({ type: 'stderr', content: data.toString() })}\n\n`);
  });

  child.on('close', (code) => {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    res.write(`data: ${JSON.stringify({ type: 'close', code })}\n\n`);
    res.end();
  });
});

app.listen(PORT, () => {
  console.log(`FreeCode Proxy Server running on http://localhost:${PORT}`);
});