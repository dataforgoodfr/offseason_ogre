import { createClient } from "redis";

export const redis = { getPubSubClients, disconnect };

type RedisClient = ReturnType<typeof createClient>;

let pubClient: RedisClient | null = null;
let subClient: RedisClient | null = null;

async function getPubSubClients(): Promise<{
  pubClient: RedisClient;
  subClient: RedisClient;
}> {
  await initPubSubClients();
  return { pubClient, subClient } as {
    pubClient: RedisClient;
    subClient: RedisClient;
  };
}

async function initPubSubClients() {
  if (!pubClient) {
    pubClient = createClient({ url: process.env.REDIS_URL });
  }

  if (!subClient) {
    subClient = pubClient.duplicate();
  }

  await Promise.all([connectClient(pubClient), connectClient(subClient)]);
}

async function connectClient(client: RedisClient) {
  return !client.isOpen ? client.connect() : Promise.resolve();
}

async function disconnect() {
  await Promise.all([disconnectClient(pubClient), disconnectClient(subClient)]);
}

async function disconnectClient(client: RedisClient | null) {
  return !!client && client.isOpen ? client.disconnect() : Promise.resolve();
}
