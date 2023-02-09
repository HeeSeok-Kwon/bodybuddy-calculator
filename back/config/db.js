const mysql = require('mysql');

const db = mysql.createConnection({
    host: 'localhost',
    port: '', // 포트번호
    user: '', // MYSQL 아이디
    password: '', // MYSQL 비밀번호
    database: '' // 접근할 DB 이름
});

module.exports = db;