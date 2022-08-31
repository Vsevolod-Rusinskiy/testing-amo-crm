// import express from "express";
// import cors from 'cors';
// import path  from "path";
// import fs from 'fs';
// import axios from 'axios'
// import  leads from './answer'
// console.log(Client);

const express = require("express");
const cors = require('cors');
const path = require("path");
const hbs = require('hbs');
const {
    engine
} = require('express-handlebars')
const axios = require('axios');

require('dotenv').config()

const app = express();

const PORT = process.env.SERVER_PORT || 8080;
const token = process.env.TOKEN

app.use(cors({
    origin: '*'
}));

app.use(express.json());


app.set('view engine', 'hbs');
app.engine("hbs", engine({
    layoutsDir: "views/",
    defaultLayout: "home",
    extname: "hbs"
}));
app.use(express.static(path.resolve() + "/public"));


app.get('/', (req, res) => {
    // res.render('home');

    getAmoLeads()

    async function getAmoLeads() {
        let answer = await axios({
            method: 'get',
            url: 'https://alekseirizchkov.amocrm.ru/api/v4/leads',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': "application/json"
            },
        })

        const response = await answer.data
        const leads = response._embedded.leads
        console.log(response._embedded.leads[0]._embedded)
        res.render('home', {
            title: 'Тестовое задание',
            data: leads
        })
    }


});



// app.get('/', (req, res) => {
//     res.render('layout.hbs', {
//         title: 'Test'
//     })
// });


// app.get('/api/leads', (req, res) => {

//     async function getAmoLeads() {
//         let answer = await axios({
//             method: 'get',
//             url: 'https://alekseirizchkov.amocrm.ru/api/v4/leads',
//             headers: {
//                 'Authorization': `Bearer ${token}`,
//                 'Content-Type': "application/json"
//             },
//         })

//         const responseBody = answer.data
//         // console.log(responseBody)
//         // res.send(responseBody);
//         res.render('home', {
//             title: 'Тестовое задание',
//             data: responseBody
//         })
//     }

//     getAmoLeads()

// });




app.listen(PORT, (req, res) => {
    console.log(`Server is working on port ${PORT}`);
});