var express = require('express');
var router = express.Router();
var ctrlInterface = require('../controllers/interface');

/* login page. */
router
    .route('/')
    .get(ctrlInterface.login) 
    .post(ctrlInterface.newUser);

/* main page. */
router
    .route('/main')
    .post(ctrlInterface.main); 

/* student options page */
router
    .route('/sOptions')
    .post(ctrlInterface.sOptions);

/* edit student route */
router
    .route('/edit')
    .post(ctrlInterface.edit);

/* app choice route */
router
    .route('/choices')
    .post(ctrlInterface.choices);

/* app choice route */
router
    .route('/studentAdded')
    .get(ctrlInterface.studentAdded);
       
module.exports = router;
