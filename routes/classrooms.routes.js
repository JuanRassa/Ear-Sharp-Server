const router = require('express').Router();
const mongoose = require('mongoose');
const Classroom = require('../models/Classroom.model');

const { isAuthenticated } = require('../middleware/jwt.middleware.js');
const { isTeacher } = require('../middleware/roles_checker.middlewares');

const statusMessages = require('../messages/status.json');

const {
  messagesFor200s: { s200: succesfullyDeleted, succesfullyUpdated, s201: registerCreated },
  messagesFor400s: {
    s400: { invalidDataType },
    s404: { registerNotFound },
    s409: { registerAlreadyExists },
  },
} = statusMessages;

router.post('/classrooms/create', isAuthenticated, isTeacher, async (req, res, next) => {
  const { name, year, period, isActive, organizationId, members, available_exercises } = req.body;

  try {
    const classroomExists = await Classroom.findOne({ name });

    if (classroomExists) return res.status(409).json({ message: registerAlreadyExists });

    const newClassroom = await Classroom.create({ name, year, period, isActive, organizationId, members, available_exercises });

    res.status(201).json({
      message: registerCreated,
      ClassroomData: {
        _id: newClassroom._id,
        name: newClassroom.name,
        year: newClassroom.year,
        period: newClassroom.period,
        isActive: newClassroom.isActive,
        organizationId: newClassroom.organizationId,
        members: newClassroom.members,
        available_exercises: newClassroom.available_exercises,
      },
    });
  } catch (error) {
    console.log('Error while CREATING AN Classroom', error);
    next(error);
  }
});

router.get('/classrooms/all', isAuthenticated, isTeacher, async (req, res, next) => {
  try {
    const allclassrooms = await Classroom.find();

    res.status(200).json(allclassrooms);
  } catch (error) {
    console.error('All classrooms error:', error);
    next(error);
  }
});

router.get('/classrooms/:id', isAuthenticated, isTeacher, async (req, res, next) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: invalidDataType, expectedType: 'ObjectId' });
    }

    const foundClassroom = await Classroom.findById(id);
    if (!foundClassroom) {
      return res.status(404).json({ message: registerNotFound, idNotFound: id });
    }
    return res.status(200).json(foundClassroom);
  } catch (error) {
    console.error(`An error occurred retrieving the referred Classroom with id = ${id}`, error);
    next(error);
  }
});

router.put('/classrooms/:id', isAuthenticated, isTeacher, async (req, res, next) => {
  const { id } = req.params;
  const { name, year, period, isActive, organizationId, members, available_exercises } = req.body;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: invalidDataType, expectedType: 'ObjectId' });
    }

    const updateClassroom = await Classroom.findByIdAndUpdate(
      id,
      { name, year, period, isActive, organizationId, members, available_exercises },
      { new: true }
    );

    if (!updateClassroom) {
      return res.status(404).json({ message: registerNotFound, idNotFound: id });
    }

    res.status(200).json({ message: succesfullyUpdated, updateClassroom: updateClassroom });
  } catch (error) {
    console.error(`An error occurred retrieving/updating the referred classroom id = ${id}`, error);
    next(error);
  }
});

router.delete('/classrooms/:id', isAuthenticated, isTeacher, async (req, res, next) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: invalidDataType, expectedType: 'ObjectId' });
    }

    const deletedClassroom = await Classroom.findByIdAndDelete(id);

    if (!deletedClassroom) {
      return res.status(404).json({ message: registerNotFound, idNotFound: id });
    }

    res.status(200).json({ message: succesfullyDeleted, deletedClassroom: deletedClassroom });
  } catch (error) {
    console.error(`An error occurred deleting the referred classroom id = ${id}`, error);
    next(error);
  }
});

module.exports = router;
