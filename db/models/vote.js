'use strict';
module.exports = (sequelize, DataTypes) => {
    const Vote = sequelize.define('Vote', {
        value: {
            allowNull: false,
            type: DataTypes.BOOLEAN,
        },
        userId: {
            allowNull: false,
            type: DataTypes.INTEGER,

        },
        answerId: {
            allowNull: false,
            type: DataTypes.INTEGER,
        },
    }, {});
    Vote.associate = function(models) {
    // associations can be defined here
        Vote.belongsTo(models.User, { foreignKey: 'userId' });
        Vote.belongsTo(models.Answer, { foreignKey: 'answerId', onDelete: 'CASCADE' });
    };
    return Vote;
};
