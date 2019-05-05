const keys = require('./keys');
const redis = require('redis');

const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: () => 1000 
});
const sub = redisClient.duplicate(); // subscription. 

function fib(index) {
    if(index < 2) return 1;
    return fib(index - 1) + fib(index - 2);
}

// Watch redis and run cb any time it gets a message

sub.on('message', (channel, message) => {
    console.log('receiving something', message);
    console.log('fib number', fib(parseInt(message)))
    redisClient.hset('values', message, fib(parseInt(message)));
}); 
sub.subscribe('insert');