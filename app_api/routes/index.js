const express = require('express');
const router = express.Router();
const ctrlUser = require('../controllers/user');
const ctrlStudents = require('../controllers/students');

// user
/*
router
    .route('/user')
    .post(ctrlUser.userCreate);
*/
router
    .route('/user/:userid/login')
    .get(ctrlUser.userLogin);
// update info route needed
// delete user route needed

// students
router
    .route('/user/:userid/students')
    .get(ctrlStudents.allStudents)
    .post(ctrlStudents.studentCreate);

router
    .route('/user/:userid/students/:studentid')
    .put(ctrlStudents.studentUpdate)
    .delete(ctrlStudents.studentDelete);

module.exports = router;
