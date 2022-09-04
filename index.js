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
    extname: "hbs",
    helpers: {
        separatePriceWithSpace: function separatePriceWithSpace(price) {
            num = '' + price;
            return num.replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, "$1 ");
        }
    }
}));
app.use(express.static(path.resolve() + "/public"));


// function separatePriceWithSpace(price) {
//     num = '' + price;
//     return num.replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, "$1 ");
// }


// console.log(price(12345566))


app.get('/', async (req, res) => {


    // TODO Promise.all ???

    await getLeads();
    await getUsers();

    // change id for names;
    const leadsWithUsersNames = changeNameIdForNameText(leads, putUsersNamesAndIdInObj(users));
    const leadsWithStatuses = changeDate(leadsWithUsersNames);
    const answer = changeStatusIdForStatusText(leadsWithStatuses, statuses)

    console.log(answer);
    res.render('home', {
        title: 'Тестовое задание',
        data: answer,
        // statusColor: true
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
        // console.log(leads)
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
});


function putUsersNamesAndIdInObj(users) {
    const usersNamesAndIdInObj = {};

    for (const elem of users) {
        const key = elem.id;
        const value = elem.name;
        usersNamesAndIdInObj[key] = value
    }
    return usersNamesAndIdInObj;
}

function changeNameIdForNameText(leads, names) {
    for (const elem of leads) {
        for (const item in names) {
            if (elem.responsible_user_id === +item) {
                elem.responsible_user_id = names[item];
            }
        }
    }
    return leads
}

const statuses = {
    50272636: 'Первичный контакт',
    50272639: 'Переговоры',
    50272642: 'Принимают решения',
    50272645: 'Согласование договора'
}

function convertDate(unix_timestamp) {
    const date = new Date(unix_timestamp * 1000);
    return date.toLocaleString("ru-RU", {
        day: "numeric",
        month: "long",
        year: "numeric"
    }).slice(0, -3)
}

function changeDate(leads) {
    for (const elem of leads) {
        if (elem.created_at) {
            elem.created_at = convertDate(elem.created_at)
        }
    }
    return leads;
}


function changeStatusIdForStatusText(leads, statuses) {
    for (const elem of leads) {
        for (const item in statuses) {

            if (elem.status_id === +item) {
                elem.status_id = statuses[item];

                if (elem.status_id === "Первичный контакт") {
                    elem.firstContact = true;
                }
                if (elem.status_id === "Переговоры") {
                    elem.negotiation = true;
                }
                if (elem.status_id === "Принимают решения") {
                    elem.decisions = true;
                }
                if (elem.status_id === "Согласование договора") {
                    elem.agreement = true;
                }
            }
        }

    }
    return leads
}



app.listen(PORT, (req, res) => {
    console.log(`Server is working on port ${PORT}`);
});