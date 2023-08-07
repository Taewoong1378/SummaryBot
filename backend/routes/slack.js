import axios from 'axios';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const __dirname = path.resolve();

export const slackMessage = (req, res) => {
  const inputFile = req.file.path;
  const mode = req.body.mode;
  const topic = req.body.topic;
  const outputFile = path.join(
    __dirname,
    'python',
    'output',
    'transcript_summary.txt'
  );

  const pythonProcess = spawn('python3', [
    path.join(__dirname, 'python', 'main.py'),
    inputFile,
    mode,
    topic,
    outputFile,
  ]);

  let outputData = '';

  pythonProcess.stdout.on('data', () => {
    const data = fs.readFileSync(outputFile, 'utf-8');
    outputData += data;
  });

  pythonProcess.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  pythonProcess.on('close', async (code) => {
    if (code !== 0) {
      console.log(`Python process exited with code ${code}`);
      return;
    }

    await axios({
      url: process.env.SLACK_WEBHOOK_URL,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        text: outputData,
      },
    });

    res.send(outputData);
  });
};
