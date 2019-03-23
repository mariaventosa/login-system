const express = require('express');
const bodyParser = require('body-parser');

const path = require('path');
const app = express();

const db = require('./queries')

const Sequelize = require('sequelize');
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

app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/login.html'));
});

app.post('/login', function (req, res) {
	var username = req.body.username,
        password = req.body.password;
    console.log(username)
    console.log(password)
    User.findOne({ where: { username: username } }).then(function (user) {
            if (!user) {
                 res.redirect('/login');
             }
             
              else if (!user.validPassword(password)) {
                 res.redirect('/login');
             } 
             else { res.sendFile(path.join(__dirname + '/home.html'));}

        });
    // var name = req.body.username + ' ' + req.body.password;

});

// app.get('/users', db.getUsers)
// app.get('/users/:username', db.getUserByUsername)

const server = app.listen(3000, () => {
  console.log(`Express running on port ${server.address().port}`);
});

