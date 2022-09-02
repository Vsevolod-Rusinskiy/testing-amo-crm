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


app.get('/', async (req, res) => {


    // TODO Promise.all ???

    await getLeads();
    await getUsers();

    const response = changeIdForName(leads, putUsersNamesAndIdInObj(users))


    res.render('home', {
        title: 'Тестовое задание',
        data: response
    })

    async function getLeads() {
        let answer = await axios({
            method: 'get',
            url: 'https://alekseirizchkov.amocrm.ru/api/v4/leads',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': "application/json"
            },
        })

        leads = answer.data._embedded.leads;
        console.log(leads)
        return leads
    }

    async function getUsers() {
        const answer = await axios({
            method: 'get',
            url: 'https://alekseirizchkov.amocrm.ru/api/v4/users',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': "application/json"
            },
        });
        users = answer.data._embedded.users;
        // console.log('>>>',users)
        return users;
    }


    function putUsersNamesAndIdInObj(users) {
        const usersNamesAndIdInObj = {};

        for (const elem of users) {
            const key = elem.id;
            const value = elem.name;
            usersNamesAndIdInObj[key] = value
        }
        return usersNamesAndIdInObj;
    }

   
    // console.log('++++', await getLeads())
    // console.log('>>>', putUsersNamesAndIdInObj(await getUsers()))

    function changeIdForName(leads, names) {
        for (const elem of leads) {
            for (const item in names) {
                if (elem.responsible_user_id === +item) {
                  elem.responsible_user_id = names[item]
                }
            }
        }
        return leads
    }
  
    // console.log(changeIdForName(leads, putUsersNamesAndIdInObj(users)))

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