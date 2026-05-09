"use strict";

// Note: The global functions getMode and applyMode are declared in initialize_dark_mode.js

const darkModeButton = document.getElementById("dark_mode_button");

darkModeButton.addEventListener("click", function () {
    const storedMode = getMode();
    const newMode = (storedMode === "light_mode") ? "dark_mode" : "light_mode";
    localStorage.setItem("darkMode", newMode);
    applyMode(newMode);
});
