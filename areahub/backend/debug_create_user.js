const http = require('http');

function request(options, body) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve({ statusCode: res.statusCode, body: data }));
    });
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

(async () => {
  try {
    const loginBody = JSON.stringify({ email: 'admin@areahub.com', senha: 'admin123' });
    const loginRes = await request({
      hostname: 'localhost',
      port: 3001,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(loginBody),
      },
    }, loginBody);
    console.log('LOGIN', loginRes.statusCode, loginRes.body);

    const token = JSON.parse(loginRes.body).token;
    const userBody = JSON.stringify({
      nome: 'Teste API',
      email: 'testeapi@areahub.com',
      senha: 'teste1234',
      role: 'CONDOMINO',
      unidade: 'Apt 303',
    });
    const createRes = await request({
      hostname: 'localhost',
      port: 3001,
      path: '/api/usuarios',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(userBody),
        Authorization: `Bearer ${token}`,
      },
    }, userBody);
    console.log('CREATE', createRes.statusCode, createRes.body);
  } catch (err) {
    console.error('ERROR', err);
  }
})();
