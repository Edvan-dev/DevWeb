import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { login, register } from '../controllers/authController.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Rotas POST delegando a lógica de autenticação para o controller
router.post('/login', login);
router.post('/register', register);

// Rotas GET para servir as páginas HTML de login e registro
router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/login.html'));
});

router.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/register.html'));
});

export default router;