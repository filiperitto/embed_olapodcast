import audios from "./data.js";
import elements from "./playerElements.js";
import { secondsToMinutes } from "./utils.js";

export default {
  currentAudio: {},
  audioData: audios,
  currentAudioPlaying: 0,
  isPlaying: false,
  songs: [],
  playbackRateValue: 1,

  start() {
    elements.get.call(this);
    for (let audio of audios) {
      this.songs[audio.id] = new Audio(audio.file);
    }
    this.update(true);
  },

  play() {
    this.isPlaying = true;
    this.songs[this.currentAudioPlaying].play();
  },

  pause() {
    this.isPlaying = false;
    this.songs[this.currentAudioPlaying].pause();
  },

  togglePlayPause() {
    this.isPlaying = this.playlistItems[
      this.currentAudioPlaying
    ].classList.contains("playing");
    if (this.isPlaying) {
      this.pause();
      this.playlistItems[this.currentAudioPlaying].classList.remove("playing");
      this.playlistItems[this.currentAudioPlaying].classList.add("paused");
      document
        .querySelector(".div-play-embed_olapodcast")
        .classList.remove("playing");
    } else {
      this.play();
      this.playlistItems[this.currentAudioPlaying].classList.add("playing");
      this.playlistItems[this.currentAudioPlaying].classList.remove("paused");
      document
        .querySelector(".div-play-embed_olapodcast")
        .classList.add("playing");
    }
  },

  toggleMute() {
    document
      .querySelector("#embed_olapodcast_unmuted")
      .classList.toggle("display-none-embed_olapodcast");
    document
      .querySelector("#embed_olapodcast_muted")
      .classList.toggle("display-none-embed_olapodcast");
    this.audio.muted = !this.audio.muted;
  },

  next() {
    this.currentAudioPlaying++;
    if (this.currentAudioPlaying === this.audioData.length) this.restart();
    this.update();
  },

  setVolume(volumeValue) {
    this.audio.volume = volumeValue / 100;
  },

  setSeek(seekValue) {
    this.audio.currentTime = seekValue;
  },

  timeUpdate() {
    this.currentDuration.innerText = secondsToMinutes(this.audio.currentTime);
    this.totalDuration.innerText = secondsToMinutes(this.audio.duration);
    this.seekBar.value = this.audio.currentTime;
    this.seekBar.max = this.audio.duration;
    this.seekBarValueForBackground.max = this.audio.duration;
    this.seekBarValueForBackground.value = this.audio.currentTime;
  },

  setPlaybackRate(playbackRateValue) {
    this.playbackRateValue = playbackRateValue;
    this.audio.playbackRate = playbackRateValue;
  },

  togglePlay(itemId) {
    const item = this.playlistItems[itemId];
    if (item) {
      if (!item.classList.contains("playing")) {
        this.currentAudioPlaying = itemId;
        if (this.currentAudioPlaying === this.audioData.length) this.restart();
        this.update();
      } else {
        this.togglePlayPause();
      }
    }
  },

  update(startPlayMusic = false) {
    this.currentAudio = this.audioData[this.currentAudioPlaying];
    this.cover.src = this.currentAudio.thumbnail;
    this.title.innerText = `${this.currentAudio.title} - ${this.currentAudio.author}`;
    elements.createAudioElement.call(this, this.currentAudio.file);

    if (!startPlayMusic) {
      this.playlistItems.forEach((item) => {
        item.classList.remove("playing");
        item.classList.remove("paused");
      });

      this.songs.forEach((song) => {
        song.pause();
        song.currentTime = 0;
      });
      this.togglePlayPause();
    }

    this.audio = this.songs[this.currentAudioPlaying];
    this.audio.onended = () => this.next();
    this.audio.ontimeupdate = () => this.timeUpdate();
    this.audio.playbackRate = this.playbackRateValue;
    this.setSeek(0);

    this.audio.onloadeddata = () => {
      elements.actions.call(this);
    };
  },

  restart() {
    this.currentAudioPlaying = 0;
    this.update();
  },
};
