const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },

    avatar: {
      type: String,
      default: "",
    },

    bio: {
      type: String,
      default: "",
    },

    skills: [String],

    education: [
      {
        institution: String,
        degree: String,
        startYear: Number,
        endYear: Number,
      },
    ],

    projects: [
      {
        title: String,
        description: String,
        githubUrl: String,
        liveUrl: String,
        technologies: [String],
      },
    ],

    role: {
      type: String,
      enum: ["USER", "MODERATOR", "ADMIN"],
      default: "USER",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);