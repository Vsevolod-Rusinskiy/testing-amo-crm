const express = require("express");
const cors = require('cors');
const path = require("path");
const {
    engine
} = require('express-handlebars')
const axios = require('axios');
const chalk = require('chalk');
const fetch = require('node-fetch')
const fsPromise = require('fs/promises');

const fs = require('fs')
const envfile = require('envfile');

require('dotenv').config();
const tokens = require('./tokens.json');


const app = express();

const PORT = process.env.SERVER_PORT || 8095;

// const tokenAccess = process.env.ACCESS_TOKEN;
// const tokenRefresh = process.env.REFRESH_TOKEN;

const tokenAccess = tokens.ACCESS_TOKEN;
const tokenRefresh = tokens.REFRESH_TOKEN;




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


// const sourcePath = 'response.txt'
// console.log(envfile.parse(sourcePath))
// let parsedFile = envfile.parse(sourcePath);
// parsedFile.ACCESS_TOKEN = 'ACCESS_TOKEN';
// parsedFile.REFRESH_TOKEN = 'REFRESH_TOKEN';
// fs.writeFileSync('./response.txt', envfile.stringify(parsedFile))
// console.log(envfile.stringify(parsedFile))



// -------------- CHECK TOKEN -----------------------



checkToken();

async function checkToken() {
    try {
        let answer = await axios({
            method: 'get',
            url: 'https://demolitiondirectyandexru.amocrm.ru/api/v4/leads?with=contacts',
            headers: {
                'Authorization': `Bearer ${tokenAccess}`,
                'Content-Type': "application/json"
            },
        })

        const leads = await answer.data._embedded.leads;
    } catch (error) {
        console.log('+++', error.response.status);
        if (error.response.status === 401) {
            console.log(chalk.white.bgBlue.bold('Starting change token...'));
            await refreshToken();
            console.log(chalk.white.bgBlue.bold('Done'));
        }
    }
}


async function refreshToken() {

    const raw = JSON.stringify({
        "client_id": "69381124-7c4d-49da-8792-df8f333bfb60",
        "client_secret": "AIpLGrvT1TFPILnuJbxrcBtTV3fiN4Tr2UZBf3U1TeotTwy9maAgwZL6WZRivpzb",
        "grant_type": "refresh_token",
        "refresh_token": tokenRefresh,
        "redirect_uri": "https://newartspace.ru/"
    });

    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': "application/json",
        },
        body: raw,
        redirect: 'follow'
    };

    // const newTokens = ''

    try {
        const response = await fetch("https://demolitiondirectyandexru.amocrm.ru/oauth2/access_token", requestOptions);
        data = await response.json();
        console.log('data >>>', data)
        console.log('data >>>', data.access_token)
        console.log('data >>>', data.refresh_token)

        const sourcePath = '.env'
        console.log(envfile.parse(sourcePath))
        let parsedFile = envfile.parse(sourcePath);
        parsedFile.ACCESS_TOKEN = data.access_token;
        fs.writeFileSync('./.env', envfile.stringify(parsedFile))
        parsedFile.REFRESH_TOKEN = data.refresh_token;
        fs.writeFileSync('./.env', envfile.stringify(parsedFile))
        console.log(envfile.stringify(parsedFile))

        let tokens =  {
            "ACCESS_TOKEN" : data.access_token,
            "REFRESH_TOKEN" : data.refresh_token,
        } 

        try {
            await fsPromise.writeFile(path.resolve(__dirname, 'tokens.json'), JSON.stringify(tokens) )
            console.log('Файл сохранен');

        } catch (error) {
            console.log(error);
        }

       

    } catch (error) {
        console.log('Can not get tocken', error);
    }

    // try {



    //     // await fsPromise.writeFile(path.resolve(__dirname, response.txt), newTokens)
    //     // console.log(successMessage('Файл сохранен'));

    // } catch (error) {
    //     console.log(error.message);
    // }
}


app.get(['/', '/:query'], async (req, res) => {

    try {
        const leads = await getLeadsWithContactsId();
        const users = await getUsers();
        const contacts = await getContacts();

        const leadsWithUsersNames = changeNameIdForNameText(leads, putUsersNamesAndIdInObj(users));
        const leadsWithStatuses = changeDate(leadsWithUsersNames);
        const leadsWithTextStatuses = changeStatusIdForStatusText(leadsWithStatuses, statuses);
        //    console.log(chalk.blue.bgGreen.bold(changeStatusIdForStatusText(leadsWithStatuses, statuses)))
        const leadsWithContactsEmailAndPhone = addContactsEmailAndPhone(leadsWithTextStatuses, contacts)
        const answer = leadsWithContactsEmailAndPhone;

        if (req.params.query === 'all-leads-search') {
            res.status(200).send({
                'data': {
                    data: "dataAllLeadsFromSearch",
                    answerAllLeadsFromSearch: answer
                }
            });

        } else {
            res.render('home', {
                title: 'Тестовое задание',
                answer: answer,
            })
        }
    } catch (error) {
        console.log(error);
    }
});

app.get('/query/:query', async function (req, res) {

    const queryString = encodeURI(req.params.query);
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


    const leadsWithUsersNames = changeNameIdForNameText(leads, putUsersNamesAndIdInObj(users));
    const leadsWithStatuses = changeDate(leadsWithUsersNames);
    const leadsWithTextStatuses = changeStatusIdForStatusText(leadsWithStatuses, statuses);
    const leadsWithContactsEmailAndPhone = addContactsEmailAndPhone(leadsWithTextStatuses, contacts);
    const answer = leadsWithContactsEmailAndPhone;

    res.status(200).send({
        data: {
            data: "dataLeadsFromSearch",
            answerLeadsFromSearch: answer
        }
    });
})



async function getLeadsWithContactsId() {


    let answer = await axios({
        method: 'get',
        url: 'https://demolitiondirectyandexru.amocrm.ru/api/v4/leads?with=contacts',
        headers: {
            'Authorization': `Bearer ${tokenAccess}`,
            'Content-Type': "application/json"
        },
    })

    const leads = await answer.data._embedded.leads;
    return leads;

}

async function getUsers() {

    try {
        const answer = await axios({
            method: 'get',
            url: 'https://demolitiondirectyandexru.amocrm.ru/api/v4/users',
            headers: {
                'Authorization': `Bearer ${tokenAccess}`,
                'Content-Type': "application/json"
            },
        });
        const users = await answer.data._embedded.users;
        return users;
    } catch (error) {
        console.log('Something went wrong...', error)
    }
}

async function getContacts() {
    try {
        const answer = await axios({
            method: 'get',
            url: 'https://demolitiondirectyandexru.amocrm.ru/api/v4/contacts',
            headers: {
                'Authorization': `Bearer ${tokenAccess}`,
                'Content-Type': "application/json"
            },
        });
        const contacts = await answer.data._embedded.contacts;
        return contacts;
    } catch (error) {
        console.log('Something went wrong...', error)
    }

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
    50687014: 'Первичный контакт',
    50687017: 'Переговоры',
    50687020: 'Принимают решения',
    50687023: 'Согласование договора'
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

function getIdFromLeadsString(leads) {
    if (leads === null) {
        return null;
    }

    const idFromLeadsArray = [];

    for (const lead of leads) {
        idFromLeadsArray.push('&id[]=' + lead.id);
    }
    const idFromLeadsString = idFromLeadsArray.join('');
    return idFromLeadsString;
}

// -------------- SEARCH FUNC -------------------------------------------------------------------------------------


async function getleadsFromSearch(queryString) {
    try {
        const response = await axios({
            method: 'get',
            url: `https://demolitiondirectyandexru.amocrm.ru/api/v4/leads?query=${queryString}`,
            headers: {
                'Authorization': `Bearer ${tokenAccess}`,
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



async function getleadsFromSearchById(string) {
    try {
        const response = await axios({
            method: 'get',
            url: `https://demolitiondirectyandexru.amocrm.ru/api/v4/leads?with=contacts${string}`,
            headers: {
                'Authorization': `Bearer ${tokenAccess}`,
                'Content-Type': "application/json"
            },
        });

        const leadsFromSearchById = await response.data._embedded.leads;
        return leadsFromSearchById;

    } catch (error) {
        console.log('Something went wrong', error);
    }
}

try {
    app.listen(PORT, (req, res) => {
        console.log(`Server is working on port ${PORT}`);
    });
} catch (error) {
    console.log('>>>>>>>>', error);
}