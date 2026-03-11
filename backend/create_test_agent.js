const db = require('./db');
const bcrypt = require('bcrypt');

async function createAgent() {
    try {
        const passwordHash = await bcrypt.hash('agent123', 10);
        await db.query(
            "INSERT INTO users (full_name, email, password, role, status) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (email) DO UPDATE SET password = $3, status = $5",
            ['Test Agent', 'testagent@travelhub.com', passwordHash, 'agent', 'approved']
        );
        console.log("Test agent created/updated: testagent@travelhub.com / agent123");
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
createAgent();
