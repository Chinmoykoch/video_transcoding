import mongoose, { Schema } from "mongoose";

const videoSchema = new Schema(
  {
    title: {
      type: String,
      trim: true,
      maxlength: 200,
      required: true,
    },

    mimeType: {
      type: String,
      required: true,
    },

    duration: {
      type: String,
      default: "0",
    },

    status: {
      type: String,
      enum: ["UPLOADED", "PROCESSING", "READY", "FAILED"],
      default: "UPLOADED",
    },

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Creator",
      required: true,
    },

    filePath: {
      type: String,
      required: true,
    },

    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Video", videoSchema);