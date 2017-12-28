var express = require('express');
var router = express.Router();
var ctrlInterface = require('../controllers/interface');

/* GET login page. */
router.get('/', ctrlInterface.login); 

/* GET main page. */
router.get('/main', ctrlInterface.main); 
        
module.exports = router;
