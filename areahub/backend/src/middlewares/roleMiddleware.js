/**
 * Middleware de Controle de Funções (Roles)
 * Responsável por autorizar requisições baseado no perfil do usuário
 */

const roleMiddleware = (allowedRoles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Usuário não autenticado' });
      }

      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({ error: 'Acesso não autorizado para este perfil' });
      }

      next();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
};

module.exports = roleMiddleware;
