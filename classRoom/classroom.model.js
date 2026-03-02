const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        name: { type: DataTypes.STRING, allowNull: false },
        gradeLevel: { type: DataTypes.STRING, allowNull: false },
        section: { type: DataTypes.STRING, allowNull: false },
        capacity: { type: DataTypes.INTEGER, allowNull: false },
        description: { type: DataTypes.STRING, allowNull: true }
    };

    const options = {};

    return sequelize.define('Classroom', attributes, options);
}