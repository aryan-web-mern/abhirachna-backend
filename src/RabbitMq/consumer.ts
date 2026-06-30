import sendEmail from "../Services/mailer";
import { createConnection, getChannel } from "./connection";

export const startConsuming = async () => {
  try {
    await createConnection();
    const channel = getChannel();
    const queue = "send_email_updates";

    await channel.assertQueue(queue, { durable: true }); //durable for persistence
    channel.prefetch(1);

    console.log("Consumer listening on queue:", queue);

    channel.consume(queue, async (msg) => {
      if (!msg) return;

      let parsed;

      try {
        parsed = JSON.parse(msg.content.toString());
      } catch (err) {
        console.error("Invalid message JSON:", msg.content.toString());
        channel.ack(msg); // discard bad messages
        return;
      }

      const attempt = parsed.attempt || 1;

      try {
        await sendEmail(parsed);
         channel.ack(msg);
      } catch (error) {
        if (attempt < 3) {
          const retryMessage = { ...parsed, attempt: attempt + 1 };
          channel.sendToQueue(
            queue,
            Buffer.from(JSON.stringify(retryMessage)),
            {
              persistent: true,
            }
          );
        } else {
          console.error(
            "Max retry attempts reached. Discarding message:",
            parsed
          );
          // Optionally send to DLQ here
        }

        channel.ack(msg);
      }
    });
  } catch (error) {
    console.error("Error setting up RabbitMQ consumer:", error);
  }
};
