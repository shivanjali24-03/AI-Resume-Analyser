import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import multer from 'multer';
import { PDFParse } from 'pdf-parse';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

app.get('/', (req, res) => {
  res.send('Backend AI Server is Live!');
});

// Accept a single PDF (max 10MB), kept in memory
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') cb(null, true);
    else cb(new Error('Only PDF files are allowed'));
  },
});

const MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

const buildPrompt = (resumeText, jobDescription) => [
  'You are an expert ATS (Applicant Tracking System) and technical recruiter.',
  jobDescription
    ? 'Review the resume against the job description.'
    : 'Review the resume for a general software developer role.',
  'Return ONLY JSON with exactly these keys:',
  '{',
  '  "atsScore": integer 0-100,',
  '  "matchingSkills": string[] (relevant skills/keywords found in the resume),',
  '  "missingSkills": string[] (important skills/keywords that are missing),',
  '  "improvements": string[] (3-6 short, specific, actionable suggestions)',
  '}',
  '',
  'RESUME:',
  resumeText.slice(0, 20000),
  jobDescription ? '\nJOB DESCRIPTION:\n' + jobDescription.slice(0, 8000) : '',
].join('\n');

const toList = (v) => (Array.isArray(v) ? v.map(String).filter(Boolean) : []);

app.post('/api/resume/analyze', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a PDF resume.' });
    }
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ success: false, message: 'GEMINI_API_KEY is not set on the server.' });
    }

    // 1. Pull plain text out of the PDF
    const parser = new PDFParse({ data: req.file.buffer });
    const { text } = await parser.getText();
    await parser.destroy();
    const resumeText = (text || '').trim();
    if (!resumeText) {
      return res.status(422).json({ success: false, message: 'Could not read any text from this PDF.' });
    }

    const jobDescription = (req.body.jobDescription || '').trim();

    // 2. Ask Gemini for a structured ATS review
    const model = genAI.getGenerativeModel({
      model: MODEL,
      generationConfig: { responseMimeType: 'application/json', temperature: 0.3 },
    });
    const result = await model.generateContent(buildPrompt(resumeText, jobDescription));
    const raw = result.response.text().replace(/^```(?:json)?\s*|\s*```$/g, '');
    const parsed = JSON.parse(raw);

    // 3. Normalise so the UI always gets the shape it expects
    const data = {
      atsScore: Math.max(0, Math.min(100, Math.round(Number(parsed.atsScore) || 0))),
      matchingSkills: toList(parsed.matchingSkills),
      missingSkills: toList(parsed.missingSkills),
      improvements: toList(parsed.improvements),
    };

    res.json({ success: true, data });
  } catch (err) {
    console.error('Analyze error:', err);
    res.status(500).json({ success: false, message: 'Failed to analyze resume.' });
  }
});

// Turn upload errors (wrong type, file too large) into clean 400 responses
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError || err.message === 'Only PDF files are allowed') {
    return res.status(400).json({ success: false, message: err.message });
  }
  next(err);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});