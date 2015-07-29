var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');
var bCrypt = require('bcrypt-nodejs');

module.exports = function(passport) {
	passport.use('signup', new LocalStrategy({
		passReqToCallback : true
	},
	function(req, username, password, done) {
		findOrCreateUser = function() {
			User.findOne({ 'username' : username }, function(err, user) {
				if (err) {
					console.log('Error in signup: ' + err);
					return done(err);
				}
				if (user) {
					console.log('User already exists with username ' + username);
					return done(null, false, req.flash('message', 'user already exists'));
				} else {
					var newUser = new User();
					newUser.username = username;
					newUser.password = createHash(password);
					newUser.email = req.param('email');
					newUser.firstName = req.param('firstName');
					newUser.lastName = req.param('lastName');
					newUser.userType = 'teacher';

					newUser.save(function(err) {
						if(err){
							console.log("Error in saving user: " + err);
							throw err;
						}
						console.log('User Registration successful');
						return done(null, newUser);
					});
				}
			});
		};
		process.nextTick(findOrCreateUser);
	}));


	passport.use('createStudent', new LocalStrategy({
		passReqToCallback : true
	},
	function(req, username, password, done) {
		findOrCreateUser = function() {
			User.findOne({ 'username' : username }, function(err, user) {
				if (err) {
					console.log('Error in signup: ' + err);
					return done(err);
				}
				if (user) {
					console.log('User already exists with username ' + username);
					return done(null, false, req.flash('message', 'user already exists'));
				} else {
					var newUser = new User();
					newUser.username = username;
					newUser.password = createHash(password);
					newUser.firstName = req.param('firstName');
					newUser.lastName = req.param('lastName');
					newUser.userType = 'student';

					newUser.save(function(err) {
						if(err){
							console.log("Error in saving user: " + err);
							throw err;
						}
						console.log('User Registration successful');
						return;
					});
				}
			});
		};
		process.nextTick(findOrCreateUser);
	}));

	var createHash = function(password) {
		return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
	}
}