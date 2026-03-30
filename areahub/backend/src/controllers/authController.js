const prisma = require('../lib/prisma');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

function gerarToken(usuario) {
  const payload = {
    id: usuario.id,
    nome: usuario.nome,
    email: usuario.email,
    role: usuario.role,
    primeiroAcesso: usuario.primeiroAcesso,
  };

  if (usuario.condomino) {
    payload.condominoId = usuario.condomino.id;
  }

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  });
}

exports.login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ erro: 'Email e senha sao obrigatorios' });
    }

    const usuario = await prisma.usuario.findUnique({
      where: { email },
      include: { condomino: true },
    });

    if (!usuario) {
      return res.status(401).json({ erro: 'Credenciais invalidas' });
    }

    if (!usuario.status) {
      return res.status(401).json({ erro: 'Usuario inativo. Entre em contato com a administracao' });
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);

    if (!senhaValida) {
      return res.status(401).json({ erro: 'Credenciais invalidas' });
    }

    const token = gerarToken(usuario);
    const { senha: _, ...usuarioSemSenha } = usuario;

    return res.status(200).json({
      mensagem: 'Login realizado com sucesso',
      token,
      usuario: usuarioSemSenha,
    });
  } catch (error) {
    console.error('Erro no login:', error);
    return res.status(500).json({ erro: 'Erro interno do servidor' });
  }
};

exports.primeiroAcesso = async (req, res) => {
  try {
    const { senha } = req.body;

    if (!senha) {
      return res.status(400).json({ erro: 'A nova senha e obrigatoria' });
    }

    const usuario = await prisma.usuario.findUnique({
      where: { id: Number(req.user.id) },
      include: { condomino: true },
    });

    if (!usuario) {
      return res.status(404).json({ erro: 'Usuario nao encontrado' });
    }

    if (!usuario.primeiroAcesso) {
      return res.status(400).json({ erro: 'Primeiro acesso ja foi realizado' });
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    const usuarioAtualizado = await prisma.usuario.update({
      where: { id: Number(req.user.id) },
      data: { senha: senhaHash, primeiroAcesso: false },
      include: { condomino: true },
    });

    const token = gerarToken(usuarioAtualizado);
    const { senha: _, ...usuarioSemSenha } = usuarioAtualizado;

    return res.status(200).json({
      mensagem: 'Senha atualizada com sucesso',
      token,
      usuario: usuarioSemSenha,
    });
  } catch (error) {
    console.error('Erro no primeiro acesso:', error);
    return res.status(500).json({ erro: 'Erro interno do servidor' });
  }
};

exports.redefinirSenha = async (req, res) => {
  try {
    const { senhaAtual, novaSenha } = req.body;

    if (!senhaAtual || !novaSenha) {
      return res.status(400).json({ erro: 'Senha atual e nova senha sao obrigatorios' });
    }

    const usuario = await prisma.usuario.findUnique({
      where: { id: Number(req.user.id) },
      include: { condomino: true },
    });

    if (!usuario) {
      return res.status(404).json({ erro: 'Usuario nao encontrado' });
    }

    const senhaValida = await bcrypt.compare(senhaAtual, usuario.senha);
    if (!senhaValida) {
      return res.status(401).json({ erro: 'Senha atual incorreta' });
    }

    const novaSenhaHash = await bcrypt.hash(novaSenha, 10);

    const usuarioAtualizado = await prisma.usuario.update({
      where: { id: Number(req.user.id) },
      data: { senha: novaSenhaHash, primeiroAcesso: false },
      include: { condomino: true },
    });

    const token = gerarToken(usuarioAtualizado);
    const { senha: _, ...usuarioSemSenha } = usuarioAtualizado;

    return res.status(200).json({
      mensagem: 'Senha redefinida com sucesso',
      token,
      usuario: usuarioSemSenha,
    });
  } catch (error) {
    console.error('Erro ao redefinir senha:', error);
    return res.status(500).json({ erro: 'Erro interno do servidor' });
  }
};

exports.logout = async (req, res) => {
  try {
    return res.status(200).json({ mensagem: 'Logout realizado com sucesso' });
  } catch (error) {
    console.error('Erro no logout:', error);
    return res.status(500).json({ erro: 'Erro interno do servidor' });
  }
};
