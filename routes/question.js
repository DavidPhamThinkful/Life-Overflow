const express = require('express');
const { requireAuth } = require('../auth');
const { csrfProtection, asyncHandler } = require('../utils');
const db = require('../db/models');

const router = express.Router();

router.get('/', asyncHandler((async (req, res) => {
    const questions = await db.Question.findAll({
        include: [{model: db.Answer}, {model: db.Category}, {model: db.User}]});
        res.render('question', {title:'Here is the list of questions', questions, user: res.locals.user});
})));


router.get('/new', requireAuth, csrfProtection, asyncHandler(async (req, res) => {
    const categories = await db.Category.findAll();
    res.render('new-question', {title:'Ask your question or forever hold your peace!!!',categories, id:"", question:{title: null, description: null}, csrfToken: req.csrfToken()});
}));
router.post('/',requireAuth, csrfProtection, asyncHandler((async (req, res) => {
    const { title, description, categoryId} = req.body;
    const categories = await db.Category.findAll();
    const errors = []

    if(title.length < 10 || title.length > 255){
        errors.push("Title does not fall within range of 10-255 characters!")
    }

    if(description.length < 10){
        errors.push("Description must be within 10 characters!")
    }


    if(!errors.length){
        const question = await db.Question.create({
        title,
        description,
        userId: req.session.auth.userId,
        categoryId
    });

        res.redirect('/questions');
    } else {
        res.render('new-question', {title:'Ask your question or forever hold your peace!!!',categories, id:"", question:{title: null, description: null}, errors, csrfToken: req.csrfToken()});
    }



})));


router.get('/:id(\\d+)',requireAuth, asyncHandler((async (req, res) => {
    const questions = [await db.Question.findOne({ where: {id: req.params.id},
        include: [{model: db.Answer}, {model: db.Category}, {model: db.User}]})];
        console.log(questions[0].Answers[0])
        res.render('question', {title: 'Answer and Begone', questions, id: req.params.id, user: res.locals.user});
})));

router.get('/:id/edit',requireAuth, asyncHandler((async (req, res) =>{
    const question = await db.Question.findByPk(req.params.id);
    const categories = await db.Category.findAll();
    res.render('new-question', {title:'Edit your question!', question, id:`/${req.params.id}`,categories, csrfToken:req.csrfToken()})

})));

router.post('/:id(\\d+)',requireAuth, asyncHandler((async (req, res) => {
    const {title, description, categoryId} = req.body;

    const question = await db.Question.findByPk(req.params.id);

    question.title = title;

    question.description = description;

    question.categoryId = categoryId;

    await question.save();

    res.redirect(`/questions/${question.id}`)




})));
router.post('/:id/delete',requireAuth, asyncHandler((async (req, res) => {
    const question = await db.Question.findByPk(req.params.id);
    await question.destroy();
    res.redirect('questions')
})));


module.exports = router;
