"use strict";

// Set YouTube thumbnail images based on iframe video URLs

document.querySelectorAll(".media_container").forEach(container => {
    const video = container.querySelector(".video");
    const thumbnail = container.querySelector(".thumbnail");
    const url = new URL(video.src);
    const id = url.pathname.split("/").pop();

    thumbnail.style.backgroundImage = "url('https://i.ytimg.com/vi/" + id + "/hqdefault.jpg')";
});
