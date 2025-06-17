
# Distributed Task Queue for Restaurant Order Processing

## Overview
This project implements a distributed task queue system using **Node.js** and **RabbitMQ** for simulating restaurant order processing.

## Features
- ✅ Asynchronous order handling via message queue
- ✅ Reliable message delivery using **RabbitMQ**
- ✅ Exponential backoff retries for failed tasks
- ✅ Parallel order processing with multiple consumers
- ✅ Order state flow: `Received → Preparing → Ready for Pickup → Completed`
- ✅ Dead-letter queue (`dead_orders`) for unprocessable orders
- ✅ Dockerized setup for easy local development

---

## Technologies Used
- Node.js
- Express
- RabbitMQ
- Docker & Docker Compose

---

## Directory Structure
```
├── Dockerfile
├── docker-compose.yml
├── index.js              # API server
├── queueProducer.js      # Sends orders to the queue
├── queueConsumer.js      # Processes orders from the queue
├── package.json
└── README.md
```

---

## Setup Instructions

### 🔧 Prerequisites
- [Docker](https://www.docker.com/products/docker-desktop) installed and running

---

### 🚀 Running the Project

```bash
# Step 1: Clone the repository
git clone <your-repo-url>
cd <project-directory>

# Step 2: Build and start containers
docker-compose up --build
```

- The API server will be available at: `http://localhost:3000`
- RabbitMQ Management UI: `http://localhost:15672`  
  - Username: `guest`
  - Password: `guest`

---

## 📦 API Endpoints

### POST `/order`
Submit a new order to the queue.

**Request Body**
```json
{
  "orderId": "123",
  "items": ["Pizza", "Burger"]
}
```

**Response**
```json
{
  "status": "Order received",
  "order": {
    "orderId": "123",
    "items": ["Pizza", "Burger"]
  }
}
```

---

## 🛠 How It Works

1. A user/client sends a POST request to `/order`.
2. The API (producer) sends the order to RabbitMQ’s `orders` queue.
3. The consumer (`queueConsumer.js`) listens to the queue, processes orders in stages.
4. If processing fails after retries, the order is moved to the `dead_orders` queue.

---

## 🐇 RabbitMQ Queues

| Queue Name      | Purpose                                |
|-----------------|-----------------------------------------|
| `orders`        | Main queue for incoming orders          |
| `dead_orders`   | Backup for failed/unprocessed messages  |

---

## 🧪 Development Tips

- To test the API, use tools like [Postman](https://www.postman.com/) or `curl`.
- Check Docker logs:
  ```bash
  docker logs -f nodejs-app        # API logs
  docker logs -f order-consumer    # Consumer logs
  docker logs -f rabbitmq          # RabbitMQ logs
  ```




