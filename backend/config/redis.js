const { createClient } = require("redis");


const isProduction = process.env.NODE_ENV === 'production';

const redisClient = createClient({
  url: isProduction ? process.env.REDIS_URL : "redis://127.0.0.1:6379"
});

redisClient.on("error", (err) => {
  console.error("Redis Error:", err);
});

(async () => {
  await redisClient.connect();
  console.log(`Redis connected (${isProduction ? 'Production/Upstash' : 'Localhost'})`);
})();

module.exports = redisClient;