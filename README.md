# PANTOhealth Backend Developer Assessment  

This project implements an **IoT data management system** for processing **x-ray data** using **NestJS, RabbitMQ, and MongoDB**.  
It consists of two applications:  
- **Consumer App** → Processes incoming IoT x-ray data, stores it in MongoDB, and provides RESTful APIs for data retrieval and analysis.  
- **Producer App** → Simulates IoT devices by sending sample x-ray data to a RabbitMQ queue.  

---

## 📌 System Architecture  

```mermaid
flowchart LR
    A[Producer App (IoT Simulation)] --> B[RabbitMQ Queue (xray.queue)]
    B --> C[Consumer App (NestJS)]
    C --> D[(MongoDB)]
    C --> E[REST API / Swagger Docs]
```

---

## 🚀 Prerequisites  

- **Node.js**: Version 18 or later  
- **MongoDB**: Local installation or via Docker (`mongo:6`)  
- **RabbitMQ**: Local installation or via Docker (`rabbitmq:3-management`)  
- **Docker Compose (optional)**: To run the entire stack together  

---

## ⚙️ Setup Instructions  

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd <your-repo-root>
```

### 2. Install Dependencies
```bash
# Consumer App
cd consumer-app && npm install

# Producer App
cd ../producer-app && npm install
```

### 3. Configure Environment Variables  

**consumer-app/.env**
```env
# Local (based on docker ps output)
MONGODB_URI=mongodb://localhost:27017/consumer-app
RABBITMQ_URI=amqp://localhost:5672
```

**producer-app/.env**
```env
# Local (based on docker ps output)
RABBITMQ_URI=amqp://localhost:5672
```

---

## 🐇 Running RabbitMQ and MongoDB via Docker  

Start RabbitMQ (with management plugin) and MongoDB containers:  
```bash
# RabbitMQ
docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management

# MongoDB
docker run -d --name mongodb -p 27017:27017 mongo:6
```

### ✅ Default Ports
| Service       | Port (Local) | Port (Container) | Usage                          |
|---------------|-------------|------------------|--------------------------------|
| RabbitMQ AMQP | 5672        | 5672             | Producer/Consumer connections |
| RabbitMQ UI   | 15672       | 15672            | Management Dashboard          |
| MongoDB       | 27017       | 27017            | Database access               |

---

## 📡 Run Applications  

### Without Docker Compose
```bash
# Start Consumer
cd consumer-app && npm run start:dev

# Start Producer
cd ../producer-app && npm run start:dev
```

### With Docker Compose
From the project root:
```bash
docker-compose up -d --build
```

---

## 📡 API Endpoints  

### Swagger Documentation  
- Consumer API Docs → [http://localhost:3000/api](http://localhost:3000/api)  
- Producer has a simple endpoint for testing (no Swagger).  

### Consumer Endpoints (CRUD + Filter)  
- `POST /signals` → Create a new x-ray signal  
- `GET /signals` → Get all x-ray signals  
- `GET /signals/:id` → Get a signal by ID  
- `PUT /signals/:id` → Update a signal  
- `DELETE /signals/:id` → Delete a signal  
- `GET /signals/filter?deviceId=<id>&from=<ISODate>&to=<ISODate>` → Filter signals  

### Producer Endpoint  
- `POST /producer/send` → Send sample x-ray data to RabbitMQ  

---

## 🧪 Testing  

The **Consumer App** includes unit tests (using **Jest**) for:  
- Data extraction and processing  
- CRUD operations  
- Handling large datasets (e.g., 300+ data points per message)  

Run tests:  
```bash
cd consumer-app
npm run test
```

---

## 🐳 Docker Compose  

```bash
docker-compose up -d
```

### Services  
- Consumer API → [http://localhost:3000/api](http://localhost:3000/api)  
- Producer → [http://localhost:3001/producer/send](http://localhost:3001/producer/send)  
- RabbitMQ Management → [http://localhost:15672](http://localhost:15672) (guest/guest)  
- MongoDB → `localhost:27017`  

---

## 📂 Sample Data  

```json
{
  "66bb584d4ae73e488c30a072": {
    "data": [
      [762, [51.339764, 12.339223833333334, 1.2038]],
      [1766, [51.33977733333333, 12.339211833333334, 1.531604]],
      [2763, [51.339782, 12.339196166666667, 2.13906]]
    ],
    "time": 1735683480000
  }
}
```

---

## 📌 Assumptions  

- Each message contains **one deviceId** as the root key.  
- `dataLength` = number of entries in the `data` array.  
- `dataVolume` = byte size of the JSON string of the message.  
- Invalid JSON or DB errors are handled with proper error responses.  
- RabbitMQ and MongoDB must be accessible via the URLs defined in `.env`.  

---

## 📝 Notes  

- Project developed on a single `master` branch.  
- **Consumer App** includes error handling and Swagger docs.  
- **Producer App** simulates IoT devices and pushes sample data to RabbitMQ.  
