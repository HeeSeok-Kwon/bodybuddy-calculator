const mysql = require('mysql');

const db = mysql.createConnection({
    host: 'localhost',
    port: '3306', // 포트번호
    user: 'root', // MYSQL 아이디
    password: 'root', // MYSQL 비밀번호
    database: 'calculator' // 접근할 DB 이름
});

module.exports = db;