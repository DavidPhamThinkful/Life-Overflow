const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const { sequelize } = require('./db/models');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const { restoreUser } = require('./auth.js');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const categoriesRouter = require('./routes/categories');
const questionRouter = require('./routes/question');
const answersAPI = require('./routes/api/answers');
const votesAPI = require('./routes/api/votes');

const app = express();

// view engine setup
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// set up session middleware
const store = new SequelizeStore({ db: sequelize });

app.use(
    session({
        secret: 'superSecret',
        // store,
        saveUninitialized: false,
        resave: false,
    }),
);
app.use(restoreUser);

// create Session table if it doesn't already exist
store.sync();

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/categories', categoriesRouter);
app.use('/questions', questionRouter);
app.use('/api', answersAPI);
app.use('/api', votesAPI);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error', { errStatus: err.status });
});

module.exports = app;
