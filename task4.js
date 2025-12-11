const musicContainer = document.querySelector('.player-container');
const playBtn = document.getElementById('play');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');

const audio = new Audio();
const progress = document.getElementById('progress');
const progressContainer = document.querySelector('.progress-container');
const title = document.getElementById('title');
const artist = document.getElementById('artist');
const cover = document.getElementById('cover');
const currTime = document.getElementById('curr-time');
const durTime = document.getElementById('dur-time');

const volumeSlider = document.getElementById('volume');
const volumeIcon = document.getElementById('volume-icon');

const playlistBtn = document.getElementById('playlist-btn');
const closePlaylistBtn = document.getElementById('close-playlist');
const playlistPanel = document.getElementById('playlist-panel');
const playlistUl = document.getElementById('playlist-ul');

// Song Data
const songs = [
    {
        title: 'Tech House Vibes',
        artist: 'SoundHelix',
        src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        cover: 'assets/images/cover.png'
    },
    {
        title: 'Electro Dream',
        artist: 'SoundHelix',
        src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
        cover: 'assets/images/cover.png'
    },
    {
        title: 'Deep Focus',
        artist: 'SoundHelix',
        src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
        cover: 'assets/images/cover.png'
    },
    // Hindi Songs (Placeholders)
    {
        title: 'Kesariya',
        artist: 'Arijit Singh',
        src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        cover: 'assets/images/cover.png'
    },
    {
        title: 'Apna Bana Le',
        artist: 'Arijit Singh',
        src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
        cover: 'assets/images/cover.png'
    },
    {
        title: 'Tum Hi Ho',
        artist: 'Arijit Singh',
        src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
        cover: 'assets/images/cover.png'
    }
];

let songIndex = 0;

// Initialize
function init() {
    loadSong(songs[songIndex]);
    renderPlaylist();
    // Default volume
    audio.volume = 1;
}

// Global Keyboard Controls
document.addEventListener('keydown', (e) => {
    // Ignore if typing in an input (not likely here but good practice)
    if (e.target.tagName === 'INPUT') return;

    switch (e.code) {
        case 'Space':
            e.preventDefault(); // prevent scrolling
            const isPlaying = musicContainer.classList.contains('play');
            if (isPlaying) pauseSong();
            else playSong();
            break;
        case 'ArrowRight':
            // Seek forward 5s
            audio.currentTime += 5;
            break;
        case 'ArrowLeft':
            // Seek backward 5s
            audio.currentTime -= 5;
            break;
        case 'ArrowUp':
            e.preventDefault();
            if (audio.volume < 0.9) audio.volume += 0.1;
            else audio.volume = 1;
            volumeSlider.value = audio.volume;
            // trigger volume event listener logic visually
            // a bit hacky but updating UI
            setVolume({ target: { value: audio.volume } });
            break;
        case 'ArrowDown':
            e.preventDefault();
            if (audio.volume > 0.1) audio.volume -= 0.1;
            else audio.volume = 0;
            volumeSlider.value = audio.volume;
            setVolume({ target: { value: audio.volume } });
            break;
    }
});

// Load song details
function loadSong(song) {
    title.innerText = song.title;
    artist.innerText = song.artist;
    audio.src = song.src;
    // Reset time display immediately
    currTime.innerText = '0:00';
    durTime.innerText = '0:00'; // Will update on loadedmetadata
    // In a real app we might change cover per song, here reusing the asset
    // cover.src = song.cover; 
}

// Play Song
function playSong() {
    musicContainer.classList.add('play');
    playBtn.querySelector('i.fa-play').classList.remove('fa-play');
    playBtn.querySelector('i').classList.add('fa-pause');
    audio.play();
}

// Pause Song
function pauseSong() {
    musicContainer.classList.remove('play');
    playBtn.querySelector('i.fa-pause').classList.remove('fa-pause');
    playBtn.querySelector('i').classList.add('fa-play');
    audio.pause();
}

// Prev Song
function prevSong() {
    songIndex--;
    if (songIndex < 0) {
        songIndex = songs.length - 1;
    }
    loadSong(songs[songIndex]);
    playSong();
    updatePlaylistActive();
}

// Next Song
function nextSong() {
    songIndex++;
    if (songIndex > songs.length - 1) {
        songIndex = 0;
    }
    loadSong(songs[songIndex]);
    playSong();
    updatePlaylistActive();
}

// Update Progress bar
function updateProgress(e) {
    const { duration, currentTime } = e.srcElement;
    const progressPercent = (currentTime / duration) * 100;
    progress.value = progressPercent || 0;

    // Update time displays
    if (duration) {
        const durMinutes = Math.floor(duration / 60);
        const durSeconds = Math.floor(duration % 60);
        durTime.innerText = `${durMinutes}:${durSeconds < 10 ? '0' + durSeconds : durSeconds}`;
    }

    const currMinutes = Math.floor(currentTime / 60);
    const currSeconds = Math.floor(currentTime % 60);
    currTime.innerText = `${currMinutes}:${currSeconds < 10 ? '0' + currSeconds : currSeconds}`;

    // Update progress bar visual fill (webkit trick)
    const val = progress.value;
    // progress.style.background = `linear-gradient(to right, #fff 0%, #fff ${val}%, rgba(255,255,255,0.3) ${val}%, rgba(255,255,255,0.3) 100%)`;
}

// Set Progress
function setProgress(e) {
    const width = this.clientWidth; // not used since it's a range input
    // direct value from range input
    const val = this.value;
    const duration = audio.duration;
    audio.currentTime = (val / 100) * duration;
}

// Set Volume
function setVolume(e) {
    audio.volume = e.target.value;
    if (audio.volume === 0) {
        volumeIcon.className = 'fa-solid fa-volume-off';
    } else if (audio.volume < 0.5) {
        volumeIcon.className = 'fa-solid fa-volume-low';
    } else {
        volumeIcon.className = 'fa-solid fa-volume-high';
    }
}

// Render Playlist
function renderPlaylist() {
    playlistUl.innerHTML = '';
    songs.forEach((song, index) => {
        const li = document.createElement('li');
        li.classList.add('playlist-item');
        if (index === songIndex) li.classList.add('active');
        li.innerHTML = `
            <span>${song.title}</span>
            <span style="font-size: 0.8em; opacity: 0.7;">${song.artist}</span>
        `;
        li.addEventListener('click', () => {
            songIndex = index;
            loadSong(songs[songIndex]);
            playSong();
            updatePlaylistActive();
            // Optional: close playlist on selection
            // playlistPanel.classList.remove('open');
        });
        playlistUl.appendChild(li);
    });
}

function updatePlaylistActive() {
    const items = document.querySelectorAll('.playlist-item');
    items.forEach((item, index) => {
        if (index === songIndex) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

// Event Listeners
playBtn.addEventListener('click', () => {
    const isPlaying = musicContainer.classList.contains('play');
    if (isPlaying) {
        pauseSong();
    } else {
        playSong();
    }
});

prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);

// Update Duration immediately when metadata loads
audio.addEventListener('loadedmetadata', () => {
    const duration = audio.duration;
    const durMinutes = Math.floor(duration / 60);
    const durSeconds = Math.floor(duration % 60);
    durTime.innerText = `${durMinutes}:${durSeconds < 10 ? '0' + durSeconds : durSeconds}`;
});

audio.addEventListener('timeupdate', updateProgress);
audio.addEventListener('ended', nextSong); // Autoplay next

progress.addEventListener('input', setProgress);
volumeSlider.addEventListener('input', setVolume);

// Playlist Toggle
playlistBtn.addEventListener('click', () => {
    playlistPanel.classList.add('open');
});

closePlaylistBtn.addEventListener('click', () => {
    playlistPanel.classList.remove('open');
});

init();
