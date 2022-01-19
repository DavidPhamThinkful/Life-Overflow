const express = require('express');
const { requireAuth } = require('../auth');
const { csrfProtection, asyncHandler } = require('../utils');
const db = require('../db/models');

const router = express.Router();

router.get('/', asyncHandler((async (req, res) => {
    const questions = await db.Question.findAll();
        res.render('question', {questions});
})));


router.get('/new', requireAuth, csrfProtection, asyncHandler(async (req, res) => {
    const categories = await db.Category.findAll();
    res.render('new-question', {categories, csrfToken: req.csrfToken()});
}));
router.post('/',requireAuth, csrfProtection, asyncHandler((async (req, res) => {
    const { title, description, categoryId} = req.body;
    const question = await db.Question.create({
        title,
        description,
        userId: req.session.auth.userId,
        categoryId
    });
    res.redirect('/questions');
})));


router.get('/questions/:id',requireAuth, asyncHandler((async (req, res) => {

})));
router.put('/questions/:id',requireAuth, asyncHandler((async (req, res) => {

})));
router.delete('/questions/:id',requireAuth, asyncHandler((async (req, res) => {

})));


module.exports = router;
