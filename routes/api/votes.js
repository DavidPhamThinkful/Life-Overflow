const express = require('express');
const db = require('../../db/models');
const { asyncHandler } = require('../../utils.js');
const { Op } = require('sequelize');

const router = express.Router();
const { Votes, Answers } = db;


const answerNotFoundError = (id) => {
    const err = Error(`Answer with id of ${id} could not be found.`);
    err.title = 'Answer not found.';
    err.status = 404;
    return err;
};

// ! =============================================================================================
// ! GET
// router.get('/votes/:id(\\d+)', asyncHandler(async (req, res, next) => {
//     const answerId = parseInt(req.params.id, 10); // answerID: 5 | userId: 3 | questionId: 3
//     const answers = await Answers.findByPk(answerId); // vote id: 1

//     if (answers) {
//         res.status(201).json({ answers });
//     }
//     else {
//         next(answerNotFoundError(answerId));
//     }
// }));


// ! =============================================================================================
// ! POST VOTE UP
router.post('/answers/:answerId(\\d+)/up', asyncHandler(async (req, res, next) => {
    const answerId = req.params.id;
    const vote = await Votes.findOne({
        where: {
            [Op.and]: [
                { answerId },
                { userId: res.locals.user.id },
            ],
        },
    });

    if (vote) { // vote exists
        if (vote.value) { // user clicks same vote btn so destroy record for userID
            await vote.destroy();
            res.status(201).json({ up: -1, down: 0 });
        }
        else { // change vote status that exists per userId
            vote.value = true;
            await vote.save();
            res.status(201).json({ up: 1, down: -1 });
        }
    }
    else { // new vote created since no vote yet for userId
        const newVote = await Votes.create({
            value: true,
            userId: res.locals.user.id,
            answerId: answerId,
        });
        res.status(201).json({ up: 1, down: 0 });
    }
}));


// ! =============================================================================================
// ! PUT
router.put('/votes/:id(\\d+)', asyncHandler(async (req, res, next) => {
    const answerId = req.params.id;
    const userId = req.user.id;


    if (answerId) {
        await vote.update({ value: req.body.value });
        res.json({ vote });
    }
    else {
        next(answerNotFoundError(answerId));
    }

}));


// ! =============================================================================================
// ! DELETE
router.delete('/votes/:id(\\d+)', asyncHandler(async (req, res, next) => {
    const answerId = parse(req.params.id, 10);
    const voteId = await Answers.findByPk({});


    if (voteId) {
        await vote.destroy();
        res.status(204).end();
    }
    else {
        next(answerNotFoundError(voteId));
    }
}));


// ! =============================================================================================


module.exports = router;
