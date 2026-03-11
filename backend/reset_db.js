const db = require('./db');

async function resetDb() {
    try {
        console.log("Dropping tables...");
        await db.query('DROP TABLE IF EXISTS bookings CASCADE');
        await db.query('DROP TABLE IF EXISTS hotels CASCADE');
        await db.query('DROP TABLE IF EXISTS package_requests CASCADE');
        await db.query('DROP TABLE IF EXISTS packages CASCADE');
        await db.query('DROP TABLE IF EXISTS users CASCADE');
        
        console.log("Initializing DB...");
        await db.initDb();
        
        console.log("Database reset and initialized successfully.");
        process.exit(0);
    } catch (err) {
        console.error("Error resetting DB:", err);
        process.exit(1);
    }
}

resetDb();
