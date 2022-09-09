const content = document.querySelector('.content');
const search = document.querySelector('#search');
const noData = document.querySelector('.no-data');



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
    console.log(this.value)
    console.log(typeof this.value)

    if (this.value === '') {
        // if (this.value === '') {
        const promise = await fetch(`/all-leads`, {
            method: 'GET',
        })
        response = await promise.json();
        const leads = response.data.answer;

        console.log(leads)

        for (const lead of leads) {
            let row = document.createElement('div');
            content.append(row);
            row.classList.add('row', 'item');

            let plus = document.createElement('div');
            row.append(plus);
            let span = document.createElement('span');
            span.innerHTML = '+'
            plus.append(span);
            span.classList.add("plus-sign");


            // plus.innerHTML = '1'
            // a = row.append(plus) plus-sign


            let nameCell = document.createElement('div');
            nameCell.innerHTML = lead.name;
            row.append(nameCell);
            nameCell.classList.add('name-cell');
            
            let spanName = document.createElement('span');
            spanName.innerHTML = ' | '
            plus.append(spanName);
            spanName.classList.add("separator");



            let status = document.createElement('div');
            // status.innerHTML = lead.status_id;
            row.append(status)
            status.classList.add('child');

            let spanStatus = document.createElement('span');
            spanStatus.innerHTML = lead.status_id;
            status.append(spanStatus)
            spanStatus.classList.add("status", "first-contact")
                // "status first-contact")

            ///-------------------


            let responsible = document.createElement('div');
            row.append(responsible);
            responsible.classList.add('child');

            let icon = document.createElement('i');
            responsible.append(icon);
            icon.classList.add("fa-regular", "fa-user");
            
            let div = document.createElement('div');
            div.innerHTML = lead.responsible_user_id;
            responsible.append(div);
            // div.classList.add("fa-regular", "fa-user");




            // responsible.innerHTML = lead.responsible_user_id;

            ///-------------------

            let date = document.createElement('div');
            date.innerHTML = lead.created_at;
            row.append(date)
            status.classList.add('child');
            let price = document.createElement('div');
            price.innerHTML = lead.price + "₽";

            row.append(price)
            price.classList.add('child');


            //     for (i = 0; i < 5; i++) {

            //         let div = document.createElement('div');
            //         row.append(div);
            //         div.classList.add('test', 'item');
            // }
        }

    }




    if (queyrString.length >= 3) {
        const promise = await fetch(`/query/${queyrString}`, {
            method: 'GET',
        })
        response = await promise.json();
        console.log(response.data.answer)


        if (response.data === 'nodata') {
            noData.classList.remove('display');
            content.classList.add('display');
        } else {
            noData.classList.add('display');
            // content.classList.remove('display');
        }
    }


})