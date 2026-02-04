import express from 'express';
import route from './route/index';
import { errorHandler } from './middleware/errorHandler';

const app = express();

app.use(express.json());

// Routes
app.use('/api/', route);

// Global error handler (should be after routes)
app.use(errorHandler);

export default app;