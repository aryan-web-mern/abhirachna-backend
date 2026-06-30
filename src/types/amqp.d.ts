declare module 'amqplib' {
  export interface Connection {
    createChannel(): Promise<Channel>;
    close(): Promise<void>;
  }

  export interface Channel {
    assertQueue(queue: string, options?: any): Promise<void>;
    sendToQueue(queue: string, content: Buffer, options?: any): void;
    consume(queue: string, callback: (msg: any) => void, options?: any): void;
    ack(msg: any): void;
    prefetch(count: number, global?: boolean): void;
    nack(msg: any, allUpTo?: boolean, requeue?: boolean): void;
    close(): Promise<void>;
  }

  export function connect(url: string): Promise<Connection>;
  export function createChannel(): Promise<Channel>;
}
