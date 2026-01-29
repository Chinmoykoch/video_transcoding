import express from "express";
import dotenv from "dotenv";
import videoRoutes from "./modules/video/video.routes"
import connectDB from "./config/db";
import authRoutes from "./modules/user/user.routes"
import { connectToRabbitMq } from "./queue/rabbitmq";
import cors from "cors";

dotenv.config();

const app = express();

const port = process.env.PORT || 8000;

app.use(express.json());
app.use(cors());

app.use("/api/v1/videos", videoRoutes);
app.use("/api/v1/auth", authRoutes);

const startServer = async () => {
    try {
        // connect database
        await connectDB();

        // connect RabbitMQ
        await connectToRabbitMq();

        app.listen(port, () => {
            console.log(`App is listening on port ${port}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
};

startServer();
