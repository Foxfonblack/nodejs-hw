import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { errors } from 'celebrate';

import { connectMongoDB } from './db/connectMongoDB.js';
import { logger } from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';
import notesRoutes from './routes/notesRoutes.js';
import authRoutes from './routes/authRoutes.js';

const PORT = process.env.PORT || 3000;

const bootstrap = async () => {
  await connectMongoDB();

  const app = express();

  app.use(logger);
  app.use(express.json());
  app.use(cookieParser());
  app.use(cors({ credentials: true, origin: true }));

  app.use(authRoutes);
  app.use(notesRoutes);

  app.use(notFoundHandler);

  app.use(errors());
  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

bootstrap();
