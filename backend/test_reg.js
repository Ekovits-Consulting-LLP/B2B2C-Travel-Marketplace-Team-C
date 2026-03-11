const http = require('http');

const data = JSON.stringify({
    fullName: "Test User",
    email: "test_new@user.com",
    password: "password123",
    role: "customer"
});

const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/register',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

const req = http.request(options, res => {
    let body = '';
    res.on('data', d => body += d);
    res.on('end', () => console.log('Status:', res.statusCode, 'Body:', body));
});

req.on('error', error => console.error(error));
req.write(data);
req.end();
