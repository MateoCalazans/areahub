const prisma = require('../lib/prisma');
const bcrypt = require('bcryptjs');
const { enviarSenhaProvisoria } = require('../services/emailService');

function gerarSenhaProvisoria(length = 8) {
  const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let senha = '';
  for (let i = 0; i < length; i += 1) {
    senha += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
  }
  return senha;
}

exports.listar = async (req, res) => {
  try {
    const usuarios = await prisma.usuario.findMany({
      select: {
        id: true,
        nome: true,
        email: true,
        status: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        condomino: true,
      },
    });

    return res.status(200).json({ usuarios });
  } catch (error) {
    console.error('Erro ao listar usuarios:', error);
    return res.status(500).json({ erro: 'Erro interno do servidor' });
  }
};

exports.buscarPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const usuario = await prisma.usuario.findUnique({
      where: { id: Number(id) },
      select: {
        id: true,
        nome: true,
        email: true,
        status: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        condomino: true,
      },
    });

    if (!usuario) {
      return res.status(404).json({ erro: 'Usuario nao encontrado' });
    }

    return res.status(200).json({ usuario });
  } catch (error) {
    console.error('Erro ao buscar usuario:', error);
    return res.status(500).json({ erro: 'Erro interno do servidor' });
  }
};

exports.criar = async (req, res) => {
  try {
    const { nome, email, senha, role, status, unidade } = req.body;

    if (!nome || !email) {
      return res.status(400).json({ erro: 'Nome e email sao obrigatorios' });
    }

    const usuarioExistente = await prisma.usuario.findUnique({
      where: { email },
    });

    if (usuarioExistente) {
      return res.status(409).json({ erro: 'Ja existe um usuario com este email' });
    }

    const senhaProvisoria = senha || gerarSenhaProvisoria();
    const senhaHash = await bcrypt.hash(senhaProvisoria, 10);

    const resultado = await prisma.$transaction(async (tx) => {
      const novoUsuario = await tx.usuario.create({
        data: {
          nome,
          email,
          senha: senhaHash,
          role: role || 'CONDOMINO',
          status: status !== undefined ? status : true,
          primeiroAcesso: true,
        },
      });

      if ((role || 'CONDOMINO') === 'CONDOMINO') {
        if (!unidade) {
          throw new Error('Unidade e obrigatoria para condominos');
        }

        await tx.condomino.create({
          data: {
            unidade,
            usuarioId: novoUsuario.id,
          },
        });
      }

      return await tx.usuario.findUnique({
        where: { id: novoUsuario.id },
        select: {
          id: true,
          nome: true,
          email: true,
          status: true,
          role: true,
          primeiroAcesso: true,
          createdAt: true,
          updatedAt: true,
          condomino: true,
        },
      });
    });

    let previewUrl = null;
    try {
      const emailResult = await enviarSenhaProvisoria(resultado.email, resultado.nome, senhaProvisoria);
      previewUrl = emailResult?.previewUrl || null;
    } catch (emailError) {
      console.error('Erro ao enviar senha provisoria:', emailError);
    }

    const responsePayload = {
      mensagem: 'Usuario criado com sucesso',
      usuario: resultado,
    };

    if (previewUrl) {
      responsePayload.previewUrl = previewUrl;
    }

    return res.status(201).json(responsePayload);
  } catch (error) {
    console.error('Erro ao criar usuario:', error);
    if (error.message === 'Unidade e obrigatoria para condominos') {
      return res.status(400).json({ erro: error.message });
    }
    return res.status(500).json({ erro: 'Erro interno do servidor' });
  }
};

exports.atualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, email, senha, role, status, unidade } = req.body;

    const usuarioExistente = await prisma.usuario.findUnique({
      where: { id: Number(id) },
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
    if (status !== undefined) dadosAtualizacao.status = status;
    if (role !== undefined) dadosAtualizacao.role = role;
    if (senha) {
      dadosAtualizacao.senha = await bcrypt.hash(senha, 10);
      dadosAtualizacao.primeiroAcesso = false;
    }

    const resultado = await prisma.$transaction(async (tx) => {
      await tx.usuario.update({
        where: { id: Number(id) },
        data: dadosAtualizacao,
      });

      // Se mudou de role para CONDOMINO e nao tinha registro de condomino
      if (role === 'CONDOMINO' && !usuarioExistente.condomino) {
        if (!unidade) {
          throw new Error('Unidade e obrigatoria para condominos');
        }
        await tx.condomino.create({
          data: {
            unidade,
            usuarioId: Number(id),
          },
        });
      }

      // Se mudou de CONDOMINO para outro role, remover registro de condomino
      if (role && role !== 'CONDOMINO' && usuarioExistente.condomino) {
        await tx.condomino.delete({
          where: { id: usuarioExistente.condomino.id },
        });
      }

      // Se continua CONDOMINO e forneceu unidade, atualizar
      if (unidade && usuarioExistente.condomino && (!role || role === 'CONDOMINO')) {
        await tx.condomino.update({
          where: { id: usuarioExistente.condomino.id },
          data: { unidade },
        });
      }

      return await tx.usuario.findUnique({
        where: { id: Number(id) },
        select: {
          id: true,
          nome: true,
          email: true,
          status: true,
          role: true,
          createdAt: true,
          updatedAt: true,
          condomino: true,
        },
      });
    });

    return res.status(200).json({ mensagem: 'Usuario atualizado com sucesso', usuario: resultado });
  } catch (error) {
    console.error('Erro ao atualizar usuario:', error);
    if (error.message === 'Unidade e obrigatoria para condominos') {
      return res.status(400).json({ erro: error.message });
    }
    return res.status(500).json({ erro: 'Erro interno do servidor' });
  }
};

exports.alterarStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (status === undefined) {
      return res.status(400).json({ erro: 'Status e obrigatorio' });
    }

    const usuarioExistente = await prisma.usuario.findUnique({
      where: { id: Number(id) },
    });

    if (!usuarioExistente) {
      return res.status(404).json({ erro: 'Usuario nao encontrado' });
    }

    const usuarioAtualizado = await prisma.usuario.update({
      where: { id: Number(id) },
      data: { status: Boolean(status) },
      select: {
        id: true,
        nome: true,
        email: true,
        status: true,
        role: true,
        primeiroAcesso: true,
        createdAt: true,
        updatedAt: true,
        condomino: true,
      },
    });

    return res.status(200).json({ mensagem: 'Status do usuario atualizado com sucesso', usuario: usuarioAtualizado });
  } catch (error) {
    console.error('Erro ao alterar status do usuario:', error);
    return res.status(500).json({ erro: 'Erro interno do servidor' });
  }
};

exports.deletar = async (req, res) => {
  try {
    const { id } = req.params;

    const usuario = await prisma.usuario.findUnique({
      where: { id: Number(id) },
    });

    if (!usuario) {
      return res.status(404).json({ erro: 'Usuario nao encontrado' });
    }

    await prisma.usuario.delete({
      where: { id: Number(id) },
    });

    return res.status(200).json({ mensagem: 'Usuario deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar usuario:', error);
    return res.status(500).json({ erro: 'Erro interno do servidor' });
  }
};
