const prisma = require('../lib/prisma');

exports.listar = async (req, res) => {
  try {
    const condominos = await prisma.condomino.findMany({
      include: {
        usuario: {
          select: {
            id: true,
            nome: true,
            email: true,
            status: true,
            role: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    return res.status(200).json({ condominos });
  } catch (error) {
    console.error('Erro ao listar condominos:', error);
    return res.status(500).json({ erro: 'Erro interno do servidor' });
  }
};

exports.buscarPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const condomino = await prisma.condomino.findUnique({
      where: { id: Number(id) },
      include: {
        usuario: {
          select: {
            id: true,
            nome: true,
            email: true,
            status: true,
            role: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        reservas: {
          include: {
            area: true,
          },
          orderBy: { data: 'desc' },
        },
      },
    });

    if (!condomino) {
      return res.status(404).json({ erro: 'Condomino nao encontrado' });
    }

    return res.status(200).json({ condomino });
  } catch (error) {
    console.error('Erro ao buscar condomino:', error);
    return res.status(500).json({ erro: 'Erro interno do servidor' });
  }
};

exports.criar = async (req, res) => {
  try {
    const { unidade, usuarioId } = req.body;

    if (!unidade || !usuarioId) {
      return res.status(400).json({ erro: 'Unidade e usuarioId sao obrigatorios' });
    }

    // Verificar se o usuario existe
    const usuario = await prisma.usuario.findUnique({
      where: { id: Number(usuarioId) },
      include: { condomino: true },
    });

    if (!usuario) {
      return res.status(404).json({ erro: 'Usuario nao encontrado' });
    }

    if (usuario.condomino) {
      return res.status(409).json({ erro: 'Este usuario ja possui um registro de condomino' });
    }

    const condomino = await prisma.condomino.create({
      data: {
        unidade,
        usuarioId: Number(usuarioId),
      },
      include: {
        usuario: {
          select: {
            id: true,
            nome: true,
            email: true,
            status: true,
            role: true,
          },
        },
      },
    });

    return res.status(201).json({ mensagem: 'Condomino criado com sucesso', condomino });
  } catch (error) {
    console.error('Erro ao criar condomino:', error);
    return res.status(500).json({ erro: 'Erro interno do servidor' });
  }
};

exports.atualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const { unidade } = req.body;

    if (!unidade) {
      return res.status(400).json({ erro: 'Unidade e obrigatoria' });
    }

    const condominoExistente = await prisma.condomino.findUnique({
      where: { id: Number(id) },
    });

    if (!condominoExistente) {
      return res.status(404).json({ erro: 'Condomino nao encontrado' });
    }

    const condomino = await prisma.condomino.update({
      where: { id: Number(id) },
      data: { unidade },
      include: {
        usuario: {
          select: {
            id: true,
            nome: true,
            email: true,
            status: true,
            role: true,
          },
        },
      },
    });

    return res.status(200).json({ mensagem: 'Condomino atualizado com sucesso', condomino });
  } catch (error) {
    console.error('Erro ao atualizar condomino:', error);
    return res.status(500).json({ erro: 'Erro interno do servidor' });
  }
};

exports.deletar = async (req, res) => {
  try {
    const { id } = req.params;

    const condomino = await prisma.condomino.findUnique({
      where: { id: Number(id) },
    });

    if (!condomino) {
      return res.status(404).json({ erro: 'Condomino nao encontrado' });
    }

    await prisma.condomino.delete({
      where: { id: Number(id) },
    });

    return res.status(200).json({ mensagem: 'Condomino deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar condomino:', error);
    return res.status(500).json({ erro: 'Erro interno do servidor' });
  }
};
