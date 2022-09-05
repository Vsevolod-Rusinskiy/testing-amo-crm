const express = require("express");
const cors = require('cors');
const path = require("path");
// const hbs = require('hbs');
const {
    engine
} = require('express-handlebars')
const axios = require('axios');
const chalk = require('chalk');

require('dotenv').config()

const app = express();

const PORT = process.env.SERVER_PORT || 8005;
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



app.get('/', async (req, res) => {


    // TODO Promise.all ???

    await getLeadsWithContactsId();
    await getUsers();
    const contacts = await getContacts();

    // change id for names;
    const leadsWithUsersNames = changeNameIdForNameText(leads, putUsersNamesAndIdInObj(users));
    const leadsWithStatuses = changeDate(leadsWithUsersNames);
    const leadsWithTextStatuses = changeStatusIdForStatusText(leadsWithStatuses, statuses);
    const leadsWithContactsEmailAndPhone = addContactsEmailAndPhone(leadsWithTextStatuses, contacts)
    const answer = leadsWithContactsEmailAndPhone;

    // console.log(chalk.blue.bgGreen.bold(answer[0]))
    // console.log(chalk.blue.bgGreen.bold(addContactsEmailAndPhone(leadsWithTextStatuses, contacts)))

    res.render('home', {
        title: 'Тестовое задание',
        data: answer,
    })

    async function getLeadsWithContactsId() {
        let answer = await axios({
            method: 'get',
            url: 'https://alekseirizchkov.amocrm.ru/api/v4/leads?with=contacts',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': "application/json"
            },
        })

        leads = answer.data._embedded.leads;
        return leads;
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

    async function getContacts() {
        const answer = await axios({
            method: 'get',
            url: 'https://alekseirizchkov.amocrm.ru/api/v4/contacts',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': "application/json"
            },
        });
        const contacts = answer.data._embedded.contacts;
        return contacts;
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
    return leads;
}
function addContactsEmailAndPhone(leads, contacts) {
    for (const leadsElem of leads) {
        for (const LeadsContactsfield of leadsElem._embedded.contacts) {
            for (let contact of contacts) {
                if (LeadsContactsfield.id === contact.id) {
                    for (const fields_values of contact.custom_fields_values) {
                      LeadsContactsfield.name = contact.name;
                        if (fields_values.field_code === 'EMAIL') {
                            console.log(fields_values.values[0].value);
                            LeadsContactsfield.email = fields_values.values[0].value;
                        }
                        if (fields_values.field_code === 'PHONE') {
                            console.log(fields_values.values[0].value);
                            LeadsContactsfield.phone = fields_values.values[0].value;
                        }
                    }
                }
            }
        }
    }
    console.log(leads[0]._embedded)
    return leads;
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

// console.log(chalk.blue.bgGreen.bold(1))


app.listen(PORT, (req, res) => {
    console.log(`Server is working on port ${PORT}`);
});