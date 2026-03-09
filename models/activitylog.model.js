const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
     const attributes = { 
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            }
        },
        actionType: { type: DataTypes.STRING, allowNull: false },
        actionDetails: { type: DataTypes.TEXT, allowNull: true },
        ipAddress: {  type: DataTypes.STRING, allowNull: false },
        browserInfo: { type: DataTypes.STRING, allowNull: false },
        timestamp: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
        
};

   const options = {
       timestamps: false   
   };

    return sequelize.define('Activitylog', attributes, options);
}