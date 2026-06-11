import { jest } from '@jest/globals';
import dotenv from 'dotenv';
import request from 'supertest';
import mongoose from 'mongoose';
import app from './app.js';

dotenv.config();
jest.setTimeout(30000); // agora funciona


let accessToken;
let taskId;

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Auth e Tasks API', () => {
  it('Deve registrar usuário', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({ email: 'test@test.com', password: '123456' });
    expect(res.statusCode).toBe(201);
  });

  it('Deve logar usuário e retornar tokens', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'test@test.com', password: '123456' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('accessToken');
    accessToken = res.body.accessToken;
  });

  it('Deve criar tarefa', async () => {
    const res = await request(app)
      .post('/tasks')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ title: 'Minha primeira tarefa' });
    expect(res.statusCode).toBe(201);
    taskId = res.body._id;
  });

  it('Deve listar tarefas', async () => {
    const res = await request(app)
      .get('/tasks')
      .set('Authorization', `Bearer ${accessToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('Deve atualizar tarefa', async () => {
    const res = await request(app)
      .put(`/tasks/${taskId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ done: true });
    expect(res.statusCode).toBe(200);
    expect(res.body.done).toBe(true);
  });

  it('Deve deletar tarefa', async () => {
    const res = await request(app)
      .delete(`/tasks/${taskId}`)
      .set('Authorization', `Bearer ${accessToken}`);
    expect(res.statusCode).toBe(200);
  });
});
