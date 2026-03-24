const { Pool } = require('pg');
async function test() {
    const pool = new Pool({
        user: 'postgres',
        host: 'localhost',
        database: 'travelhub_db',
        password: 'atharva1',
        port: 5432,
    });
    try {
        const res = await pool.query('SELECT 1');
        console.log('Success with password: atharva1');
        await pool.end();
    } catch (err) {
        console.log('Failed with password: atharva1 - ' + err.message);
        await pool.end();
    }
}
test();
