# Distributed Task Queue for Restaurant Order Processing

## Overview
This project implements a distributed task queue for restaurant order processing using Node.js and RabbitMQ.

## Features
- Asynchronous order processing.
- Reliable message delivery with RabbitMQ.
- Exponential backoff for retrying failed tasks.
- Parallel processing by multiple consumers.
- Order state progression: "Received", "Preparing", "Ready for Pickup", "Completed".
- Dead-letter queue for unprocessable messages.
- Detailed error logging for debugging and monitoring.

## Setup Instructions

### Prerequisites
- .
- Node.js installedRabbitMQ installed and running locally.

### Steps
1. Install RabbitMQ from [RabbitMQ Official Website](https://www.rabbitmq.com/download.html).
2. Start RabbitMQ and ensure it is running on `localhost:5672`.
3. Clone the repository.
4. Run `npm install` to install dependencies.
5. Start the application using `node index.js`.
6. Use tools like Postman or curl to interact with the API.

### API Endpoints
- **POST /order**: Submit a new order.
  - Request Body: `{ "orderId": "123", "items": ["Pizza", "Burger"] }`
- **GET /orders**: Fetch order statuses.

## Notes
- Ensure RabbitMQ is running before submitting orders.
- Monitor order states and errors in the console logs.
- Check the dead-letter queue (`dead_orders`) for unprocessable messages.