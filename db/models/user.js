'use strict';
module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        username: {
            unique: true,
            allowNull: false,
            type: DataTypes.STRING(25),
        },
        email: {
            unqiue: true,
            allowNull: false,
            type: DataTypes.STRING(255),
        },
        hashedPassword: {
            allowNull: false,
            type: DataTypes.STRING.BINARY,
        },
    }, {});
    User.associate = function(models) {
    // associations can be defined here
        User.hasMany(models.Question, { foreignKey: 'userId' });
        User.hasMany(models.Answer, { foreignKey: 'userId' });
        User.hasMany(models.Vote, { foreignKey: 'userId' });
    };
    User.prototype.hasAnswered = async function(questionId) {
        const answer = await sequelize.models.Answer.findOne({ where: { userId: this.id, questionId } });

        return Boolean(answer);
    };
    return User;
};
