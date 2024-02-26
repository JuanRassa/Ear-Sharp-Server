const router = require('express').Router();
const mongoose = require('mongoose');
const User = require('../models/User.model');

router.get('/users', async (req, res, next) => {
  try {
    const allUsers = await User.find();

    res.status(200).json(allUsers);
  } catch (error) {
    console.error('All Users error:', error);
    next(error);
  }
});

router.delete('/users/:id', async (req, res, next) => {
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
