var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var passport = require('passport');
var cookieSession = require('cookie-session');

require('./models/User');
require('./services/passport');

var indexRouter = require('./routes/index');

// connect to the database
mongoose.connect('mongodb://localhost:27017/user-login', { useUnifiedTopology: true });
mongoose.Promise = global.Promise;
mongoose.connection.on('error', err => {
  console.log(`DB connection → ${err.message}`);
});



var app = express();

app.set('trust proxy', 1) // trust first proxy


app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}))


app.use(passport.initialize());
app.use(passport.session());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');




app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use((req, res, next) => {
  var isAuth = req.isAuthenticated();
  var isLogin = ['/login', '/register'].includes(req.originalUrl);

  if (!isAuth && !isLogin) {
    return res.redirect('/login');
  }
  return next();
})

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
