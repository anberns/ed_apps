/* GET login page */
const login = function(req, res) {
    res.render('login', {
        pageHeader: {
            title: 'Welcome to Unnamed App'
        }
    });
};

/* GET main page */ 
const main = function(req, res) {
    res.render('main', {title: 'Main Menu'});
};
 module.exports = {
     login,
     main
 };
