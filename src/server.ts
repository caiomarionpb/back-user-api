import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import './config/db';
import userRoutes from './routes/user.routes'; // ✅ deve bater com a pasta src/routes
import authRoutes from './routes/auth.routes';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());           // ✅ importante: lê JSON no body
app.use(express.urlencoded({ extended: true })); // opcional: lê form-data
app.use('/api/auth', authRoutes);   // login: /api/auth/login
app.use('/api/users', userRoutes);  // profile: /api/users/profile

// Rotas
app.use('/api', userRoutes);
app.use('/api', authRoutes);

app.get('/api/teste', (req, res) => {
  res.send('teste ok');
});

app.get('/', (req, res) => {
  res.send('API rodando 🚀');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
// dentro de server.ts
app.get('/api/teste-user', (req, res) => res.send('rota de user ok'));