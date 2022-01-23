const express = require('express');
const db = require('../../db/models');
const { asyncHandler } = require('../../utils.js');

const router = express.Router();

router.put('/answers/:answerId(\\d+)/votes', asyncHandler(async (req, res) => {
    const answerId = req.params.answerId;

    const vote = await db.Vote.findOne({
        where: {
            answerId,
            userId: req.session.auth.userId,
        },
    });

    const { value } = req.body;
    if (vote) { // vote exists
        const oldValue = vote.value;
        if (vote.value === value) { // user clicks same vote btn so destroy record for userID
            await vote.destroy();
            res.json({ oldValue, value });

        }
        else { // change vote status that exists per userId
            vote.value = value;
            await vote.save();
            res.json({ oldValue, value });
        }
    }
    else { // new vote created since no vote yet for userId
        await db.Vote.create({
            userId: res.locals.user.id,
            answerId: answerId,
            value,
        });
        res.json({ oldValue: null, value });
    }
}));

module.exports = router;
