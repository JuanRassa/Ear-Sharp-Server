const { Schema, model } = require('mongoose');

const exerciseProgressSchema = new Schema(
  {
    organization_id: {
      type: Schema.Types.ObjectId,
      required: [true, 'An Exercise_Info must be associated to an Exercise_Progress. Please enter an Exercise_InfoId.'],
    },
    fullfilled_date: {
      type: Date,
    },
    evaluation_type: {
      type: String,
      enum: ['Evaluation', 'Practice'],
      default: 'Practice',
    },
    student: {
      type: Schema.Types.ObjectId,
      required: [true, 'An Exercise_Info must be associated to a User. Please enter an UserId.'],
    },
    percentage_result: {
      type: Number,
      required: [true, 'It must be indicated the percentage score of the exercise.'],
      min: 0,
      max: 100,
    },
    is_approved: {
      type: Boolean,
      required: [true, 'It must be indicated if the course has been approved or not.'],
    },
  },
  {
    timestamps: true,
  }
);

const Exercise_Progress = model('Exercise_Progress', exerciseProgressSchema);

module.exports = Exercise_Progress;
