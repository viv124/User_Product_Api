const jwt = require('jsonwebtoken');
const {User,Bill} = require('../models/userModel');

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized - No token provided' });
    }
    
    const tokenWithoutBearer = token.replace('Bearer','');
    const decoded = await jwt.verify(tokenWithoutBearer,"vivek");
    console.log(decoded.email);
    const user = await User.findOne({ email: decoded.email });

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized - User not found' });
    }
    req.locals = {};
    req.locals.value=decoded.email;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Unauthorized - Invalid token' });
    } else if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Unauthorized - Token expired' });
    } else {
      console.error('Error in authentication middleware:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }
};

module.exports = auth;
