const Pool = require('pg').Pool
const pool = new Pool({
  user: 'mariaventosa',
  host: 'localhost',
  database: 'auth-system',
  password: 'password',
  port: 5432,
})

const getUsers = (request, response) => {
  pool.query('SELECT * FROM users ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getUserByUsername = (request, response) => {
  const username = request.params.username

  pool.query('SELECT * FROM users WHERE username = $1', [username], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}


module.exports = {
  getUsers,
  getUserByUsername,
}