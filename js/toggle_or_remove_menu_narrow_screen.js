"use strict";

const bar = document.getElementById("bar");
const liWithDropdownCollection = document.getElementsByClassName("li_with_dropdown");

export function toggleMenu() {
    bar.classList.toggle("extended_bar");
    hideDropdowns();
}

export function removeMenu() {
    bar.classList.remove("extended_bar");
    hideDropdowns();
}

function hideDropdowns() {
    for (const liWithDropdown of liWithDropdownCollection) {
        liWithDropdown.classList.remove("visible_dropdown");
    }
}
