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
const axios = require('axios');
require('dotenv').config()

const app = express();

const PORT = process.env.SERVER_PORT || 3000;
const token = process.env.TOKEN

app.use(cors({
    origin: '*'
}));

app.use(express.static(path.resolve() + "/public"));
app.use(express.json());



app.get('/', (req, res) => {
    res.render('index.html')
});





app.get('/api/leads', (req, res) => {

    async function getAmoLeads() {
        let answer = await axios({
            method: 'get',
            url: 'https://alekseirizchkov.amocrm.ru/api/v4/leads',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': "application/json"
            },
        })

        const responseBody = answer.data
        console.log(responseBody)
        res.send(responseBody);

    }

    getAmoLeads()


});




app.listen(PORT, (req, res) => {
    console.log(`Server is working on port ${PORT}`);
});