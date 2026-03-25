require('dotenv').config();
const db = require('./db');

async function addTestBooking() {
    try {
        // First, get a package ID
        const packages = await db.query("SELECT id, title FROM packages WHERE status = 'approved' LIMIT 1");
        if (packages.rows.length === 0) {
            console.log("No approved packages found. Please add packages first.");
            return;
        }

        const packageId = packages.rows[0].id;
        console.log("Using package:", packages.rows[0]);

        // Create multiple test bookings
        const bookings = [
            {
                name: 'Customer',
                email: 'customer@gmail.com',
                phone: '+1234567890',
                address: '123 Main St',
                city: 'New York',
                country: 'USA',
                age: 30
            },
            {
                name: 'John Doe',
                email: 'john.doe@example.com',
                phone: '+1234567890',
                address: '123 Main St',
                city: 'New York',
                country: 'USA',
                age: 30
            },
            {
                name: 'Jane Smith',
                email: 'jane.smith@example.com',
                phone: '+1987654321',
                address: '456 Oak Ave',
                city: 'Los Angeles',
                country: 'USA',
                age: 25
            },
            {
                name: 'Bob Johnson',
                email: 'bob.johnson@example.com',
                phone: '+1555123456',
                address: '789 Pine St',
                city: 'Chicago',
                country: 'USA',
                age: 35
            }
        ];

        for (const booking of bookings) {
            const result = await db.query(
                `INSERT INTO bookings
                (package_id, customer_name, email, travelers, travel_date, status)
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING *`,
                [
                    packageId,
                    booking.name,
                    booking.email,
                    2,
                    '2024-12-25',
                    'confirmed'
                ]
            );
            console.log("Test booking created for:", booking.email);
        }
        process.exit(0);
    } catch (err) {
        console.error("Error creating test booking:", err);
        process.exit(1);
    }
}

addTestBooking();