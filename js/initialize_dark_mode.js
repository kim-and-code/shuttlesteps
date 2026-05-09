"use strict";

applyMode(getMode());

// Global function used by toggle_dark_mode.js
function applyMode(mode) {
    document.documentElement.classList.remove("light_mode", "dark_mode");
    document.documentElement.classList.add(mode);
}

// Global function used by toggle_dark_mode.js
function getMode() {
    return (localStorage.getItem("darkMode") || "light_mode");
}
