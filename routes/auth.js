var express = require('express');
var router = express.Router();

//const session = require("express-session");
const passport = require("passport");
//const LocalStrategy = require("passport-local").Strategy;
//const bcrypt = require("bcryptjs");

//var User = require('../models/user');
var authController = require('../controllers/authController')

/*
passport.use(
  new LocalStrategy((username, password, done) => {
    User.findOne({ username: username }, (err, user) => {
      if (err) {
	console.log('ERROR GENERAL\n');
        return done(err);
      };
      if (!user) {
	console.log('ERROR USER\n');
        return done(null, false, { msg: "Incorrect username" });
      }
      bcrypt.compare(password, user.password, (err, res) => {
          if (res) { return done(null, user); console.log('logged in')}
          else {
             console.log('not working');
             return done(null, false, {msg: "Incorrect password"});
          }
      });
    });
  })
);
*/
router.get('/signup', authController.signup_get);

router.post('/signup', authController.signup_post);

router.get('/login', authController.login_get);

router.post(
   '/login',
   passport.authenticate('local'),
   function(req, res) {
    res.redirect('/');
   }
);

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect("/products");
});

module.exports = router;
