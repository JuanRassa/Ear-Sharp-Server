const { Schema, model } = require('mongoose');

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required.'],
      trim: true,
    },
    last_name: {
      type: String,
      required: [true, 'Last name is required.'],
      trim: true,
    },
    username: {
      type: String,
      required: [true, 'Username is required.'],
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required.'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required.'],
      trim: true,
    },
    role: {
      type: String,
      enum: ['SuperAdmin', 'OrganizationAdmin', 'Teacher', 'Student', 'Solo'],
      default: 'Solo',
    },
    organization_admin_id: {
      type: Schema.Types.ObjectId,
    },
    exercises_progress: [{ type: Schema.Types.ObjectId }],
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const User = model('User', userSchema);

module.exports = User;
