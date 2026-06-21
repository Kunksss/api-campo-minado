const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/dashboard', userController.getDashboard);
router.get('/:id', userController.getProfile);
router.put('/:id', userController.addBalance);
router.delete('/:id', userController.deleteUser);

module.exports = router;