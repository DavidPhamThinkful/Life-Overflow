const express = require('express');
const db = require('../../db/models');
const { asyncHandler } = require('../../utils.js');

const router = express.Router();

router.get('/answers/:id(\\d+)', asyncHandler(async (req, res) => {

}));

router.post('/questions/:questionId(\\d+)/answers', asyncHandler(async (req, res) => {
    const questionId = parseInt(req.params.questionId);
    const userId = req.session.auth.userId;
    const { body } = req.body;

    await db.Answer.create({ questionId, userId, description: body });
    res.json({ body });
}));

router.put('/answers/:id(\\d+)', asyncHandler(async (req, res) => {

}));

router.delete('/answers/:id(\\d+)', asyncHandler(async (req, res) => {

}));

module.exports = router;
