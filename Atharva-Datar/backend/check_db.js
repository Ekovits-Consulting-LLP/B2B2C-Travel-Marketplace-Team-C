require('dotenv').config();
const db = require('./db');

async function testConnection() {
    try {
        await db.initDb();
        const res = await db.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
        console.log("Tables in travelhub_db:", res.rows.map(r => r.table_name));
        process.exit(0);
    } catch (err) {
        console.error("Error connecting to DB:", err);
        process.exit(1);
    }
}

testConnection();
