const db = require('./db');

async function checkColumns() {
    try {
        const result = await db.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'bookings'");
        console.log('Columns in bookings table:');
        result.rows.forEach(row => console.log('- ' + row.column_name));
    } catch (err) {
        console.error('Error:', err);
    }
}

checkColumns();