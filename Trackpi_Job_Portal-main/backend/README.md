# TrackPi Job Portal - Backend

The backend server for the TrackPi Job Portal, providing a robust API for user authentication, job management, and application logic. Built with Node.js and Express, it ensures secure and efficient data handling.

## 🚀 Technology Stack

### Core
- **[Node.js](https://nodejs.org/)**: JavaScript runtime environment.
- **[Express.js](https://expressjs.com/)**: Fast, unopinionated, minimalist web framework for Node.js.

### Database
- **[MongoDB](https://www.mongodb.com/)**: NoSQL database for flexible data storage.
- **[Mongoose](https://mongoosejs.com/)**: Elegant MongoDB object modeling for Node.js.

### Authentication & Security
- **[JSON Web Token (JWT)](https://jwt.io/)**: ^9.0.3 - Standard for securing API endpoints.
- **[Bcrypt](https://www.npmjs.com/package/bcrypt)**: ^6.0.0 (or bcryptjs) - Library to help you hash passwords.
- **[Cors](https://www.npmjs.com/package/cors)**: ^2.8.5 - Middleware to enable Cross-Origin Resource Sharing.

### Utilities
- **[Dotenv](https://www.npmjs.com/package/dotenv)**: ^17.2.3 - Module to load environment variables.
- **[Axios](https://axios-http.com/)**: ^1.13.2 - Promise based HTTP client.
- **[Nodemon](https://nodemon.io/)**: ^3.1.11 - Utility that monitors for changes and automatically restarts the server (Dev).

## 🛠️ Prerequisites

- **Node.js**: v18.0.0 or higher
- **MongoDB**: Local installation or MongoDB Atlas connection string.

## 📦 Installation

1. **Navigate to the backend directory**:
   ```bash
   cd Trackpi_Job_Portal/backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Setup**:
   Create a `.env` file in the root of the `backend` directory and add the following variables:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```

## 🚀 Usage

### Development Server
Run the server with Nodemon for automatic restarts:
```bash
npm run dev
```
The server will start on `http://localhost:5000` (or your defined PORT).

### Production Start
Start the server in production mode:
```bash
npm start
```

## 📂 Project Structure

```
backend/
├── config/              # Configuration files (DB connection, etc.)
├── controllers/         # Request handlers for routes
├── middleware/          # Custom middlewares (Auth, Error handling)
├── models/              # Mongoose database models
├── routes/              # API route definitions
├── .env                 # Environment variables
├── server.js            # Entry point for the application
└── package.json         # Project dependencies and scripts
```

## 📄 License

[License Information Here]
