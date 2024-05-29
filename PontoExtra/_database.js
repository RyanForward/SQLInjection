const pg = require('pg')

const client = new pg.Client({
    user: 'postgres',
    host: 'localhost',
    database: 'RyanApp',
    password: '1496070202',
    port: 5432
})

module.exports = client