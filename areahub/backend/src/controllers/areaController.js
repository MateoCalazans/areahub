const prisma = require('../lib/prisma');

exports.listar = async (req, res) => {
  try {
    const { ativa } = req.query;

    const where = {};
    if (ativa !== undefined) {
      where.ativa = ativa === 'true';
    }

    const areas = await prisma.area.findMany({ where });

    return res.status(200).json({ areas });
  } catch (error) {
    console.error('Erro ao listar areas:', error);
    return res.status(500).json({ erro: 'Erro interno do servidor' });
  }
};

exports.buscarPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const area = await prisma.area.findUnique({
      where: { id: Number(id) },
      include: {
        _count: {
          select: { reservas: true },
        },
      },
    });

    if (!area) {
      return res.status(404).json({ erro: 'Area nao encontrada' });
    }

    return res.status(200).json({ area });
  } catch (error) {
    console.error('Erro ao buscar area:', error);
    return res.status(500).json({ erro: 'Erro interno do servidor' });
  }
};

exports.criar = async (req, res) => {
  try {
    const { nome, descricao, capacidade, horarioAbertura, horarioFechamento } = req.body;

    if (!nome || !capacidade || !horarioAbertura || !horarioFechamento) {
      return res.status(400).json({ erro: 'Nome, capacidade, horario de abertura e horario de fechamento sao obrigatorios' });
    }

    if (capacidade <= 0) {
      return res.status(400).json({ erro: 'Capacidade deve ser maior que zero' });
    }

    const area = await prisma.area.create({
      data: {
        nome,
        descricao: descricao || null,
        capacidade: Number(capacidade),
        horarioAbertura,
        horarioFechamento,
      },
    });

    return res.status(201).json({ mensagem: 'Area criada com sucesso', area });
  } catch (error) {
    console.error('Erro ao criar area:', error);
    return res.status(500).json({ erro: 'Erro interno do servidor' });
  }
};

exports.atualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, descricao, capacidade, horarioAbertura, horarioFechamento, ativa } = req.body;

    const areaExistente = await prisma.area.findUnique({
      where: { id: Number(id) },
    });

    if (!areaExistente) {
      return res.status(404).json({ erro: 'Area nao encontrada' });
    }

    if (capacidade !== undefined && capacidade <= 0) {
      return res.status(400).json({ erro: 'Capacidade deve ser maior que zero' });
    }

    const dadosAtualizacao = {};
    if (nome !== undefined) dadosAtualizacao.nome = nome;
    if (descricao !== undefined) dadosAtualizacao.descricao = descricao;
    if (capacidade !== undefined) dadosAtualizacao.capacidade = Number(capacidade);
    if (horarioAbertura !== undefined) dadosAtualizacao.horarioAbertura = horarioAbertura;
    if (horarioFechamento !== undefined) dadosAtualizacao.horarioFechamento = horarioFechamento;
    if (ativa !== undefined) dadosAtualizacao.ativa = ativa;

    const area = await prisma.area.update({
      where: { id: Number(id) },
      data: dadosAtualizacao,
    });

    return res.status(200).json({ mensagem: 'Area atualizada com sucesso', area });
  } catch (error) {
    console.error('Erro ao atualizar area:', error);
    return res.status(500).json({ erro: 'Erro interno do servidor' });
  }
};

exports.deletar = async (req, res) => {
  try {
    const { id } = req.params;

    const area = await prisma.area.findUnique({
      where: { id: Number(id) },
    });

    if (!area) {
      return res.status(404).json({ erro: 'Area nao encontrada' });
    }

    // Verificar se existem reservas futuras
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const reservasFuturas = await prisma.reserva.count({
      where: {
        areaId: Number(id),
        data: { gte: hoje },
        status: { in: ['PENDENTE', 'APROVADA'] },
      },
    });

    if (reservasFuturas > 0) {
      return res.status(400).json({ erro: 'Nao e possivel deletar a area pois existem reservas futuras vinculadas' });
    }

    await prisma.area.delete({
      where: { id: Number(id) },
    });

    return res.status(200).json({ mensagem: 'Area deletada com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar area:', error);
    return res.status(500).json({ erro: 'Erro interno do servidor' });
  }
};

exports.verificarDisponibilidade = async (req, res) => {
  try {
    const { id } = req.params;
    const { data } = req.query;

    if (!data) {
      return res.status(400).json({ erro: 'Data e obrigatoria (formato YYYY-MM-DD)' });
    }

    const area = await prisma.area.findUnique({
      where: { id: Number(id) },
    });

    if (!area) {
      return res.status(404).json({ erro: 'Area nao encontrada' });
    }

    const dataConsulta = new Date(data + 'T00:00:00.000Z');

    const reservas = await prisma.reserva.findMany({
      where: {
        areaId: Number(id),
        data: dataConsulta,
        status: { in: ['PENDENTE', 'APROVADA'] },
      },
      select: {
        id: true,
        horaInicio: true,
        horaFim: true,
        status: true,
      },
      orderBy: { horaInicio: 'asc' },
    });

    return res.status(200).json({
      area: {
        id: area.id,
        nome: area.nome,
        horarioAbertura: area.horarioAbertura,
        horarioFechamento: area.horarioFechamento,
      },
      data,
      reservas,
    });
  } catch (error) {
    console.error('Erro ao verificar disponibilidade:', error);
    return res.status(500).json({ erro: 'Erro interno do servidor' });
  }
};
