const { Schema, model } = require('mongoose');

const exerciseInfoSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required.'],
      trim: true,
    },
    code: {
      type: String,
      required: [true, 'A code is required.'],
      unique: [true, 'A unique code is requiered.'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'A category is required.'],
      trim: true,
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
  },
  {
    timestamps: true,
  }
);

const Exercise_Info = model('Exercise_Info', exerciseInfoSchema);

module.exports = Exercise_Info;
