const express = require('express');
const { Sequelize } = require('../db/models');
const db = require('../db/models');
const { asyncHandler } = require('../utils.js');
const router = express.Router();

const images = {
    family: 'https://compass-ssl.microsoft.com/assets/fe/5b/fe5b766b-2852-4866-8dcb-fc93763fad6e.png?n=FamilyHeroAnim2_poster_trimmed.png',
    friends: 'https://clipartix.com/wp-content/uploads/2018/01/Friends-clipart-free-download-clip-art-on.jpg',
    romance: 'https://www.pngkit.com/png/detail/171-1719776_romance-clipart-romantic-clipart.png',
    life: 'https://www.pngall.com/wp-content/uploads/1/Life-PNG-Clipart.png',
    death: 'https://www.pikpng.com/pngl/b/278-2786753_jpg-freeuse-stock-death-pass-away-frames-illustrations.png',
};

router.get('/:id', asyncHandler(async (req, res) => {
    const catName = decodeURIComponent(req.params.id);
    const category = await db.Category.findOne({
        where: {
            name: {
                [Sequelize.Op.iLike]: catName,
            },
        },
        include: 'Questions',
        order: [['updatedAt', 'DESC']],
    });
    const questions = category.Questions;
    const image = images[catName];

    res.render('questions', { title: category.name, questions, image });
}));

module.exports = router;
