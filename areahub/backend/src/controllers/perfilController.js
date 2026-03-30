const prisma = require('../lib/prisma');
const bcrypt = require('bcryptjs');

exports.buscarPerfil = async (req, res) => {
  try {
    const usuario = await prisma.usuario.findUnique({
      where: { id: Number(req.user.id) },
      include: { condomino: true },
    });

    if (!usuario) {
      return res.status(404).json({ erro: 'Usuario nao encontrado' });
    }

    const { senha, ...usuarioSemSenha } = usuario;
    return res.status(200).json({ usuario: usuarioSemSenha });
  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    return res.status(500).json({ erro: 'Erro interno do servidor' });
  }
};

exports.atualizarPerfil = async (req, res) => {
  try {
    const { nome, email, senha } = req.body;
    const usuarioExistente = await prisma.usuario.findUnique({
      where: { id: Number(req.user.id) },
      include: { condomino: true },
    });

    if (!usuarioExistente) {
      return res.status(404).json({ erro: 'Usuario nao encontrado' });
    }

    if (email && email !== usuarioExistente.email) {
      const emailEmUso = await prisma.usuario.findUnique({ where: { email } });
      if (emailEmUso) {
        return res.status(409).json({ erro: 'Ja existe um usuario com este email' });
      }
    }

    const dadosAtualizacao = {};
    if (nome !== undefined) dadosAtualizacao.nome = nome;
    if (email !== undefined) dadosAtualizacao.email = email;
    if (senha) {
      dadosAtualizacao.senha = await bcrypt.hash(senha, 10);
      dadosAtualizacao.primeiroAcesso = false;
    }

    const usuarioAtualizado = await prisma.usuario.update({
      where: { id: Number(req.user.id) },
      data: dadosAtualizacao,
      include: { condomino: true },
    });

    const { senha: _, ...usuarioSemSenha } = usuarioAtualizado;
    return res.status(200).json({ mensagem: 'Perfil atualizado com sucesso', usuario: usuarioSemSenha });
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    return res.status(500).json({ erro: 'Erro interno do servidor' });
  }
};
