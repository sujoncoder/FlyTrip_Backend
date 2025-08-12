/* eslint-disable no-console */
import { createClient } from 'redis';
import { SECRET } from './env';


// REDIS CONFIG
export const redisClient = createClient({
    username: SECRET.REDIS_USERNAME,
    password: SECRET.REDIS_PASSWORD,
    socket: {
        host: SECRET.REDIS_HOST,
        port: Number(SECRET.REDIS_PORT)
    }
});

redisClient.on('error', err => console.log('Redis Client Error', err));



// await client.set('foo', 'bar');
// const result = await client.get('foo');
// console.log(result)  // >>> bar


export const connectRedis = async () => {
    if (!redisClient.isOpen) {
        await redisClient.connect();
        console.log("🌵 Redis Connected");
    }
};