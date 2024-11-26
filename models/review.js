const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');

const Review = sequelize.define('Review', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: User, key: 'id' },
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
});

// Relationship to User
Review.belongsTo(User, { foreignKey: 'userId' });

module.exports = Review;
