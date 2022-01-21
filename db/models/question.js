'use strict';
module.exports = (sequelize, DataTypes) => {
    const Question = sequelize.define('Question', {
        title: {
            allowNull: false,
            type: DataTypes.STRING(255),
            validate: {
                len: [10, 255],
            },
        },
        body: {
            allowNull: false,
            type: DataTypes.TEXT,
            validate: {
                len: [10, 500],
            },
        },
        userId: {
            allowNull: false,
            type: DataTypes.INTEGER,


        },
        categoryId: {
            allowNull: false,
            type: DataTypes.INTEGER,

        },
    }, {});
    Question.associate = function(models) {
    // associations can be defined here
        Question.belongsTo(models.User, { foreignKey: 'userId' });
        Question.belongsTo(models.Category, { foreignKey: 'categoryId', });
        Question.hasMany(models.Answer, { foreignKey: 'questionId', onDelete: 'CASCADE' });
    };
    return Question;
};
