# Crypto Crash Game Backend

## Description
This project is the backend for a multiplayer "Crypto Crash" gambling game using Node.js, Express.js, MongoDB, WebSockets, and real-time cryptocurrency pricing.

## Setup Instructions

### Prerequisites:
1. **Node.js** (v14 or above)
2. **MongoDB** (running locally or using a cloud database service)
3. **Postman** (for testing API endpoints)

### Installation:
1. Clone the repository:
    ```bash
    git clone https://github.com/your-username/crypto-crash-game-backend.git
    cd crypto-crash-game-backend
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

### Running Locally:
1. Ensure MongoDB is running locally (or configure to use a remote MongoDB instance).
2. Start the server:
    ```bash
    npm start
    ```

3. The server will run on `http://localhost:3000`.

### API Endpoints:
- **POST** `/api/game/bet`: Place a bet.
- **POST** `/api/game/cashout`: Cash out before the crash.
- **GET** `/api/player/wallet/{playerId}`: Get wallet balance.

### WebSocket Events:
- `round_start`: New round started.
- `round_crash`: The round has crashed.
- `multiplier`: Current multiplier.

## Testing with Postman:
You can import the Postman collection from the provided file.
