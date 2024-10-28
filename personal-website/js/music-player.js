class MusicPlayer {
    constructor() {
        this.audio = new Audio();
        this.isPlaying = false;
        this.currentTrack = 0;
        
        // Playlist of songs - Add your songs here
        this.playlist = [
            {
                title: "Song 1",
                artist: "Artist 1",
                file: "music/song1.mp3",
                albumArt: "images/album-art-1.jpg"
            },
            {
                title: "Song 2",
                artist: "Artist 2",
                file: "music/song2.mp3",
                albumArt: "images/album-art-2.jpg"
            }
            // Add more songs as needed
        ];

        this.initializePlayer();
        this.setupEventListeners();
    }

    initializePlayer() {
        // Initialize UI elements
        this.elements = {
            playBtn: document.getElementById('playBtn'),
            prevBtn: document.getElementById('prevBtn'),
            nextBtn: document.getElementById('nextBtn'),
            volumeSlider: document.getElementById('volumeSlider'),
            progress: document.getElementById('progress'),
            currentTime: document.getElementById('currentTime'),
            duration: document.getElementById('duration'),
            songTitle: document.getElementById('songTitle'),
            artistName: document.getElementById('artistName'),
            albumArt: document.getElementById('albumArt'),
            playlist: document.getElementById('playlistItems')
        };

        // Load first track
        this.loadTrack(this.currentTrack);
        this.renderPlaylist();
    }

    setupEventListeners() {
        // Play/Pause button
        this.elements.playBtn.addEventListener('click', () => this.togglePlay());

        // Previous/Next buttons
        this.elements.prevBtn.addEventListener('click', () => this.prevTrack());
        this.elements.nextBtn.addEventListener('click', () => this.nextTrack());

        // Volume control
        this.elements.volumeSlider.addEventListener('input', (e) => {
            this.audio.volume = e.target.value / 100;
        });

        // Audio event listeners
        this.audio.addEventListener('timeupdate', () => this.updateProgress());
        this.audio.addEventListener('ended', () => this.nextTrack());
        this.audio.addEventListener('loadedmetadata', () => {
            this.elements.duration.textContent = this.formatTime(this.audio.duration);
        });

        // Progress bar click
        document.querySelector('.progress-bar').addEventListener('click', (e) => {
            const progressBar = e.currentTarget;
            const clickPosition = e.offsetX / progressBar.offsetWidth;
            this.audio.currentTime = clickPosition * this.audio.duration;
        });

        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            switch(e.code) {
                case 'Space':
                    e.preventDefault();
                    this.togglePlay();
                    break;
                case 'ArrowLeft':
                    this.prevTrack();
                    break;
                case 'ArrowRight':
                    this.nextTrack();
                    break;
            }
        });
    }

    loadTrack(index) {
        const track = this.playlist[index];
        this.audio.src = track.file;
        this.elements.songTitle.textContent = track.title;
        this.elements.artistName.textContent = track.artist;
        this.elements.albumArt.src = track.albumArt;
        this.updatePlaylistActiveItem();
        
        // Reset progress
        this.elements.progress.style.width = '0%';
        this.elements.currentTime.textContent = '0:00';
        
        // Preload metadata
        this.audio.load();
    }

    togglePlay() {
        if (this.isPlaying) {
            this.audio.pause();
            this.isPlaying = false;
            this.elements.playBtn.innerHTML = `
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>`;
        } else {
            this.audio.play();
            this.isPlaying = true;
            this.elements.playBtn.innerHTML = `
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="6" y="4" width="4" height="16"></rect>
                    <rect x="14" y="4" width="4" height="16"></rect>
                </svg>`;
        }
    }

    prevTrack() {
        this.currentTrack = (this.currentTrack - 1 + this.playlist.length) % this.playlist.length;
        this.loadTrack(this.currentTrack);
        if (this.isPlaying) this.audio.play();
    }

    nextTrack() {
        this.currentTrack = (this.currentTrack + 1) % this.playlist.length;
        this.loadTrack(this.currentTrack);
        if (this.isPlaying) this.audio.play();
    }

    updateProgress() {
        const duration = this.audio.duration;
        const currentTime = this.audio.currentTime;
        const progress = (currentTime / duration) * 100;
        
        this.elements.progress.style.width = `${progress}%`;
        this.elements.currentTime.textContent = this.formatTime(currentTime);
        
        // Update duration in case it wasn't available earlier
        if (duration && !isNaN(duration)) {
            this.elements.duration.textContent = this.formatTime(duration);
        }
    }

    formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    renderPlaylist() {
        this.elements.playlist.innerHTML = this.playlist
            .map((track, index) => `
                <li class="playlist-item ${index === this.currentTrack ? 'active' : ''}" 
                    data-index="${index}">
                    <img src="${track.albumArt}" alt="${track.title}">
                    <div>
                        <h4>${track.title}</h4>
                        <p>${track.artist}</p>
                    </div>
                </li>
            `)
            .join('');

        // Add click events to playlist items
        document.querySelectorAll('.playlist-item').forEach(item => {
            item.addEventListener('click', () => {
                this.currentTrack = parseInt(item.dataset.index);
                this.loadTrack(this.currentTrack);
                if (this.isPlaying) this.audio.play();
            });
        });
    }

    updatePlaylistActiveItem() {
        document.querySelectorAll('.playlist-item').forEach((item, index) => {
            item.classList.toggle('active', index === this.currentTrack);
        });
    }
}

// Initialize the player when the document is loaded
document.addEventListener('DOMContentLoaded', () => {
    const player = new MusicPlayer();
});