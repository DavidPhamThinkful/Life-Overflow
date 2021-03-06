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
    const categories = await db.Category.findAll({
        order: [['name', 'ASC']],
    });
    res.render('index', { title: 'Welcome to LifeOverflow', categories });
}));

const registerValidators = [
    check('username')
        .exists({ checkFalsy: true })
        .withMessage('Please provide a value for Username')
        .bail()
        .isLength({ max: 25 })
        .withMessage('Username must not be more than 25 characters long')
        .bail()
        .custom(value => {
            return db.User.findOne({ where: { username: value } })
                .then((user) => {
                    if (user) {
                        return Promise.reject('The provided Username is already exist, please choose another one');
                    }
                });
        }),
    check('email')
        .isEmail()
        .withMessage('Please enter a valid email.')
        .bail()
        .isLength({ max: 255 })
        .withMessage('Email Address must not be more than 255 characters long')
        .bail()
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
        .bail()
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/, 'g')
        .withMessage('Password must contain at least 1 lowercase letter, uppercase letter, number, and special character (i.e. "!@#$%^&*")')
        .bail()
        .isLength({ max: 50 })
        .withMessage('Confirm Password must not be more than 50 characters long'),
    check('confirmPassword')
        .exists({ checkFalsy: true })
        .withMessage('Please provide a value for Confirm Password')
        .bail()
        .isLength({ max: 50 })
        .withMessage('Confirm Password must not be more than 50 characters long')
        .bail()
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Password and Confirm password must match.');
            }
            return true;
        }),
];

const loginValidators = [
    check('email')
        .isEmail()
        .withMessage('Please enter a valid email.'),
    check('password')
        .exists({ checkFalsy: true })
        .withMessage('Please enter a password.'),
];

router.get('/register', csrfProtection, (req, res) => {
    res.render('register', { title: '', csrfToken: req.csrfToken(), errors: {} });
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
        const errors = {};
        validatorErrors.array().forEach(err => {
            errors[err.param] = err.msg;
        });

        res.render('register', { title: 'Register', csrfToken: req.csrfToken(), username, email, errors });
    }
}));

router.get('/login', csrfProtection, (req, res) => {
    res.render('login', { title: '', csrfToken: req.csrfToken(), errors: {} });
});


router.post('/login', csrfProtection, loginValidators, asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const errors = {};
    const validatorErrors = validationResult(req);

    if (validatorErrors.isEmpty()) {
        const user = await db.User.findOne({ where: { email } });

        if (user && await bcrypt.compare(password, user.hashedPassword.toString())) {
            loginUser(req, user);
            return res.redirect('/');
        }
        else {
            errors.login = 'The provided email or password is incorrect';
        }
    }
    else {
        validatorErrors.array().forEach(err => {
            errors[err.param] = err.msg;
        });
    }

    res.render('login', { title: 'Login', csrfToken: req.csrfToken(), email, errors });
}));

router.post('/logout', (req, res) => {
    logoutUser(req);
    res.redirect('/');
});

router.post('/demo', asyncHandler(async (req, res) => {
    const user = await db.User.findOne({ where: { username: 'JusticeCouple' } });
    loginUser(req, user);
    res.redirect('/');
}));

router.get('/search', asyncHandler(async (req, res) => {
    const { query } = req.query;
    if (query === '') {
        return res.render('search', { title: 'Nothing was entered in search bar.', questions: [] });
    }
    const questions = await db.Question.findAll({
        where: {
            [Sequelize.Op.or]: [
                {
                    title: {
                        [Sequelize.Op.iLike]: `%${query}%`,
                    },
                },
                {
                    body: {
                        [Sequelize.Op.iLike]: `%${query}%`,
                    },
                },
            ],
        },
        order: [['updatedAt', 'DESC']],
    });

    res.render('search', { title: `Results for "${query}"`, questions });
}));

module.exports = router;
