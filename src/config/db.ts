
/**
 * Configuração e conexão com o banco de dados MySQL.
 * Utiliza variáveis de ambiente para os dados de acesso.
 */

import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

// Cria a conexão com o banco de dados usando dados do .env
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Realiza a conexão e exibe mensagem de sucesso ou erro
connection.connect((err) => {
  if (err) {
    console.error('Erro ao conectar no banco:', err);
    return;
  }
  console.log('Conectado ao MySQL 🚀');
});

export default connection;