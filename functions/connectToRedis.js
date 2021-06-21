const redis = require('redis');

async function connectToRedis() {
    return await new Promise((resolve, reject) => {
        const redisClient = redis.createClient({ url: process.env.REDIS_PATH });

        redisClient.on('error', err => {
            console.error('REDIS ERROR', err);
            redisClient.quit();
            reject(err);
        });

        redisClient.on('ready', () => resolve(redisClient));
    });
}

module.exports = connectToRedis;
