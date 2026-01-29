import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectToRabbitMq, consumeJobs } from "../src/queue/rabbitmq";
import { transcodeVideo } from "./transcoder";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/video-transcoding";

const startWorker = async () => {
    try {
        // DB Connect
        await mongoose.connect(MONGO_URI);
        console.log("Connected to MongoDB (Worker)");

        // RabbitMQ Connect 
        await connectToRabbitMq();

        // Start job creation
        console.log("Worker is running and listening for jobs...");
        await consumeJobs(async (jobId) => {
            console.log(`[Worker] Starting processing for job ${jobId}`);
            await transcodeVideo(jobId);
            console.log(`[Worker] Completed processing for job ${jobId}`);
        });

    } catch (error) {
        console.error("Worker failed to start:", error);
        process.exit(1);
    }
};

startWorker();
