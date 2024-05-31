const express = require("express");
const router = express.Router();
const User = require("../models/user");
const passport = require('passport');
const { saveRedirectUrl } = require("../middleware");
const usercontroller = require('../controllers/user');

router.route('/signup')
    .get(usercontroller.renderSignup)
    .post(usercontroller.signup);

router.route('/login')
    .get(usercontroller.renderLogin)
    .post(saveRedirectUrl, passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), usercontroller.login);

router.get('/logout', usercontroller.logout);
module.exports = router;


// router.get('/signup', usercontroller.renderSignup);
// router.post('/signup', usercontroller.signup);

// router.get('/login', usercontroller.renderLogin);

// router.post('/login', saveRedirectUrl, passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), usercontroller.login);

// router.get('/logout', usercontroller.logout);