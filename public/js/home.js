const wrapper = document.querySelector('.content');
const search = document.querySelector('#search');



wrapper.addEventListener('click', function (event) {
    event.preventDefault();
    if (event.target && event.target.classList.contains('plus-sign')) {
        let elem = event.target;
        elem.innerHTML = (elem.innerHTML === '+') ? elem.innerHTML = '-' : elem.innerHTML = '+';
        event.target.closest('.row').nextElementSibling.classList.toggle('visible');
    }
})


search.addEventListener('keyup', function () {

    let queyrString = this.value;
    
    if (queyrString.length >= 3 ) {
        const promise = fetch(`/query/${queyrString}`, {
            method: 'GET',
        });

        promise.then(response => {
            return response.json();
        }).then(data => {
            console.log('data',data.error)
        })
    }
})