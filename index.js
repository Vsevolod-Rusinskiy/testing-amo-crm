
import express from "express";
import cors from 'cors';
import path  from "path";
import fs from 'fs';

// console.log(Client);

// const express = require("express") ;
// const cors = require('cors') ;
// const path  = require("path") ;
// const cl = require('amocrm-js')

const app = express();

const PORT = process.env.SERVER_PORT || 3000;
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

const amoJson = {"_page":1,"_links":{"self":{"href":"https://alekseirizchkov.amocrm.ru/api/v4/leads?page=1&limit=50"}},"_embedded":{"leads":[{"id":2841691,"name":"Запрос тарифов","price":14000,"responsible_user_id":8499319,"group_id":0,"status_id":50272636,"pipeline_id":5721550,"loss_reason_id":null,"created_by":8499319,"updated_by":8499319,"created_at":1661709389,"updated_at":1661760858,"closed_at":null,"closest_task_at":null,"is_deleted":false,"custom_fields_values":null,"score":null,"account_id":30363148,"labor_cost":null,"_links":{"self":{"href":"https://alekseirizchkov.amocrm.ru/api/v4/leads/2841691?page=1&limit=50"}},"_embedded":{"tags":[],"companies":[]}},{"id":2841687,"name":"Рекламная продукция","price":11000,"responsible_user_id":8499319,"group_id":0,"status_id":50272636,"pipeline_id":5721550,"loss_reason_id":null,"created_by":8499319,"updated_by":8499319,"created_at":1661709383,"updated_at":1661761131,"closed_at":null,"closest_task_at":null,"is_deleted":false,"custom_fields_values":null,"score":null,"account_id":30363148,"labor_cost":null,"_links":{"self":{"href":"https://alekseirizchkov.amocrm.ru/api/v4/leads/2841687?page=1&limit=50"}},"_embedded":{"tags":[],"companies":[]}}]}}

// console.log(JSON.stringify(amoJson))
// console.log(JSON.parse(amoJson))

app.get('/', (req, res) => {
    // res.send('ok')
    res.render('index.html')
});

import {Client}  from "amocrm-js";

const crm = new Client({
    domain: 'alekseirizchkov',
    auth: {
        client_id: 'ac7028ff-5671-4bdf-9254-c4cc32d9305f',
        client_secret: 'ORte0zkC3D6THghrUVutvyuo0Rla2FK5TJ2uL4mku8VdiB6UvHX6KwY9zRxSEj4c',
        redirect_uri: 'https://newartspace.ru',
        code: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImQ0ZDUxYmNjZDc0YjY3Y2MyODkyMGY5NDkzZmRlN2U1ZTRhZjc0ZjkwODgxMDM3YTM0NDlhN2RjOWExMjY0ZjY3OWQ5MmQ1OWEwZThlYmJjIn0.eyJhdWQiOiI1YjY5NmFiYy0wYTI3LTQ5ODMtOTg5ZS1jM2FiYzZlZTBlMjQiLCJqdGkiOiJkNGQ1MWJjY2Q3NGI2N2NjMjg5MjBmOTQ5M2ZkZTdlNWU0YWY3NGY5MDg4MTAzN2EzNDQ5YTdkYzlhMTI2NGY2NzlkOTJkNTlhMGU4ZWJiYyIsImlhdCI6MTY2MTcxMDA0MSwibmJmIjoxNjYxNzEwMDQxLCJleHAiOjE2NjE3OTY0NDEsInN1YiI6Ijg0OTkzMTkiLCJhY2NvdW50X2lkIjozMDM2MzE0OCwic2NvcGVzIjpbInB1c2hfbm90aWZpY2F0aW9ucyIsImZpbGVzIiwiY3JtIiwiZmlsZXNfZGVsZXRlIiwibm90aWZpY2F0aW9ucyJdfQ.HSTTM_AIRVVSeeRK-Br7cfxpeJke-OZpVvZXl4Py5yn0l0-nweoq_cq9xvU4tf24rsIPE6QYb-XCWDBCRBzGbTjIh4HnxSfTvoximh6cOpqFg2ud_8qwLi11PIisiIJ3Kyxgj32ei2ndek6aOLQWuG7PMql8kgazvpqqB1_vnzxRpzLblKkO1O2uw2RVfufnlCnNTOOJhslfcczfdy2eu1hMoIO4MaAIOudeyNDMj2hHxPZM_NwPn_nKdpELw4LBIOJCL5fM1s1SG1hHFJPRZTMkZr4T1PYw_lzO3tjXB00cASsuXDqIN92z8F5E-iiPxmfXNWJ9z6XwSat-ZOw31w'
    },
} )

// const a = async () => {
//     const data = await crm.request.get('/api/v4/leads');
// }
// a()

// console.log(a)

// fs.writeFile(path.resolve(path.resolve(), 'error.txt'), a(), (err) => {
//     if (err) {
//         console.log(errorMessage(err.message));
//     } else {
//         console.log(successMessage('файл сохранен'));
//     }
// });

// a()
// console.log(a())




app.get('/events/all', (req, res) => {

    res.setHeader('Content-Type', 'text/json');
    res.setHeader('Content-Type', 'application/json');

    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000/events/all/");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    res.json(events);
});
// crm()
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

app.listen(PORT, (req, res) => {
    console.log(`Server is working on port ${PORT}`);
});