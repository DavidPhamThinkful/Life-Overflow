'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('Votes', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            value: {
                allowNull: false,
                type: Sequelize.BOOLEAN,
            },
            userId: {
                allowNull: false,
                type: Sequelize.INTEGER,
                references: { model: 'Users' },
            },
            answerId: {
                allowNull: false,
                type: Sequelize.INTEGER,
                references: { model: 'Answers'},
                onDelete: 'cascade'
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.fn('NOW'),
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.fn('NOW'),
            },
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('Votes');
    },
};
