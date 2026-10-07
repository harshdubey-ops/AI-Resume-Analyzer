const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
  {
    userId:{
      type:mongoose.Schema.Types.ObjectId,ref:"User",
      required:true,
    },
    fileName: {
      type: String,
      required: true,
    },

    resumeText: {
      type: String,
      required: true,
    },

    analysis: {
      atsScore: Number,
      skills: [String],
      strengths: [String],
      weaknesses: [String],
      missingSkills: [String],
      suggestions: [String],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Resume", resumeSchema);