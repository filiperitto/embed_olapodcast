// import audios from "./data.js";
import elements from "./playerElements.js";
import { secondsToMinutes } from "./utils.js";

export default {
  audios: [],
  currentAudio: {},
  audioData: [],
  currentAudioPlaying: 0,
  isPlaying: false,
  songs: [],
  playbackRateValue: 1,

  async start() {
    await this.FetchAudio(2020);
    elements.get.call(this);
    console.log("audios", this.audios);
    for (let audio of this.audios) {
      this.songs[audio.id] = new Audio(audio.content);
    }
    this.update(true);
  },

  play() {
    this.isPlaying = true;
    this.songs[this.audioData[this.currentAudioPlaying].id].play();
  },

  pause() {
    this.isPlaying = false;
    this.songs[this.audioData[this.currentAudioPlaying].id].pause();
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
      if (item.classList.contains("paused")) {
        this.togglePlayPause();
      } else if (!item.classList.contains("playing")) {
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
    this.title.innerText = `${this.currentAudio.title}`;
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

    this.audio = this.songs[this.audioData[this.currentAudioPlaying].id];
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

  async FetchAudio(channel_id) {
    await fetch("https://api.olapodcasts.com/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `
          query{
            channels(id: ${channel_id}){
              data {
                id
                name
                thumbnail(height: 200, width: 200)
                description
                episodes{
                  data{
                    id
                    description
                    content
                    title
                    tags
                    play_count
                    original
                    thumbnail(height: 100, width: 100)
                    likes
                    duration
                  }
                }
              }
            }
          }
        `,
      }),
    })
      .then((response) => response.json())
      .then(({ data }) => {
        if (
          data &&
          data.channels &&
          data.channels.data &&
          data.channels.data[0].episodes &&
          data.channels.data[0].episodes.data &&
          data.channels.data[0].episodes.data.length
        ) {
          const playlistElement = document.querySelector(
            ".ul-embed_olapodcast"
          );
          if (playlistElement) {
            playlistElement.innerHTML = "";
            const episodes = data.channels.data[0].episodes.data;
            for (let i = 0; i < episodes.length; i++) {
              this.audios[i] = episodes[i];
              playlistElement.innerHTML += this.createPlaylistItem(episodes[i]);
            }
            this.audioData = this.audios;
          }
        }
      })
      .catch((err) => console.log(err));
  },

  createPlaylistItem(item) {
    return `<li class="bx-eb-ola">
              <div class="bx-eb-ola list-playlis-embed_olapodcast">
                <button class="default">
                  <svg class="play" width="12" height="14" viewBox="0 0 12 14" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M11 5.26795C12.3333 6.03775 12.3333 7.96225 11 8.73205L3.5 13.0622C2.16666 13.832 0.499999 12.8697 0.499999 11.3301L0.5 2.66987C0.5 1.13027 2.16667 0.168021 3.5 0.937822L11 5.26795Z"
                      fill="#313131" />
                  </svg>
                  <svg class="pause" width="14" height="16" viewBox="0 0 14 16" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <rect x="10" width="4" height="16" rx="2" fill="#F57E20" />
                    <rect width="4" height="16" rx="2" fill="#F57E20" />
                  </svg>
                </button>
                <div class="bx-eb-ola min-thumb">
                  <img alt="" src="${item.thumbnail}">
                </div>
                <div class="bx-eb-ola name-epi">
                  <span>${item.title}</span>
                </div>
                <div class="bx-eb-ola timer-epi">
                  <span>${secondsToMinutes(item.duration)} min</span>
                </div>
              </div>
            </li>`;
  },
};
