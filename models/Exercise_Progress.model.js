const { Schema, model } = require('mongoose');

const exerciseProgressSchema = new Schema({});

const Exercise_Progress = model('Exercise_Progress', exerciseProgressSchema);

module.exports = Exercise_Progress;
