const User = require("../models/user");

module.exports.renderSignup = (req, res) => {
    res.render('users/signup.ejs')
};

module.exports.signup = async (req, res, next) => {
    try {
        let { username, email, password } = req.body;
        let newuser = new User({
            email,
            username,
        });
        let registeredUser = await User.register(newuser, password);


        // after signup we want to login the user
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash('success', 'Welcome to Stay Finder');
            res.redirect('/listings');
        });


    } catch (e) {
        req.flash('error', e.message);
        console.log(e.message);
        res.redirect('/signup');
    }
};

module.exports.renderLogin = (req, res) => {
    res.render('users/login.ejs')
};

module.exports.login = async (req, res) => {
    req.flash('success', 'Welcome to Stay Finder');
    //if res.locals.redirectUrl is enpty/undefined the url will redirect to /listings
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.logout = (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash('success', 'you are logged out');
        res.redirect('/listings');
    });
};