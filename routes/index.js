var express = require('express');
var router = express.Router();
var passport = require('passport');
const mongoose = require('mongoose');
const User = mongoose.model('User');



/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express', me: req.user || {} });
});


router.get('/login', function (req, res, next) {
  res.render('login', { title: 'Login' });
});

router.get('/register', function (req, res, next) {
  res.render('register', { title: 'register' });
});

router.get('/logout', function (req, res, next) {
  req.logOut();
  res.redirect('/login');
});

router.post('/login', (req, res, next) => {
  passport.authenticate('local', function (err, user, info) {
    if (err) { return next(err); }
    if (!user) {
      return res.status(400).send({ error: info });
    }
    req.logIn(user, function (err) {
      if (err) { return next(err); }
      return res.redirect('/');
    });
  })(req, res, next);
});

router.post('/register', (req, res, next) => {

  const { username: email, password, level } = req.body;

  User.findOne({ email: email }, function (err, user) {
    if (err) {
      return res.status(400).send({ err });
    }
    if (!user) {
      const newUser = new User({
        name: email,
        email: email,
        password: password,
        accessLevel: parseInt(level)
      }).save()
        .then(user => {
          req.logIn(user, function (err) {
            if (err) { return next(err); }
            return res.redirect('/');
          });
        })
        .catch(err => {
          return res.status(400).send({ err });
        })
      return newUser;
    }
    return res.status(400).send({ error: 'user already exists' });
  });
});


module.exports = router;
