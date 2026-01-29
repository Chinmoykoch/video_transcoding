import ffmpeg from "fluent-ffmpeg";
import path from "path";
import fs from "fs";
import Job from "../src/modules/jobs/job.model";
import Video from "../src/modules/video/video.model";

export const transcodeVideo = async (jobId: string) => {
    const job = await Job.findById(jobId);
    if (!job) {
        throw new Error(`Job not found: ${jobId}`);
    }

    try {
        // Update job status -> PROCESSING
        job.status = "PROCESSING";
        await job.save();

        const inputPath = path.resolve(job.inputPath);
        const outputDir = path.join(path.dirname(inputPath), "processed");

        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        const fileName = path.basename(inputPath, path.extname(inputPath));
        const resolutions = [
            { name: "720p", width: 1280, height: 720 },
            { name: "480p", width: 854, height: 480 }
        ];

        const outputPaths: Record<string, string> = {};

        // Process resolutions
        for (const res of resolutions) {
            const outputPath = path.join(outputDir, `${fileName}_${res.name}.mp4`);

            console.log(`[Transcoder] Starting transcode: ${res.name} for ${jobId}`);

            await new Promise((resolve, reject) => {
                ffmpeg(inputPath)
                    .output(outputPath)
                    .videoCodec("libx264")
                    .size(`${res.width}x${res.height}`)
                    .on("end", () => {
                        outputPaths[res.name] = path.relative(process.cwd(), outputPath);
                        resolve(true);
                    })
                    .on("error", (err) => {
                        console.error(`FFmpeg error (${res.name}):`, err);
                        reject(err);
                    })
                    .run();
            });
        }

        // Update job with outputs and COMPLETED status
        job.outputs = new Map(Object.entries(outputPaths));
        job.status = "COMPLETED";
        await job.save();

        // Update video status -> READY
        await Video.findByIdAndUpdate(job.videoId, { status: "READY" });

        console.log(`[Transcoder] Finished job: ${jobId}`);
    } catch (error: any) {
        console.error(`[Transcoder] Job failed: ${jobId}`, error);
        job.status = "FAILED";
        job.error = error.message;
        await job.save();

        await Video.findByIdAndUpdate(job.videoId, { status: "FAILED" });
        throw error;
    }
};
