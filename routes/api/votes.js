const express = require('express');
const db = require('../db/models');
const { asyncHandler } = require('../utils.js');

const router = express.Router();

router.get('/votes/:id(\\d+)', asyncHandler(async (req, res) => {

}))

router.post('answers/:answerId(\\d+)/votes', asyncHandler(async (req, res) => {
    
}))

router.put('/votes/:id(\\d+)', asyncHandler(async (req, res) => {
    
}))

router.delete('/votes/:id(\\d+)', asyncHandler(async (req, res) => {
    
}))

module.exports = router;
