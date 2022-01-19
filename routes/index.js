const express = require('express');
const db = require('../db/models');
const bcrypt = require('bcryptjs');
const { csrfProtection, asyncHandler } = require('../utils.js');
const { check, validationResult } = require('express-validator');
const { loginUser, logoutUser } = require('../auth.js');
const { Sequelize } = require('../db/models');

const router = express.Router();

/* GET home page. */
router.get('/', asyncHandler(async (req, res) => {
    const categories = await db.Category.findAll();
    res.render('index', { title: 'Welcome to LifeOverflow', categories });
}));

const registerValidators = [
    check('username')
        .exists({ checkFalsy: true })
        .withMessage('Please provide a value for Username')
        .isLength({ max: 25 })
        .withMessage('Username must not be more than 25 characters long')
        .custom(value => {
            return db.User.findOne({ where: { username: value } })
                .then((user) => {
                    if (user) {
                        return Promise.reject('The provided Username is already exist, please choose another one');
                    }
                });
        }),
    check('email')
        .exists({ checkFalsy: true })
        .withMessage('Please provide a value for Email')
        .isEmail()
        .withMessage('The provided Email is not a valid email format')
        .isLength({ max: 255 })
        .withMessage('Email Address must not be more than 255 characters long')
        .custom((value) => {
            return db.User.findOne({ where: { email: value } })
                .then((user) => {
                    if (user) {
                        return Promise.reject('The provided Email Address is already in use');
                    }
                });
        }),
    check('password')
        .exists({ checkFalsy: true })
        .withMessage('Please provide a value for Password')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/, 'g')
        .withMessage('Password must contain at least 1 lowercase letter, uppercase letter, number, and special character (i.e. "!@#$%^&*")'),
    check('confirmPassword')
        .exists({ checkFalsy: true })
        .withMessage('Please provide a value for Confirm Password')
        .isLength({ max: 50 })
        .withMessage('Confirm Password must not be more than 50 characters long')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Confirm Password does not match Password');
            }
            return true;
        }),
];

const loginValidators = [
    check('email')
        .exists({ checkFalsy: true })
        .withMessage('Please enter an email'),
    check('password')
        .exists({ checkFalsy: true })
        .withMessage('Please enter a password'),
];

router.get('/register', csrfProtection, (req, res) => {
    res.render('register', { title: 'Register', csrfToken: req.csrfToken() });
});

router.post('/register', csrfProtection, registerValidators, asyncHandler(async (req, res) => {
    const { email, username, password } = req.body;
    const user = await db.User.build({ email, username });

    const validatorErrors = validationResult(req);

    if (validatorErrors.isEmpty()) {
        const hashedPassword = await bcrypt.hash(password, 10);
        user.hashedPassword = hashedPassword;
        await user.save();

        loginUser(req, user);
        res.redirect('/');
    }
    else {
        const errors = validatorErrors.array().map(err => err.msg);
        res.render('register', { title: 'Register', csrfToken: req.csrfToken(), username, email, errors });
    }
}));

router.get('/login', csrfProtection, (req, res) => {
    res.render('login', { title: 'Login', csrfToken: req.csrfToken() });
});


router.post('/login', csrfProtection, loginValidators, asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    let errors = [];
    const validatorErrors = validationResult(req);

    if (validatorErrors.isEmpty()) {
        const user = await db.User.findOne({ where: { email } });

        if (user && await bcrypt.compare(password, user.hashedPassword.toString())) {
            loginUser(req, user);
            return res.redirect('/');
        }
        else {
            errors.push('The provided email or password is incorrect');
        }
    }
    else {
        errors = validatorErrors.array().map(err => err.msg);
    }

    res.render('login', { title: 'Login', csrfToken: req.csrfToken(), email, errors });
}));

router.post('/logout', (req, res) => {
    logoutUser(req);
    res.redirect('/');
});

router.post('/demo', asyncHandler(async (req, res) => {
    const user = await db.User.findOne({ where: { username: 'Demo' } });
    loginUser(req, user);
    res.redirect('/');
}));

router.get('/search', asyncHandler(async (req, res) => {
    const { query } = req.query;
    const questions = await db.Question.findAll({
        where: {
            [Sequelize.Op.or]: [
                {
                    title: {
                        [Sequelize.Op.iLike]: `%${query}%`,
                    },
                },
                {
                    description: {
                        [Sequelize.Op.iLike]: `%${query}%`,
                    },
                },
            ],
        },
    });

    res.render('search', { title: query, questions });
}));

module.exports = router;
