const mongoose = require('mongoose').set('debug',true);
const User = mongoose.model('User');

const userCreate = (req, res) => {
    User
        .create({
            username : req.body.username,
            password : req.body.password
        }, (err, userInfo) => {
            if (err) {
                res
                    .status(400)
                    .json(err);
            } else {
                res
                    .status(201)
                    .json(userInfo);
            }
        });
};

const userLogin = (req, res) => {
    if (req.body.username && req.body.password) {
        User
            .find({ 'username' : req.body.username})
            .exec((err, userInfo) => {
                if (!userInfo.length)  {
                    res
                        .status(404)
                        .json({
                            "message": "user not found"
                        });
                    return;
                } else if (err) {
                    res
                        .status(404)
                        .json(err);
                    return;
                }
                if (req.body.password === userInfo[0].password) {
                    res
                        .status(200)
                        .json(userInfo);
                } 
                else {
                    res
                        .status(404)
                        .json({
                            "message" : "incorrect password"
                        });
                    return;
                }
            });
    } else {
        res
            .status(404)
            .json({
                "message": "missing parameters"
            });
    }
};

const updateUser = (req, res) => {
    if (!req.params.userid) {
        res
            .status(404)
            .json({
                "message": "userid is required"
            });
        return;
    }
    User
        .findById(req.params.userid)
        .select('username password')
        .exec((err, userInfo) => {
            if (!userInfo)  {
                 res
                    .status(404)
                    .json({
                        "message": "userid not found"
                    });
                 return;
            } else if (err) {
                res
                    .status(404)
                    .json(err);
                return;
            }
            if (req.body.username) {
                userInfo.username = req.body.username;
            }
            if (req.body.password) {
                userInfo.password = req.body.password;
            }
            userInfo.save((err, userInfo) => {
                if (err) {
                    res
                        .status(404)
                        .json(err);
                } else {
                    res
                        .status(200)
                        .json(userInfo);
                }
            });
        });
};

const deleteUser = (req, res) => {
    const userid = req.params.userid;
    if (userid) {
        User
            .findById(userid)
            .exec((err, userInfo) => {
                User.remove((err, userInfo) => {
                    if (err)  {
                        res
                            .status(404)
                            .json(err);
                        return;
                    } 
                    res
                        .status(204)
                        .json(null);
                });
            });
    } else {
        res
            .status(404)
            .json({
                "message": "No userid in request"
            });
    }
};

module.exports = {
    userCreate,
    userLogin,
    updateUser,
    deleteUser
};
