const db = require('./db');
async function check() {
    try {
        const res = await db.query("SELECT id, full_name, email, role, status FROM users");
        console.log(JSON.stringify(res.rows, null, 2));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
check();
