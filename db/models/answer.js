'use strict';
module.exports = (sequelize, DataTypes) => {
    const Answer = sequelize.define('Answer', {
        description: {
            allowNull: false,
            type: DataTypes.TEXT,
        },
        userId: {
            allowNull: false,
            type: DataTypes.INTEGER,

        },
        questionId: {
            allowNull: false,
            type: DataTypes.INTEGER,
        },
    }, {});
    Answer.associate = function(models) {
    // associations can be defined here
        Answer.belongsTo(models.User, { foreignKey: 'userId' });
        Answer.belongsTo(models.Question, { foreignKey: 'questionId' });
        Answer.hasMany(models.Vote, { foreignKey: 'answerId' });
    };
    return Answer;
};
