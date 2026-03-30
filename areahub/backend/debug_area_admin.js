const http = require('http');

function request(options, body) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    });
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

(async () => {
  try {
    const loginBody = JSON.stringify({ email: 'admin@areahub.com', senha: 'admin123' });
    const login = await request({
      hostname: 'localhost',
      port: 3001,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(loginBody),
      },
    }, loginBody);
    console.log('LOGIN', login.status, login.body);

    let token;
    try {
      token = JSON.parse(login.body).token;
    } catch (err) {
      console.error('Failed to parse login response');
      return;
    }

    const createBody = JSON.stringify({ nome: 'TEST AREA', descricao: 'Teste via debug', capacidade: 10, horarioAbertura: '08:00', horarioFechamento: '20:00' });
    const create = await request({
      hostname: 'localhost',
      port: 3001,
      path: '/api/areas',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(createBody),
        Authorization: `Bearer ${token}`,
      },
    }, createBody);
    console.log('CREATE AREA', create.status, create.body);

    const list = await request({
      hostname: 'localhost',
      port: 3001,
      path: '/api/areas',
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('LIST AREAS', list.status, list.body);
  } catch (error) {
    console.error('ERROR', error);
  }
})();