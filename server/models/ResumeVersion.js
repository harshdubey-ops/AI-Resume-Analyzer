const mongoose = require("mongoose");

const resumeVersionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    legacyProfileId: {
      type: mongoose.Schema.Types.ObjectId,
      sparse: true,
      unique: true,
    },
    name: { type: String, required: true, trim: true, maxlength: 80 },
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

resumeVersionSchema.index({ userId: 1, updatedAt: -1 });

module.exports = mongoose.model("ResumeVersion", resumeVersionSchema);
