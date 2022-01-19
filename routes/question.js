const express = require('express');
const { requireAuth } = require('../auth');
const { csrfProtection, asyncHandler } = require('../utils');
const db = require('../db/models');

const router = express.Router();

router.get('/', asyncHandler((async (req, res) => {
    const questions = await db.Question.findAll();
        res.render('question', {title:'Here is the list of questions',questions}); 
})));


router.get('/new', requireAuth, csrfProtection, asyncHandler(async (req, res) => {
    const categories = await db.Category.findAll();
    res.render('new-question', {title:'Ask your question or forever hold your peace!!!',categories, csrfToken: req.csrfToken()});
}));
router.post('/',requireAuth, csrfProtection, asyncHandler((async (req, res) => {
    const { title, description, categoryId} = req.body;
    const question = await db.Question.create({
        title,
        description,
        userId: req.session.auth.userId,
        categoryId
    });
    res.redirect('questions');
})));


router.get('/:id',requireAuth, asyncHandler((async (req, res) => {
    const question = await db.Question.findByPk(req.params.id);
    res.render('questions', { title:'Here is your question! ANSWER OR BEGONE!',questions: [question] } ); 
})));

router.get('/:id/edit',requireAuth, asyncHandler((async (req, res) =>{
    const question = await db.Question.findByPk(req.params.id);
    const categories = await db.Category.findAll();
    res.render('new-question', {title:'Edit your question!', question, categories, csrfToken:req.csrfToken()})

})));

router.post('/:id',requireAuth, asyncHandler((async (req, res) => {  
    const {title, description, categoryId} = req.body;

    const question = await db.Question.findByPk(req.params.id);

    question.title = title;

    question.description = description;

    question.categoryId = categoryId;

    await question.save();

    res.redirect(`/questions/${question.id}`)


  
    
})));
router.delete('/:id',requireAuth, asyncHandler((async (req, res) => {
    const question = await db.Question.findByPk(req.params.id);
    await question.destroy();
    res.redirect('questions')
})));


module.exports = router;
