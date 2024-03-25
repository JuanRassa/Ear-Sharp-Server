const { Schema, model } = require('mongoose');

const exerciseProgressSchema = new Schema(
  {
    user_email: {
      type: 'String',
      required: [true, 'An Exercise_Progress must be associated to a User. Please enter a User Email.'],
    },
    exercise_code: {
      type: 'String',
      required: [true, 'An Exercise_Progress must be associated to a Exercise_Info. Please enter a User Email.'],
    },
    organization_name: {
      type: 'String',
      default: null,
    },
    evaluation_type: {
      type: String,
      enum: ['Evaluation', 'Practice'],
      default: 'Practice',
    },
    questions_quantity: {
      type: Number,
      min: 5,
      max: 20,
      default: 5,
    },
    approvement_percentage: {
      type: Number,
      min: 60,
      max: 90,
      default: 60,
    },
    correct_answers: {
      type: Number,
      required: [true, 'It must be indicated the total number of correct answers in the exercise.'],
      min: 0,
    },
    percentage_result: {
      type: Number,
    },
    is_approved: {
      type: Boolean,
      required: [true, 'It must be indicated if the course has been approved or not.'],
    },
    exercise_info: { type: Schema.Types.ObjectId, ref: 'Exercise_Info' },
  },
  {
    timestamps: true,
  }
);

const Exercise_Progress = model('Exercise_Progress', exerciseProgressSchema);

module.exports = Exercise_Progress;
