const db = require('./db');

async function checkBookedBy() {
    try {
        // Check total bookings
        const totalResult = await db.query('SELECT COUNT(*) as total FROM bookings');
        console.log('Total bookings:', totalResult.rows[0].total);

        // Check bookings with booked_by set
        const withBookedByResult = await db.query('SELECT COUNT(*) as count FROM bookings WHERE booked_by IS NOT NULL');
        console.log('Bookings with booked_by set:', withBookedByResult.rows[0].count);

        // Check bookings without booked_by
        const withoutBookedByResult = await db.query('SELECT COUNT(*) as count FROM bookings WHERE booked_by IS NULL');
        console.log('Bookings without booked_by:', withoutBookedByResult.rows[0].count);

        // Show a few examples
        const examplesResult = await db.query('SELECT id, customer_name, email, booked_by FROM bookings ORDER BY id DESC LIMIT 3');
        console.log('Recent bookings:');
        examplesResult.rows.forEach(b => {
            console.log(`ID ${b.id}: ${b.customer_name} (${b.email}) - booked_by: ${b.booked_by}`);
        });

    } catch (err) {
        console.error('Error:', err);
    }
}

checkBookedBy();