const express = require('express');
const router = express.Router();
const ctrlUser = require('../controllers/user');
const ctrlStudents = require('../controllers/students');

// user
router
    .route('/user')
    .post(ctrlUser.userCreate)

router
    .route('/user/:userid/login')
    .get(ctrlUser.userLogin);

router
    .route('/user/:userid')
    .put(ctrlUser.updateUser)
    .delete(ctrlUser.deleteUser);

// students
router
    .route('/user/:userid/students')
    .get(ctrlStudents.allStudents)
    .post(ctrlStudents.studentCreate);

router
    .route('/user/:userid/students/:studentid')
    .get(ctrlStudents.getStudent)
    .put(ctrlStudents.studentUpdate)
    .delete(ctrlStudents.studentDelete);

module.exports = router;
