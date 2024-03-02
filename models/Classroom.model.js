const { Schema, model } = require('mongoose');

const classroomSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required.'],
      trim: true,
    },
    year: {
      type: Number,
      required: [true, 'The year is required.'],
      trim: true,
      min: 2024,
    },
    period: {
      type: Number,
      trim: true,
      min: 0,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    organizationId: {
      type: Schema.Types.ObjectId,
      required: [true, 'A classroom must be associated to an organization. Please enter an organizationId.'],
    },
    members: [{ type: Schema.Types.ObjectId }],
    available_exercises: [{ type: Schema.Types.ObjectId }],
  },
  {
    timestamps: true,
  }
);

const Classroom = model('Classroom', classroomSchema);

module.exports = Classroom;
