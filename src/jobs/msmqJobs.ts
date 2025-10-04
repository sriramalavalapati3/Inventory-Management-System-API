import RabbitMQClient from "../messaging/rabbitMqClient";
import { ProductService } from "../modules/products";

export default class RabbitMQJobs {
  private static queueName = "inventory_jobs";

  static async start(): Promise<void> {
    const channel = RabbitMQClient.prototype.getChannel();

    await channel.assertQueue(this.queueName, { durable: true });
    console.log(`✅ Waiting for messages in queue: ${this.queueName}`);

    channel.consume(this.queueName, async (msg: any) => {
      if (!msg) return;

      try {
        const payload = JSON.parse(msg.content.toString());
        const { type, productId, quantity } = payload;

        if (type === "INCREMENT") {
          await ProductService.increaseProductQuantity(productId, quantity);
        } else if (type === "DECREMENT") {
          await ProductService.decreaseProductQuantity(productId, quantity);
        }

        channel.ack(msg); // acknowledge successful processing
      } catch (err) {
        console.error("❌ Error processing inventory job:", err);
        // optionally: channel.nack(msg, false, true) to requeue
      }
    });
  }
}
