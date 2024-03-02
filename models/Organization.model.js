const { Schema, model } = require('mongoose');

const organizationSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required.'],
    trim: true,
  },
  exercises: [{ type: Schema.Types.ObjectId }],
});

const Organization = model('Organization', organizationSchema);

module.exports = Organization;
