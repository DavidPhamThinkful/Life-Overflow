const express = require('express');
const db = require('../db/models');
const { asyncHandler } = require('../utils.js');

const router = express.Router();

router.get('/answers/:id(\\d+)', asyncHandler(async (req, res) => {

}))

router.post('/answers/:id(\\d+)', asyncHandler(async (req, res) => {
    
}))

router.put('/answers/:id(\\d+)', asyncHandler(async (req, res) => {
    
}))

router.delete('/answers/:id(\\d+)', asyncHandler(async (req, res) => {
    
}))

module.exports = router;
