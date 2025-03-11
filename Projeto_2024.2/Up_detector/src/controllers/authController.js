import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import path from 'path';
import { fileURLToPath } from 'url';
import { prisma } from '../utils/db.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function for login: validates the user, compares the password and generates the JWT token
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
  
// Function for register: creates a new user and redirects according to the result.
// If the username already exists, it redirects back to the registration page with an error message.
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
  
      // Upon successful registration, redirect to the login page.
      return res.redirect('/auth/login');
    } catch (error) {
      console.error('Erro no registro:', error);
      return res.redirect('/auth/register?error=Erro+interno');
    }
};

export default router;