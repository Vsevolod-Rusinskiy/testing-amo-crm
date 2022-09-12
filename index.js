const express = require("express");
const cors = require('cors');
const path = require("path");
const {
    engine
} = require('express-handlebars')
const axios = require('axios');
const chalk = require('chalk');
const fetch = require('node-fetch')
const fsPromise = require('fs/promises')
require('dotenv').config();

const app = express();

const PORT = process.env.SERVER_PORT || 8095;
const token = process.env.ACCESS_TOKEN;


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


// -------------- CHECK TOKEN -----------------------

async function fetchTocken() {
    // var myHeaders = new Headers();
    // myHeaders.append("Content-Type", "application/json");
    // myHeaders.append("Cookie", "session_id=l6p8opamu37psq3p5eh01j5l5a; user_lang=ru");

    var raw = JSON.stringify({
        "client_id": "69381124-7c4d-49da-8792-df8f333bfb60",
        "client_secret": "AIpLGrvT1TFPILnuJbxrcBtTV3fiN4Tr2UZBf3U1TeotTwy9maAgwZL6WZRivpzb",
        "grant_type": "refresh_token",
        "refresh_token": "def50200afdd0a9cb6c89feb85d4380b9046de5bc2dc5a614db8a8def4aae354fbf72297998211291012558a2dabeee3b212662b4bf7aecd3a837d08ed8050faa05f2a9d286531daccdc2f48f85ea0b6699439199d57218894b06d0ef027b088ec97cc701a69a1028d05a7f94f7afc148d634f10074ab53d87a0898c9885223a77f1ce66c636eae6bb771f116a50e324456fabdc47dfb73d7ad2a674ebebc952fa1ec02ab2009f870b74b3f077060a9b78005d84ebc97d0db43b714d912219bb76b5a8cf3ff6937e2fffdfc1dd025c870a7dd8d8a262d72f5d08dcebaa79f2ffa8eb27d776ad91eaaa9a03481f92cbe88c2846523e92aa945f469f968cae144922c9f6fcb22b489fd2afd434f2402556430ca963b4bb917ac31636c27b8abb28e492d28cf743f5dc4893ce5db5a1e6378a87f545f95ae993a5370054100f59cffff769d9a21da66674374310612b0da2a7a8c765e2e33bcf295e80fec3ced40f9e44770e082a6f9ba01c18e1d355bda4bb951338aac2775418a54c2d56fca239554b0e988d1cd2a3334815b4981bf81e04a9a915277fe8a1f68cd41ff54b1677af0ca1ad9286477c593c010803bb10eb404fd87465476bf4f9b0c8401f3bfea5012158a7fbb8d548d4ae108a664faa4509db4397a9f62a965a59d62d588b15f511",
        "redirect_uri": "https://newartspace.ru/"
    });

    var requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': "application/json",
        },
        body: raw,
        redirect: 'follow'
    };

    fetch("https://demolitiondirectyandexru.amocrm.ru/oauth2/access_token", requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));

    // try {
    //     let response = await fetch('https://demolitiondirectyandexru.amocrm.ru/api/v4/leads?with=contacts', {
    //         method: 'get',
    //         headers: {
    //             'Authorization': `Bearer ${token}`,
    //             'Content-Type': "application/json"
    //         },
    //     });

    //     data = await response;
    //     console.log('>>>', data.status);
    //     console.log(chalk.white.bgBlue.bold('>>>', data.status));

    //     if (data.status === 401) {

    //         const body = {
    //             "client_id": "5b696abc-0a27-4983-989e-c3abc6ee0e24",
    //             "client_secret": "VJOnPjjtT4yZdy3Z5v3XLXGzcp6ZGMlqGIxpscTVZDS9RIdEnQhfw0vgE5d78BIg",
    //             "grant_type": "refresh_token",
    //             "refresh_token": process.env.REFRESH_TOKEN,
    //             "redirect_uri": "https://newartspace.ru/"
    //         }

    //         try {
    //             let response = fetch('https://demolitiondirectyandexru.amocrm.ru/oauth2/access_token', {
    //                 method: 'post',
    //                 headers: {
    //                     'Authorization': `Bearer ${token}`,
    //                     'Content-Type': "application/json",
    //                     "token_type": "Bearer",

    //                 },
    //                 body: JSON.stringify(body),
    //             });

    //             data = await response;
    //             console.log('>>>', data);
    //             console.log(chalk.white.bgBlue.bold('>>>', data.status));

    //             await fsPromise.writeFile(path.resolve(__dirname, `response.txt`), data.toString() )
    //             await fsPromise.writeFile(path.resolve(__dirname, `response.txt`), JSON.stringify(data.status) )
    //             console.log('Файл сохранен');

    //         } catch (error) {
    //             console.log(chalk.blue.bgGreen.bold(error))
    //         }
    //     }

    // } catch (error) {
    //     console.log(chalk.blue.bgGreen.bold(error.status))
    // }
}
fetchTocken();



// app.get(['/', '/:query'], async (req, res) => {
//     try {
//         const leads = await getLeadsWithContactsId();
//         const users = await getUsers();
//         const contacts = await getContacts();

//         const leadsWithUsersNames = changeNameIdForNameText(leads, putUsersNamesAndIdInObj(users));
//         const leadsWithStatuses = changeDate(leadsWithUsersNames);
//         const leadsWithTextStatuses = changeStatusIdForStatusText(leadsWithStatuses, statuses);
//         const leadsWithContactsEmailAndPhone = addContactsEmailAndPhone(leadsWithTextStatuses, contacts)
//         const answer = leadsWithContactsEmailAndPhone;

//         if (req.params.query === 'all-leads-search') {
//             res.status(200).send({
//                 'data': {
//                     data: "dataAllLeadsFromSearch",
//                     answerAllLeadsFromSearch: answer
//                 }
//             });

//         } else {
//             res.render('home', {
//                 title: 'Тестовое задание',
//                 answer: answer,
//             })
//         }
//     } catch (error) {
//         console.log(error);
//     }
// });

// app.get('/query/:query', async function (req, res) {

//     const queryString = encodeURI(req.params.query);
//     const leadsFromSearch = await getleadsFromSearch(queryString);

//     if (leadsFromSearch === null) {
//         return res.status(200).send({
//             'data': 'nodata'
//         });
//     }

//     const idFromLeadsString = getIdFromLeadsString(leadsFromSearch);
//     const leads = await getleadsFromSearchById(idFromLeadsString);
//     const users = await getUsers();
//     const contacts = await getContacts();


//     const leadsWithUsersNames = changeNameIdForNameText(leads, putUsersNamesAndIdInObj(users));
//     const leadsWithStatuses = changeDate(leadsWithUsersNames);
//     const leadsWithTextStatuses = changeStatusIdForStatusText(leadsWithStatuses, statuses);
//     const leadsWithContactsEmailAndPhone = addContactsEmailAndPhone(leadsWithTextStatuses, contacts);
//     const answer = leadsWithContactsEmailAndPhone;

//     res.status(200).send({
//         data: {
//             data: "dataLeadsFromSearch",
//             answerLeadsFromSearch: answer
//         }
//     });
// })



// async function getLeadsWithContactsId() {


//     let answer = await axios({
//         method: 'get',
//         url: 'https://demolitiondirectyandexru.amocrm.ru/api/v4/leads?with=contacts',
//         headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': "application/json"
//         },
//     })

//     const leads = await answer.data._embedded.leads;
//     return leads;

// }

// async function getUsers() {

//     try {
//         const answer = await axios({
//             method: 'get',
//             url: 'https://demolitiondirectyandexru.amocrm.ru/api/v4/users',
//             headers: {
//                 'Authorization': `Bearer ${token}`,
//                 'Content-Type': "application/json"
//             },
//         });
//         const users = await answer.data._embedded.users;
//         return users;
//     } catch (error) {
//         console.log('Something went wrong...', error)
//     }
// }

// async function getContacts() {
//     try {
//         const answer = await axios({
//             method: 'get',
//             url: 'https://demolitiondirectyandexru.amocrm.ru/api/v4/contacts',
//             headers: {
//                 'Authorization': `Bearer ${token}`,
//                 'Content-Type': "application/json"
//             },
//         });
//         const contacts = await answer.data._embedded.contacts;
//         return contacts;
//     } catch (error) {
//         console.log('Something went wrong...', error)
//     }

// }

// function putUsersNamesAndIdInObj(users) {
//     const usersNamesAndIdInObj = {};

//     for (const elem of users) {
//         const key = elem.id;
//         const value = elem.name;
//         usersNamesAndIdInObj[key] = value
//     }
//     return usersNamesAndIdInObj;
// }

// function changeNameIdForNameText(leads, names) {
//     for (const elem of leads) {
//         for (const item in names) {
//             if (elem.responsible_user_id === +item) {
//                 elem.responsible_user_id = names[item];
//             }
//         }
//     }
//     return leads;
// }

// function addContactsEmailAndPhone(leads, contacts) {
//     for (const leadsElem of leads) {
//         for (const LeadsContactsfield of leadsElem._embedded.contacts) {
//             for (let contact of contacts) {
//                 if (LeadsContactsfield.id === contact.id) {
//                     for (const fields_values of contact.custom_fields_values) {
//                         LeadsContactsfield.name = contact.name;
//                         if (fields_values.field_code === 'EMAIL') {
//                             LeadsContactsfield.email = fields_values.values[0].value;
//                         }
//                         if (fields_values.field_code === 'PHONE') {
//                             LeadsContactsfield.phone = fields_values.values[0].value;
//                         }
//                     }
//                 }
//             }
//         }
//     }
//     return leads;
// }

// const statuses = {
//     50272636: 'Первичный контакт',
//     50272639: 'Переговоры',
//     50272642: 'Принимают решения',
//     50272645: 'Согласование договора'
// }

// function convertDate(unix_timestamp) {
//     const date = new Date(unix_timestamp * 1000);
//     return date.toLocaleString("ru-RU", {
//         day: "numeric",
//         month: "long",
//         year: "numeric"
//     }).slice(0, -3)
// }

// function changeDate(leads) {
//     for (const elem of leads) {
//         if (elem.created_at) {
//             elem.created_at = convertDate(elem.created_at)
//         }
//     }
//     return leads;
// }


// function changeStatusIdForStatusText(leads, statuses) {
//     for (const elem of leads) {
//         for (const item in statuses) {

//             if (elem.status_id === +item) {
//                 elem.status_id = statuses[item];

//                 if (elem.status_id === "Первичный контакт") {
//                     elem.firstContact = true;
//                 }
//                 if (elem.status_id === "Переговоры") {
//                     elem.negotiation = true;
//                 }
//                 if (elem.status_id === "Принимают решения") {
//                     elem.decisions = true;
//                 }
//                 if (elem.status_id === "Согласование договора") {
//                     elem.agreement = true;
//                 }
//             }
//         }
//     }
//     return leads
// }

// function getIdFromLeadsString(leads) {
//     if (leads === null) {
//         return null;
//     }

//     const idFromLeadsArray = [];

//     for (const lead of leads) {
//         idFromLeadsArray.push('&id[]=' + lead.id);
//     }
//     const idFromLeadsString = idFromLeadsArray.join('');
//     return idFromLeadsString;
// }

// // -------------- SEARCH FUNC -------------------------------------------------------------------------------------


// async function getleadsFromSearch(queryString) {
//     try {
//         const response = await axios({
//             method: 'get',
//             url: `https://demolitiondirectyandexru.amocrm.ru/api/v4/leads?query=${queryString}`,
//             headers: {
//                 'Authorization': `Bearer ${token}`,
//                 'Content-Type': "application/json"
//             },
//         });
//         const answer = await response.data
//         if (answer === '') {
//             return null;
//         }
//         const leadsFromSearch = await response.data._embedded.leads;
//         return leadsFromSearch;
//     } catch (error) {
//         console.log('Something went wrong...', error)
//     }
// }



// async function getleadsFromSearchById(string) {
//     try {
//         const response = await axios({
//             method: 'get',
//             url: `https://demolitiondirectyandexru.amocrm.ru/api/v4/leads?with=contacts${string}`,
//             headers: {
//                 'Authorization': `Bearer ${token}`,
//                 'Content-Type': "application/json"
//             },
//         });

//         const leadsFromSearchById = await response.data._embedded.leads;
//         return leadsFromSearchById;

//     } catch (error) {
//         console.log('Something went wrong', error);
//     }
// }

// try {
//     app.listen(PORT, (req, res) => {
//         console.log(`Server is working on port ${PORT}`);
//     });
// } catch (error) {
//     console.log('>>>>>>>>', error);
// }