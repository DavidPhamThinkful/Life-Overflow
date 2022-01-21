const express = require('express');
const db = require('../../db/models');
const { asyncHandler } = require('../../utils.js');
const { Op } = require('sequelize');

const router = express.Router();
const { Vote, Answers } = db;


const answerNotFoundError = (id) => {
    const err = Error(`Answer with id of ${id} could not be found.`);
    err.title = 'Answer not found.';
    err.status = 404;
    return err;
};


// ! =============================================================================================
// ! POST UP VOTE
// ! =============================================================================================
router.post('/answers/:answerId(\\d+)/up', asyncHandler(async (req, res, next) => {
    const answerId = req.params.answerId;

    const vote = await Vote.findOne({
        where: {
            answerId,
            userId: req.session.auth.userId,
        },
    });

    if (vote) { // vote exists
        if (vote.value) { // user clicks same vote btn so destroy record for userID
            await vote.destroy();
            res.json({ up: -1, down: 0 });
        }
        else { // change vote status that exists per userId
            vote.value = true;
            await vote.save();
            res.json({ up: 1, down: -1 });
        }
    }
    else { // new vote created since no vote yet for userId
        const newVote = await Vote.create({
            value: true,
            userId: res.locals.user.id,
            answerId: answerId,
        });
        res.json({
            down: 0,
            up: 1,
        });
    }
}));


// ! =============================================================================================
// ! POST DOWN VOTE
// ! =============================================================================================
router.post('/answers/:answerId(\\d+)/down', asyncHandler(async (req, res, next) => {
    const answerId = req.params.answerId;

    const vote = await Vote.findOne({
        where: {
            answerId,
            userId: res.locals.user.id,
        },
    });

    if (vote) { // vote exists
        if (vote.value) { // user clicks same vote btn so destroy record for userID
            vote.value = false;
            await vote.save();
            res.json({ up: -1, down: 1 });
        }
        else { // change vote status that exists per userId
            await vote.destroy();
            res.json({ up: 0, down: -1 });
        }
    }
    else { // new vote created since no vote yet for userId
        const newVote = await Vote.create({
            value: false,
            userId: res.locals.user.id,
            answerId: answerId,
        });
        res.json({
            down: 1,
            up: 0,
        });
    }
}));

// ! =============================================================================================


module.exports = router;
