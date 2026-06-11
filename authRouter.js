import express from 'express';
import User from './User.js';
import { generateAccessToken, generateRefreshToken } from './token.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  const user = new User({ email, password });
  await user.save();
  res.status(201).json({ message: 'Usuário registrado!' });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: 'Credenciais inválidas' });
  }
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  user.refreshToken = refreshToken;
  await user.save();
  res.json({ accessToken, refreshToken });
});

router.post('/refresh', async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(401).json({ message: 'Token não fornecido' });

  const user = await User.findOne({ refreshToken });
  if (!user) return res.status(403).json({ message: 'Refresh token inválido' });

  try {
    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const newAccessToken = generateAccessToken(user);
    res.json({ accessToken: newAccessToken });
  } catch {
    res.status(403).json({ message: 'Refresh expirado' });
  }
});

export default router;
