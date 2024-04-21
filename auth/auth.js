const bcrypt = require('bcrypt');
const userModel = require('../models/userModel'); 
const jwt = require("jsonwebtoken"); 

exports.login = function (req, res,next) {
    let username = req.body.username;
    let password = req.body.password;
  
    userModel.lookup(username, function (err, user) {
      if (err) {
        console.log("error looking up user", err);
        return res.status(401).send();
      }
      if (!user) {
        console.log("user ", username, " not found");
        return res.render("user/register");
      }
      //compare provided password with stored password
      bcrypt.compare(password, user.password, function (err, result) {
        if (result) {
          
          let payload = { username: user.user, role: user.role };
         
          let accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET);
          res.cookie("jwt", accessToken);
          console.log("Logged in");
          res.redirect('/');
        } else {
          return res.render("user/login");
        }
      });
    });
  };

  exports.verify = function (req, res, next) {
    const accessToken = req.cookies.jwt;
    if (!accessToken) {
        return next();
        
    }
    try {
        const payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
        res.locals.user = { username: payload.username, role: payload.role };
        res.locals.isUser = payload.role === 'user';
        res.locals.isAdmin = payload.role === 'admin';
        res.locals.isPantry = payload.role === 'pantry';
        next();
    } catch (e) {
        console.error("JWT verification failed:", e);
        return res.status(401).send("Session expired or invalid. Please log in again.");
    }
};

exports.requireRole = function(requiredRoles) {
  if (!Array.isArray(requiredRoles)) {
      requiredRoles = [requiredRoles];
  }

  return function(req, res, next) {
      console.log("Checking roles for:", res.locals.user);
      if (!res.locals.user) {
          return res.status(401).send("Unauthorized: No access rights");
      }
      if (requiredRoles.includes(res.locals.user.role)) {
          next(); 
      } else {
          res.status(403).send("Access Denied: You do not have permission to perform this action.");
      }
  };
};







