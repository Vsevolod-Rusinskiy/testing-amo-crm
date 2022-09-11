const content = document.querySelector('.content');
const search = document.querySelector('#search');
const noData = document.querySelector('.no-data');
// const row = document.querySelectorAll('.row');



// console.log(row);


// removeDomElem(row);

// function removeDomElem(elem) {
//     row.forEach((elem) => {
//         elem.remove();
//     });
// }


content.addEventListener('click', function (event) {
    event.preventDefault();
    if (event.target && event.target.classList.contains('plus-sign')) {
        let elem = event.target;
        elem.innerHTML = (elem.innerHTML === '+') ? elem.innerHTML = '-' : elem.innerHTML = '+';
        event.target.closest('.row').nextElementSibling.classList.toggle('visible');
    }
})



search.addEventListener('keyup', async function () {
    let queyrString = this.value;

    if (this.value === '') {
        const promise = await fetch(`/all-leads-search`, {
            method: 'GET',
        })
        response = await promise.json();
        const leads = response.data.answerAllLeadsFromSearch;

        // removeDomElem(row);

        // row.forEach((elem) => {
        //     elem.remove();
        // });

        noData.classList.add('display');
        content.classList.remove('display');


        const row = document.querySelectorAll('.row');

        removeDomElem(row);

        // row.forEach((elem) => {
        //     elem.remove();
        // });

        console.log('удалил!')

        console.log('перед отрисовкой!')

        displayLeads(leads);

        console.log('после  отрисовки!')
    }


    if (queyrString.length >= 3) {
        const promise = await fetch(`/query/${queyrString}`, {
            method: 'GET',
        });
        response = await promise.json();
        console.log(response.data)
        console.log(response.data.answerLeadsFromSearch)

        // if ()


        if (response.data === 'nodata') {
            noData.classList.remove('display');
            content.classList.add('display');

            // == dataAllLeadsFromSearch
        } else {
            noData.classList.add('display');
        }
    }
})

/// -----  FUNC --------------------

function separatePriceWithSpace(price) {
    num = '' + price;
    return num.replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, "$1 ");
}

function displayLeads(leads) {


    // console.log(row)

    if (leads) {

        for (const lead of leads) {

            let row = document.createElement('div');
            content.append(row);
            row.classList.add('row', 'item');

            let plus = document.createElement('div');
            row.append(plus);
            let span = document.createElement('span');
            span.innerHTML = '!'
            plus.append(span);
            span.classList.add("plus-sign");

            let nameCell = document.createElement('div');
            row.append(nameCell);
            nameCell.classList.add('name-cell');

            let nameCellName = document.createElement('div');
            nameCellName.innerHTML = lead.name;
            nameCell.append(nameCellName);
            nameCellName.classList.add('name-cell-name');

            let nameCellTags = document.createElement('div');
            nameCell.append(nameCellTags);
            nameCellTags.classList.add('name-cell-tags');

            for (const items of lead._embedded.tags) {

                let spanSeparator = document.createElement('span');
                spanSeparator.innerHTML = " | ";
                nameCellTags.append(spanSeparator);
                spanSeparator.classList.add("separator");


                let spanTag = document.createElement('span');
                spanTag.innerHTML = items.name;
                nameCellTags.append(spanTag);
                spanTag.classList.add("tag");
            }

            let status = document.createElement('div');
            row.append(status)
            status.classList.add('child');

            let spanStatus = document.createElement('span');
            spanStatus.innerHTML = lead.status_id;
            status.append(spanStatus);
            let statusStyle = 'green';
            switch (lead.status_id) {
                case 'Первичный контакт':
                    statusStyle = 'first-contact';
                    break;
                case 'Переговоры':
                    statusStyle = 'negotiation';
                    break;
                case 'Принимают решения':
                    statusStyle = 'decisions';
                case 'Согласование договора':
                    statusStyle = 'decisions';
                    break;
            }

            spanStatus.classList.add("status", statusStyle);

            let responsible = document.createElement('div');
            row.append(responsible);
            responsible.classList.add('child');

            let icon = document.createElement('i');
            responsible.append(icon);
            icon.classList.add("fa-regular", "fa-user");

            let div = document.createElement('div');
            div.innerHTML = lead.responsible_user_id;
            responsible.append(div);

            let date = document.createElement('div');
            date.innerHTML = lead.created_at;
            row.append(date)
            date.classList.add('child');
            let price = document.createElement('div');
            price.innerHTML = separatePriceWithSpace(lead.price) + " ₽ ";

            row.append(price)
            price.classList.add('child');

            let rowContacts = document.createElement('div');
            content.append(rowContacts);
            rowContacts.classList.add('row', 'item', 'contacts', 'visible');


            for (const contact of lead._embedded.contacts) {
                let div = document.createElement('div');
                rowContacts.append(div);
                div.classList.add("child", "name-cell");

                let i = document.createElement('i');
                div.append(i);
                i.classList.add("fa-user", "fa-regular");

                let contactName = document.createElement('div');
                contactName.innerHTML = contact.name;
                div.append(contactName);

                if (contact.phone) {

                    let spanSeparatorPhone = document.createElement('span');
                    spanSeparatorPhone.innerHTML = " | ";
                    div.append(spanSeparatorPhone);
                    spanSeparatorPhone.classList.add("separator");

                    let spanTagPhone = document.createElement('span');
                    div.append(spanTagPhone);
                    spanTagPhone.classList.add("tag");

                    let linkPhone = document.createElement('a');
                    linkPhone.setAttribute("href", contact.phone);
                    spanTagPhone.append(linkPhone);

                    let iconPhone = document.createElement('i');
                    linkPhone.append(iconPhone);
                    iconPhone.classList.add("fa-solid", "fa-phone");
                }


                if (contact.email) {

                    let spanSeparatorEmail = document.createElement('span');
                    spanSeparatorEmail.innerHTML = " | ";
                    div.append(spanSeparatorEmail);
                    spanSeparatorEmail.classList.add("separator");

                    let spanTagEmail = document.createElement('span');
                    div.append(spanTagEmail);
                    spanTagEmail.classList.add("tag");

                    let linkEmail = document.createElement('a');
                    linkEmail.setAttribute("href", contact.email);
                    spanTagEmail.append(linkEmail);

                    let iconEmail = document.createElement('i');
                    linkEmail.append(iconEmail);
                    iconEmail.classList.add("fa-solid", "fa-envelope");

                }
            }
        }
    }
}

function removeDomElem(row) {
    row.forEach((elem) => {
        elem.remove();
    });
}