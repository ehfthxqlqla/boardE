const mysql = require("mysql")
const db = mysql.createPool({
    host:'localhost',
    user:'root',
    password:'1234',
    database:'react_board_app'
})

module.exports = db;