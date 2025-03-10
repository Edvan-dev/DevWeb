import { prisma } from '../utils/db.js';

export const login = async (req, res) => {
    const { username, password } = req.body;
    try {
        // Realiza a busca do usuário com base no username e password
        const user = await prisma.user.findFirst({
            where: {
                username,
                password,
            },
        });

        if (user) {
            res.json({ success: true, message: 'Login bem-sucedido!' });
        } else {
            res.status(401).json({ success: false, message: 'Credenciais inválidas' });
        }
    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({ success: false, message: 'Erro no servidor' });
    }
};
export const register = async (req, res) => {
    const { username, password } = req.body;
    try {
        // Verifica se o usuário já existe
        const existingUser = await prisma.user.findUnique({
            where: { username },
        });
        if (existingUser) {
            // Redirecionar para a página de cadastro com mensagem de erro
            return res.redirect('/auth/register?error=usuario+ja+existe');
        }
        
        // Cria o usuário caso não exista
        await prisma.user.create({
            data: {
                username,
                password,
            },
        });
        res.redirect('/auth/login');
    } catch (error) {
        console.error('Erro no registro do usuário:', error);
        res.status(500).json({ success: false, message: 'Erro no servidor' });
    }
};