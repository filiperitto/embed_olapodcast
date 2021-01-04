import { secondsToMinutes } from "./utils.js";
import data from "./data.js";

function FetchAudio(channel_id) {
  fetch("https://api.olapodcasts.com/graphql", {
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
      console.log(data);
      if (
        data &&
        data.channels &&
        data.channels.data &&
        data.channels.data[0].episodes &&
        data.channels.data[0].episodes.data &&
        data.channels.data[0].episodes.data.length
      ) {
        const playlistElement = document.querySelector(".ul-embed_olapodcast");
        if (playlistElement) {
          playlistElement.innerHTML = "";
          const episodes = data.channels.data[0].episodes.data;
          for (let i = 0; i < episodes.length; i++) {
            playlistElement.innerHTML += createPlaylistItem(episodes[i]);
          }
        }
      }
    })
    .catch((err) => console.log(err));
}

if (data && data.length) {
  const playlistElement = document.querySelector(".ul-embed_olapodcast");
  if (playlistElement) {
    playlistElement.innerHTML = "";
    for (let i = 0; i < data.length; i++) {
      playlistElement.innerHTML += createPlaylistItem(data[i]);
    }
  }
}

function createPlaylistItem(item) {
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
                <span>${secondsToMinutes(item.time)} min</span>
              </div>
            </div>
          </li>`;
}

// FetchAudio(3000);
