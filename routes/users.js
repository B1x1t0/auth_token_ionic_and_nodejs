var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var morgan      = require('morgan');
var passport    = require('passport');
var config      = require('../config/database'); // db config file
var User        = require('../models/user'); // mongoose user model
var jwt         = require('jwt-simple');

// pass passport
require('../config/passport')(passport);

/* GET users */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.post('/signup', function(req, res) {
  console.log("signup ",req.body );
  if (!req.body.email && !req.body.password) {
    res.json({success: false, msg: 'Please set pass name and password.'});
  } else {
    var newUser = new User({
      password: req.body.password,
      email: req.body.email
    });
    // save user
    newUser.save(function(err) {
      if (err) {
        return res.json({success: false, msg: 'Username already exists.', error: err});
      }else{
              res.json({success: true, msg: 'Successful created new user.'});
      }
    });
  }
});

router.post('/authenticate', function(req, res) {
  User.findOne({
    email: req.body.email
  }, function(err, user) {
    if (err) throw err;
 
    if (!user) {
      res.send({success: false, msg: 'El usuario no existe.'});
    } else {
      // check if password matches
      user.comparePassword(req.body.password, function (err, isMatch) {
        if (isMatch && !err) {
          // if user is found and password is right create a token
          var token = jwt.encode(user, config.secret);
          // return the information including token as JSON
          res.json({success: true, token: 'JWT ' + token});
        } else {
          res.send({success: false, msg: 'La contrasena es incorrecta.'});
        }
      });
    }
  });
});



router.get('/member/info', passport.authenticate('jwt', { session: false}), function(req, res) {

  var token = getToken(req.headers);
  console.log("token ", token);
  if (token) {
    var decoded = jwt.decode(token, config.secret);
    console.log("DECODED ", decoded);
    User.findOne({
      email: decoded.email
    }, function(err, user) {
        if (err) throw err;
 
        if (!user) {
          return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});
        } else {
          res.json({success: true, msg: 'Welcome in the member area ' + user.email + '!',
                    user: user});
        }
    });
  } else {
    return res.status(403).send({success: false, msg: 'No token provided.'});
  }
});



 
getToken = function (headers) {
  if (headers && headers.authorization) {
    var parted = headers.authorization.split(' ');
    if (parted.length === 2) {
      return parted[1];
    } else {
      return null;
    }
  } else {
    return null;
  }
};

module.exports = router;
