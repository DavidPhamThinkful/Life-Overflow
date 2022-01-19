const express = require('express');
const { Sequelize } = require('../db/models');
const db = require('../db/models');
const { asyncHandler } = require('../utils.js');
const router = express.Router();

router.get('/:id', asyncHandler(async (req, res) => {
    const catName = decodeURIComponent(req.params.id);
    const category = await db.Category.findOne({
        where: {
            name: {
                [Sequelize.Op.iLike]: catName,
            },
        },
        include: 'Questions',
    });
    const questions = category.Questions;
    console.log(questions);

    res.render('categories', { title: category.name, questions });
}));

module.exports = router;
