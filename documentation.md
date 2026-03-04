# FinLit Backend Documentation

## 🚀 Introduction
FinLit Backend is a real-time, server-authoritative simulation engine for an Indian macroeconomic multiplayer game. It handles agriculture systems, financial modeling, role-based gameplay, and behavioral scoring.

## 🛠️ Getting Started

### Prerequisites
- **Node.js**: v16.x or higher
- **npm**: v7.x or higher
- **MySQL**: v8.0 or higher

### Installation
1. Clone the repository to your local machine.
2. Navigate to the backend directory:
   ```bash
   cd backend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

### Configuration
Create a `.env` file in the `src/` directory (or modify the existing one) with the following variables:
```env
PORT=5000
DB_HOST=localhost
DB_USER=your_username
DB_PASS=your_password
DB_NAME=finlit_db
NODE_ENV=development
```

## 📂 Project Structure
The project follows a modular architecture for scalability and maintainability:

- `src/config/`: Configuration files (Database connection, Passport, etc.).
- `src/controllers/`: Request handlers that orchestrate service calls.
- `src/middleware/`: Express middleware (Authentication, Validation, Error Handling).
- `src/models/`: Sequelize database models.
- `src/routes/`: API route definitions.
- `src/services/`: Core business logic and engine implementations.
- `src/types/`: TypeScript interfaces and custom type definitions.
- `src/utils/`: Utility functions and helper classes.
- `src/app.ts`: Express application setup and middleware integration.
- `src/server.ts`: Server entry point and configuration loading.

## 📜 Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the development server with `nodemon` and `ts-node`. |
| `npm run build` | Compiles TypeScript code into the `dist/` directory. |
| `npm start` | Runs the compiled application from the `dist/` directory. |
| `npm test` | Placeholder for running automated tests. |

## ⚙️ Core Systems Reference
The backend logic and data structure are governed by specialized mandates:
- **Backend Logic:** Refer to [GEMINI.md](./GEMINI.md) for game rules, engines, and role-specific logic.
- **Data Model:** Refer to [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) for the relational structure and design principles.

## 🛠️ Development Workflow
1. **Database Changes:** Update `DATABASE_SCHEMA.md` first. Implement changes via Sequelize migrations or model updates.
2. **Business Logic:** Logic should reside in the `services/` layer to remain independent of the transport layer (Express).
3. **API Endpoints:**
   - Define the route in `routes/`.
   - Implement the handler in `controllers/`.
   - Call relevant `services/`.
4. **Validation:** Always validate incoming data in the middleware layer before it reaches the controller.

## 🏥 Health Check
The API provides a health check endpoint to verify system status:
- **URL:** `GET /health`
- **Response:** `{ "status": "UP", "timestamp": "..." }`

## 📖 API Documentation (Swagger)
The project uses Swagger for interactive API documentation.
- **URL:** `http://localhost:5000/api-docs`
- **Features:**
  - Test API endpoints directly from the browser.
  - View detailed request/response schemas.
  - Authenticate using JWT via the "Authorize" button.

## 🎮 Unity Client Connection
The Unity client interacts with the backend via RESTful API calls.

### Connection Configuration
- **Base URL:** `http://<server-ip>:5000` (Local: `http://localhost:5000`)
- **Data Format:** All requests and responses use standard `JSON`.
- **Content-Type:** `application/json`

### Implementation in C# (Unity)
Use `UnityWebRequest` to communicate with the server. Ensure you use `yield return` or `async/await` for non-blocking operations.

```csharp
using UnityEngine;
using UnityEngine.Networking;
using System.Collections;

public class BackendClient : MonoBehaviour {
    private string baseUrl = "http://localhost:5000";

    public IEnumerator CheckHealth() {
        using (UnityWebRequest webRequest = UnityWebRequest.Get($"{baseUrl}/health")) {
            yield return webRequest.SendWebRequest();

            if (webRequest.result == UnityWebRequest.Result.Success) {
                Debug.Log("Server Status: " + webRequest.downloadHandler.text);
            } else {
                Debug.LogError("Error: " + webRequest.error);
            }
        }
    }
}
```

### Authentication Flow
1. **Login:** Send credentials to `/auth/login`.
2. **Token:** Receive a JWT (JSON Web Token) in the response.
3. **Authorization:** Include the token in the `Authorization` header for all subsequent requests.
   - **Header Format:** `Authorization: Bearer <your_token>`

### Best Practices for Unity
- **Serialization:** Use `JsonUtility` or `Newtonsoft.Json` for mapping JSON to C# Classes.
- **Error Handling:** Always check for network errors and HTTP status codes (401 for Unauthorized, 400 for Bad Request).
- **Time Sync:** Since the simulation is server-authoritative, use the server's `timestamp` from the health check or login response to synchronize your local timers.
