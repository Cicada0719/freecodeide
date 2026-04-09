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
  const { code, filename } = req.body;
  if (!code) {
    return res.status(400).json({ error: 'No code provided' });
  }

  // Create a temporary directory to run the code
  const tmpDir = path.join(__dirname, 'tmp');
  if (!fs.existsSync(tmpDir)) {
    fs.mkdirSync(tmpDir, { recursive: true });
  }

  const safeFilename = filename ? path.basename(filename) : 'script.fc';
  const filePath = path.join(tmpDir, safeFilename);
  fs.writeFileSync(filePath, code);

  // Here we use the free-code CLI to "run" or process the file
  // Since free-code is an AI agent, we ask it to execute or analyze the file
  const prompt = `Please run or analyze the following file and provide the output: ${filePath}`;
  
  const env = {
    ...process.env,
    CLAUDE_CODE_USE_OPENAI: '1',
    OPENAI_API_KEY: 'sk-6ca22604fd7f30be89484acc6e466fc86511fc861a205efd0f4f0ff7863eeb01',
    OPENAI_BASE_URL: 'https://sub.ai6.me',
    OPENAI_MODEL: 'gpt-5.4', // Depending on how free-code handles this, it might need specific mapping
  };

  const child = spawn(FREE_CODE_CLI, ['-p', prompt], {
    cwd: tmpDir,
    env
  });

  let output = '';
  let errorOutput = '';

  child.stdout.on('data', (data) => {
    output += data.toString();
  });

  child.stderr.on('data', (data) => {
    errorOutput += data.toString();
  });

  child.on('close', (code) => {
    // Clean up
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    if (code !== 0) {
      res.json({ output: `Exit code: ${code}\nError: ${errorOutput}\nOutput: ${output}` });
    } else {
      res.json({ output: output || 'Execution completed.' });
    }
  });
});

app.listen(PORT, () => {
  console.log(`FreeCode Proxy Server running on http://localhost:${PORT}`);
});