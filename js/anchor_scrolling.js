"use strict";

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", anchorScroll);
} else {
    anchorScroll();
}

function anchorScroll() {
    const id = location.hash;
    if (id) {
        history.scrollRestoration = "manual";
        window.addEventListener("load", () => {
            document.querySelector(id)?.scrollIntoView();
        })
    }
}
