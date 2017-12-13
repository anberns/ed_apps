/* GET login page */
module.exports.login = function(req, res) {
    res.render('login', {
        pageHeader: {
            title: 'Welcome to Unnamed App'
        }
    });
};

/* GET main page */ 
module.exports.main = function(req, res) {
    res.render('main', {title: 'Main Menu'});
};
