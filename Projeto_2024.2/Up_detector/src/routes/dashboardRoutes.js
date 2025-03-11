import express from 'express';
import { prisma } from '../utils/db.js';
import { getDashboard, addIP, deleteIP, pingIP } from '../controllers/dashboardController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getDashboard);
router.post('/add-ip', addIP);
router.post('/delete-ip', deleteIP);

router.get('/get-ips', authenticateToken, async (req, res) => {
    try {
      const ips = await prisma.ip.findMany();
      res.json(ips);
    } catch (error) {
      console.error('Erro ao buscar IPs:', error);
      res.status(500).json({ error: 'Erro ao buscar IPs' });
    }
});

router.get('/ping/:ip', pingIP); // Rota para Ping

export default router;