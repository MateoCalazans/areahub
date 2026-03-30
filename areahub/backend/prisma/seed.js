const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando seed do banco de dados...');

  // Limpar dados existentes
  await prisma.reserva.deleteMany();
  await prisma.condomino.deleteMany();
  await prisma.area.deleteMany();
  await prisma.usuario.deleteMany();

  // Criar usuário administrador
  const admin = await prisma.usuario.create({
    data: {
      nome: 'Administrador',
      email: 'admin@areahub.com',
      senha: await bcrypt.hash('admin123', 10),
      role: 'ADMINISTRADOR',
      status: true,
      primeiroAcesso: false,
    },
  });
  console.log('Administrador criado:', admin.email);

  // Criar síndico
  const sindico = await prisma.usuario.create({
    data: {
      nome: 'Síndico',
      email: 'sindico@areahub.com',
      senha: await bcrypt.hash('sindico123', 10),
      role: 'SINDICO',
      status: true,
      primeiroAcesso: false,
    },
  });
  console.log('Síndico criado:', sindico.email);

  // Criar condôminos
  const morador1 = await prisma.usuario.create({
    data: {
      nome: 'Morador Um',
      email: 'morador1@areahub.com',
      senha: await bcrypt.hash('morador123', 10),
      role: 'CONDOMINO',
      status: true,
      primeiroAcesso: false,
      condomino: {
        create: {
          unidade: 'Apt 101',
        },
      },
    },
    include: { condomino: true },
  });
  console.log('Morador 1 criado:', morador1.email);

  const morador2 = await prisma.usuario.create({
    data: {
      nome: 'Morador Dois',
      email: 'morador2@areahub.com',
      senha: await bcrypt.hash('morador123', 10),
      role: 'CONDOMINO',
      status: true,
      primeiroAcesso: false,
      condomino: {
        create: {
          unidade: 'Apt 202',
        },
      },
    },
    include: { condomino: true },
  });
  console.log('Morador 2 criado:', morador2.email);

  // Criar áreas comuns
  const salaoFestas = await prisma.area.create({
    data: {
      nome: 'Salão de Festas',
      descricao: 'Salão amplo para eventos e confraternizações',
      capacidade: 50,
      horarioAbertura: '08:00',
      horarioFechamento: '22:00',
      ativa: true,
    },
  });

  const churrasqueira = await prisma.area.create({
    data: {
      nome: 'Churrasqueira',
      descricao: 'Área de churrasqueira com espaço coberto',
      capacidade: 20,
      horarioAbertura: '08:00',
      horarioFechamento: '22:00',
      ativa: true,
    },
  });

  const quadraTenis = await prisma.area.create({
    data: {
      nome: 'Quadra de Tênis',
      descricao: 'Quadra de tênis com iluminação noturna',
      capacidade: 4,
      horarioAbertura: '06:00',
      horarioFechamento: '22:00',
      ativa: true,
    },
  });
  console.log('Áreas criadas: Salão de Festas, Churrasqueira, Quadra de Tênis');

  // Criar reservas de exemplo
  const hoje = new Date();
  const amanha = new Date(hoje);
  amanha.setDate(amanha.getDate() + 1);
  const depoisDeAmanha = new Date(hoje);
  depoisDeAmanha.setDate(depoisDeAmanha.getDate() + 2);

  await prisma.reserva.create({
    data: {
      data: amanha,
      horaInicio: '10:00',
      horaFim: '14:00',
      status: 'APROVADA',
      condominoId: morador1.condomino.id,
      areaId: salaoFestas.id,
    },
  });

  await prisma.reserva.create({
    data: {
      data: amanha,
      horaInicio: '12:00',
      horaFim: '16:00',
      status: 'PENDENTE',
      condominoId: morador2.condomino.id,
      areaId: churrasqueira.id,
    },
  });

  await prisma.reserva.create({
    data: {
      data: depoisDeAmanha,
      horaInicio: '08:00',
      horaFim: '10:00',
      status: 'CANCELADA',
      condominoId: morador1.condomino.id,
      areaId: quadraTenis.id,
    },
  });

  await prisma.reserva.create({
    data: {
      data: depoisDeAmanha,
      horaInicio: '15:00',
      horaFim: '18:00',
      status: 'REJEITADA',
      condominoId: morador2.condomino.id,
      areaId: salaoFestas.id,
    },
  });

  await prisma.reserva.create({
    data: {
      data: depoisDeAmanha,
      horaInicio: '09:00',
      horaFim: '11:00',
      status: 'PENDENTE',
      condominoId: morador1.condomino.id,
      areaId: churrasqueira.id,
    },
  });

  console.log('Reservas de exemplo criadas');
  console.log('Seed concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error('Erro ao executar seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
