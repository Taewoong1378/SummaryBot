import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import fs from 'fs';
import helmet from 'helmet';
import hpp from 'hpp';
import morgan from 'morgan';
import multer from 'multer';
import path from 'path';
import { slackMessage } from './routes/slack.js';

dotenv.config();

const __dirname = path.resolve();

const app = express();
const prod = process.env.NODE_ENV === 'production';

const transcriptionDir = path.join(__dirname, 'python', 'transcription');
if (!fs.existsSync(transcriptionDir)) {
  fs.mkdirSync(transcriptionDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, transcriptionDir);
  },
  filename: function (req, file, cb) {
    cb(null, 'transcript.txt');
  },
});

const upload = multer({ storage });

if (prod) {
  app.enable('trust proxy');
  app.use(morgan('combined'));
  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(hpp());
} else {
  app.use(morgan('dev'));
  app.use(
    cors({
      origin: true,
      credentials: true,
    })
  );
}
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('hello express');
});

const port = process.env.PORT || 8000;

app.post('/txt', upload.single('file'), slackMessage);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
