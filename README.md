# AI Resume Analyzer

An AI-powered Resume Analyzer built using the MERN stack that helps users analyze their resumes, evaluate ATS compatibility, identify skill gaps, and match resumes with job descriptions.

## Features

- User signup and login
- JWT-based authentication and protected routes
- Resume upload and AI-powered analysis
- ATS score, skills detection, strengths, weaknesses, and improvement recommendations
- Job description matching with match score and skill gaps
- Resume and job match history
- Resume Builder with professional templates, live preview, saved versions, and PDF/DOCX export
- User-wise data isolation
- Responsive UI

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
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── pages/
│   │   ├── Analysis.jsx
│   │   ├── JobMatch.jsx
│   │   ├── JobMatchHistory.jsx
│   │   ├── ResumeBuilder.jsx
│   │   ├── ResumeHistory.jsx
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   └── UploadResume.jsx
│   ├── App.jsx
│   ├── ProtectedRoute.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
├── server/
│   ├── models/
│   │   ├── JobMatch.js
│   │   ├── Resume.js
│   │   ├── ResumeProfile.js
│   │   ├── ResumeVersion.js
│   │   └── Users.js
│   ├── authMiddleware.js
│   ├── server.js
│   ├── package.json
│   └── package-lock.json
├── .gitignore
├── package.json
├── package-lock.json
└── vite.config.js
```

## Resume Builder

Signed-in users can create role-specific resume versions, edit each version independently, choose a modern or classic template, and preview it live. New versions start as a copy of the selected resume. Existing single-draft data is migrated into a first version on the next visit. Save versions to the account, download an editable Word document with **Download DOCX**, or use the browser print dialog and choose **Save as PDF**.
