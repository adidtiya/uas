require('dotenv').config();
const { Sequelize } = require('sequelize');

// Initialize Sequelize with environment variables
const sequelize = new Sequelize(
    process.env.DB_NAME,       // Database name
    process.env.DB_USER,       // Database username
    process.env.DB_PASSWORD,   // Database password
    {
        host: process.env.DB_HOST,  // Host address
        port: process.env.DB_PORT || 5432, // Default PostgreSQL port
        dialect: 'postgres',       // Specify PostgreSQL as the dialect
        logging: false,            // Disable logging (optional)
    }
);

// Test database connection
(async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection to the database has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
})();

module.exports = sequelize;
