# AI Resume Analyzer

An AI-powered Resume Analyzer built using the MERN stack that helps users analyze their resumes, evaluate ATS compatibility, identify skill gaps, and match resumes with job descriptions.

## Features

- User Signup & Login
- JWT-based Authentication
- Protected Routes
- Resume Upload
- AI-powered Resume Analysis
- ATS Score
- Skills Detection
- Strengths & Weaknesses Analysis
- Missing Skills Detection
- AI Recommendations
- Job Description Matching
- Job Match Score
- Matching & Missing Skills
- Resume History
- Job Match History
- Delete Resume & Job Match
- User-wise Data Isolation
- Responsive UI
- Premium Dark UI

## Tech Stack

### Frontend
- React.js
- Vite
- Tailwind CSS
- React Router

### Backend
- Node.js
- Express.js
- JWT Authentication
- Multer
- PDF Parse
- Mammoth

### Database
- MongoDB
- Mongoose

### AI
- Google Gemini API

## Project Structure

```text
AI-RESUME/
│
├── public/
├── src/
│   ├── assets/
│   ├── pages/
│   │   ├── Analysis.jsx
│   │   ├── JobMatch.jsx
│   │   ├── JobMatchHistory.jsx
│   │   ├── Login.jsx
│   │   ├── ResumeHistory.jsx
│   │   ├── Signup.jsx
│   │   └── UploadResume.jsx
│   │
│   ├── App.jsx
│   ├── ProtectedRoute.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
│
├── server/
│   ├── models/
│   │   ├── JobMatch.js
│   │   ├── Resume.js
│   │   └── Users.js
│   │
│   ├── authMiddleware.js
│   ├── server.js
│   ├── package.json
│   └── package-lock.json
│
├── .gitignore
├── package.json
├── package-lock.json
└── vite.config.js