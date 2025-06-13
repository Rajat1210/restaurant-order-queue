const amqp = require('amqplib');
const retry = require('retry');

const QUEUE_NAME = 'orders';
const DEAD_LETTER_QUEUE = 'dead_orders';

const operation = retry.operation({
    retries: 5,
    factor: 2,
    minTimeout: 1000,
    maxTimeout: 10000
});

async function processOrder(order) {
    console.log('Processing order:', order);
    const states = ['Received', 'Preparing', 'Ready for Pickup', 'Completed'];
    for (const state of states) {
        console.log(`Order ${order.orderId} is now: ${state}`);
        await new Promise(resolve => setTimeout(resolve, 2000)); 
    }
    console.log('Order processed successfully:', order);
}

async function consumeQueue() {
    try {
        const connection = await amqp.connect('amqp://localhost');
        const channel = await connection.createChannel();
        await channel.assertQueue('orders', { durable: true });

        channel.consume('orders', (msg) => {
            if (msg !== null) {
                const order = JSON.parse(msg.content.toString());
                operation.attempt((currentAttempt) => {
                processOrder(order)
                    .then(() => {
                        channel.ack(msg);
                    })
                    .catch(err => {
                        if (operation.retry(err)) return;
                        console.error('Failed after retries:', err);
                        channel.sendToQueue(DEAD_LETTER_QUEUE, Buffer.from(JSON.stringify(order)), { persistent: true });
                        channel.ack(msg);
                    });
            });
        }
});
        
        console.log('Consumer is running');
    } catch (error) {
        console.error('Error consuming queue:', error);
    }
}

await channel.assertQueue(DEAD_LETTER_QUEUE, { durable: true });
channel.sendToQueue(DEAD_LETTER_QUEUE, Buffer.from(JSON.stringify(order)));

consumeQueue().catch(console.error);