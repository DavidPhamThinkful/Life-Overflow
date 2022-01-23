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
            { username: 'Woman1984', email: 'w1984@w1984.com', hashedPassword: await bcrypt.hash('password', 10) },
            { username: 'JusticeCouple', email: 'hotjl@hotjl.com', hashedPassword: await bcrypt.hash('password', 10) },
        ], { fields: ['username', 'email', 'hashedPassword'], returning: true });

        const categories = await queryInterface.bulkInsert('Categories', [
            { name: 'Family' },
            { name: 'Friends' },
            { name: 'Romance' },
            { name: 'Life' },
            { name: 'Death' },
        ], { fields: ['name'], returning: true });

        const questions = await queryInterface.bulkInsert('Questions', [
            { title: 'My Sweet Snowball', body: 'I lost my Snowball. How do I continue without her?', userId: 1, categoryId: 5},
            { title: 'Congratulations', body: 'My best friend just had his first child. Should we get something for him or for his baby?', userId: 2, categoryId: 2},
            { title: 'Blood is thicker than water?!?!', body: 'Is it wrong that we feel like our friends are more family than our actual family?', userId: 2, categoryId: 1},
            { title: 'Cat-Hater-Cure...', body: 'How can I get my new girlfriend to accept my 8 cats?', userId: 1, categoryId: 3},
        ], { fields: ['title', 'body', 'userId', 'categoryId'], returning: true });

        const answers = await queryInterface.bulkInsert('Answers', [
            { body: 'My husband and I had out Lassie creamated. She now watches over us from our mantle.', userId: 2, questionId: 1},
            { body: 'A new cat is always a wonderful surprise on any occasion!', userId: 1, questionId: 2},
            { body: 'NOT AT ALL! My cats are closer to me now than my family.', userId: 1, questionId: 3},
            { body: 'Dude, it might just be that eight cats is just eight too many...', userId: 2, questionId: 4},
        ], { fields: ['body', 'userId', 'questionId'], returning: true });

        await queryInterface.bulkInsert('Votes', [
            { value: true, userId: 1, answerId: 1},
            { value: false, userId: 2, answerId: 2},
            { value: false, userId: 2, answerId: 3},
            { value: false, userId: 1, answerId: 4},
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
