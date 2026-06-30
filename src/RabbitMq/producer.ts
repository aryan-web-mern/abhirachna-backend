import { createConnection,getChannel ,closeConnection} from "./connection"

export const sendToQueue = async (mailPayload: any) => {
  try {
    await createConnection(); 
    const channel = getChannel();
    const queue = "send_email_updates";

    await channel.assertQueue(queue, { durable: true });

    const payload =mailPayload;

    channel.sendToQueue(queue, Buffer.from(JSON.stringify(payload)), {
      persistent: true,
    });

  

  } catch (error) {
    console.error("Error in sending message to RabbitMQ:", error);
  }
};



export const sendToQueueCreateFolder = async (leadId: string, userId: string) => {
  try {
    await createConnection();
    const channel = getChannel();
    const queue = "create_folder";

    await channel.assertQueue(queue, { durable: true });

    // Proper payload banao
    const payload = {
      leadId: leadId?.toString(),
      userId: userId?.toString(),
    };

    console.log("Payload sending to RabbitMQ:", payload);

    channel.sendToQueue(queue, Buffer.from(JSON.stringify(payload)), {
      persistent: true,
    });

    console.log("Message sent to queue:", queue);
  } catch (error) {
    console.error("Error in sending message to RabbitMQ:", error);
  }
};
