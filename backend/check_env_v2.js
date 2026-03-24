
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');
console.log('Env path:', envPath);
if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    console.log('Env content raw:', content);
    
    // Manual parse
    const lines = content.split('\n');
    lines.forEach(line => {
        const parts = line.split('=');
        if (parts.length === 2) {
            process.env[parts[0].trim()] = parts[1].trim();
        }
    });
} else {
    console.log('.env file not found at', envPath);
}

console.log('DB_USER:', process.env.DB_USER);
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
console.log('DB_PORT:', process.env.DB_PORT);

const { Pool } = require('pg');
async function test() {
    const pool = new Pool({
        user: process.env.DB_USER || 'postgres',
        host: process.env.DB_HOST || 'localhost',
        database: process.env.DB_NAME || 'travelhub_db',
        password: process.env.DB_PASSWORD || 'atharva1',
        port: parseInt(process.env.DB_PORT || '5432'),
    });
    try {
        const res = await pool.query('SELECT 1');
        console.log('Connection successful!');
        await pool.end();
    } catch (err) {
        console.log('Connection failed:', err.message);
        await pool.end();
    }
}
test();
