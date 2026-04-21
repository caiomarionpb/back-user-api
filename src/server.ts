
/**
 * Arquivo principal do backend (server.ts)
 * Inicializa o servidor Express, configura middlewares, rotas e inicia o listener.
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Conexão com o banco de dados
import './config/db';
// Rotas principais
import userRoutes from './routes/user.routes';
import authRoutes from './routes/auth.routes';
import bookingRoutes from './bookings/booking.routes';

dotenv.config();

const app = express();

// Middlewares globais
app.use(cors());
app.use(express.json());           // Importante: lê JSON no body
app.use(express.urlencoded({ extended: true })); // Opcional: lê form-data

// Rotas da aplicação
app.use('/api/auth', authRoutes);      // Rotas de autenticação
app.use('/api/users', userRoutes);    // Rotas de usuários
app.use('/api/bookings', bookingRoutes); // Rotas de agendamentos

// Rota de teste simples
app.get('/api/teste', (req, res) => {
  res.send('teste ok');
});

// Rota principal
app.get('/', (req, res) => {
  res.send('API rodando 🚀');
});

// Inicializa o servidor na porta definida no .env ou 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));

// Rota de teste para usuários
app.get('/api/teste-user', (req, res) => res.send('rota de user ok'));