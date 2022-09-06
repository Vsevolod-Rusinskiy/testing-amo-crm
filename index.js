const express = require("express");
const cors = require('cors');
const path = require("path");
const {
    engine
} = require('express-handlebars')
const axios = require('axios');
const chalk = require('chalk');

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



app.get('/', async (req, res) => {

    try {
        await getLeadsWithContactsId();
        await getUsers();
        const contacts = await getContacts();

        const leadsWithUsersNames = changeNameIdForNameText(leads, putUsersNamesAndIdInObj(users));
        const leadsWithStatuses = changeDate(leadsWithUsersNames);
        const leadsWithTextStatuses = changeStatusIdForStatusText(leadsWithStatuses, statuses);
        const leadsWithContactsEmailAndPhone = addContactsEmailAndPhone(leadsWithTextStatuses, contacts)
        const answer = leadsWithContactsEmailAndPhone;

        res.render('home', {
            title: 'Тестовое задание',
            data: answer,
        })
    } catch (error) {
        console.log(error);
    }
});

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

//111
app.get('/query/:query', async function (req, res) {
    const queryString = encodeURI(req.params.query);
    getleadsFromSearch(queryString);
    const leadsFromSearch = await getleadsFromSearch(queryString);
     getIdFromLeadsString(leadsFromSearch);

  

    if (leadsFromSearch === undefined) {
        return res.status(200).send({
            error: 'Error'
        })
    } else {
        return res.status(200).send(leadsFromSearch);

    }

    // res.render('home', {
    //     title: 'Тестовое задание',
    //     data: answer,
    // })
})

// -------------- SEARCH FUNC -----------------


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
        const leadsFromSearch = await response.data._embedded.leads;
        return leadsFromSearch;
    } catch (error) {
        console.log('Something went wrong...')
    }
}

async function getIdFromLeadsString(leads) {
    const idFromLeadsArray = [];
    
    for (const lead of leads) {
        idFromLeadsArray.push(lead.id)
        console.log(lead.id)
        console.log(idFromLeadsArray)
    }
    const idFromLeadsString = idFromLeadsArray.join(',');
    return idFromLeadsString;
}


// } catch (error) {
//     console.log('Error ', error.message, error);
// }

// leadsFromSearch = JSON.stringify(answer.data._embedded);

// console.log(chalk.white.bgRed.bold(typeof leadsFromSearch))
// console.log(chalk.white.bgRed.bold(leadsFromSearch))
// console.log(typeof leadsFromSearch)

// взять айди сделки строкой const str = "2841691,2841687" из inputa
// сделать новую функию await getLeadsWithContactsIdFromSerch(str); -получить только свои сделки с контактами передавая айдишники
// https://alekseirizchkov.amocrm.ru/api/v4/leads?with=2841691,2841687&with=contacts

// перезапускаем все функции




// console.log(getleadsFromSearch())



try {
    app.listen(PORT, (req, res) => {
        console.log(`Server is working on port ${PORT}`);
    });
} catch (err) {
    // next(err);
    console.log(err)
}