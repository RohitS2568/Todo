const User = require("../models/User")
const Todo = require("../models/Todo")
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
require("dotenv").config();
const CryptoJS = require("crypto-js");


const verifyToken = (req, res, next) => {
  const authHeader = req.headers.token;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.TOKEN_KEY, (err, user) => {
      if (err) res.status(403).json("Token is not valid!");
      req.user = user;
      next();
    });
  } else {
    return res.status(401).json("You are not authenticated!");
  }
};

const verifyTokenAndAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.user_id === req.params.user_id || req.user.isAdmin) {
      next();
    } else {
      res.status(403).json("You are not alowed to do that!");
    }
  });
};



module.exports = {
  verifyToken,
  verifyTokenAndAuthorization,
  
};
