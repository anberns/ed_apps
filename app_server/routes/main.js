var express = require('express');
var router = express.Router();
var ctrlInterface = require('../controllers/interface');

/* GET login page. */
router.get('/', ctrlInterface.main); 
        
module.exports = router;
