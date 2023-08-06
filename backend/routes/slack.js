import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { PythonShell } from 'python-shell';

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

  const options = {
    mode: 'text',
    pythonOptions: ['-u'],
    scriptPath: path.join(__dirname, 'python'),
    args: [inputFile, mode, topic, outputFile],
  };

  PythonShell.run('main.py', options).then(async () => {
    const data = fs.readFileSync(outputFile, 'utf-8');
    await axios({
      url: process.env.SLACK_WEBHOOK_URL,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        text: data,
      },
    });
    res.send('success');
  });
};
