var async = require('async');
const bcrypt = require('bcryptjs');
var User = require('../models/user');
const validator = require('express-validator');
const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

require('dotenv').config();

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

exports.admin_get = function(req, res) {
    res.render('admin', {title: 'Admin'});
}

exports.admin_post = [
    body('code', 'Please enter the code').trim().isLength({min: 1})
        .custom((value) => value === process.env.ADMIN_CODE)
	.withMessage('Incorrect code.'),

    sanitizeBody('code').escape(),

    (req, res, next) => {
        const errors = validationResult(req);

	if (!errors.isEmpty()) {
           res.render('admin', {title: 'Admin', errors: errors.array()});
           return;
        } 
	else { 
            var user = new User({
	        first_name: res.locals.first_name,
                family_name: res.locals.family_name,
                username: res.locals.username,
                password: res.locals.password,
                member_status: 1,
		_id: res.locals.currentUser._id
	    })
            User.findByIdAndUpdate(res.locals.currentUser._id, user, {},
	        function (err) {
                    if (err) { return next(err); }
                    res.redirect('/');
	    });
	}
    }
]
