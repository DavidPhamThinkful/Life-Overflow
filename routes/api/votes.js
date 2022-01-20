const express = require('express');
const db = require('../../db/models');
const { asyncHandler } = require('../../utils.js');

const router = express.Router();

// router.get('/votes/:id(\\d+)', asyncHandler(async (req, res) => {


//     console.log(votes);
// }));

router.post('answers/:answerId(\\d+)/votes', asyncHandler(async (req, res) => {

}));

router.put('/votes/:id(\\d+)', asyncHandler(async (req, res) => {
    const { id } = req.params;
    console.log(id);
}));

router.delete('/votes/:id(\\d+)', asyncHandler(async (req, res) => {

}));

module.exports = router;
