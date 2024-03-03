const router = require('express').Router();
const mongoose = require('mongoose');
const Exercise_Progress = require('../models/Exercise_Info.model');

const { isAuthenticated } = require('../middleware/jwt.middleware.js');

const statusMessages = require('../messages/status.json');

const {
  messagesFor200s: { s200: succesfullyDeleted, succesfullyUpdated, s201: registerCreated },
  messagesFor400s: {
    s400: { invalidDataType },
    s404: { registerNotFound },
    s409: { registerAlreadyExists },
  },
} = statusMessages;

module.exports = router;
