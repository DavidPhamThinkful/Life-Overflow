const express = require('express');
const { requireAuth } = require('../auth');
const { csrfProtection, asyncHandler } = require('../utils');
const { check, validationResult } = require('express-validator');
const db = require('../db/models');

const router = express.Router();

const questionsValidators = [
    check('title')
        .isLength({ min: 10, max: 255 })
        .withMessage('Title must be between 10 and 255 characters.'),
    check('body')
        .isLength({ min: 10 })
        .withMessage('Body must be at least 10 characters.'),
];

router.get('/', asyncHandler((async (req, res) => {
    const questions = await db.Question.findAll({
        include: [{ model: db.Answer }, { model: db.Category }, { model: db.User }],
        order: [['updatedAt', 'DESC']],
    });
    const image = 'https://www.job-hunt.org/wp-content/uploads/2021/05/Smart-Answers-to-the-21-Most-Common-Interview-Questions-in-2021-2.png.webp';
    res.render('questions', { title: 'Here is the list of questions', image, questions, user: res.locals.user });
})));


router.get('/new', requireAuth, csrfProtection, asyncHandler(async (req, res) => {
    const categories = await db.Category.findAll();
    res.render('new-question', {
        title: 'Ask your question or forever hold your peace!!!',
        categories,
        id: '',
        question: { title: null, body: null },
        errors: {},
        csrfToken: req.csrfToken(),
    });
}));

router.post('/', requireAuth, csrfProtection, questionsValidators, asyncHandler((async (req, res) => {
    const { title, body, categoryId } = req.body;
    const categories = await db.Category.findAll();
    const validatorErrors = validationResult(req);

    if (validatorErrors.isEmpty()) {
        await db.Question.create({
            title,
            body,
            userId: req.session.auth.userId,
            categoryId,
        });

        res.redirect('/questions');
    }
    else {
        const errors = {};
        validatorErrors.array().forEach(err => {
            errors[err.param] = err.msg;
        });

        res.render('new-question', {
            title: 'Ask your question or forever hold your peace!!!',
            categories,
            id: '',
            question: { title: null, body: null },
            errors,
            csrfToken: req.csrfToken(),
        });
    }


})));


router.get('/:id', asyncHandler((async (req, res) => {
    const question = await db.Question.findOne({ where: { id: req.params.id },
        include: [{ model: db.Answer }, { model: db.Category }, { model: db.User }] });

    const user = res.locals.user;
    const hasAnswered = await user?.hasAnswered(question.id);

    res.render('question-page', { title: 'Answer and Begone', question, user, hasAnswered });
})));

router.get('/:id/edit', requireAuth, csrfProtection, asyncHandler((async (req, res) =>{
    const question = await db.Question.findByPk(req.params.id);
    const categories = await db.Category.findAll();
    res.render('new-question', {
        title: 'Edit your question!',
        question,
        id: `/${req.params.id}/edit`,
        categories,
        errors: {},
        csrfToken: req.csrfToken(),
    });

})));

router.post('/:id/edit', requireAuth, csrfProtection, questionsValidators, asyncHandler((async (req, res) => {
    const { title, body, categoryId } = req.body;
    const validatorErrors = validationResult(req);
    const question = await db.Question.findByPk(req.params.id);
    const categories = await db.Category.findAll();

    if (validatorErrors.isEmpty()) {

        question.title = title;
        question.body = body;
        question.categoryId = categoryId;

        await question.save();

        res.redirect(`/questions/${question.id}`);
    }
    else {
        const errors = {};
        validatorErrors.array().forEach(err => {
            errors[err.param] = err.msg;
        });

        res.render('new-question', {
            title: 'Edit your question!',
            question: { title, body },
            id: `/${req.params.id}/edit`,
            categories,
            errors,
            csrfToken: req.csrfToken(),
        });
    }
})));
router.post('/:id/delete', requireAuth, asyncHandler((async (req, res) => {
    const question = await db.Question.findByPk(req.params.id);
    await question.destroy();
    res.redirect('/questions');
})));


module.exports = router;
