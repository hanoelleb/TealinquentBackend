var async = require('async');
const bcrypt = require('bcryptjs');
var User = require('../models/user');
const validator = require('express-validator');
const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

exports.signup_get = function(req, res) {
    res.render('sign_up', {title: 'Sign up'});
}

exports.signup_post = [
  body('firstName', 'First name required.').trim().isLength({ min: 1 }),
  body('familyName', 'Family name required.').trim().isLength({ min: 1 }),
  body('username', 'Email required.').trim().isLength({ min: 1 }),
  body('password', 'Password required').trim().isLength({ min: 1 }),
  body('confirm', 'Confirm password').trim().isLength({ min: 1 })
     .custom((value, { req }) => value === req.body.password).withMessage('Passwords do not match'),

  sanitizeBody('firstName').escape(),
  sanitizeBody('familyName').escape(),
  sanitizeBody('username').escape(),
  sanitizeBody('password').escape(),

  (req, res, next) => {
     const errors = validationResult(req);
     bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
      if (err) { return next(err); }
      
      const user = new User({
	 first_name: req.body.firstName,
	 family_name: req.body.familyName,
         username: req.body.username,
         password: hashedPassword,
	 member_status: 0,
      });

       if (!errors.isEmpty()) {
           res.render('sign_up', {title: 'Sign up', first_name: req.body.firstName,
               family_name: req.body.familyName, username: req.body.email,
	       errors: errors.array()
	   });
	   return;
       }

       else {
           user.save(function(err) {
               if (err) {return next(err)};
	       res.redirect("/");
	   });
         }
      });
  }
]

exports.login_get = function(req, res) {
    res.render('login', {title: 'Login'});
}
