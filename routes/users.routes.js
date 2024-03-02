const router = require('express').Router();
const mongoose = require('mongoose');
const User = require('../models/User.model');

// ℹ️ Handles password encryption
const bcrypt = require('bcrypt');

// How many rounds should bcrypt run the salt (default - 10 rounds)
const saltRounds = 10;

const { isSuperAdmin } = require('../middleware/roles_checker.middlewares');
const { isAuthenticated } = require('../middleware/jwt.middleware.js');

router.get('/users/all', isAuthenticated, isSuperAdmin, async (req, res, next) => {
  try {
    const allUsers = await User.find();

    res.status(200).json(allUsers);
  } catch (error) {
    console.error('All Users error:', error);
    next(error);
  }
});

router.get('/users/:id', isAuthenticated, isSuperAdmin, async (req, res, next) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Id is not valid. It must be of type: ObjectId.' });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: `User with id ${id} not found.` });
    }
    return res.status(200).json(user);
  } catch (error) {
    console.error(`An error occurred retrieving the referred user with id = ${id}`, error);
    next(error);
  }
});

router.put('/users/:id', isAuthenticated, isSuperAdmin, async (req, res, next) => {
  const { id } = req.params;
  const { name, last_name, username, email, password, is_super_admin, is_org_admin, is_teacher, is_student, exercises } = req.body;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Id is not valid. It must be of type: ObjectId.' });
    }

    // This regular expression checks password for special characters and minimum length
    const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if (!passwordRegex.test(password)) {
      res.status(400).json({
        message: 'Password must have at least 6 characters and contain at least one number, one lowercase and one uppercase letter.',
      });
      return;
    }

    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { name, last_name, username, email, password: hashedPassword, is_super_admin, is_org_admin, is_teacher, is_student, exercises },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: `User with id ${id} not found. No updates were made.` });
    }

    res.status(200).json({ message: 'User updated successfuly.', updatedUser: updatedUser });
  } catch (error) {
    console.error(`An error occurred retrieving/updating the referred user id = ${id}`, error);
    next(error);
  }
});

router.delete('/users/:id', isAuthenticated, isSuperAdmin, async (req, res, next) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Id is not valid. It must be of type: ObjectId.' });
    }

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: `User with id ${id} not found. Nothing was deleted.` });
    }

    // await Task.deleteMany({ project: id });

    res.status(200).json({ message: 'User deleted successfuly.', deletedUser: deletedUser });
  } catch (error) {
    console.error(`An error occurred deleting the referred user id = ${id}`, error);
    next(error);
  }
});

module.exports = router;
