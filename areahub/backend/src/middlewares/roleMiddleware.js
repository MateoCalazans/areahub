const roleMiddleware = (rolesPermitidas) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ erro: 'Usuario nao autenticado' });
    }

    if (!rolesPermitidas.includes(req.user.role)) {
      return res.status(403).json({ erro: 'Acesso negado. Voce nao tem permissao para esta acao' });
    }

    next();
  };
};

module.exports = roleMiddleware;
