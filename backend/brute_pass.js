const { Pool } = require('pg');

const passwords = ['admin123', 'atharva1', 'atharva@123', 'Atharva@123', 'postgres', 'root', 'password', ''];

async function testAll() {
    for (const pass of passwords) {
        const pool = new Pool({
            user: 'postgres',
            host: 'localhost',
            database: 'travelhub_db',
            password: pass,
            port: 5432,
        });
        try {
            await pool.query('SELECT 1');
            console.log(`FOUND PASSWORD: ${pass}`);
            await pool.end();
            return;
        } catch (err) {
            console.log(`Failed: ${pass}`);
            await pool.end();
        }
    }
    console.log('All common passwords failed.');
}

testAll();
