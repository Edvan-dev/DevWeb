import express from 'express';
import { login, register } from '../controllers/authController.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/register.html'));
  });
router.get('/login', (req, res) => {
res.sendFile(path.join(__dirname, '../views/login.html'));
});  

export default router;