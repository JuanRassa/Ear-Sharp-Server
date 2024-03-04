const router = require('express').Router();
const mongoose = require('mongoose');
const Exercise_Info = require('../models/Exercise_Info.model');

const { isAuthenticated } = require('../middleware/jwt.middleware.js');
const { isTeacher } = require('../middleware/roles_checker.middlewares');

const statusMessages = require('../messages/status.json');

const {
  messagesFor200s: {
    s200: { succesfullyUpdated },
    s201: registerCreated,
  },
  messagesFor400s: {
    s400: { invalidDataType },
    s404: { registerNotFound },
    s409: { registerAlreadyExists },
  },
} = statusMessages;

router.post('/exercises-info/create', isAuthenticated, isTeacher, async (req, res, next) => {
  const { name, code, category, questions_quantity, approvement_percentage } = req.body;

  try {
    const exercise_infoExists = await Exercise_Info.findOne({ name });

    if (exercise_infoExists) return res.status(409).json({ message: registerAlreadyExists, detail: "Exercise's code already exists." });

    const newExercise_Info = await Exercise_Info.create({ name, code, category, questions_quantity, approvement_percentage });

    res.status(201).json({
      message: registerCreated,
      Exercise_InfoData: {
        _id: newExercise_Info._id,
        name: newExercise_Info.name,
        code: newExercise_Info.code,
        category: newExercise_Info.category,
        questions_quantity: newExercise_Info.questions_quantity,
        approvement_percentage: newExercise_Info.approvement_percentage,
      },
    });
  } catch (error) {
    console.log('Error while CREATING AN Exercise_Info.', error);
    res.status(400).json(error);
  }
});

router.get('/exercises-info/all', isAuthenticated, isTeacher, async (req, res, next) => {
  try {
    const allExercises_Infos = await Exercise_Info.find();

    res.status(200).json(allExercises_Infos);
  } catch (error) {
    console.error('All classrooms error:', error);
    next(error);
  }
});

// router.get('/exercises-info/:id', isAuthenticated, isTeacher, async (req, res, next) => {
//   const { id } = req.params;

//   try {
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({ message: invalidDataType, expectedType: 'ObjectId' });
//     }

//     const foundExercise_Info = await Exercise_Info.findById(id);
//     if (!foundExercise_Info) {
//       return res.status(404).json({ message: registerNotFound, idNotFound: id });
//     }
//     return res.status(200).json(foundExercise_Info);
//   } catch (error) {
//     console.error(`An error occurred retrieving the referred Exercise_Info with id = ${id}`, error);
//     next(error);
//   }
// });

router.get('/exercises-info/:code', isAuthenticated, isTeacher, async (req, res, next) => {
  const { code } = req.params;

  try {
    const foundExercise_Info_byCode = await Exercise_Info.find({ code });
    if (!foundExercise_Info_byCode || foundExercise_Info_byCode.length === 0) {
      return res.status(404).json({ message: registerNotFound, codeNotFound: code });
    }
    return res.status(200).json(foundExercise_Info_byCode);
  } catch (error) {
    console.error(`An error occurred retrieving the referred Exercise_Info with Code = ${code}`, error);
    next(error);
  }
});

router.put('/exercises-info/:code', isAuthenticated, isTeacher, async (req, res, next) => {
  const { code } = req.params;
  const { name, category, questions_quantity, approvement_percentage } = req.body;
  try {
    const updatedExercise_Info = await Exercise_Info.updateOne(
      { code },
      { name, category, questions_quantity, approvement_percentage },
      { new: true }
    );

    if (!updatedExercise_Info) {
      return res.status(404).json({ message: registerNotFound, codeNotFound: code });
    }

    res.status(202).json({ message: succesfullyUpdated, updatedExercise_Info });
  } catch (error) {
    console.error(`An error occurred retrieving/updating the referred Exercise_Info code = ${code}`, error);
    next(error);
  }
});

module.exports = router;
