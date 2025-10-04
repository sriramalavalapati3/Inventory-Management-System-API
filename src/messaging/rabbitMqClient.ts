import dotenv from "dotenv";
import amqplib from "amqplib"; // TypeScript won’t complain now

dotenv.config();

export default class RabbitMQClient {
  private connection: any;
  private channel: any;

  public async RabbitMQClientConnect(): Promise<void> {
    const url = process.env.RABBITMQ_URL;
    if (!url) throw new Error("RABBITMQ_URL is not defined in .env");

    this.connection = await amqplib.connect(url);
    this.channel = await this.connection.createChannel();
    console.log("✅ Connected to RabbitMQ");
  }

  public getChannel(): any {
    if (!this.channel) throw new Error("RabbitMQ channel not initialized");
    return this.channel;
  }

  public async close(): Promise<void> {
    await this.channel?.close();
    await this.connection?.close();
    console.log("✅ RabbitMQ connection closed");
  }
}
