const prisma = require('../lib/prisma');

// Funcao auxiliar para verificar conflito de horarios
function horariosConflitam(inicio1, fim1, inicio2, fim2) {
  return inicio1 < fim2 && inicio2 < fim1;
}

exports.listar = async (req, res) => {
  try {
    const { status, data, areaId } = req.query;
    const where = {};

    // Filtros opcionais
    if (status) {
      where.status = status;
    }
    if (data) {
      where.data = new Date(data + 'T00:00:00.000Z');
    }
    if (areaId) {
      where.areaId = Number(areaId);
    }

    // Se for CONDOMINO e nao estiver consultando uma area especifica, mostrar apenas suas reservas
    if (req.user.role === 'CONDOMINO' && !areaId) {
      if (!req.user.condominoId) {
        return res.status(400).json({ erro: 'Usuario condomino sem registro de condomino vinculado' });
      }
      where.condominoId = req.user.condominoId;
    }

    const reservas = await prisma.reserva.findMany({
      where,
      include: {
        condomino: {
          include: {
            usuario: {
              select: {
                id: true,
                nome: true,
                email: true,
              },
            },
          },
        },
        area: true,
      },
      orderBy: [{ data: 'desc' }, { horaInicio: 'asc' }],
    });

    return res.status(200).json({ reservas });
  } catch (error) {
    console.error('Erro ao listar reservas:', error);
    return res.status(500).json({ erro: 'Erro interno do servidor' });
  }
};

exports.buscarPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const reserva = await prisma.reserva.findUnique({
      where: { id: Number(id) },
      include: {
        condomino: {
          include: {
            usuario: {
              select: {
                id: true,
                nome: true,
                email: true,
              },
            },
          },
        },
        area: true,
      },
    });

    if (!reserva) {
      return res.status(404).json({ erro: 'Reserva nao encontrada' });
    }

    // Se for CONDOMINO, so pode ver as proprias reservas
    if (req.user.role === 'CONDOMINO' && reserva.condominoId !== req.user.condominoId) {
      return res.status(403).json({ erro: 'Acesso negado. Voce so pode visualizar suas proprias reservas' });
    }

    return res.status(200).json({ reserva });
  } catch (error) {
    console.error('Erro ao buscar reserva:', error);
    return res.status(500).json({ erro: 'Erro interno do servidor' });
  }
};

exports.criar = async (req, res) => {
  try {
    const { areaId, data, horaInicio, horaFim } = req.body;

    if (!areaId || !data || !horaInicio || !horaFim) {
      return res.status(400).json({ erro: 'Area, data, hora de inicio e hora de fim sao obrigatorios' });
    }

    if (!req.user.condominoId) {
      return res.status(400).json({ erro: 'Usuario nao possui registro de condomino vinculado' });
    }

    // Validar que hora inicio e menor que hora fim
    if (horaInicio >= horaFim) {
      return res.status(400).json({ erro: 'Hora de inicio deve ser anterior a hora de fim' });
    }

    // Verificar se a area existe e esta ativa
    const area = await prisma.area.findUnique({
      where: { id: Number(areaId) },
    });

    if (!area) {
      return res.status(404).json({ erro: 'Area nao encontrada' });
    }

    if (!area.ativa) {
      return res.status(400).json({ erro: 'Esta area nao esta ativa para reservas' });
    }

    // Validar horario dentro do funcionamento da area
    if (horaInicio < area.horarioAbertura || horaFim > area.horarioFechamento) {
      return res.status(400).json({
        erro: `Horario fora do periodo de funcionamento da area (${area.horarioAbertura} - ${area.horarioFechamento})`,
      });
    }

    // Verificar conflitos de horario
    const dataReserva = new Date(data + 'T00:00:00.000Z');

    const reservasExistentes = await prisma.reserva.findMany({
      where: {
        areaId: Number(areaId),
        data: dataReserva,
        status: { in: ['PENDENTE', 'APROVADA'] },
      },
    });

    const temConflito = reservasExistentes.some((r) =>
      horariosConflitam(horaInicio, horaFim, r.horaInicio, r.horaFim)
    );

    if (temConflito) {
      return res.status(409).json({ erro: 'Ja existe uma reserva para esta area neste horario' });
    }

    const reserva = await prisma.reserva.create({
      data: {
        data: dataReserva,
        horaInicio,
        horaFim,
        status: 'PENDENTE',
        condominoId: req.user.condominoId,
        areaId: Number(areaId),
      },
      include: {
        condomino: {
          include: {
            usuario: {
              select: { id: true, nome: true, email: true },
            },
          },
        },
        area: true,
      },
    });

    return res.status(201).json({ mensagem: 'Reserva criada com sucesso', reserva });
  } catch (error) {
    console.error('Erro ao criar reserva:', error);
    return res.status(500).json({ erro: 'Erro interno do servidor' });
  }
};

exports.atualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const { areaId, data, horaInicio, horaFim } = req.body;

    const reservaExistente = await prisma.reserva.findUnique({
      where: { id: Number(id) },
    });

    if (!reservaExistente) {
      return res.status(404).json({ erro: 'Reserva nao encontrada' });
    }

    // So pode atualizar se estiver PENDENTE
    if (reservaExistente.status !== 'PENDENTE') {
      return res.status(400).json({ erro: 'Somente reservas com status PENDENTE podem ser atualizadas' });
    }

    // Se for CONDOMINO, so pode atualizar as proprias
    if (req.user.role === 'CONDOMINO' && reservaExistente.condominoId !== req.user.condominoId) {
      return res.status(403).json({ erro: 'Acesso negado. Voce so pode atualizar suas proprias reservas' });
    }

    const novaAreaId = areaId ? Number(areaId) : reservaExistente.areaId;
    const novaData = data || reservaExistente.data;
    const novaHoraInicio = horaInicio || reservaExistente.horaInicio;
    const novaHoraFim = horaFim || reservaExistente.horaFim;

    if (novaHoraInicio >= novaHoraFim) {
      return res.status(400).json({ erro: 'Hora de inicio deve ser anterior a hora de fim' });
    }

    // Verificar area
    const area = await prisma.area.findUnique({
      where: { id: novaAreaId },
    });

    if (!area) {
      return res.status(404).json({ erro: 'Area nao encontrada' });
    }

    if (!area.ativa) {
      return res.status(400).json({ erro: 'Esta area nao esta ativa para reservas' });
    }

    if (novaHoraInicio < area.horarioAbertura || novaHoraFim > area.horarioFechamento) {
      return res.status(400).json({
        erro: `Horario fora do periodo de funcionamento da area (${area.horarioAbertura} - ${area.horarioFechamento})`,
      });
    }

    // Verificar conflitos (excluindo a reserva atual)
    const dataReserva = typeof novaData === 'string' ? new Date(novaData + 'T00:00:00.000Z') : novaData;

    const reservasExistentes = await prisma.reserva.findMany({
      where: {
        areaId: novaAreaId,
        data: dataReserva,
        status: { in: ['PENDENTE', 'APROVADA'] },
        id: { not: Number(id) },
      },
    });

    const temConflito = reservasExistentes.some((r) =>
      horariosConflitam(novaHoraInicio, novaHoraFim, r.horaInicio, r.horaFim)
    );

    if (temConflito) {
      return res.status(409).json({ erro: 'Ja existe uma reserva para esta area neste horario' });
    }

    const reserva = await prisma.reserva.update({
      where: { id: Number(id) },
      data: {
        areaId: novaAreaId,
        data: dataReserva,
        horaInicio: novaHoraInicio,
        horaFim: novaHoraFim,
      },
      include: {
        condomino: {
          include: {
            usuario: {
              select: { id: true, nome: true, email: true },
            },
          },
        },
        area: true,
      },
    });

    return res.status(200).json({ mensagem: 'Reserva atualizada com sucesso', reserva });
  } catch (error) {
    console.error('Erro ao atualizar reserva:', error);
    return res.status(500).json({ erro: 'Erro interno do servidor' });
  }
};

exports.cancelar = async (req, res) => {
  try {
    const { id } = req.params;

    const reserva = await prisma.reserva.findUnique({
      where: { id: Number(id) },
    });

    if (!reserva) {
      return res.status(404).json({ erro: 'Reserva nao encontrada' });
    }

    // Condomino so pode cancelar as proprias
    if (req.user.role === 'CONDOMINO' && reserva.condominoId !== req.user.condominoId) {
      return res.status(403).json({ erro: 'Acesso negado. Voce so pode cancelar suas proprias reservas' });
    }

    if (reserva.status === 'CANCELADA') {
      return res.status(400).json({ erro: 'Esta reserva ja esta cancelada' });
    }

    if (reserva.status === 'REJEITADA') {
      return res.status(400).json({ erro: 'Nao e possivel cancelar uma reserva rejeitada' });
    }

    const reservaAtualizada = await prisma.reserva.update({
      where: { id: Number(id) },
      data: { status: 'CANCELADA' },
      include: {
        condomino: {
          include: {
            usuario: {
              select: { id: true, nome: true, email: true },
            },
          },
        },
        area: true,
      },
    });

    return res.status(200).json({ mensagem: 'Reserva cancelada com sucesso', reserva: reservaAtualizada });
  } catch (error) {
    console.error('Erro ao cancelar reserva:', error);
    return res.status(500).json({ erro: 'Erro interno do servidor' });
  }
};

exports.aprovar = async (req, res) => {
  try {
    const { id } = req.params;

    const reserva = await prisma.reserva.findUnique({
      where: { id: Number(id) },
    });

    if (!reserva) {
      return res.status(404).json({ erro: 'Reserva nao encontrada' });
    }

    if (reserva.status !== 'PENDENTE') {
      return res.status(400).json({ erro: 'Somente reservas com status PENDENTE podem ser aprovadas' });
    }

    const reservaAtualizada = await prisma.reserva.update({
      where: { id: Number(id) },
      data: { status: 'APROVADA' },
      include: {
        condomino: {
          include: {
            usuario: {
              select: { id: true, nome: true, email: true },
            },
          },
        },
        area: true,
      },
    });

    return res.status(200).json({ mensagem: 'Reserva aprovada com sucesso', reserva: reservaAtualizada });
  } catch (error) {
    console.error('Erro ao aprovar reserva:', error);
    return res.status(500).json({ erro: 'Erro interno do servidor' });
  }
};

exports.rejeitar = async (req, res) => {
  try {
    const { id } = req.params;

    const reserva = await prisma.reserva.findUnique({
      where: { id: Number(id) },
    });

    if (!reserva) {
      return res.status(404).json({ erro: 'Reserva nao encontrada' });
    }

    if (reserva.status !== 'PENDENTE') {
      return res.status(400).json({ erro: 'Somente reservas com status PENDENTE podem ser rejeitadas' });
    }

    const reservaAtualizada = await prisma.reserva.update({
      where: { id: Number(id) },
      data: { status: 'REJEITADA' },
      include: {
        condomino: {
          include: {
            usuario: {
              select: { id: true, nome: true, email: true },
            },
          },
        },
        area: true,
      },
    });

    return res.status(200).json({ mensagem: 'Reserva rejeitada com sucesso', reserva: reservaAtualizada });
  } catch (error) {
    console.error('Erro ao rejeitar reserva:', error);
    return res.status(500).json({ erro: 'Erro interno do servidor' });
  }
};
