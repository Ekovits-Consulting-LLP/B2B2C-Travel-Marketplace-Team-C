const db = require('./db');

async function updateBookings() {
    try {
        // Get the customer user ID
        const userResult = await db.query("SELECT id FROM users WHERE email = 'customer@gmail.com'");
        if (userResult.rows.length === 0) {
            console.log('Customer user not found');
            return;
        }

        const customerId = userResult.rows[0].id;
        console.log('Customer ID:', customerId);

        // Update existing bookings
        const updateResult = await db.query(
            'UPDATE bookings SET booked_by = $1 WHERE booked_by IS NULL',
            [customerId]
        );

        console.log('Updated', updateResult.rowCount, 'bookings');

        // Check how many bookings now have booked_by set
        const countResult = await db.query('SELECT COUNT(*) as count FROM bookings WHERE booked_by IS NOT NULL');
        console.log('Total bookings with booked_by set:', countResult.rows[0].count);

    } catch (err) {
        console.error('Error:', err);
    }
}

updateBookings();