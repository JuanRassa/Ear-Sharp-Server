const { Schema, model } = require('mongoose');

const classroomSchema = new Schema({});

const Classroom = model('Classroom', classroomSchema);

module.exports = Classroom;
