import axios from 'axios';

// In production (Render serving React build), relative paths work fine.
// In dev, Vite proxy handles /api/* → localhost:5000.
// VITE_API_URL can override for separate frontend/backend deployments.
const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
});

export default instance;
