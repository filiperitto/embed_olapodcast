import player from "./player.js";

const path = function (file) {
  return `/assets/js/${file}`;
};

window.addEventListener("load", player.start());
