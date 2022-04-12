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
            { username: 'James', email: 'James@test.com', hashedPassword: await bcrypt.hash('password', 10) },
            { username: 'Shirley', email: 'shirley@test.com', hashedPassword: await bcrypt.hash('password', 10) },
        ], { fields: ['username', 'email', 'hashedPassword'], returning: true });

        const categories = await queryInterface.bulkInsert('Categories', [
            { name: 'Family' },
            { name: 'Friends' },
            { name: 'Romance' },
            { name: 'Life' },
            { name: 'Death' },
        ], { fields: ['name'], returning: true });

        const questions = await queryInterface.bulkInsert('Questions', [
            {
                title: 'My Sweet Snowball',
                body: 'I lost my Snowball. How do I continue without her?',
                userId: users[0].id,
                categoryId: categories[4].id,
            },
            {
                title: 'Congratulations',
                body: 'My best friend just had his first child. Should we get something for him or for his baby?',
                userId: users[1].id,
                categoryId: categories[1].id,
            },
            {
                title: 'Blood is thicker than water?!?!',
                body: 'Is it wrong that we feel like our friends are more family than our actual family?',
                userId: users[1].id,
                categoryId: categories[0].id,
            },
            {
                title: 'Cat-Hater-Cure...',
                body: 'How can I get my new girlfriend to accept my 8 cats?',
                userId: users[0].id,
                categoryId: categories[2].id,
            },
            {
                title: 'Good places to Take Family on Vacation in California',
                body: 'I want to take m family, three of us to the state of California from Washington State, we want to drive so we can see scenery and have 14 days total to explore',
                userId: users[2].id,
                categoryId: categories[0].id,
            },
            {
                title: 'How to deal with a death of family member',
                body: 'Been many years I grown up with my aunt and she ended up with cancer and all of a sudden passed away with no warning when she was OK. What are some grieving or services others have received from this type of surprise death?',
                userId: users[3].id,
                categoryId: categories[4].id,
            },
        ], { fields: ['title', 'body', 'userId', 'categoryId'], returning: true });

        const answers = await queryInterface.bulkInsert('Answers', [
            {
                body: 'My husband and I had out Lassie creamated. She now watches over us from our mantle.',
                userId: users[1].id,
                questionId: questions[0].id,
            },
            {
                body: 'A new cat is always a wonderful surprise on any occasion!',
                userId: users[0].id,
                questionId: questions[1].id,
            },
            {
                body: 'NOT AT ALL! My cats are closer to me now than my family.',
                userId: users[0].id,
                questionId: questions[2].id,
            },
            {
                body: 'Dude, it might just be that eight cats is just eight too many...',
                userId: users[1].id,
                questionId: questions[3].id,
            },
            {
                body: 'You could take a drive down highway 101 all the way to Anthem, Ca. and then visit Disney Land & California Adventures. We did that and was great fun and plenty to see along the way.',
                userId: users[3].id,
                questionId: questions[4].id,
            },
            {
                body: 'There are many services available for this type of unexpected death and cancer, check out www.death-and-cancer.org , it has helped a few people that I know in the past. Good luck!',
                userId: users[2].id,
                questionId: questions[5].id,
            },
        ], { fields: ['body', 'userId', 'questionId'], returning: true });

        await queryInterface.bulkInsert('Votes', [
            { value: true, userId: users[0].id, answerId: answers[0].id },
            { value: false, userId: users[1].id, answerId: answers[1].id },
            { value: false, userId: users[1].id, answerId: answers[2].id },
            { value: false, userId: users[1].id, answerId: answers[3].id },
            { value: true, userId: users[2].id, answerId: answers[4].id },
            { value: true, userId: users[3].id, answerId: answers[5].id },
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
