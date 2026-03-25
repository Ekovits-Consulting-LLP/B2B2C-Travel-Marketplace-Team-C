const db = require('./db');

async function checkBookings() {
    try {
        const result = await db.query('SELECT id, customer_name, email, package_id, status FROM bookings ORDER BY id DESC LIMIT 10');
        console.log('Recent bookings:');
        result.rows.forEach(b => {
            console.log(`${b.id}: ${b.customer_name} (${b.email}) - Package ${b.package_id} - ${b.status}`);
        });
    } catch (err) {
        console.error('Error:', err);
    }
}

checkBookings();