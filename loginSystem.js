const srv = require('./serverConfig');

//define db
var database = 'auth-system'
var user = 'postgres'
var password = ''
var dialect = 'postgres'
var host = 'localhost'


// export config
module.exports = {
    database: database,
    user: user,
    password: password,
    dialect: dialect,
    host: host
}

