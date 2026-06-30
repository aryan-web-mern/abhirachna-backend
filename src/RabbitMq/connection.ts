import * as amqp from 'amqplib';
import Appconfig from "../Config/Appconfig";


let connection: Awaited<ReturnType<typeof amqp.connect>> | null = null;
let channel: amqp.Channel | null = null;

export const createConnection = async () => {
  if (connection && channel) return { connection, channel };

  try {
    //create connection to RabbitMQ server
    const uri = Appconfig.mq_url
    connection = await amqp.connect(uri);

    if (!connection) {
      throw new Error("Failed to establish RabbitMQ connection.");
    }

    channel = await connection.createChannel();

  

    return { connection, channel };
  } catch (error) {
    console.error("Failed to connect to RabbitMQ:", error);
    throw error;
  }
};

export const getChannel = () => {
  if (!channel) {
    throw new Error(
      "RabbitMQ channel not established. Call createConnection first."
    );
  }
  return channel;
};

export const closeConnection = async () => {
  try {
    if (connection && channel) {
      await connection.close();
      await channel.close();
      console.log("RabbitMQ connection closed");
    }
  } catch (error) {
    console.error("Error closing RabbitMQ connection:", error);
  }
};






