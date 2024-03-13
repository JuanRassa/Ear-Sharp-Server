const statusMessages = require('../messages/status.json');

const {
  messagesFor400s: {
    s403: { isNotSuperAdmin, isNotOrgAdmin, isNotTeacher, isNotStudent },
  },
} = statusMessages;

const isSuperAdmin = (req, res, next) => {
  const { role } = req.payload;
  console.log('damn REQ:', req.payload);
  try {
    if (role === "SuperAdmin") {
      next();
    } else {
      return res.status(403).json({ message: isNotSuperAdmin });
    }
  } catch (error) {
    console.error('An error occurred checking super_admin credentials', error);
    next(error);
  }
};
const isOrgAdmin = (req, res, next) => {
  const { role } = req.payload;
  try {
    if (role === "OrganizationAdmin") {
      next();
    } else {
      return res.status(403).json({ message: isNotOrgAdmin });
    }
  } catch (error) {
    console.error('An error occurred checking org_admin credentials', error);
    next(error);
  }
};
const isTeacher = (req, res, next) => {
  const { role } = req.payload;
  try {
    if (role = "Teacher") {
      next();
    } else {
      return res.status(403).json({ message: isNotTeacher });
    }
  } catch (error) {
    console.error('An error occurred checking teacher credentials', error);
    next(error);
  }
};
const isStudent = (req, res, next) => {
  const { role } = req.payload;
  try {
    if (role === "Student") {
      next();
    } else {
      return res.status(403).json({ message: isNotStudent });
    }
  } catch (error) {
    console.error('An error occurred checking student credentials', error);
    next(error);
  }
};

const isSolo = (req, res, next) => {
  const { role } = req.payload;
  try {
    if (role === "Solo") {
      next();
    } else {
      return res.status(403).json({ message: isNotStudent });
    }
  } catch (error) {
    console.error('An error occurred checking student credentials', error);
    next(error);
  }
};

module.exports = {
  isSuperAdmin,
  isOrgAdmin,
  isTeacher,
  isStudent,
  isSolo
};
