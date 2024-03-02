const router = require('express').Router();
const mongoose = require('mongoose');
const Organization = require('../models/Organization.model');

const { isAuthenticated } = require('../middleware/jwt.middleware.js');
const { isOrgAdmin } = require('../middleware/roles_checker.middlewares');
const statusMessages = require('../messages/status.json');

const {
  messagesFor200s: { s201: registerCreated, s200: succesfullyDeleted },
  messagesFor400s: {
    s400: { invalidDataType },
    s404: { registerNotFound },
    s409: { registerAlreadyExists },
  },
} = statusMessages;

router.post('/organizations/create', isAuthenticated, isOrgAdmin, async (req, res, next) => {
  const { name } = req.body;

  try {
    const organizationExists = await Organization.findOne({ name });

    if (organizationExists) return res.status(409).json({ message: registerAlreadyExists });

    const newOrganization = await Organization.create({ name });

    res.status(201).json({ message: registerCreated, organizationData: { name: newOrganization.name, _id: newOrganization._id } });
  } catch (error) {
    console.log('Error while CREATING AN ORGANIZATION', error);
    next(error);
  }
});

router.get('/organizations/all', isAuthenticated, isOrgAdmin, async (req, res, next) => {
  try {
    const allOrganizations = await Organization.find();

    res.status(200).json(allOrganizations);
  } catch (error) {
    console.error('All Organizations error:', error);
    next(error);
  }
});

router.get('/organizations/:id', isAuthenticated, isOrgAdmin, async (req, res, next) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: invalidDataType, expectedType: 'ObjectId' });
    }

    const foundOrganization = await Organization.findById(id);
    if (!foundOrganization) {
      return res.status(404).json({ message: registerNotFound });
    }
    return res.status(200).json(foundOrganization);
  } catch (error) {
    console.error(`An error occurred retrieving the referred organization with id = ${id}`, error);
    next(error);
  }
});

router.delete('/organizations/:id', isAuthenticated, isOrgAdmin, async (req, res, next) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: invalidDataType, expectedType: 'ObjectId' });
    }

    const deletedOrganization = await Organization.findByIdAndDelete(id);

    if (!deletedOrganization) {
      return res.status(404).json({ message: registerNotFound, idNotFound: id });
    }

    res.status(200).json({ message: succesfullyDeleted, deletedOrganization: deletedOrganization });
  } catch (error) {
    console.error(`An error occurred deleting the referred user id = ${id}`, error);
    next(error);
  }
});

module.exports = router;
