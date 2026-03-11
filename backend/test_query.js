const db = require('./db');

async function test() {
    try {
        const result = await db.query(
            `SELECT p.*, u.full_name as agent_name,
            (SELECT json_agg(h.*) FROM hotels h WHERE h.package_id = p.id) as hotels
            FROM packages p 
            LEFT JOIN users u ON p.agent_id = u.id 
            WHERE p.status = 'pending' 
            ORDER BY p.created_at DESC`
        );
        console.log("Success:", result.rows.length);
    } catch(err) {
        console.error("Error:", err.message);
    } finally {
        process.exit();
    }
}
test();
