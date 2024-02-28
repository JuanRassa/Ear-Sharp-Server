const statusMessages = require('../messages/status.json');

const {
  messagesFor400s: {
    s403: { isNotSuperAdmin, isNotOrgAdmin, isNotTeacher, isNotStudent },
  },
} = statusMessages;

const isSuperAdmin = (req, res, next) => {
  const { is_super_admin } = req.payload;
  console.log('FUCK REQ:', req.payload);
  try {
    if (is_super_admin) {
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
  const { is_org_admin } = req.payload;
  try {
    if (is_org_admin) {
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
  const { is_teacher } = req.payload;
  try {
    if (is_teacher) {
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
  const { is_student } = req.payload;
  try {
    if (is_student) {
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
};
