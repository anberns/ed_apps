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
                console.log(thisStudent);
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
                    thisStudent.sounds = _doUpdateSounds(req, res);
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
                    .status(404)
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
            //sounds : req.body.sounds,
            //sightWords : req.body.sightWords,
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
                    .redirect('/studentAdded');
                    //.json(addedStudent);
            }
        });
    }
};

// questionable solution, might need to preprocess data in controller
// (Getting MEAN p. 242)
// needs refactoring
const _doUpdateSounds= (req, res) => {
    let sounds = {
        shortVowels : {
            all : false,
            a : false,
            e : false,
            i : false,
            o : false,
            u : false 
        },
        digraphs : {
            all : false,
            sh : false,
            ch : false,
            th : false,
            wh : false,
            ck : false 
        },
        longVowels : {
            all : false,
            a : false,
            e : false,
            i : false,
            o : false,
            u : false 
        },
        vowelTeams : {
            all : false,
            ea : false,
            ee : false,
            ai : false,
            ei : false,
            ie : false, 
            oo : false,
            ou : false,
            au : false,
            ui : false,
            ue : false
        },
        diphs : {
            all : false,
            ow : false,
            oy : false,
            ey : false,
            ew : false,
            ay : false, 
            aw : false
        },
        rCon : {
            all : false,
            ar : false,
            er : false,
            ir : false,
            or : false,
            ur : false 
        }
    };

    // short vowels
    if (req.body.allShort) {
        sounds.shortVowels.all = true;
    }
    else {
        if (req.body.shortA) {
            sounds.shortVowels.a = true;
        }
        if (req.body.shortE) {
            sounds.shortVowels.e = true;
        }
        if (req.body.shortI) {
            sounds.shortVowels.i = true;
        }
        if (req.body.shortO) {
            sounds.shortVowels.o = true;
        }
        if (req.body.shortU) {
            sounds.shortVowels.u = true;
        }
    }
    
    // digraphs
    if (req.body.allDigraphs) {
        sounds.digraphs.all = true;
    }
    else {
        if (req.body.ch) {
            sounds.digraphs.ch = true;
        }
        if (req.body.sh) {
            sounds.digraphs.sh = true;
        }
        if (req.body.th) {
            sounds.digraphs.th = true;
        }
        if (req.body.wh) {
            sounds.digraphs.th = true;
        }
        if (req.body.ck) {
            sounds.digraphs.ck = true;
        }
    }

    // long vowels
    if (req.body.allLong) {
        sounds.longVowels.all = true;
    }
    else {
        if (req.body.a) {
            sounds.longVowels.a = true;
        }
        if (req.body.e) {
            sounds.longVowels.e = true;
        }
        if (req.body.i) {
            sounds.longVowels.i = true;
        }
        if (req.body.o) {
            sounds.longVowels.o = true;
        }
        if (req.body.u) {
            sounds.longVowels.u = true;
        }
    }

    // vowel teams
    if (req.body.allTeams) {
        sounds.vowelTeams.all = true;
    }
    else {
        if (req.body.ea) {
            sounds.vowelTeams.ea = true;
        }
        if (req.body.ee) {
            sounds.vowelTeams.ee = true;
        }
        if (req.body.ai) {
            sounds.vowelTeams.ai = true;
        }
        if (req.body.ei) {
            sounds.vowelTeams.ei = true;
        }
        if (req.body.ie) {
            sounds.vowelTeams.ie = true;
        }
        if (req.body.oo) {
            sounds.vowelTeams.oo = true;
        }
        if (req.body.ou) {
            sounds.vowelTeams.ou = true;
        }
        if (req.body.au) {
            sounds.vowelTeams.au = true;
        }
        if (req.body.ui) {
            sounds.vowelTeams.ui = true;
        }
        if (req.body.ue) {
            sounds.vowelTeams.ue = true;
        }
    }

    // Diphthongs 
    if (req.body.allDiphs) {
        sounds.diphs.all = true;
    }
    else {
        if (req.body.ow) {
            sounds.diphs.ow = true;
        }
        if (req.body.oy) {
            sounds.diphs.oy = true;
        }
        if (req.body.ey) {
            sounds.diphs.ey = true;
        }
        if (req.body.ew) {
            sounds.diphs.ew = true;
        }
        if (req.body.ay) {
            sounds.diphs.ay = true;
        }
        if (req.body.aw) {
            sounds.diphs.aw = true;
        }
    }

    // R-controlled 
    if (req.body.allRCons) {
        sounds.rCon.all = true;
    }
    else {
        if (req.body.ar) {
            sounds.rCon.ar = true;
        }
        if (req.body.er) {
            sounds.rCon.er = true;
        }
        if (req.body.ir) {
            sounds.rCon.ir = true;
        }
        if (req.body.or) {
            sounds.rCon.or = true;
        }
        if (req.body.ur) {
            sounds.rCon.ur = true;
        }
    }

    return sounds;
}

