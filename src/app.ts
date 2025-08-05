import express from 'express';
import { limiter } from './middlewares/limiter';
import { errorHandler } from './middlewares/errorHandler';
import notesRouter from './routes/notes';

const app = express();
app.use(express.json());
app.use(limiter);
app.use('/notes', notesRouter);
app.use(errorHandler);

export default app;
