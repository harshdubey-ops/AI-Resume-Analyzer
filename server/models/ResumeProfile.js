const mongoose = require("mongoose");

const resumeProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    template: { type: String, enum: ["modern", "classic"], default: "modern" },
    fullName: { type: String, default: "", maxlength: 120 },
    headline: { type: String, default: "", maxlength: 120 },
    email: { type: String, default: "", maxlength: 160 },
    phone: { type: String, default: "", maxlength: 50 },
    location: { type: String, default: "", maxlength: 120 },
    linkedin: { type: String, default: "", maxlength: 200 },
    website: { type: String, default: "", maxlength: 200 },
    summary: { type: String, default: "", maxlength: 2500 },
    skills: { type: String, default: "", maxlength: 6000 },
    experience: { type: String, default: "", maxlength: 6000 },
    education: { type: String, default: "", maxlength: 6000 },
    projects: { type: String, default: "", maxlength: 6000 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ResumeProfile", resumeProfileSchema);
