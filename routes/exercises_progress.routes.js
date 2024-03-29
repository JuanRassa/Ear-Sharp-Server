const router = require('express').Router();
const mongoose = require('mongoose');
const Exercise_Progress = require('../models/Exercise_Progress.model');
const Exercise_Info = require('../models/Exercise_Info.model');

const { isAuthenticated } = require('../middleware/jwt.middleware.js');
const { isTeacher } = require('../middleware/roles_checker.middlewares');
const statusMessages = require('../messages/status.json');

const {
  messagesFor200s: {
    s200: { succesfullyUpdated },
    s201: { registerCreated },
  },
  messagesFor400s: {
    s400: { invalidDataType },
    s404: { registerNotFound },
    s409: { registerAlreadyExists },
  },
} = statusMessages;

router.post('/exercises-progress/create', isAuthenticated, async (req, res, next) => {
  const { user_email, exercise_name, exercise_code, organization_name, evaluation_type, correct_answers } = req.body;

  try {
    const foundedExerciseInfo = await Exercise_Info.findOne({ code: exercise_code });

    if (!foundedExerciseInfo || foundedExerciseInfo.length === 0) {
      return res.status(404).json({ message: registerNotFound, codeNotFound: exercise_code, detail: 'No exercise with the referred code exists.' });
    }

    const { questions_quantity, approvement_percentage } = foundedExerciseInfo;

    const percentage_result = (correct_answers * 100) / questions_quantity;
    const is_approved = percentage_result >= approvement_percentage;

    // res.status(210).json({ questions_quantity, approvement_percentage, correct_answers, percentage_result, is_approved });

    const newExercise_Progress = await Exercise_Progress.create({
      user_email,
      exercise_name,
      exercise_code,
      organization_name,
      evaluation_type,
      questions_quantity,
      approvement_percentage,
      correct_answers,
      percentage_result,
      is_approved,
    });

    res.status(201).json({
      message: registerCreated,
      Exercise_ProgressData: {
        _id: newExercise_Progress._id,
        user_email: newExercise_Progress.user_email,
        exercise_name: newExercise_Progress.exercise_name,
        exercise_code: newExercise_Progress.exercise_code,
        organization_name: newExercise_Progress.organization_name,
        evaluation_type: newExercise_Progress.evaluation_type,
        correct_answers: newExercise_Progress.correct_answers,
        percentage_result: newExercise_Progress.percentage_result,
        is_approved: newExercise_Progress.is_approved,
      },
    });
  } catch (error) {
    console.log('Error while CREATING AN Exercise_Progress.', error);
    res.status(400).json(error);
  }
});

router.get('/exercises-progress/all', isAuthenticated, isTeacher, async (req, res, next) => {
  try {
    const allExercises_Infos = await Exercise_Progress.find();

    res.status(200).json(allExercises_Infos);
  } catch (error) {
    console.error('All classrooms error:', error);
    next(error);
  }
});

router.get('/exercises-progress/:userEmail', isAuthenticated, async (req, res, next) => {
  const { userEmail } = req.params;
  console.log('userEmail TYPE', typeof userEmail);
  console.log('userEmail', userEmail);

  try {
    const foundedExerciseInfo = await Exercise_Progress.find({ user_email: userEmail });
    if (!foundedExerciseInfo || foundedExerciseInfo.length === 0) {
      return res.status(404).json({ message: registerNotFound, userEmailNotFound: userEmail });
    }
    return res.status(200).json(foundedExerciseInfo);
  } catch (error) {
    console.error(`An error occurred retrieving the referred Email does not exists = ${userEmail}`, error);
    next(error);
  }
});

router.get('/progress-own-user', isAuthenticated, async (req, res, next) => {
  const { email } = req.payload;

  try {
    const foundedExerciseInfo = await Exercise_Progress.find({ user_email: email });
    if (!foundedExerciseInfo || foundedExerciseInfo.length === 0) {
      return res.status(404).json({ message: registerNotFound, userEmailNotFound: email });
    }
    return res.status(200).json(foundedExerciseInfo);
  } catch (error) {
    console.error(`An error occurred retrieving the referred Email does not exists = ${email}`, error);
    next(error);
  }
});

router.delete('/exercises-progress/:id', isAuthenticated, async (req, res, next) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Id is not valid. It must be of type: ObjectId.' });
    }

    const deletedProgress = await Exercise_Progress.findByIdAndDelete(id);

    if (!deletedProgress) {
      return res.status(404).json({ message: `Exercise_Progress with id ${id} not found. Nothing was deleted.` });
    }

    // await Task.deleteMany({ project: id });

    res.status(200).json({ message: 'Exercise_Progress deleted successfuly.', deletedProgress: deletedProgress });
  } catch (error) {
    console.error(`An error occurred deleting the referred user id = ${id}`, error);
    next(error);
  }
});

module.exports = router;
