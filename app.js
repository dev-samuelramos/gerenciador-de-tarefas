import dotenv from 'dotenv';
import express from 'express';
import connectDB from './db.js';
import authRouter from './authRouter.js';
import taskRouter from './taskRouter.js';

// Carrega variáveis do .env
dotenv.config();

const app = express();
app.use(express.json());

// Conecta ao banco
connectDB();

app.use('/auth', authRouter);
app.use('/tasks', taskRouter);

export default app;
