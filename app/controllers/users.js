/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    User = mongoose.model('User');

/**
 * Auth callback
 */
exports.authCallback = function(req, res, next) {
    res.redirect('/');
};

/**
 * Show login form
 */
exports.signin = function(req, res) {
    res.render('users/signin', {
        title: 'Signin',
        errors: req.flash('error')
    });
};

/**
 * Show sign up form
 */
exports.signup = function(req, res) {
    var user = req.flash('user');
    if(user && user.length == 1) {
        user = user[0];
    } else {
        user = new User();
    }
    res.render('users/signup', {
        title: 'Sign up',
        //errors: req.flash('errors'),
        user: user
    });
};

/**
 * Logout
 */
exports.signout = function(req, res) {
    req.logout();
    res.redirect('/');
};

/**
 * Session
 */
exports.session = function(req, res) {
    res.redirect('/');
};

/**
 * Create user
 */
exports.create = function(req, res) {
    var user = new User(req.body);

    user.provider = 'local';
    user.save(function(err) {
        if (err) {
           for(var i in err.errors) {
               req.flash('errors', {message:err.errors[i].type, path:err.errors[i].path});
           }
           req.flash('user', user);
           return res.redirect('/signup');
       }
       req.logIn(user, function(err) {
           if (err) return next(err);
           return res.redirect('/');
       });
    });
};

/**
 *  Show profile
 */
exports.show = function(req, res) {
    var user = req.profile;

    res.render('users/show', {
        title: user.name,
        user: user
    });
};

/**
 * Send User
 */
exports.me = function(req, res) {
    res.jsonp(req.user || null);
};

/**
 * Find user by id
 */
exports.user = function(req, res, next, id) {
    User
        .findOne({
            _id: id
        })
        .exec(function(err, user) {
            if (err) return next(err);
            if (!user) return next(new Error('Failed to load User ' + id));
            req.profile = user;
            next();
        });
};
