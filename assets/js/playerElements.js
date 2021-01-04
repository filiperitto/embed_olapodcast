import { secondsToMinutes } from "./utils.js";

export default {
  get() {
    this.cover = document.querySelector(".thumb-embed_olapodcast img");
    this.title = document.querySelector(
      ".bx-eb-ola .infos-box-embed_olapodcast h2"
    );
    this.playPause = document.querySelector("#embed_ola_podcast_play_pause");
    this.muteBtn = document.querySelector("#embed_olapodcast_muted");
    this.unmuteBtn = document.querySelector("#embed_olapodcast_unmuted");
    this.volumeControl = document.querySelector(
      "#embed_olapodcast_vol_control"
    );
    this.seekBar = document.querySelector("#embed_olapodcast_seekbar");
    this.seekBarValueForBackground = document.querySelector(
      "#track_embed_ola_podscast_background"
    );
    this.currentDuration = document.querySelector("#current-duration");
    this.totalDuration = document.querySelector("#total-duration");
    this.speedlist = document.getElementById("speedlist");
    this.playlistItems = document.querySelectorAll(
      ".list-playlis-embed_olapodcast"
    );
  },
  createAudioElement(audio) {
    this.audio = new Audio(audio);
  },
  actions() {
    this.audio.onended = () => this.next();
    this.audio.ontimeupdate = () => this.timeUpdate();
    this.playPause.onclick = () => this.togglePlayPause();
    this.muteBtn.onclick = () => this.toggleMute();
    this.unmuteBtn.onclick = () => this.toggleMute();
    this.volumeControl.oninput = () => this.setVolume(this.volumeControl.value);
    this.volumeControl.onchange = () =>
      this.setVolume(this.volumeControl.value);

    this.seekBar.oninput = () => this.setSeek(this.seekBar.value);
    this.seekBar.onchange = () => this.setSeek(this.seekBar.value);

<<<<<<< HEAD
    this.seekBarValueForBackground.oninput = () =>
      this.setSeek(this.seekBarValueForBackground.value);
    this.seekBarValueForBackground.onchange = () =>
      this.setSeek(this.seekBarValueForBackground.value);
=======
    this.seekBarValueForBackground.oninput = () => this.setSeek(this.seekBarValueForBackground.value);
    this.seekBarValueForBackground.onchange = () => this.setSeek(this.seekBarValueForBackground.value);
>>>>>>> 863491d499bf8944f26e3acb8e5c9c98afa5f527

    this.totalDuration.innerText = secondsToMinutes(this.audio.duration);
    this.speedlist.onchange = () => this.setPlaybackRate(this.speedlist.value);
    this.playlistItems.forEach((item, index) => {
      item.onclick = () => {
        this.togglePlay(index);
      };
    });
  },
};
