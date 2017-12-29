const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const User = mongoose.model('User');

const allStudents = (req, res) => {
    if (req.params && req.params.userid) {
        User
            .findById(req.params.userid)
            .select('students')
            .exec((err, userInfo) => {
                if (!userInfo) {
                    res
                        .status(200)
                        .json({
                            "message" : "userid not found"
                        });
                    return;
                } else if (err) {
                    res
                        .status(400)
                        .json({
                            err : err 
                        });
                    return;
                }
                if (userInfo.students && userInfo.students.length > 0) {
                    response = userInfo.students;
                    res
                        .status(200)
                        .json(response);
                }
                else {
                    res
                        .status(404)
                        .json({"message" : "no students found"
                        });
                }
            });
    } else {
        res
            .status(404)
            .json({"message" : "missing parameters"
            });
    }
};

const getStudent = (req, res) => {
    if (req.params && req.params.userid && req.params.studentid) {
        User
            .findById(req.params.userid)
            .select('students')
            .exec((err, userInfo) => {
                if (!userInfo) {
                    res
                        .status(200)
                        .json({
                            "message" : "userid not found"
                        });
                    return;
                } else if (err) {
                    res
                        .status(400)
                        .json({
                            err : err 
                        });
                    return;
                }
                if (userInfo.students && userInfo.students.length > 0) {
                    const student = userInfo.students.id(req.params.studentid);
                    if (!student) {
                        res
                            .status(404)
                            .json({
                                "message" : "studentid not found"
                            });
                    } else {
                        response = {
                            student : {
                                firstName : student.firstName,
                                lastInit : student.lastInit,
                                sounds : student.sounds,
                                sightWords : student.sightWords,
                                id : req.params.studentid
                            }
                        };
                        res
                            .status(200)
                            .json(response);
                    }
                } else {
                    res
                        .status(404)
                        .json({"message" : "no students found"
                        });
                }
            });
    } else {
        res
            .status(404)
            .json({"message" : "missing parameters"
            });
    }
};

// need to work out how to store sounds and sight words
const studentCreate = (req, res) => { 
    const userid = req.params.userid;
    if (userid) {
        User
            .findById(userid)
            .select('students')
            .exec((err, userInfo) => {
                if (err) {
                    res
                        .status(400)
                        .json(err);
                } else {
                    _doAddStudent(req, res, userInfo);
                }
            });
    } else {
        res
            .status(404)
            .json({
                "message" : "Not found, userid required"
            });
    }
};

const studentUpdate = function (req, res) { 
    if (!req.params.userid || !req.params.studentid) {
        res
            .status(404)
            .json({
                "message" : "user and students ids required"
            });
        return;
    }
    User
        .findById(req.params.userid)
        .select('students')
        .exec((err, userInfo) => {
            if (!userInfo) {
                res
                    .status(200)
                    .json({
                        "message" : "userid not found"
                    });
                return;
            } else if (err) {
                res
                    .status(400)
                    .json({
                        err : err 
                    });
                return;
            }
            if (userInfo.students && userInfo.students.length > 0) {
                let thisStudent = userInfo.students.id(req.params.studentid);
                if (!thisStudent) {
                    res
                        .status(404)
                        .json({
                            "message" : "student id not found"
                        });
                } else {
                    if (req.body.fistName) {
                        thisStudent.firstName = req.body.firstName;
                    }
                    if (req.body.lastInit) {
                        thisStudent.lastInit = req.body.lastInit;
                    }
                    // collect, augment and save first
                    if (req.body.sightWords) {
                        thisStudent.sightWords = req.body.sightWords;
                    }
                    // collect, augment and save first
                    if (req.body.sounds) {
                        thisStudent.sounds = req.body.sounds;
                    }
                    userInfo.save((err, studentInfo) => {
                        if (err) {
                            res
                                .status(404)
                                .json(err);
                        } else {
                            res
                                .status(200)
                                .json(thisStudent);
                        }
                    });
                }
            }
        });
};

const studentDelete = function (req, res) { 
    if (!req.params.userid || !req.params.studentid) {
        res
            .status(404)
            .json({
                "message" : "user and students ids required"
            });
        return;
    }
    User
        .findById(req.params.userid)
        .select('students')
        .exec((err, userInfo) => {
            if (!userInfo) {
                res
                    .status(200)
                    .json({
                        "message" : "userid not found"
                    });
                return;
            } else if (err) {
                res
                    .status(400)
                    .json(err);
                return;
            }
            if (userInfo.students && userInfo.students.length > 0) {
                if (!userInfo.students.id(req.params.studentid)) {
                    res
                        .status(404)
                        .json({
                            "message" : "student id not found"
                        });
                } else {
                    userInfo.students.id(req.params.studentid).remove(); 
                    userInfo.save((err) => {
                        if (err) {
                            res
                                .status(404)
                                .json(err);
                        } else {
                            res
                                .status(204)
                                .json(null);
                        }
                    });
                }
            } else {
                res
                    .status(404)
                    .json({
                        "message" : "No student to delete"
                    });
            }
        });
};

module.exports = {
    allStudents,
    getStudent,
    studentCreate,
    studentUpdate,
    studentDelete
};

const _doAddStudent = (req, res, userInfo) => {
    if (!userInfo) {
        res
            .status(400)
            .json({
                'message' : 'userid not found'
            });
    } else {
        userInfo.students.push({
            firstName : req.body.firstName,
            lastInit : req.body.lastInit,
            sounds : req.body.sounds,
            sightWords : req.body.sightWords,
        });
        userInfo.save((err, userInfo) => {
            if (err) {
                res
                    .status(400)
                    .json(err);
            } else {
                let addedStudent = userInfo.students[userInfo.students.length -1];
                res
                    .status(201)
                    .json(addedStudent);
            }
        });
    }
};
