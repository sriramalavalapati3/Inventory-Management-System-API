import { createClient } from 'redis';

export const client = createClient({
    username: 'default',
    password: 'eghOEHh7Meg64MHbfZNWlXxiIWeDcD8I',
    socket: {
        host: 'redis-15032.c85.us-east-1-2.ec2.redns.redis-cloud.com',
        port: 15032
    }
});

client.on('error', err => console.log('Redis Client Error', err));

