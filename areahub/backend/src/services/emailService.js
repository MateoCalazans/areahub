const nodemailer = require('nodemailer');

async function createTransporter() {
  const { EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS } = process.env;

  if (!EMAIL_HOST || !EMAIL_PORT || !EMAIL_USER || !EMAIL_PASS) {
    const testAccount = await nodemailer.createTestAccount();
    return nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  }

  return nodemailer.createTransport({
    host: EMAIL_HOST,
    port: Number(EMAIL_PORT),
    secure: Number(EMAIL_PORT) === 465,
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
  });
}

async function enviarSenhaProvisoria(email, nome, senha) {
  const transporter = await createTransporter();

  const mailOptions = {
    from: `AreaHub <${process.env.EMAIL_USER || 'no-reply@areahub.com'}>`,
    to: email,
    subject: 'Sua senha provisoria do AreaHub',
    html: `
      <p>Olá ${nome},</p>
      <p>Sua conta no AreaHub foi criada com sucesso.</p>
      <p>Use a senha provisória abaixo para fazer o primeiro acesso:</p>
      <p><strong>${senha}</strong></p>
      <p>Após o primeiro login, será solicitado que você cadastre uma nova senha.</p>
      <p>Se você não solicitou este acesso, desconsidere esta mensagem.</p>
    `,
  };

  const info = await transporter.sendMail(mailOptions);
  const previewUrl = nodemailer.getTestMessageUrl(info);

  console.log('Senha provisoria enviada para:', email);
  if (previewUrl) {
    console.log('Visualizar email de teste:', previewUrl);
  }

  return { info, previewUrl };
}

module.exports = {
  enviarSenhaProvisoria,
};
