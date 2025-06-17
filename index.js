const express = require('express');
const bodyParser = require('body-parser');
const { sendToQueue } = require('./queueProducer');

const app = express();
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('<h1>Order Queue System Running</h1><p>POST /order</p>');
});

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))