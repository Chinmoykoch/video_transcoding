import mongoose, { Schema } from "mongoose";

const jobSchema = new Schema(
  {
    videoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video",
      required: true,
    },

    inputPath: {
      type: String,
      required: true,
    },

    outputs: {
      type: Map,
      of: String,
      default: {},
    },

    status: {
      type: String,
      enum: ["CREATED", "QUEUED", "PROCESSING", "COMPLETED", "FAILED"],
      default: "CREATED",
    },

    error: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Job", jobSchema);