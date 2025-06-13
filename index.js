 const express = require('express');
const bodyParser = require('body-parser');
const { sendToQueue } = require('./queueProducer');
const amqp = require('amqplib');

const app = express();
app.use(bodyParser.json());

const QUEUE_NAME = 'orders';

app.post('/order', async (req, res) => {
    const order = req.body;
    try {
        console.log(`Received order: ${JSON.stringify(order)}`);
        await sendToQueue(order);
        res.status(200).send({ status: 'Order received', order });
    } catch (error) {
        console.error('Error processing order:', error);
        res.status(500).send({ status: 'Error processing order', error });
    }
});

app.get('/orders', async (req, res) => {
    try {
        const connection = await amqp.connect('amqp://localhost');
        const channel = await connection.createChannel();
        await channel.assertQueue(QUEUE_NAME, { durable: true });

        const messages = [];
        await channel.consume(QUEUE_NAME, (msg) => {
            if (msg !== null) {
                const order = JSON.parse(msg.content.toString());
                console.log(`Fetched order from queue: ${JSON.stringify(order)}`);
                messages.push(order);
                channel.ack(msg);
            }
        }, { noAck: false });

        setTimeout(async () => {
            await channel.close();
            await connection.close();
            res.status(200).send(messages);
        }, 1000); 

    } catch (error) {
        console.error('Error fetching order statuses:', error);
        res.status(500).send({ status: 'Error fetching order statuses', error });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));