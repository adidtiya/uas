const { Pool } = require('pg');

// Configure the database connection
const pool = new Pool({
    user: 'postgres',      // replace with your PostgreSQL username
    host: 'localhost',           // host of the PostgreSQL server
    database: 'frontend',        // name of the database
    password: 'Harsa2012',   // replace with your PostgreSQL password
    port: 5432,                  // default PostgreSQL port
});

// Test the connection
pool.connect((err) => {
    if (err) {
        console.error('Error connecting to the database', err);
    } else {
        console.log('Connected to the PostgreSQL database');
    }
});

module.exports = pool;
