# Ear Sharp Server

## General Description

## API Routes

### Authentication

| Method | Route        | Description        |
| ------ | ------------ | ------------------ |
| POST   | /auth/signup | Creates a new user |
| POST   | /auth/login  | Logs the user      |
| GET    | /auth/verify | Verifies the JWT   |

## Database Models

### User

```js
{
  name: String,
  last_name: String,
  username: String,
  email: String,
  password: String,
  role: { 
    type: String, 
    enum: ['SuperAdmin', 'OrganizationAdmin', 'Teacher', 'Student', 'Solo'],
    default: 'Solo'
  }
  organization_admin_id: {
    type: Schema.Types.ObjectId,
    default: null,
    ref: "Organization"
  },
  exercise_progress: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Exercise_Progress'
    }
  ]
}
```
