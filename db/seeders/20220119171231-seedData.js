'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
    up: async (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      */
        const users = await queryInterface.bulkInsert('Users', [
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
            { title: 'Question 1', body: 'Question 1 body', userId: users[0].id, categoryId: categories[0].id },
            { title: 'Question 2', body: 'Question 2 body', userId: users[1].id, categoryId: categories[2].id },
        ], { fields: ['title', 'body', 'userId', 'categoryId'], returning: true });

        const answers = await queryInterface.bulkInsert('Answers', [
            { body: 'Question 1 answer', userId: users[0].id, questionId: questions[0].id },
            { body: 'Question 1 answer2', userId: users[1].id, questionId: questions[0].id },
            { body: 'Question 2 answer', userId: users[0].id, questionId: questions[1].id },
            { body: 'Question 2 answer2', userId: users[1].id, questionId: questions[1].id },
        ], { fields: ['body', 'userId', 'questionId'], returning: true });

        await queryInterface.bulkInsert('Votes', [
            { value: true, userId: users[0].id, answerId: answers[0].id },
            { value: true, userId: users[1].id, answerId: answers[0].id },
            { value: true, userId: users[0].id, answerId: answers[1].id },
            { value: false, userId: users[1].id, answerId: answers[1].id },
            { value: true, userId: users[0].id, answerId: answers[2].id },
            { value: false, userId: users[1].id, answerId: answers[2].id },
            { value: false, userId: users[0].id, answerId: answers[3].id },
            { value: false, userId: users[1].id, answerId: answers[3].id },
        ], { fields: [ 'value', 'userId', 'questionId'] });
    },

    down: async (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      */
        await queryInterface.bulkDelete('Votes', null, {});
        await queryInterface.bulkDelete('Answers', null, {});
        await queryInterface.bulkDelete('Questions', null, {});
        await queryInterface.bulkDelete('Categories', null, {});
        await queryInterface.bulkDelete('Users', null, {});
    },
};
