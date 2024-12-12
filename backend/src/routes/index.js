const express = require('express');
const router = express.Router();
const UsersController = require('../controllers/UsersController');
const GroupsController = require('../controllers/GroupsController');
const ExpensesController = require('../controllers/ExpensesController');
const SettlementsController = require('../controllers/SettlementsController');
const jwt = require('jsonwebtoken');
const config = require('config');

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace('Bearer ', '');
  if (!token) return res.status(401).send('No token provided');
  try {
    const decoded = jwt.verify(token, config.get('jwtSecret'));
    req.userId = decoded.userId;
    next();
  } catch (err) {
    return res.status(401).send('Invalid token');
  }
}

// Public routes
router.post('/register', UsersController.register);
router.post('/login', UsersController.login);

// Protected routes
router.get('/profile', authMiddleware, UsersController.profile);
router.post('/groups', authMiddleware, GroupsController.createGroup);
router.get('/groups', authMiddleware, GroupsController.getUserGroups);
router.delete('/groups/:groupId', authMiddleware, GroupsController.deleteGroup);
router.post('/groups/:groupId/members', authMiddleware, GroupsController.addMemberAfterCreation);
router.get('/groups/:groupId/members', authMiddleware, GroupsController.getGroupMembers);

router.post('/expenses', authMiddleware, ExpensesController.addExpense);
router.get('/expenses/:groupId', authMiddleware, ExpensesController.getGroupExpenses);

router.get('/settlements/:groupId', authMiddleware, SettlementsController.getSettlements);

module.exports = router;