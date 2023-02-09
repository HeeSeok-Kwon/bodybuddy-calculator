const express = require('express');
const app = express();
const db = require('./config/db');
const cors = require("cors");
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 3001;

// 기본 세팅
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true,
}));

// 요청횟수 변수
let requsetNum = 0;

// API 설정
app.get(`/api/result`, (req, res) => {
    db.query("SELECT answer FROM cal;", 
    (error, response) => {
        if(error) throw error;
        res.send(response);
    });
});

app.post(`/api/insert`, (req, res) => {
    const answer = req.body.answer;

    if(requsetNum >= 9) {
        requsetNum = 0;
        throw new Error("요청 횟수 에러");
    } else {
        db.query("INSERT INTO cal (answer) VALUES (?);", 
        answer,
        (error, rows, fiels) => {
            res.send('OK');
            requsetNum += 1;
        });
    }
});

app.listen(PORT, () => {
    console.log(`PORT NUM :  ${PORT} - RUNNING SERVER`);
})