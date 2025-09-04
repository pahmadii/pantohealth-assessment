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

3. **Configure Environment Variables**:
   - Create a `.env` file in `consumer-app`:
     ```env
     MONGODB_URI=mongodb://localhost:27017/pantohealth
     RABBITMQ_URL=amqp://localhost:5672
     ```
   - Create a `.env` file in `producer-app`:
     ```env
     RABBITMQ_URL=amqp://localhost:5672
     ```

4. **Run the Applications**:
   - Start the Consumer app:
     ```bash
     cd consumer-app && npm run start:dev
     ```
   - Start the Producer app:
     ```bash
     cd ../producer-app && npm run start:dev
     ```

## API Endpoints
- **Swagger Documentation**: Access the API documentation at `http://localhost:3000/api`
- **Example Endpoint** (Producer):
  - Send sample x-ray data:
    ```bash
    curl -X POST http://localhost:3001/producer/send
    ```
- **Consumer Endpoints**:
  - `POST /signals`: Create a new x-ray signal
  - `GET /signals`: Get all x-ray signals
  - `GET /signals/:id`: Get a specific signal by ID
  - `PUT /signals/:id`: Update a signal
  - `DELETE /signals/:id`: Delete a signal
  - `GET /signals/filter?deviceId=<id>&startTime=<timestamp>`: Filter signals by deviceId and startTime

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

## Sample Data
The system processes x-ray data in the following JSON format, with up to 300 data points per message:
```json
{
  "66bb584d4ae73e488c30a072": {
    "data": [
      [762, [51.339764, 12.339223833333334, 1.2038]],
      [1766, [51.33977733333333, 12.339211833333334, 1.531604]],
      // ... up to 563 data points
    ],
    "time": 1735683480000
  }
}
```

## Assumptions
- Input x-ray data follows the provided JSON format with a single `deviceId` key, a `data` array of up to 300 `[time, [x-coord, y-coord, speed]]` entries, and a `time` timestamp.
- `dataLength` is calculated as the number of entries in the `data` array (e.g., 300 for the provided sample).
- `dataVolume` is calculated as the byte size of the JSON string of the `data` array.
- RabbitMQ and MongoDB are running locally or accessible via the provided URLs in `.env` files.
- Error handling is implemented for invalid JSON formats and database operations.

## Additional Notes
- The project uses Git Flow for version control, with `main` for stable releases and `develop` for ongoing development.
- All dependencies are managed via npm, and the project is compatible with Node.js v18+.
- The Consumer app includes robust error handling for data processing and database operations.
- The Producer app sends the provided sample x-ray data to the RabbitMQ queue.

For any issues or questions, please refer to the GitHub repository or contact the developer.