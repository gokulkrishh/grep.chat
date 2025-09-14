import { createClient } from "redis"

const globalForRedis = globalThis as unknown as {
  redis: ReturnType<typeof createClient> | undefined
}

export const redis =
  globalForRedis.redis ??
  createClient({
    url: process.env.REDIS_URL || "redis://localhost:6379",
    socket: {
      connectTimeout: 60000,
    },
  })

if (process.env.NODE_ENV !== "production") {
  globalForRedis.redis = redis
}

if (!redis.isOpen) {
  redis.connect().catch(console.error)
}

export default redis
