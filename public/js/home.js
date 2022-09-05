// const plusSign = document.querySelectorAll('.plus-sign');
const wrapper = document.querySelector('.content');
// const contacts = document.querySelector('.contacts');

// console.log(wrapper)

wrapper.addEventListener('click', function (event) {
    event.preventDefault();


    if (event.target && event.target.classList.contains('plus-sign')) {
        let elem = event.target
        console.log(elem)
        elem.innerHTML = (elem.innerHTML === '+') ? elem.innerHTML = '-' : elem.innerHTML = '+';
        event.target.closest('.row').nextElementSibling.classList.toggle('visible')

    }

})