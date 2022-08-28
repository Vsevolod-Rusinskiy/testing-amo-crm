// import http from 'http';
// const http = require('http');
// import express from "express";
// import cors from 'cors';
// import path  from "path";

const express = require("express") ;
const cors = require('cors') ;
const path  = require("path") ;

const app = express();

// const PORT = process.env.SERVER_PORT || 5000;
app.use(cors({
    origin: '*'
}));

app.use(express.static(path.resolve() + "/public"));
app.use(express.json());

let events = [{
        date: '2022-05-06',
        name: 'event1'
    },
    {
        date: '2022-05-06',
        name: 'event2'
    },
    {
        date: '2022-05-07',
        name: 'event3'
    },
    {
        date: '2022-05-07',
        name: 'event4'
    },
    {
        date: '2022-05-08',
        name: 'event5'
    },
]

/*

/events/all/ - отдает все события
/events/2022-05-06 - массив событий за заданную дату

1 отделаный файл js и через fetch обратиться и получить все события в ul по кнопке 
2 кнопка input, в инпут юзер пишет дату и по кнопке он должен увидеь событие за эту дату

*/

// // app.use(express.static(path.__dirname + '/public'));
// app.use(express.static(path.join(path.__dirname, 'public')));

app.get('/', (req, res) => {
    // res.send('ok')
    res.render('index.html')
});

app.get('/events/all', (req, res) => {

    res.setHeader('Content-Type', 'text/json');

    // res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000/events/all/");
    // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    // res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    res.json(events);
});

app.get('/events/:date', (req, res) => {

    const array = events.filter((event) => {
        if (req.params.date === event.date) {
            return true;
        } else {
            return false;
        }
    });

    let answer = JSON.stringify(array);
    res.setHeader(
        'Content-Type', 'text/json'


    );
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.send(answer);
});

// const server = http.createServer(app)

app.listen(5000, (req, res) => {
    console.log('working...');
});