var playlists = document.querySelector('.playlist')
const header = document.querySelector('.header h2');
const cdThumb = document.querySelector('.cd-thumb');
const audio = document.querySelector('.audio');
const playBtn = document.querySelector('.btn-touggle-play');
const player = document.querySelector('.app');
const progress = document.querySelector('.progress');
const nextBtn = document.querySelector('.btn-next');
const prevBtn = document.querySelector('.btn-prev');
const randomBtn = document.querySelector('.btn-random')
const repeatBtn = document.querySelector('.btn-repeat');
const PLAYER_STORAGE_KEY = 'MUSIC_SETTING';

const app = {
    currentIndex : 0,
    arrayIndex: [],
    isPlaying: false,
    isRandom: false,
    isReapeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    setConfig: function(key,value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
    },
    songs: [
        {
            name: 'Em có đợi tin nhắn tôi không ?',
            singer: 'Hải Sâm',
            path: './assects/music/Em-Co-Doi-Tin-Nhan-Toi-Khong-Hai-Sam.mp3',
            img: './assects/img/Em-co-doi-tin-nhan-toi-khong.jpg'
        },
        {
            name:'Lạnh thôi đừng mưa',
            singer:'Hải Sâm',
            path:'./assects/music/Lanh-Thoi-Dung-Mua-Hai-Sam.mp3',
            img:'./assects/img/lanh-thoi-dung-mua.jpg'
        },
        {
            name:'Mong',
            singer:'Hải Sâm',
            path:'./assects/music/Mong-Hai-Sam.mp3',
            img:'./assects/img/mong.jpg'
        },
        {
            name:'Một điều mà anh rất ngại nói ra',
            singer:'Hải Sâm',
            path:'./assects/music/Mot-Dieu-Ma-Anh-Rat-Ngai-Noi-Ra-Hai-Sam.mp3',
            img:'./assects/img/mot-dieu-ma-anh-rat-ngai-noi-ra.png'
        },
        {
            name:'Một file âm thanh nhỏ',
            singer:'Hải Sâm & Sam Itsnk',
            path:'./assects/music/Mot-File-Am-Thanh-Nho-Hai-Sam-Itsnk.mp3',
            img:'./assects/img/mot-file-am-thanh-nho.png'
        },
        {
            name:'Nhiều hơn một lý do',
            singer:'Hải Sâm',
            path:'./assects/music/Nhieu-Hon-Mot-Ly-Do-Hai-Sam.mp3',
            img:'./assects/img/nhieu-hon-mot-ly-do.jpg'
        },
        {
            name:'Sao không nói',
            singer:'Hải Sâm',
            path:'./assects/music/Sao-Khong-Noi-Hai-Sam.mp3',
            img:'./assects/img/sao-khong-noi.jpg'
        },
        {
            name:'Thế thôi',
            singer:'Hải Sâm',
            path:'./assects/music/The-Thoi-Hai-Sam.mp3',
            img:'./assects/img/the-thoi.jpg'
        }
    ],

    render: function(){
        const htmls = this.songs.map((song,index) => {
            return `
            <div class="song" data-index="${index}">
                <div class="song-img" style="background-image: url('${song.img}')">
                </div>
                <div class="body">
                    <div class="title">${song.name}</div>
                    <div class="author">${song.singer}</div>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
            `
        })
        playlists.innerHTML = htmls.join('')
    },
    handleEvent: function() {
        const cd = document.querySelector('.cd')
        const cdWidth=cd.offsetWidth;

        //Xử lý CD quay / dừng
        const cdThumbAnimate = cdThumb.animate([
            {
                transform : 'rotate(360deg)'
            }
        ], {
            duration: 10000,
            iterations: Infinity
        });
        cdThumbAnimate.pause();
        
        
        //Xử lý phóng to thu nhỏ
        document.onscroll = function() {
            const scrollTop = document.documentElement.scrollTop || window.scrollY;
            const newCdWidth = cdWidth-scrollTop;

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px': 0;
            cd.style.opacity = newCdWidth/cdWidth;
        }
        // Xử lý play
        playBtn.onclick = function() {
            if(app.isPlaying){
                audio.pause();
            }else {
                audio.play();
            }
        }
        // Xử lý khi song đươc play
        audio.onplay = function() {
            app.isPlaying = true;
            player.classList.add('playing');
            cdThumbAnimate.play();
        }
        // Xử lý khi song bị pause
        audio.onpause = function() {
            app.isPlaying = false;
            player.classList.remove('playing');
            cdThumbAnimate.pause();
        }
        //Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function() {
            const currentProgress = Math.floor(audio.currentTime / audio.duration * 100);
            progress.value = currentProgress;
        }
        //Xử lý khi tua bài hát
        progress.oninput = function(e) {
            const seekTime = audio.duration * e.target.value / 100;
            audio.currentTime = seekTime;
        }
        //Xử lý next bài hát
        nextBtn.onclick = function() {
            if(app.isRandom){
                app.playRandomSong()
            }else{
                app.nextSong();
            }
            audio.play();
        }
        //Xử lý pre bài hát
        prevBtn.onclick = function() {
            if(app.isRandom){
                app.playRandomSong()
            }else{
                app.prevSong();
            }
            audio.play();
        }
        //Xử lý khi ramdom
        randomBtn.onclick = function() {
            app.isRandom = !app.isRandom;
            app.setConfig('isRandom', app.isRandom);
            randomBtn.classList.toggle('active', app.isRandom);
        }
        //Khi bài hát kết thúc
        audio.onended = function() {
            if(app.isReapeat){
                audio.play();
            }else{
                nextBtn.click();
            }
        }
        //Xử lý khi repeat 1 song
        repeatBtn.onclick = function() {
            app.isReapeat = !app.isReapeat;
            app.setConfig('repeat', app.isReapeat);
            repeatBtn.classList.toggle('active', app.isReapeat);
        }

        //Xử lý lắng nghe click thay đổi bài hát
        playlists.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)');
            if(songNode || e.target.closest('.option')) {
                if(songNode) {
                    app.currentIndex = Number(songNode.dataset.index);
                    app.loadCurrentSong();
                    audio.play();
                }

                if(e.target.closest('.option')){
                    console.log('meo')
                }
            }
        }
    },
    defineProperties: function() {
        Object.defineProperty(this,'currentSong',{
            get: function() {
                return this.songs[this.currentIndex];
            }
        })
    },
    loadCurrentSong: function() {
        header.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.img}')`;
        audio.src = this.currentSong.path;
        this.activeSong();
        this.scrollToActiveSong();
        
    },
    activeSong: function() {
        const songElements = document.querySelectorAll('.song');
        songElements.forEach((song,index) => {
            if(index === this.currentIndex){
                song.classList.add('active');
            }else{
                song.classList.remove('active');
            }
        })
    },
    loadConfig: function() {
        this.isRandom = this.config.isRandom;
        this.isReapeat = this.config.isReapeat;
        randomBtn.classList.toggle('active', app.isRandom);
        repeatBtn.classList.toggle('active', app.isReapeat);
    },
    scrollToActiveSong: function() {
        
        setTimeout(() => {
            if(this.currentIndex < 2) {
                const songActive = document.querySelector('.song.active');
                songActive.scrollIntoView({
                behavior: 'smooth',
                block: 'end'
            })
            } else {
                const songActive = document.querySelector('.song.active');
                songActive.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                })
            }

        },300)

    },
    nextSong: function() {
        this.currentIndex++;
        if(this.currentIndex >= this.songs.length){
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },
    prevSong: function() {
        this.currentIndex--;
        if(this.currentIndex < 0){
            this.currentIndex = this.songs.length - 1 ;
        }
        this.loadCurrentSong();
    },
    playRandomSong: function() {
        let newIndex;
        do{
            newIndex = Math.floor(Math.random() * this.songs.length);
        }while(this.currentIndex == newIndex || this.arrayIndex.includes(newIndex));
        this.arrayIndex.push(newIndex);
        if(this.arrayIndex.length == this.songs.length){
            this.arrayIndex = [];
        }
        this.currentIndex = newIndex;

        this.loadCurrentSong();
    },
   
    start: function (){
        //Load các config ra
        this.loadConfig();
        //Đinh nghĩa các thuộc tính cho Object
        this.defineProperties();

        //Lắng nghe các sự kiện (DOM events)
        this.handleEvent();

        //Tải các bài hát đầu tiên khi bắt đầu ứng dụng
        this.loadCurrentSong();

        //Render các bài hát
        this.render();

        //Active bài hát
        this.activeSong();

    }
}

app.start();

