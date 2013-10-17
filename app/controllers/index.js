/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    async = require('async'),
    _ = require('underscore');


exports.render = function(req, res) {
	var user = null;
	if(req.user) {
		user = {
			name: req.user.name,
			username: req.user.username,
			email: req.user.email,
		};
	}
    res.render('index', {
        user: req.user ? JSON.stringify(req.user) : "null"
    });
};
