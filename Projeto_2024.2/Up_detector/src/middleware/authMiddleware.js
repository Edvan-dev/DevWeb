import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
  // O header padrão deve ser: "Authorization: Bearer <token>"
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Token não fornecido' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, userPayload) => {
    if (err) {
      return res.status(403).json({ success: false, message: 'Token inválido' });
    }
    // Anexa os dados do usuário à requisição para uso posterior
    req.user = userPayload;
    next();
  });
};
