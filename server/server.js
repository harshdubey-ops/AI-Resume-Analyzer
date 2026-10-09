const { GoogleGenAI } = require("@google/genai");
const dotenv = require("dotenv");
dotenv.config();
const authMiddleware = require("./authMiddleware");
const mongoose = require("mongoose");

const Resume = require("./models/Resume");
const JobMatch = require("./models/JobMatch");
const ResumeProfile = require("./models/ResumeProfile");
const ResumeVersion = require("./models/ResumeVersion");
const User = require("./models/Users");

const bcrypt = require("bcryptjs");

const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");

const { PDFParse } = require("pdf-parse");
const jwt = require("jsonwebtoken");  

// ==========================================
// MONGODB CONNECTION
// ==========================================

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });


// ==========================================
// GEMINI
// ==========================================

const ai = new GoogleGenAI({});


// ==========================================
// EXPRESS
// ==========================================

const app = express();

app.use(cors());
app.use(express.json());

const upload = multer({ dest: "uploads/" });


// ==========================================
// HOME
// ==========================================

app.get("/", (req, res) => {
  res.json({
    message: "Resumind backend is running",
  });
});


// ==========================================
// SIGNUP API
// ==========================================

app.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({
      message: "User registered successfully",
    });

  } catch (error) {
    console.error("Signup error:", error);

    res.status(500).json({
      message: "Failed to register user",
      error: error.message,
    });
  }
});


// ==========================================
// LOGIN API
// ==========================================

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid password",
      });
    }

   const token = jwt.sign(
  {
    userId: user._id,
    email: user.email,
  },
  process.env.JWT_SECRET,
  {
    expiresIn: "7d",
  }
);

    res.json({
      message: "Login successful",
      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      message: "Login failed",
      error: error.message,
    });
  }
});


// ==========================================
// RESUME UPLOAD + AI ANALYSIS
// ==========================================

app.post(
  "/upload",
  authMiddleware,
  upload.single("resume"),
  async (req, res) => {
  try {

    if (!req.file) {
      return res.status(400).json({
        message: "No resume uploaded",
      });
    }

    const dataBuffer = fs.readFileSync(req.file.path);

    const parser = new PDFParse({
      data: dataBuffer,
    });

    const pdfData = await parser.getText();

    await parser.destroy();

    console.log(
      "Resume received:",
      req.file.originalname
    );

    console.log("Extracted text:");
    console.log(pdfData.text);


    // Gemini Analysis

    let response;

    for (let attempt = 1; attempt <= 4; attempt++) {

      try {

        console.log(
          `Gemini attempt ${attempt}...`
        );

        response = await ai.models.generateContent({

          model: "gemini-3.5-flash",

          contents: `Analyze this resume and return ONLY valid JSON.

Use exactly this structure:

{
  "atsScore": 0,
  "skills": [],
  "strengths": [],
  "weaknesses": [],
  "missingSkills": [],
  "suggestions": []
}

Rules:

- skills: technical and professional skills found in the resume
- strengths: strong points of the resume
- weaknesses: areas that need improvement
- missingSkills: useful skills that are missing or could strengthen the resume
- suggestions: practical suggestions to improve the resume
- atsScore: resume quality and ATS compatibility score from 0 to 100
- Each item must be a short string.
- Do not use markdown.
- Do not add any text outside the JSON.

Resume:
${pdfData.text}`,

        });

        console.log(
          "Gemini response received."
        );

        break;

      } catch (error) {

        console.log(
          `Gemini attempt ${attempt} failed`
        );

        if (attempt === 4) {
          throw error;
        }

        const delay =
          2000 * Math.pow(2, attempt - 1);

        console.log(
          `Retrying after ${delay / 1000} seconds...`
        );

        await new Promise((resolve) =>
          setTimeout(resolve, delay)
        );
      }
    }


    const analysis = JSON.parse(response.text);

    console.log("AI Analysis:");
    console.log(response.text);


    // Save Resume

    const newResume = new Resume({
      userId:req.user.userId,

      fileName: req.file.originalname,

      resumeText: pdfData.text,

      analysis: analysis,

    });

    await newResume.save();

    console.log(
      "Resume saved to MongoDB"
    );


    res.json({

      message: "Resume analyzed successfully",

      fileName: req.file.originalname,

      text: pdfData.text,

      analysis: analysis,

    });

  } catch (error) {

    console.error(
      "Resume processing error:",
      error
    );

    res.status(500).json({

      message: "Failed to process resume",

      error: error.message,

    });
  }
});


// ==========================================
// JOB MATCH API
// ==========================================

app.post("/job-match", authMiddleware, async (req, res) => {

  try {

    const {
      resumeId,
      jobDescription,
    } = req.body;


    if (!resumeId || !jobDescription) {

      return res.status(400).json({

        message:
          "Resume ID and job description are required",

      });
    }


    // Find Resume

    const resume =
      await Resume.findById(resumeId);


    if (!resume) {

      return res.status(404).json({

        message: "Resume not found",

      });
    }


    console.log(
      "Job match started for:",
      resume.fileName
    );


    // Gemini Job Match

    let response;


    for (
      let attempt = 1;
      attempt <= 4;
      attempt++
    ) {

      try {

        console.log(
          `Job Match Gemini attempt ${attempt}...`
        );


        response =
          await ai.models.generateContent({

            model: "gemini-3.5-flash",

            contents: `Compare the resume with the job description and return ONLY valid JSON.

Use exactly this structure:

{
  "matchScore": 0,
  "matchingSkills": [],
  "missingSkills": [],
  "recommendations": []
}

Rules:

- matchScore: overall match percentage from 0 to 100
- matchingSkills: skills present in both the resume and job description
- missingSkills: important job-related skills missing from the resume
- recommendations: practical suggestions to improve the resume for this specific job
- Each item must be a short string
- Do not use markdown
- Do not add any text outside the JSON

RESUME:
${resume.resumeText}

JOB DESCRIPTION:
${jobDescription}`,

          });


        console.log(
          "Job Match Gemini response received."
        );

        break;


      } catch (error) {

        console.log(
          `Job Match Gemini attempt ${attempt} failed`
        );


        if (attempt === 4) {
          throw error;
        }


        const delay =
          2000 * Math.pow(2, attempt - 1);


        console.log(
          `Retrying Job Match after ${delay / 1000} seconds...`
        );


        await new Promise((resolve) =>
          setTimeout(resolve, delay)
        );
      }
    }


    const matchAnalysis =
      JSON.parse(response.text);


    console.log(
      "Job Match Analysis:"
    );

    console.log(response.text);


    // Save Job Match

    const newJobMatch =
      new JobMatch({
        userId: req.user.userId,

        resumeId: resume._id,

        resumeFileName:
          resume.fileName,

        jobDescription:
          jobDescription,

        matchScore:
          matchAnalysis.matchScore,

        matchingSkills:
          matchAnalysis.matchingSkills,

        missingSkills:
          matchAnalysis.missingSkills,

        recommendations:
          matchAnalysis.recommendations,

      });


    await newJobMatch.save();


    console.log(
      "Job Match saved to MongoDB"
    );


    res.json({

      message:
        "Job match analyzed successfully",

      fileName:
        resume.fileName,

      analysis:
        matchAnalysis,

    });


  } catch (error) {

    console.error(
      "Job match error:",
      error
    );


    res.status(500).json({

      message:
        "Failed to analyze job match",

      error:
        error.message,

    });
  }
});


// ==========================================
// GET SAVED RESUMES
// ==========================================

const resumeVersionFields = [
  "template",
  "fullName",
  "headline",
  "email",
  "phone",
  "location",
  "linkedin",
  "website",
  "summary",
  "skills",
  "experience",
  "education",
  "projects",
];

function readResumeVersionFields(body) {
  const fields = {};
  for (const field of resumeVersionFields) {
    if (body[field] !== undefined) {
      if (typeof body[field] !== "string") {
        return { error: `${field} must be text` };
      }
      fields[field] = body[field].trim();
    }
  }
  if (fields.template && !["modern", "classic"].includes(fields.template)) {
    return { error: "Please choose a valid resume template" };
  }
  return { fields };
}

app.get("/resume-versions", authMiddleware, async (req, res) => {
  try {
    let versions = await ResumeVersion.find({ userId: req.user.userId })
      .sort({ updatedAt: -1 })
      .lean();

    if (versions.length === 0) {
      const legacyProfile = await ResumeProfile.findOne({ userId: req.user.userId }).lean();
      if (legacyProfile) {
        let migratedVersion = await ResumeVersion.findOne({
          legacyProfileId: legacyProfile._id,
        }).lean();

        if (!migratedVersion) {
          try {
            migratedVersion = await ResumeVersion.create({
              ...Object.fromEntries(
                resumeVersionFields
                  .filter((field) => legacyProfile[field] !== undefined)
                  .map((field) => [field, legacyProfile[field]])
              ),
              userId: req.user.userId,
              legacyProfileId: legacyProfile._id,
              name: legacyProfile.headline || "My Resume",
            });
          } catch (error) {
            if (error.code !== 11000) throw error;
            migratedVersion = await ResumeVersion.findOne({
              legacyProfileId: legacyProfile._id,
            });
          }
        }

        if (migratedVersion) {
          await ResumeProfile.deleteOne({ _id: legacyProfile._id, userId: req.user.userId });
        }
        versions = await ResumeVersion.find({ userId: req.user.userId })
          .sort({ updatedAt: -1 })
          .lean();
      }
    }

    res.json({ versions });
  } catch (error) {
    console.error("Error fetching resume versions:", error);
    res.status(500).json({ message: "Failed to fetch resume versions" });
  }
});

app.post("/resume-versions", authMiddleware, async (req, res) => {
  try {
    const name = typeof req.body.name === "string" ? req.body.name.trim() : "";
    if (!name) {
      return res.status(400).json({ message: "A name is required for this resume version" });
    }
    if (name.length > 80) {
      return res.status(400).json({ message: "Resume version names must be 80 characters or fewer" });
    }

    const { fields, error } = readResumeVersionFields(req.body);
    if (error) return res.status(400).json({ message: error });

    const version = await ResumeVersion.create({
      ...fields,
      userId: req.user.userId,
      name,
    });
    res.status(201).json({ message: "Resume version created successfully", version });
  } catch (error) {
    console.error("Error creating resume version:", error);
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: "Please check your resume details and try again." });
    }
    res.status(500).json({ message: "Failed to create resume version" });
  }
});

app.put("/resume-versions/:id", authMiddleware, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ message: "Resume version not found" });
    }
    const name = typeof req.body.name === "string" ? req.body.name.trim() : "";
    if (!name) {
      return res.status(400).json({ message: "A name is required for this resume version" });
    }
    if (name.length > 80) {
      return res.status(400).json({ message: "Resume version names must be 80 characters or fewer" });
    }

    const { fields, error } = readResumeVersionFields(req.body);
    if (error) return res.status(400).json({ message: error });

    const version = await ResumeVersion.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { $set: { ...fields, name } },
      { new: true, runValidators: true }
    ).lean();
    if (!version) {
      return res.status(404).json({ message: "Resume version not found" });
    }
    res.json({ message: "Resume version saved successfully", version });
  } catch (error) {
    console.error("Error saving resume version:", error);
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: "Please check your resume details and try again." });
    }
    res.status(500).json({ message: "Failed to save resume version" });
  }
});

app.delete("/resume-versions/:id", authMiddleware, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ message: "Resume version not found" });
    }
    const version = await ResumeVersion.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId,
    });
    if (!version) {
      return res.status(404).json({ message: "Resume version not found" });
    }
    res.json({ message: "Resume version deleted successfully" });
  } catch (error) {
    console.error("Error deleting resume version:", error);
    res.status(500).json({ message: "Failed to delete resume version" });
  }
});

app.get("/resume-builder", authMiddleware, async (req, res) => {
  try {
    const resume = await ResumeProfile.findOne({ userId: req.user.userId }).lean();
    res.json({ resume });
  } catch (error) {
    console.error("Error fetching resume builder draft:", error);
    res.status(500).json({ message: "Failed to fetch resume builder draft" });
  }
});

app.put("/resume-builder", authMiddleware, async (req, res) => {
  try {
    const allowedFields = [
      "template",
      "fullName",
      "headline",
      "email",
      "phone",
      "location",
      "linkedin",
      "website",
      "summary",
      "skills",
      "experience",
      "education",
      "projects",
    ];
    const profile = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        if (typeof req.body[field] !== "string") {
          return res.status(400).json({ message: `${field} must be text` });
        }
        profile[field] = req.body[field].trim();
      }
    }

    if (!profile.fullName) {
      return res.status(400).json({ message: "Full name is required" });
    }

    const resume = await ResumeProfile.findOneAndUpdate(
      { userId: req.user.userId },
      { $set: profile, $setOnInsert: { userId: req.user.userId } },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    ).lean();

    res.json({ message: "Resume draft saved successfully", resume });
  } catch (error) {
    console.error("Error saving resume builder draft:", error);
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: "Please check your resume details and try again." });
    }
    res.status(500).json({ message: "Failed to save resume builder draft" });
  }
});

app.get("/resumes", authMiddleware, async (req, res) => {

  try {

    const resumes =
      await Resume
      .find({ userId: req.user.userId })
        .sort({ createdAt: -1 });


    res.json(resumes);


  } catch (error) {

    console.error(
      "Error fetching resumes:",
      error
    );


    res.status(500).json({

      message:
        "Failed to fetch resumes",

    });
  }
});


// ==========================================
// DELETE RESUME
// ==========================================

app.delete(
  "/resumes/:id",authMiddleware,
  async (req, res) => {

    try {

      const deletedResume =
        await Resume.findOneAndDelete({
          _id: req.params.id,
          userId: req.user.userId
        });


      if (!deletedResume) {

        return res.status(404).json({

          message:
            "Resume not found",

        });
      }


      // Delete related Job Matches

      await JobMatch.deleteMany({

        resumeId:
          req.params.id,

      });


      res.json({

        message:
          "Resume deleted successfully",

      });


    } catch (error) {

      console.error(
        "Error deleting resume:",
        error
      );


      res.status(500).json({

        message:
          "Failed to delete resume",

      });
    }
  }
);


// ==========================================
// GET SAVED JOB MATCHES
// ==========================================

app.get(
  "/job-matches",authMiddleware,
  async (req, res) => {

    try {

      const matches =
        await JobMatch
          .find({userId:req.user.userId})
          .sort({ createdAt: -1 });


      res.json(matches);


    } catch (error) {

      console.error(
        "Error fetching job matches:",
        error
      );


      res.status(500).json({

        message:
          "Failed to fetch job matches",

      });
    }
  }
);


// ==========================================
// DELETE JOB MATCH
// ==========================================

app.delete(
  "/job-matches/:id",
  authMiddleware,
  async (req, res) => {

    try {

      const deletedMatch =
        await JobMatch.findOneAndDelete({
          _id: req.params.id,
          userId: req.user.userId
        });


      if (!deletedMatch) {

        return res.status(404).json({

          message:
            "Job match not found",

        });
      }


      res.json({

        message:
          "Job match deleted successfully",

      });


    } catch (error) {

      console.error(
        "Error deleting job match:",
        error
      );


      res.status(500).json({

        message:
          "Failed to delete job match",

      });
    }
  }
);


// ==========================================
// SERVER
// ==========================================

const PORT = 5000;

app.listen(PORT, () => {

  console.log(
    `Server running on http://localhost:${PORT}`
  );

});