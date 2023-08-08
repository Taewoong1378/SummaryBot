import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import fs from 'fs';
import morgan from 'morgan';
import multer from 'multer';
import path from 'path';
import { slackMessage } from './routes/slack.js';

dotenv.config();

const __dirname = path.resolve();

const app = express();

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

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Server is running successfully');
});

const port = process.env.PORT || 8000;

app.post('/txt', upload.single('file'), slackMessage);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
