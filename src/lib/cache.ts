import Redis from 'ioredis';

const globalForRedis = global as unknown as { redis: Redis };

export const redis =
  globalForRedis.redis ||
  new Redis(process.env.REDIS_URL || 'redis://127.0.0.1:6379', {
    lazyConnect: true,
    maxRetriesPerRequest: 3,
    retryStrategy(times) {
      const delay = Math.min(times * 50, 2000);
      return delay;
    }
  });

if (process.env.NODE_ENV !== 'production') globalForRedis.redis = redis;

/**
 * Get data from cache. Returns null if not found or if cache fails.
 */
export async function getCache<T>(key: string): Promise<T | null> {
  try {
    const data = await redis.get(key);
    if (data) {
      return JSON.parse(data) as T;
    }
    return null;
  } catch (err) {
    console.error(`Cache GET error for key ${key}:`, err);
    return null; // Fallback to DB
  }
}

/**
 * Set data to cache with optional TTL in seconds.
 * Default TTL is 5 minutes (300 seconds).
 */
export async function setCache(key: string, data: any, ttlSeconds: number = 300): Promise<void> {
  try {
    await redis.set(key, JSON.stringify(data), 'EX', ttlSeconds);
  } catch (err) {
    console.error(`Cache SET error for key ${key}:`, err);
  }
}

/**
 * Invalidate a specific cache key.
 */
export async function invalidateCache(key: string): Promise<void> {
  try {
    await redis.del(key);
  } catch (err) {
    console.error(`Cache DEL error for key ${key}:`, err);
  }
}

/**
 * Invalidate keys matching a pattern. Use carefully in production.
 */
export async function invalidateCachePattern(pattern: string): Promise<void> {
  try {
    const stream = redis.scanStream({
      match: pattern,
      count: 100,
    });
    
    stream.on('data', async (keys) => {
      if (keys.length) {
        const pipeline = redis.pipeline();
        keys.forEach((key: string) => pipeline.del(key));
        await pipeline.exec();
      }
    });
  } catch (err) {
    console.error(`Cache PATTERN DEL error for pattern ${pattern}:`, err);
  }
}
