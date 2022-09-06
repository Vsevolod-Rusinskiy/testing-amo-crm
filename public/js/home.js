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

    if (queyrString.length >= 3) {
        const promise = await fetch(`/query/${queyrString}`, {
            method: 'GET',
        });
        response = await promise.json();

        if (response.data) {
            noData.classList.remove('display')
            content.classList.add('display')
        }
        if (!response.data) {
            noData.classList.add('display')
            content.classList.remove('display')
        }
    }
})
