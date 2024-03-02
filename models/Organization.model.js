const { Schema, model } = require('mongoose');

const organizationSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required.'],
      trim: true,
    },
    classroms: [{ type: Schema.Types.ObjectId }],
  },
  {
    timestamps: true,
  }
);

const Organization = model('Organization', organizationSchema);

module.exports = Organization;
