const { Pool } = require('pg');
require('dotenv').config();

async function test(pass) {
    const pool = new Pool({
        user: 'postgres',
        host: 'localhost',
        database: 'travelhub_db',
        password: pass,
        port: 5432,
    });
    try {
        const res = await pool.query('SELECT 1');
        console.log(`Success with password: ${pass}`);
        await pool.end();
        return true;
    } catch (err) {
        console.log(`Failed with password: ${pass} - ${err.message}`);
        await pool.end();
        return false;
    }
}

async function run() {
    await test('admin123');
    await test('atharva1');
}

run();
