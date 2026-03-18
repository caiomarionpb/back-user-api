// src/controllers/auth.controller.ts
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import connection from '../config/db';

// REGISTER
export const register = (req: Request, res: Response) => {
  const { name, email, password, number, age } = req.body;

  if (!name || !email || !password || !number || !age) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
  }

  const checkQuery = 'SELECT * FROM users WHERE email = ?';
  connection.query(checkQuery, [email], (err, results: any) => {
    if (err) return res.status(500).json({ error: 'Erro no banco' });

    if (results.length > 0) {
      return res.status(400).json({ error: 'Email já cadastrado' });
    }

    const insertQuery = 'INSERT INTO users (name, email, password, number, age) VALUES (?, ?, ?, ?, ?)';
    connection.query(insertQuery, [name, email, password, number, age], (err2, result: any) => {
      if (err2) return res.status(500).json({ error: 'Erro ao criar usuário' });

      const token = jwt.sign(
        { id: result.insertId, email },
        process.env.JWT_SECRET as string,
        { expiresIn: '1d' }
      );

      return res.json({ token });
    });
  });
};

// LOGIN
export const login = (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email e senha obrigatórios' });
  }

  const query = 'SELECT * FROM users WHERE email = ? AND password = ?';
  connection.query(query, [email, password], (err, results: any) => {
    if (err) return res.status(500).json({ error: 'Erro no banco' });
    if (results.length === 0) return res.status(404).json({ error: 'Usuário ou senha incorretos' });

    const user = results[0];
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: '1d' }
    );

    return res.json({ token });
  });
};

// PROFILE
export const getProfile = (req: Request, res: Response) => {
  const userId = (req as any).userId; // definido no middleware
  const query = 'SELECT id, name, email, number, age FROM users WHERE id = ?';
  connection.query(query, [userId], (err, results: any) => {
    if (err) return res.status(500).json({ error: 'Erro no banco' });
    if (results.length === 0) return res.status(404).json({ error: 'Usuário não encontrado' });
    return res.json(results[0]);
  });
};

// UPDATE PROFILE
export const updateProfile = (req: Request, res: Response) => {
  const userId = (req as any).userId;
  const { name, number, age } = req.body;

  const query = 'UPDATE users SET name = ?, number = ?, age = ? WHERE id = ?';
  connection.query(query, [name, number, age, userId], (err) => {
    if (err) return res.status(500).json({ error: 'Erro ao atualizar' });
    return res.json({ message: 'Perfil atualizado com sucesso' });
  });
};