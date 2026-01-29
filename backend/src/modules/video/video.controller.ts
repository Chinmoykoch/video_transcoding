import { Request, Response } from "express";
import Video from "../video/video.model";
import Job from "../jobs/job.model";
import { publishJob } from "../../queue/rabbitmq";

export const uploadVideoController = async (req: Request, res: Response) => {
  try {
    //  Validate file
    if (!req.file) {
      return res.status(400).json({
        message: "No video file uploaded",
      });
    }

    const file = req.file as Express.Multer.File;
    const { title } = req.body;

    // Validate title
    if (!title) {
      return res.status(400).json({
        message: "Title is required",
      });
    }

    // Validate video  type
    if (!file.mimetype.startsWith("video/")) {
      return res.status(400).json({
        message: "Only video files are allowed",
      });
    }

    //  Create DB entry
    const video = await Video.create({
      title,
      mimeType: file.mimetype,
      duration: "0", 
      status: "UPLOADED",
      uploadedBy: (req as any).user.id,

      //  file reference
      filePath: file.path,
    });

    // Create Job entry
    const job = await Job.create({
      videoId: video._id,
      inputPath: video.filePath,
      status: "QUEUED",
      outputs: {},
    });

    // Update video with jobId
    video.jobId = job._id;
    await video.save();

    // Push to queue
    await publishJob(job._id.toString());

    return res.status(201).json({
      message: "Video uploaded and transcoding started successfully",
      video,
      job,
    });
  } catch (error) {
    console.error("Video upload error:", error);
    return res.status(500).json({
      message: "Video upload failed",
    });
  }
};

export const getVideosController = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const videos = await Video.find({ uploadedBy: userId })
      .populate("jobId")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      videos,
    });
  } catch (error) {
    console.error("Get videos error:", error);
    return res.status(500).json({
      message: "Failed to fetch videos",
    });
  }
};