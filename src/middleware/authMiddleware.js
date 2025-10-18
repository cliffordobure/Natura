const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { USER_ROLES } = require('../config/constants');

// Protect routes - verify JWT token
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        res.status(401);
        throw new Error('User not found');
      }

      if (!req.user.isActive) {
        res.status(401);
        throw new Error('User account is inactive');
      }

      next();
    } catch (error) {
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
};

// Authorize based on roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      res.status(403);
      throw new Error(`User role '${req.user.role}' is not authorized to access this route`);
    }
    next();
  };
};

// Check if user is admin or director
const isAdminOrDirector = (req, res, next) => {
  if (req.user.role !== USER_ROLES.ADMIN && req.user.role !== USER_ROLES.DIRECTOR) {
    res.status(403);
    throw new Error('Access denied. Admin or Director role required.');
  }
  next();
};

// Check if user is teacher or above
const isTeacherOrAbove = (req, res, next) => {
  const allowedRoles = [USER_ROLES.TEACHER, USER_ROLES.DIRECTOR, USER_ROLES.ADMIN];
  if (!allowedRoles.includes(req.user.role)) {
    res.status(403);
    throw new Error('Access denied. Teacher role or above required.');
  }
  next();
};

// Check if user has access to child data
const hasChildAccess = async (req, res, next) => {
  try {
    const childId = req.params.childId || req.body.childId || req.query.childId;
    
    if (!childId) {
      return next();
    }

    // Admin and directors have access to all
    if (req.user.role === USER_ROLES.ADMIN || req.user.role === USER_ROLES.DIRECTOR) {
      return next();
    }

    // Parents can only access their own children
    if (req.user.role === USER_ROLES.PARENT) {
      if (!req.user.childrenIds.map(id => id.toString()).includes(childId)) {
        res.status(403);
        throw new Error('Access denied. You do not have access to this child.');
      }
    }

    // Teachers can access children in their classrooms
    if (req.user.role === USER_ROLES.TEACHER) {
      const Child = require('../models/Child');
      const child = await Child.findById(childId);
      
      if (!child) {
        res.status(404);
        throw new Error('Child not found');
      }

      if (!req.user.classroomIds.map(id => id.toString()).includes(child.classroomId.toString())) {
        res.status(403);
        throw new Error('Access denied. You do not have access to this child.');
      }
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  protect,
  authorize,
  isAdminOrDirector,
  isTeacherOrAbove,
  hasChildAccess,
};

