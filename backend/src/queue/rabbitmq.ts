import amqp from "amqplib";


const QUEUE_NAME = "video_transcoding_jobs";
let channel: amqp.Channel;

export const connectToRabbitMq = async () => {
    try {
        const rabbitUrl = process.env.RABBITMQ_URL || "amqp://localhost";
        const connection = await amqp.connect(rabbitUrl);

        channel = await connection.createChannel();
        await channel.assertQueue(QUEUE_NAME, { durable: true });
        console.log("RabbitMQ connected successfully");
    } catch (error) {
        console.error("RabbitMQ connection failed:", error);
        throw error;
    }
}

export const publishJob = async (jobId: string) => {
    if (!channel) {
        throw new Error("RabbitMQ channel not initialized");
    }

    channel.sendToQueue(
        QUEUE_NAME,
        Buffer.from(JSON.stringify({ jobId })),
        { persistent: true }
    );
};

export const consumeJobs = async (callback: (jobId: string) => Promise<void>) => {
    if (!channel) {
        throw new Error("RabbitMQ channel not initialized");
    }

    await channel.prefetch(1);

    channel.consume(QUEUE_NAME, async (msg) => {
        if (msg !== null) {
            try {
                const { jobId } = JSON.parse(msg.content.toString());
                console.log(`[Worker] Received job: ${jobId}`);

                await callback(jobId);

                channel.ack(msg);
            } catch (error) {
                console.error(`[Worker] Error processing job:`, error);
                channel.nack(msg, false, true);
            }
        }
    });
};