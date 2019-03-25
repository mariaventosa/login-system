var express = require('express');
var bodyParser = require('body-parser');

const path = require('path');

const Sequelize = require('sequelize');

// const db = require('./queries')

var cookieParser = require('cookie-parser');
var session = require('express-session');

var app = express();


app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());
var sequelize = new Sequelize('postgres://postgres@localhost:5432/auth-system');

const User = sequelize.define('users', {
  username: Sequelize.STRING,
  password: Sequelize.STRING
});

User.prototype.validPassword = function (password) {
    if(password == this.password){ 
        return true;
    }
    else {
        return false; 
    }
}

sequelize.sync()
    .then(() => console.log('users table has been successfully created, if one doesn\'t exist'))
    .catch(error => console.log('This error occured', error));



app.use(session({
    key: 'user_sid',
    secret: 'keyboardcat',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 600000
    }
}));


app.use((req, res, next) => {
    if (req.cookies.user_sid && !req.session.user) {
        res.clearCookie('user_sid');        
    }
    next();
});


var sessionChecker = (req, res, next) => {
    if (req.session.user && req.cookies.user_sid) {
        res.redirect('/home');
    } 
    else {
        next();
    }    
};


app.get('/', sessionChecker, (req, res) => {
    res.redirect('/login');
});


app.get('/login', sessionChecker, (req, res) => {
    res.sendFile(__dirname + '/login.html');
});


app.post('/login', function (req, res) {
  var username = req.body.username,
        password = req.body.password;
    console.log(username)
    console.log(password)
    User.findOne({ where: { username: username } }).then(function (user) {
            if (!user) {
                 res.redirect('/login');
                 console.log('no user');
             }
              else if (!user.validPassword(password)) {
                console.log('wrong password');
                 res.redirect('/login');
             } 
             else { 
              // res.sendFile(path.join(__dirname + '/home.html'));
              console.log('access granted');
              req.session.user = user.dataValues;
                res.redirect('/home');
             }
        });
//     // var name = req.body.username + ' ' + req.body.password;
});

// route for user's dashboard
app.get('/home', (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
        res.sendFile(__dirname + '/home.html');
        console.log("going home");
    } 
    else {
        res.redirect('/login');
        console.log("back to login");
    }
});

app.route('/signup')
    .get(sessionChecker, (req, res) => {
        res.sendFile(__dirname + '/signup.html');
    })
    .post((req, res) => {
        console.log("creating user")
        User.create({
            username: req.body.username,
            password: req.body.password
        })
        .then(user => {
            console.log("going home");
            req.session.user = user.dataValues;
            res.redirect('/home');
        })
        .catch(error => {
            console.log("error");
            res.redirect('/signup');
        });
    });

app.get('/logout', (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
        res.clearCookie('user_sid');
        res.redirect('/');
        console.log("logged out");
    } 
    else {
        res.redirect('/login');
    }
});


const server = app.listen(3000, () => {
  console.log(`Express running on port ${server.address().port}`);
}); 