import ping from 'ping';
import path from 'path';
import { fileURLToPath } from 'url';
import { prisma } from '../utils/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getDashboard = (req, res) => {
    res.sendFile(path.join(__dirname, '../views/dashboard.html'));
};

export const addIP = async (req, res) => {
    const { ip_address } = req.body;
    try {
        await prisma.ip.create({
            data: {
                ip_address,
            },
        });
        res.redirect('/dashboard');
    } catch (error) {
        console.error('Erro ao adicionar IP:', error);
        res.status(500).json({ success: false, message: 'Erro ao adicionar IP' });
    }
};

export const deleteIP = async (req, res) => {
    const { id } = req.body;
    try {
        await prisma.ip.delete({
            where: {
                id: Number(id),
            },
        });
        res.redirect('/dashboard');
    } catch (error) {
        console.error('Erro ao deletar IP:', error);
        res.status(500).json({ success: false, message: 'Erro ao deletar IP' });
    }
};
   export const pingIP = async (req, res) => {
    const { ip } = req.params;
    try {
      // Busca o registro do IP para criar a relação
      const ipRecord = await prisma.ip.findUnique({
        where: { ip_address: ip }
      });

      if (!ipRecord) {
        return res.json({ success: false, message: 'IP não encontrado' });
      }

      // Realiza o ping real usando a biblioteca "ping"
      const pingResult = await ping.promise.probe(ip);
      // O tempo retornado pode ser uma string; converta para número, se necessário.
      const time = Number(pingResult.time);

      // Salva o tempo de ping na tabela PingTime relacionado ao IP encontrado
      await prisma.pingTime.create({
        data: {
          time: time,
          ipId: ipRecord.id
        }
      });

      res.json({ success: true, time });
    } catch (error) {
      console.error('Erro ao realizar o ping:', error);
      res.json({ success: false });
    }
};