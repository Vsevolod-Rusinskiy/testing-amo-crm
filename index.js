const express = require("express");
const cors = require('cors');
const path = require("path");
const {
    engine
} = require('express-handlebars')
const axios = require('axios');
const chalk = require('chalk');
const {
    type
} = require("express/lib/response");

require('dotenv').config();

const app = express();

const PORT = process.env.SERVER_PORT || 8095;
const token = process.env.TOKEN;


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

let superAnswer = false;
let inputValue = '';

// -------------- ROUTS ------------------------------------------------------------------------------------------------------


app.get(['/', '/:query'], async (req, res) => {

    try {
        const leads = await getLeadsWithContactsId();
        const users = await getUsers();
        const contacts = await getContacts();

        const leadsWithUsersNames = changeNameIdForNameText(leads, putUsersNamesAndIdInObj(users));
        const leadsWithStatuses = changeDate(leadsWithUsersNames);
        const leadsWithTextStatuses = changeStatusIdForStatusText(leadsWithStatuses, statuses);
        const leadsWithContactsEmailAndPhone = addContactsEmailAndPhone(leadsWithTextStatuses, contacts)
        const answer = leadsWithContactsEmailAndPhone;


        console.log(chalk.white.bgBlue.bold(req.params.query));

        if (req.params.query === 'all-leads-search') {
            res.status(200).send({
                'data': {
                    data: "data",
                    answerAllLeadsSearch: answer
                }

            });

        } else {
            res.render('home', {
                title: 'Тестовое задание',
                answer: answer,
            })
        }



        // } else {
        //     console.log('>>>//', !!superAnswer);

        //     res.render('home', {
        //         title: 'Тестовое задание',
        //         data: superAnswer,
        //         inputValue : inputValue
        //     })
        // }
        // if (superAnswer === true) {
        //     console.log('>>>//', !!superAnswer);

        //     res.render('home', {
        //         title: 'Тестовое задание',
        //         data: superAnswer,
        //     })
        // }



    } catch (error) {
        console.log(error);
    }
});

//111
app.get('/query/:query', async function (req, res) {

    const queryString = encodeURI(req.params.query);
    // console.log(chalk.blue.bgGreen.bold(typeof queryString))
    // console.log(chalk.blue.bgGreen.bold( queryString))
    const leadsFromSearch = await getleadsFromSearch(queryString);

    if (leadsFromSearch === null) {
        return res.status(200).send({
            'data': 'nodata'
        });
    }

    const idFromLeadsString = getIdFromLeadsString(leadsFromSearch);

    const leads = await getleadsFromSearchById(idFromLeadsString);
    const users = await getUsers();
    const contacts = await getContacts();

    console.log(chalk.white.bgBlue.bold(leads))


    const leadsWithUsersNames = changeNameIdForNameText(leads, putUsersNamesAndIdInObj(users));
    const leadsWithStatuses = changeDate(leadsWithUsersNames);
    const leadsWithTextStatuses = changeStatusIdForStatusText(leadsWithStatuses, statuses);
    const leadsWithContactsEmailAndPhone = addContactsEmailAndPhone(leadsWithTextStatuses, contacts);
    const answer = leadsWithContactsEmailAndPhone;

    // superAnswer = answer;
    // inputValue = req.params.query;

    res.status(200).send({
        'data': {
            data: "data",
            answer: answer
        }

    });
})

// -------------- FUNC ------------------------------------------------------------------------------------------------------

async function getLeadsWithContactsId() {
    let answer = await axios({
        method: 'get',
        url: 'https://alekseirizchkov.amocrm.ru/api/v4/leads?with=contacts',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': "application/json"
        },
    })

    const leads = await answer.data._embedded.leads;
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
    const users = await answer.data._embedded.users;
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
    const contacts = await answer.data._embedded.contacts;
    return contacts;
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
                            LeadsContactsfield.email = fields_values.values[0].value;
                        }
                        if (fields_values.field_code === 'PHONE') {
                            LeadsContactsfield.phone = fields_values.values[0].value;
                        }
                    }
                }
            }
        }
    }
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


// -------------- SEARCH FUNC -------------------------------------------------------------------------------------


async function getleadsFromSearch(queryString) {
    try {
        const response = await axios({
            method: 'get',
            url: `https://alekseirizchkov.amocrm.ru/api/v4/leads?query=${queryString}`,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': "application/json"
            },
        });
        const answer = await response.data
        if (answer === '') {
            return null;
        }
        const leadsFromSearch = await response.data._embedded.leads;
        return leadsFromSearch;
    } catch (error) {
        console.log('Something went wrong...', error)
    }
}

function getIdFromLeadsString(leads) {
    if (leads === null) {
        return null;
    }

    const idFromLeadsArray = [];

    for (const lead of leads) {
        console.log(lead.id)
        idFromLeadsArray.push('&id[]=' + lead.id)

    }
    const idFromLeadsString = idFromLeadsArray.join('');
    return idFromLeadsString;
}

async function getleadsFromSearchById(string) {
    console.log(string)
    console.log(typeof string)
    try {
        const response = await axios({
            method: 'get',
            url: `https://alekseirizchkov.amocrm.ru/api/v4/leads?with=contacts${string}`,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': "application/json"
            },
        });


        console.log(chalk.blue.bgGreen.bold(response.data._embedded.leads));
        const leadsFromSearchById = await response.data._embedded.leads;
        return leadsFromSearchById;

    } catch (error) {
        console.log('Something went wrong getting leadsFromSearchById ...', error);
    }
}

try {
    app.listen(PORT, (req, res) => {
        console.log(`Server is working on port ${PORT}`);
    });
} catch (err) {
    console.log(err)
}