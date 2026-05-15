"use strict";

const bar = document.getElementById("bar");

window.addEventListener("resize", function () {
    if (window.matchMedia("screen and (min-width: 70rem)").matches) {
        if (bar.classList.contains("extended_bar")) {
            bar.classList.remove("extended_bar");
        }
    }
});
