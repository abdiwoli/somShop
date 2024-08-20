import express from 'express';
import cors from 'cors';
import router from './routes/index';
import path from 'path';

const app = express();

// Middleware to parse incoming JSON and URL-encoded data
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ limit: '20mb', extended: true }));

// Enable CORS
app.use(cors());

// Serve static files from the 'uploads' directory using the '/images' path
app.use('/images', express.static(path.join(__dirname, 'uploads')));

// Handle 404 for missing images
app.use('/images', (req, res) => {
  res.status(404).send('Image not found');
});

// Use the router for other routes
app.use(router);

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Som Server running on port ${port}`);
});

export default app;
