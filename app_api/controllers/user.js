const mongoose = require('mongoose').set('debug',true);
const User = mongoose.model('User');

const userCreate = function (req, res) {
    res
        .status(200)
        .json({"status" : "success"});
};
const userLogin = function (req, res) {
    if (req.params && req.params.userid) {
        User
            .findById(req.params.userid)
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
                res
                    .status(200)
                    .json(userInfo);
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
    //userCreate,
    userLogin
};
