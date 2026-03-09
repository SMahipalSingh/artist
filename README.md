# CanvasFlow (Artishub Marketplace) 🎨

Welcome to CanvasFlow, a premier MERN stack e-commerce platform built for artists to sell physical prints and offer premium subscriptions.

## 🚀 Developer Onboarding Guide

If you are pulling this project from GitHub to work on it locally, follow these steps exactly to get your environment running.

### 1. Prerequisites
Before you start, ensure you have the following installed on your system:
*   [Node.js](https://nodejs.org/) (v18 or higher recommended)
*   [Git](https://git-scm.com/)
*   A code editor like [VS Code](https://code.visualstudio.com/)

### 2. Clone the Repository
Open your terminal (or command prompt) and clone the project:

```bash
git clone https://github.com/SMahipalSingh/artist.git
cd artist/artishub
```

### 3. Install NPM Dependencies
This project has two separate `package.json` files (one for the React Frontend, one for the Express Backend). You **must** install dependencies for both.

**A. Install Backend Dependencies:**
```bash
# From the root "artishub" directory
cd server
npm install
```

**B. Install Frontend Dependencies:**
```bash
# Go back to the root, then into the client folder
cd ../client
npm install
```

### 4. Create the Environment `.env` File
For security reasons, the `.env` file containing database passwords and secret keys is **not** uploaded to GitHub. You must create one manually in the **backend folder**.

1. Navigate to your `server/` folder.
2. Create a new file named exactly `.env` (no filename before the dot).
3. Paste the following template into your `.env` file and ask the lead developer for the missing keys (like the MongoDB URI):

```ini
PORT=5000
NODE_ENV=development

# Request the MongoDB connection string from Mahipal
MONGO_URI=your_mongodb_connection_string_here

# JWT Secret for User Authentication
JWT_SECRET=supersecret123
```

### 5. Start the Application
You need to run both the frontend and the backend servers simultaneously. The easiest way to do this is to use two separate terminal windows.

**Terminal 1 (Start the Backend):**
```bash
cd server
npm run dev
```
*You should see a message saying "Server running in development mode on port 5000" and "MongoDB Connected".*

**Terminal 2 (Start the Frontend):**
```bash
cd client
npm run dev
```
*You should see a Vite URL like `http://localhost:5174` (or similar).*

### 🎉 You're done!
Open the Vite localhost URL in your browser. The application should now be running locally on your machine connected to the cloud database.