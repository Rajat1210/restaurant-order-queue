const amqp = require('amqplib');

async function sendToQueue(order) {
    try {
        const connection = await amqp.connect('amqp://rabbitmq');
        const channel = await connection.createChannel();
        await channel.assertQueue('orders', { durable: true });
        channel.sendToQueue('orders', Buffer.from(JSON.stringify(order)), { persistent: true });
        console.log(`Order sent to queue: ${JSON.stringify(order)}`);
        await channel.close();
        await connection.close();
    } catch (error) {
        console.error('Error sending order to queue:', error);
    }
}

module.exports = { sendToQueue };