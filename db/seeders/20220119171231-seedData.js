'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
    up: async (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      */
        const user = await queryInterface.bulkInsert('Users', [
            { username: 'Demo', email: 'demo@test.com', hashedPassword: await bcrypt.hash('password', 10) },
            { username: 'Joe', email: 'joe@test.com', hashedPassword: await bcrypt.hash('password', 10) },
        ], { fields: ['username', 'email', 'hashedPassword'], returning: true });

        const categories = await queryInterface.bulkInsert('Categories', [
            { name: 'Family' },
            { name: 'Friends' },
            { name: 'Romance' },
            { name: 'Life' },
            { name: 'Death' },
        ], { fields: ['name'], returning: true });

        const questions = await queryInterface.bulkInsert('Questions', [
            { title: 'Question 1', description: 'Question 1 description', userId: user[0].id, categoryId: categories[0].id },
            { title: 'Question 2', description: 'Question 2 description', userId: user[1].id, categoryId: categories[2].id },
        ], { fields: ['title', 'description', 'userId', 'categoryId'], returning: true });

        await queryInterface.bulkInsert('Answers', [
            { description: 'Question 1 answer', userId: user[0].id, questionId: questions[0].id },
            { description: 'Question 1 answer', userId: user[1].id, questionId: questions[0].id },
            { description: 'Question 2 answer', userId: user[0].id, questionId: questions[1].id },
            { description: 'Question 2 answer', userId: user[1].id, questionId: questions[1].id },
        ], { fields: ['description', 'userId', 'questionId'] });
    },

    down: async (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      */
        await queryInterface.bulkDelete('Answers', null, {});
        await queryInterface.bulkDelete('Questions', null, {});
        await queryInterface.bulkDelete('Categories', null, {});
        await queryInterface.bulkDelete('Users', null, {});
    },
};
