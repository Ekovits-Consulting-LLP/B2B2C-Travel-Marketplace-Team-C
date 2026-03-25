const db = require('./db');

async function checkColumn() {
    try {
        const result = await db.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'booked_by'");
        if (result.rows.length > 0) {
            console.log('booked_by column exists:', result.rows[0]);
        } else {
            console.log('booked_by column does not exist');
        }
    } catch (err) {
        console.error('Error:', err);
    }
}

checkColumn();