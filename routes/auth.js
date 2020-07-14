var express = require('express');
var router = express.Router();

const passport = require("passport");
var authController = require('../controllers/authController')

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

router.get('/admin', authController.admin_get);

router.post('/admin', authController.admin_post);

module.exports = router;
