const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Sequelize instance

const User = sequelize.define('User', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    profilePhoto: {
        type: DataTypes.STRING,
        allowNull: true, 
    },
});

module.exports = User;
