const express = require('express');
const db = require('../../db/models');
const { asyncHandler } = require('../../utils.js');

const router = express.Router();

router.get('/answers/:id(\\d+)', asyncHandler(async (req, res) => {
    const answerId = req.params.id;
    const answer = await db.Answer.findOne({
        where: { id: answerId },
        include: 'Votes',
    });

    if (answer) {
        const votes = answer.Votes;
        const upVotesCounter = votes.filter(vote => vote.value === true).length;
        const downVotesCounter = votes.filter(vote => vote.value === false).length;

        const data = {
            id: answer.id,
            userId: answer.userId,
            questionId: answer.questionId,
            body: answer.body,
            upVotesCounter,
            downVotesCounter,
        };

        res.json({ answer: data });
    }
    else {
        res.json({ message: 'Answer not found ' });
    }
}));

router.post('/questions/:questionId(\\d+)/answers', asyncHandler(async (req, res) => {
    const questionId = parseInt(req.params.questionId);
    const userId = req.session.auth.userId;
    const { body } = req.body;

    const answer = await db.Answer.create({ questionId, userId, body: body });
    res.json({ body, id: answer.id });
}));

router.put('/answers/:id(\\d+)', asyncHandler(async (req, res) => {
    const { id } = req.params;
    const answer = await db.Answer.findByPk(id);
    const { body } = req.body;

    if (answer) {
        answer.body = body;
        await answer.save();
        res.json({ body, id });
    }
}));

router.delete('/answers/:id(\\d+)', asyncHandler(async (req, res) => {
    const { id } = req.params;
    const answer = await db.Answer.findByPk(id);

    if (answer) {
        answer.destroy();
        res.status(204).end();
    }
}));

module.exports = router;
