import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5050;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(cors());
app.use(express.json());

// API placeholder route
app.get('/api', (req, res) => {
  res.json({ message: "API is connected" });
});

// Serve frontend build static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(join(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(join(__dirname, 'dist', 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('Chef Kitchen API is running. Use Vite on port 3000 to access the frontend.');
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
