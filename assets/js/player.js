import audios from "./data.js";
import elements from "./playerElements.js";
import { secondsToMinutes } from "./utils.js";

export default {
  currentAudio: {},
  audioData: audios,
  currentAudioPlaying: 0,
  isPlaying: false,

  start() {
    elements.get.call(this);
    this.update();
  },

  play() {
    this.isPlaying = true;
    document
      .querySelector(".div-play-embed_olapodcast")
      .classList.add("playing");
    this.audio.play();
  },

  pause() {
    this.isPlaying = false;
    document
      .querySelector(".div-play-embed_olapodcast")
      .classList.remove("playing");
    this.audio.pause();
  },

  togglePlayPause() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
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
    if (this.currentAudioPlaying == this.audioData.length) this.restart();
    this.update();
  },

  setVolume(volumeValue) {
    this.audio.volume = volumeValue / 100;
  },

  setSeek(seekValue) {
    this.audio.currentTime = seekValue;
  },

  setPlaybackRate(playbackRateValue) {
    this.audio.playbackRate = playbackRateValue;
  },

  timeUpdate() {
    this.currentDuration.innerText = secondsToMinutes(this.audio.currentTime);
    this.seekbar.value = this.audio.currentTime;
  },

  update() {
    this.currentAudio = this.audioData[this.currentAudioPlaying];
    this.cover.src = this.currentAudio.thumbnail;
    this.title.innerText = `${this.currentAudio.title} - ${this.currentAudio.author}`;
    elements.createAudioElement.call(this, this.currentAudio.file);

    this.audio.onloadeddata = () => {
      elements.actions.call(this);
    };
  },

  restart() {
    this.currentAudioPlaying = 0;
    this.update();
  },

  initAudio() {
    speedlist.addEventListener("change", changeSpeed);

    function changeSpeed(event) {
      this.audio.playbackRate = event.target.value;
    }
  },
};
