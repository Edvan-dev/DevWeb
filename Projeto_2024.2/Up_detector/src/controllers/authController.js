import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import path from 'path';
import { fileURLToPath } from 'url';
import { prisma } from '../utils/db.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Função de login: valida o usuário, compara a senha e gera o token JWT.
export const login = async (req, res) => {
    const { username, password } = req.body;
  
    try {
      const user = await prisma.user.findUnique({ where: { username } });
      if (!user) {
        return res.status(401).json({ success: false, message: 'Usuário não encontrado' });
      }
  
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return res.status(401).json({ success: false, message: 'Senha inválida' });
      }
  
      const token = jwt.sign(
        { id: user.id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
  
      return res.json({ success: true, token });
    } catch (error) {
      console.error('Erro no login:', error);
      return res.status(500).json({ success: false, message: 'Erro interno no servidor' });
    }
};
  
// Função de registro: cria um novo usuário e redireciona de acordo com o resultado.
// Se o nome de usuário já existir, redireciona de volta para a página de registro com uma mensagem de erro.
export const register = async (req, res) => {
    const { username, password } = req.body;
  
    try {
      const existingUser = await prisma.user.findUnique({ where: { username } });
      if (existingUser) {
        return res.redirect('/auth/register?error=usuario+ja+existe');
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
      await prisma.user.create({
        data: {
          username,
          password: hashedPassword,
        },
      });
  
      // Após o registro bem-sucedido, redirecionar para a página de login.
      return res.redirect('/auth/login');
    } catch (error) {
      console.error('Erro no registro:', error);
      return res.redirect('/auth/register?error=Erro+interno');
    }
};

export default router;