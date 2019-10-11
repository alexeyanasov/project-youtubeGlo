'use strict';
document.addEventListener('DOMContentLoaded', () => {

    //экраннная клавиатура
    {
        const keyboardButton = document.querySelector('.search-form__keyboard');
        const keyboard = document.querySelector('.keyboard');
        const closeKeyboard = document.getElementById('close-keyboard');
        const searchInput = document.querySelector('.search-form__input');

        const toggleKeyboard = () => {
            keyboard.style.top = keyboard.style.top ? '' : '50%' ; }; // функция с тернарным оператором
        const changeLang = (btn,lang) => { 
            const langRu = [
                'ё', 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, '-', '=', '⬅',
                'й', 'ц', 'у', 'к', 'е', 'н', 'г', 'ш', 'щ', 'з', 'х', 'ъ',
                'ф', 'ы', 'в', 'а', 'п', 'р', 'о', 'л', 'д', 'ж', 'э',
                'я', 'ч', 'с', 'м', 'и', 'т', 'ь', 'б', 'ю', '.',
                'en', ' '
               ];
            const langEn = [
                '`', 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, '-', '=', '⬅',
                'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']',
                'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', '"',
                'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/',
                'ru', ' '
               ];
               if (lang == 'en') {
                   btn.forEach((elem, i) => { 
                    elem.textContent = langEn[i];
                   })
               } else { 
                    btn.forEach((elem, i) => { 
                    elem.textContent = langRu[i];
                   })
               }
        }
        const typing = (event) => {
            const target = event.target;
            
            if ((target.tagName.toLowerCase() === 'button')) {
                const buttons = [...keyboard.querySelectorAll('button')].filter(elem => elem.style.visibility !== 'hidden'); //получение всех непустых кнопок
                const contentButton= target.textContent.trim();
                if (event.target.id == 'space') {
                searchInput.value += ' ';
                } else if (event.target.id == 'keyboard-backspace') {
                searchInput.value = searchInput.value.substring(0, searchInput.value.length - 1);
                } else if (contentButton === 'en' || contentButton === 'ru') {
                    changeLang(buttons, contentButton)
                } else {
                searchInput.value += contentButton;
                 }
            }
        };

        keyboardButton.addEventListener('click', toggleKeyboard); //отслеживание нажатия на объект            
        closeKeyboard.addEventListener('click', toggleKeyboard);
        keyboard.addEventListener('click', typing);
    }

    //меню
    {
        const burger = document.querySelector('.spinner');
        const sidebarMenu = document.querySelector('.sidebarMenu');
        
        burger.addEventListener('click', () => {
            burger.classList.toggle('active');
            sidebarMenu.classList.toggle('rollUp');
        });

            sidebarMenu.addEventListener('click', (event)=> {
                let target = event.target;
                target = target.closest('a[href="#"]');
                
                if (target) { 
                    const parentTarget = target.parentNode;
                    sidebarMenu.querySelectorAll('li').forEach((elem) => {
                       
                            if (elem===parentTarget) {
                            elem.classList.add('active');
                        } else {
                            elem.classList.remove('active');
                        }
                     })

                }
            })
        
    }
    
    

    //Модальное окно
   const youtuber = () => {   
        const youtuberItems = document.querySelectorAll('[data-youtuber]');
        const youTuberModal = document.querySelector('.youTuberModal');
        const youtuberContainer = document.getElementById('youtuberContainer');

        const qw = [3840, 2560, 1920, 1280, 854, 640, 426, 256];
        const qh = [2160, 1440, 1080, 720, 480, 360, 240, 144];

        const sizeVideo = () => { 

            let ww = document.documentElement.clientWidth;
            let wh = document.documentElement.clientHeight;

            for (let i = 0; i < qw.length; i++) {
                 if (ww > qw[i]) {
                     youtuberContainer.querySelector('iframe').style.cssText = `
                     width: ${qw[i]}px;
                     height: ${qh[i]}px;
                     `;
                    youtuberContainer.style.cssText =  `
                    width: ${qw[i]}px;
                    height: ${qh[i]}px;
                    top: ${(wh-qh[i]) / 2}px;
                    left: ${(ww-qw[i]) / 2}px;
                    `;
                    break;
                 } 
            }
        }

        youtuberItems.forEach(elem => {
            elem.addEventListener('click', () => {
                const idVideo = elem.dataset.youtuber;
                youTuberModal.style.display = 'block';

                const youTuberFrame = document.createElement('iframe');
                youTuberFrame.src = `https://youtube.com/embed/${idVideo}`;
                youtuberContainer.insertAdjacentElement('beforeend', youTuberFrame);
                
                window.addEventListener('resize', sizeVideo);
                sizeVideo();
               
            });
        });

        youTuberModal.addEventListener('click', () => {
            youTuberModal.style.display = '';
            youtuberContainer.textContent = '';
            window.removeEventListener('resize', sizeVideo);
        });

    }

    //штука
    {
        document.body.insertAdjacentHTML('beforeend', `
        <div class="youTuberModal">
        <div id="youtuberClose">&#215;</div>
        <div id="youtuberContainer"></div>
        </div>`);
    }

    //youtube
    {
        const API_KEY = 'AIzaSyC7qXOmuEWUVXMikunO8mkhjS42Nc6TNdc';
        const CLIENT_ID = '849800000683-vjckugeimtr31cgv9b59o010dse6o7dt.apps.googleusercontent.com';
        //авторизация
        {
            const buttonAuth = document.getElementById('authorize');
            const authBlock = document.querySelector('.auth');
            const errorAuth = err => {
                console.error(err);
                authBlock.style.display = '';
            }; //функция отлавливающия ошибки при авторизации
            

            const authenticate = () =>  gapi.auth2.getAuthInstance() 
                    .signIn({scope: "https://www.googleapis.com/auth/youtube.readonly"})
                    .then(() => { console.log("Авторизация успешна"); }) //срабатывает при ответе от сервера
                    .catch(errorAuth); //функция авторизации, метод catch срабатывает только при ошибке
            
            const loadClient = () => { //передает апи ключ и запускает метод load который обращается к ютубу
                gapi.client.setApiKey(API_KEY);
                return gapi.client.load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest")
                    .then( () => console.log("GAPI client loaded for API"))
                    .then( () => authBlock.style.display = 'none')
                    .catch(errorAuth);
              } 
                               
            gapi.load("client:auth2", () => gapi.auth2.init({client_id: CLIENT_ID}));

                buttonAuth.addEventListener('click', () => {
                    authenticate().then(loadClient);
                })

          
        }
        //request
        {
            const gloTube = document.querySelector('.logo-academy');
            const trends = document.getElementById('yt_trend');
            const like = document.getElementById('yt_like');
            const main = document.getElementById('yt_main');

            const request = options => {
                gapi.client.youtube[options.method]
                .list(options)
                .then(response => response.result.items)
                .then(render)
                .then(youtuber)
                .catch( err => console.err('Во время запроса произошла ошибка: ' + err));
            }
            const render = (data) => {
                console.log(data);
                const ytWrapper = document.getElementById('yt-wrapper');
                ytWrapper.textContent = '';
                data.forEach(item => {
                   try {
                       const {
                           id,
                           id:{
                               videoId
                            }, 
                       snippet:{
                           channelTitle, 
                           title,
                           resourceId: {
                               videoId:likevideoId
                           } = {}, 
                           thumbnails:{
                               high:{
                                   url
                                }
                            }
                        }
                    } = item;
                    ytWrapper.innerHTML += `
                        <div class="yt" data-youtuber="${likevideoId || videoId || id}">
                        <div class="yt-thumbnail" style="--aspect-ratio:16/9;">
                            <img src="${url}" alt="thumbnail" class="yt-thumbnail__img">
                        </div>
                        <div class="yt-title">${title}</div>
                        <div class="yt-channel">${channelTitle}</div>
                        </div>
                    `;} catch (err) {
                        console.error(err);
                    }
                })

            }

            gloTube.addEventListener('click', () => {
                request({
                    method: 'search',
                    part: 'snippet',
                    channelId: 'UCVswRUcKC-M35RzgPRv8qUg',
                    order: 'date',
                    maxResults: 6,
                })
            });

            trends.addEventListener('click', () => {
                request({
                    method: 'videos',
                    part: 'snippet',
                    chart: 'mostPopular',
                    regionCode: 'RU',
                    maxResults: 6,
                })
            });

            like.addEventListener('click', () => {
                request({
                    method: 'playlistItems',
                    part: 'snippet',
                    playlistId: 'LLnOrjn5juLzpeUbJ-bRz22w',
                    maxResults: 6,
                })
            });

            main.addEventListener('click', () => {
                request({
                    method: 'search',
                    part: 'snippet',
                    channelId: 'UClDnqhoeEL5GebAm2Mtjm_g',
                    order: 'date',
                    maxResults: 6,
                })
            });



        }
    }

});
