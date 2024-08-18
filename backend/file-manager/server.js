import express from 'express';
import cors from 'cors';
import router from './routes/index';

const app = express();

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ limit: '20mb', extended: true }));
app.use(cors());
app.use(router);
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Som Server running on port ${port}`);
});

export default app;
