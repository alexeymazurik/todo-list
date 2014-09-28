var express             = require('express'),
    mysql               = require('mysql'),
    http                = require('http'),
    path                = require('path'),
    fs                  = require('fs'),
    passport            = require('passport'),
    config              = require('./config/config'),
    md5                 = require('md5'),
    bodyParser          = require('body-parser'),
    cookieParser        = require('cookie-parser'),
    session             = require('express-session'),
    connection          = require('./models/db_connect').localConnect(),
    flash               = require('connect-flash'),
    projectsController  = require('./controllers/projects_controller'),
    tasksController     = require('./controllers/tasks_controller'),
    userController      = require('./controllers/users_controller');

var app = express();
app.listen(3000);
console.log('Server listened at 3000...');

// configuration ===============================================================
// connect to our database

require('./config/passport')(passport); // pass passport for configuration

app.use(express.static(__dirname + '/public'));
app.use(bodyParser());
app.use(cookieParser());

// required for passport
app.use(session({ secret: 'vidyapathaisalwaysrunning' } )); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

app.get('/', function(req, res) {
    res.status(200).sendfile('./public/views/index.html');
});

app.get('/signup-failde', function(req, res) {
    req.logout();
    res.status(500).send('');
});
app.get('/signup-successfully', function(req, res) {
    res.status(200).send(JSON.stringify(req.user));
});

app.get('/signin-failde', function(req, res) {
    req.logout();
    res.status(500).send('');
});
app.get('/signin-successfully', function(req, res) {
    res.status(200).send(JSON.stringify(req.user));
});
app.get('/signout', function(req, res) {
    req.logout();
    res.status(200).send('');
});
app.get('/getuser', function(req,res){
    res.status(200).send(req.user);
});


app.post('/signin', passport.authenticate('local-login', {
    successRedirect : '/signin-successfully', // redirect to the secure profile section
    failureRedirect : '/signin-failed', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
}),
    function(req, res) {
        if (req.body.remember) {
            req.session.cookie.maxAge = 1000 * 60 * 3;
        } else {
            req.session.cookie.expires = false;
        }
        res.redirect('/signin-successfully');
    });

app.post('/signup', passport.authenticate('local-signup', {
    successRedirect : '/signup-successfully', // redirect to the secure profile section
    failureRedirect : '/signup-failed', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
}));

app.post('/results', userController.isLoggedIn, projectsController.results);
app.post('/addProject', userController.isLoggedIn, projectsController.add);
app.post('/editProject', userController.isLoggedIn, projectsController.edit);
app.post('/deleteProject', userController.isLoggedIn, projectsController.remove);

app.post('/addTask', userController.isLoggedIn, tasksController.add);
app.post('/deleteTask', userController.isLoggedIn, tasksController.remove);
app.post('/editTask', userController.isLoggedIn, tasksController.edit);
app.post('/editStatus', userController.isLoggedIn, tasksController.editStatus);