require('dotenv').config();
const db = require('./db');
const bcrypt = require('bcrypt');

async function testRegistration() {
    try {
        const email = 'test_err_' + Date.now() + '@user.com';
        const passwordHash = await bcrypt.hash('password123', 10);

        console.log("Checking if user exists...");
        const userExists = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        console.log("User exists:", userExists.rows.length > 0);

        console.log("Inserting new user...");
        const newUser = await db.query(
            'INSERT INTO users (full_name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, full_name, email, role',
            ['Test User', email, passwordHash, 'agent']
        );

        console.log("User registered successfully:", newUser.rows[0]);
        process.exit(0);
    } catch (err) {
        console.error("\n--- REGISTRATION DB ERROR ---");
        console.error(err);
        process.exit(1);
    }
}

testRegistration();
