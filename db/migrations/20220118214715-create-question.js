'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('Questions', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            title: {
                allowNull: false,
                type: Sequelize.STRING(255),
            },
            body: {
                allowNull: false,
                type: Sequelize.TEXT,
            },
            userId: {
                allowNull: false,
                type: Sequelize.INTEGER,
                references: { model: 'Users' },


            },
            categoryId: {
                allowNull: false,
                type: Sequelize.INTEGER,
                references: { model: 'Categories' },
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
        return queryInterface.dropTable('Questions');
    },
};
