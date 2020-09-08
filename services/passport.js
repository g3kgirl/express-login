const passport = require('passport');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const LocalStrategy = require('passport-local').Strategy;

/**
 * The first time user logs in, we take user's id and
 * store it in req.session.passport.user as cookie.
 * All the follow up request will contain this cookie.
 * cookie-session does the job of decrypting this information.
 */
passport.serializeUser((user, done) => {
  done(null, user.id);
});

/**
 * After logging in, all the follow up requests by user contains
 * the cookie. cookie-session docodes it and put the information
 * inside req.session.passport.id . This id (user's id) is retrieved
 * from session object and then we find the user from database using
 * the id and put it into req.user
 */
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});



passport.use(new LocalStrategy(
  function (email, password, done) {
    User.findOne({ email: email }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, null, 'User not found');
      }
      return user.comparePassword(password, (err, match) => {
        if (err) {
          return done(null, false);
        }
        return done(null, user);
      })
    });
  }
));
