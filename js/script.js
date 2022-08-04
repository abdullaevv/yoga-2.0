window.addEventListener('DOMContentLoaded', function() {
    'use strict';

    let tab = document.querySelectorAll('.info-header-tab'),
        info = document.querySelector('.info-header'),
        tabContent = document.querySelectorAll('.info-tabcontent');

    function hideTabContent(a) {
        for (let i = a; i < tabContent.length; i++) {
            tabContent[i].classList.remove('show');
            tabContent[i].classList.add('hide');
        }
    }     
    
    hideTabContent(1);

    function showTabContent(b) {
        if (tabContent[b].classList.contains('hide')) {
            tabContent[b].classList.remove('hide');
            tabContent[b].classList.add('show');
        }
    }

    info.addEventListener('click', function(event) {
        let target = event.target;
        if (target && target.classList.contains('info-header-tab')) {
            for(let i = 0; i < tab.length; i++) {
                if (target == tab[i]) {
                    hideTabContent(0);
                    showTabContent(i);
                    break;
                }
            }
        }

    });

    //timer

    let deadLine = '2022-08-05';
    function getTimeRemaining(endtime) {
        let t = Date.parse(endtime) - Date.parse(new Date()),
            seconds = Math.floor((t/1000) % 60),
            minutes = Math.floor((t/1000/60) % 60),
            hours = Math.floor((t/(1000*60*60)));
            //hours = Math.floor((t/1000/60/60) % 24); //Таймер для дней 
            //days = Math.floor((t/(1000*60*60*24)));  //Таймер для дней 
        return {
            'total' : t, 
            'hours' : hours,
            'minutes' : minutes,
            'seconds' : seconds
        };
    }

    function setClock(id, endtime) {
        let timer = document.getElementById(id),
            hours = timer.querySelector('.hours'),
            minutes = timer.querySelector('.minutes'),
            seconds = timer.querySelector('.seconds'),
            timeInterval = setInterval(updateClock, 1000);

        function updateClock() {
            let t = getTimeRemaining(endtime);

            if (hours < 10) {
                hours.textContent = '0' + t.hours;
            } else {
                hours.textContent = t.hours;
            }

            //тоже самое, только короче)
            minutes.textContent = t.minutes < 10 ? '0' + t.minutes : t.minutes;
            seconds.textContent = t.seconds < 10 ? '0' + t.seconds : t.seconds;

            if (t.total <= 0) {
                clearInterval(timeInterval);
                hours.textContent = '00';
                minutes.textContent = '00';
                seconds.textContent = '00';

            }
        }
    }



    setClock('timer', deadLine);

    //modal

    let more = document.querySelector('.more'),
        overlay = document.querySelector('.overlay'),
        close = document.querySelector('.popup-close');

    more.addEventListener('click', function() {
        overlay.style.display = 'block';
        this.classList.add('more-slash'); // Добавили кнопке класс more-slash (в которой анимация)
        document.body.style.overflow = 'hidden';
    });

    close.addEventListener('click', function() {
        overlay.style.display = 'none';
        more.classList.remove('more-slash');
        document.body.style.overflow = '';

    });

    // Form

    let message = {
        loading: 'Загрузка...',
        success: 'Спасибо! Скоро мы с вами свяжемся!',
        failure: 'Что-то пошло не так...'
    };

    let form = document.querySelector('.main-form')[0], //получаем данные с html

        input = form.getElementsByTagName('input'),
        statusMessage = document.createElement('div'); //создал div
        statusMessage.classList.add('status'); //и добавил класс статус

    function sendForm(elem) {
        elem.addEventListener('submit', function(e) { //обработчик с событием submit обязательно присваивается на саму форму, а не на кнопку
            e.preventDefault(); //что бы не перезагружалсь страница при отправке номера
                form.appendChild(statusMessage); //добавли div с сообщение о статусе
                let formData = new FormData(elem); //создаем объект для формы

            function postData(data) {
                return new Promise(function(resolve, reject) {
                    let request = new XMLHttpRequest(); //использовал htr что бы работать с ajax
                    request.open('POST', 'server.php');//определяем какой метод и место файла с настройками сервера
                    request.setRequestHeader('Content-type', 'application/json; charset=utf-8'); //application/x-www-form-urlencoded в обычном случае

                    

                    request.onreadystatechange = function() { //проверка
                        if (request.readyState < 4) {
                            resolve();
                        } else if (request.readyState === 4) {
                            if (request.status == 200) {
                                resolve();
                            }
                            else {
                                reject();
                            }
                        }
                    };

                    request.send(data); 

                });
            } //postData

            function clearInput(){
                for (let i = 0; i < input.length; i++) { //обнуление inputов
                    input[i].value = '';
                }
                
            }

            postData(formData)
                .then(() => statusMessage.innerHTML = message.loading)
                .then(() => {
                    statusMessage.innerHTML = '';
                })
                .catch(() => statusMessage.innerHTML = message.failure)
                .then(clearInput)
        });
    };
    sendForm(form);
});
    
