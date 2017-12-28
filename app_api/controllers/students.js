const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const User = mongoose.model('User');

const allStudents = function (req, res) {
    res
        .status(200)
        .json({
            "status" : "success"
        });
};
const studentCreate = function (req, res) { 
    res
        .status(200)
        .json({
            "status" : "success"
        });
};
const studentUpdate = function (req, res) { 
    res
        .status(200)
        .json({
            "status" : "success"
        });
};
const studentDelete = function (req, res) { 
    res
        .status(200)
        .json({
            "status" : "success"
        });
};

module.exports = {
    allStudents,
    studentCreate,
    studentUpdate,
    studentDelete
};
