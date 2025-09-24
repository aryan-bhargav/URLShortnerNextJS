import Redis from "ioredis";

declare global {
  var redis: Redis | undefined;
}

if (!process.env.REDIS_URL) {
  throw new Error("REDIS_URL is not defined in .env.local");
}

// Reuse Redis instance in serverless
const redis: Redis = global.redis ?? new Redis(process.env.REDIS_URL);

if (!global.redis) global.redis = redis;

export default redis;
