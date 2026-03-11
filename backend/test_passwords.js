const { Pool } = require('pg');

async function testPassword(password) {
    const pool = new Pool({
        user: 'postgres',
        host: 'localhost',
        database: 'travelhub_db',
        password: password,
        port: 5432,
    });
    try {
        await pool.query('SELECT 1');
        console.log(`Success with password: ${password}`);
        return true;
    } catch (err) {
        console.log(`Failed with password: ${password}`);
        return false;
    } finally {
        await pool.end();
    }
}

async function runTests() {
    const passwords = ['atharva1', 'admin123', 'postgres', 'password', '123456', 'travelhub', 'atharva'];
    for (const pwd of passwords) {
        if (await testPassword(pwd)) {
            process.exit(0);
        }
    }
    process.exit(1);
}

runTests();
