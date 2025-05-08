import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import postRoutes from './routes/posts.js';
import userRouter from "./routes/user.js";

dotenv.config();

const app = express();

app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ limit: '30mb', extended: true }));
app.use(cors());

app.use('/posts', postRoutes);
app.use('/user', userRouter);

const PORT = process.env.PORT || 5001;
const CONNECTION_URL = process.env.MONGO_URI;

mongoose.connect(CONNECTION_URL)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on: http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  });

