const request = require('request');
const apiOptions = {
    server : 'http://localhost:3000'
};

/* fill in with heroku app address
if (process.env.NODE_ENV === 'production') {
    apiOptions.server = ...
}
*/

/* GET login page */
const login = function(req, res, alertFlag) {
    loginPage(req, res, false);
};

/* POST new user*/
const newUser = function(req, res) {
    let requestOptions;
    const path = '/api/user';
    let postdata = {
        username : req.body.newuser,
        password : req.body.newpassword
    };
    requestOptions = {
        url : apiOptions.server + path,
        method : "post",
        json : postdata
    };
    request(
            requestOptions,
            function(err, response, body) {
                if (response.statusCode === 201) {
                    loginPage(req, res, true);
                } else {
                    _showError(req, res, body, response.statusCode);
                }
            }
           );
};

/* POST main page */ 
const main = function(req, res) {
    let requestOptions; 
    const path = '/api/user/login';
    let postdata = {
        username : req.body.user,
        password : req.body.password
    };
    requestOptions = {
        url : apiOptions.server + path,
        method : 'post',
        json : postdata,
        qs : {
        }
    };
    request(
            requestOptions,
            function(err, response, body) {
                //console.log(response);
                if (response.statusCode != 200) {
                    _showError(req, res, body, response.statusCode);
                } else {
                    req.session.user = body[0];
                    mainPage(req, res, body);
                }
            }
    );            
};

/* POST student options page */ 
const sOptions = function(req, res) {
    optionsPage(req, res);
};

/* student options page */ 
const choices = function(req, res) {
    const choice = req.body.choice;
    if (choice === 'Rapid Exchange') {
        // app route
    } else if (choice === 'Sight Word Practice') {
        // app route
    } else if (choice === 'Edit Values') {
        editPage(req, res);
    } else if (choice === 'Delete Student') {
        // add delete confirmation popup
         let requestOptions; 
            const path = '/api/user/' + req.session.user._id + '/students/' + req.session.user.students[req.session.curStudent]._id;
            console.log(path);
            requestOptions = {
                url : apiOptions.server + path,
                method : 'delete',
                json : {},
                qs : {
                }
            };
            request(
                    requestOptions,
                    function(err, response, body) {
                        if (response.statusCode != 204) {
                            _showError(req, res, body, response.statusCode);
                        } else {
                            // remove student from session
                            req.session.user.students.splice(req.session.curStudent, 1);
                            mainPage(req, res, body);
                        }
                    }
            );       
    }

};

/* POST student edit page */ 
const edit= function(req, res) {
    editPage(req, res);
};

/* student added route */ 
const studentAdded = function(req, res) {
    sAdded(req, res);
};

module.exports = {
     login,
     newUser,
     main,
     sOptions,
     choices,
     edit,
     studentAdded
 };

// external functions
const _renderLoginPage = function(req, res, alertFlag) {
    res.render('login', {
        title: 'Welcome to Unnamed App',
        alertFlag : alertFlag
    });
};

const loginPage = function(req, res, alertFlag) {
    _renderLoginPage(req, res, alertFlag);
};

const _renderMainPage = function(req, res, body) {
    res.render('main', {
        title: 'Howdy ' + req.session.user.username + '!',
        students : req.session.user.students,
        id : req.session.user._id
    });
};

const mainPage = function(req, res, body) {
    _renderMainPage(req, res, body);
};

const optionsPage = function(req, res) {
    _renderOptionsPage(req, res);
};

const _renderOptionsPage = function(req, res) {
    req.session.curStudent = req.body.index;
    res.render('sOptions', {
        title: 'Student Menu',
        name : req.session.user.students[req.session.curStudent].firstName + ' ' + req.session.user.students[req.session.curStudent].lastInit,
        userId : req.session.user._id,
        sounds : req.session.user.students[req.session.curStudent].sounds,
        sightWords : req.session.user.students[req.session.curStudent].sightWords
    });
};

const editPage = function(req, res) {
    _renderEditPage(req, res);
};

const _renderEditPage = function(req, res) {
    res.render('edit', {
        title : 'Edit the Values for ' + req.session.user.students[req.session.curStudent].firstName + ' ' + req.session.user.students[req.session.curStudent].lastInit,
        userId : req.session.user._id,
        test : 'test',
        studentId : req.session.user.students[req.session.curStudent]._id,
        sounds : req.session.user.students[req.session.curStudent].sounds,
        sightWords : req.session.user.students[req.session.curStudent].sightWords
        });
};

const sAdded = function(req, res) {
    // refresh session data
    let requestOptions; 
    const path = '/api/user/' + req.session.user._id + '/students';
    requestOptions = {
        url : apiOptions.server + path,
        method : 'get',
        json : {},
        qs : {
        }
    };
    request(
            requestOptions,
            function(err, response, body) {
                if (response.statusCode != 200) {
                    _showError(req, res, body, response.statusCode);
                } else {
                    req.session.user.students = body;
                    req.session.curStudent = req.session.user.students.length - 1;
                    editPage(req, res, body);
                }
            }
    );
};

const _showError = function (req, res, body, status) {
    let title;
    let content = body.message;
    if (status === 404) {
        title = "404";
    } else {
        title = status;
    }
    res.status(status);
    res.render('generic-text', {
        title : title,
        content : content
    });
};
