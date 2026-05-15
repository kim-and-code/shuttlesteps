"use strict";

// Note: Dropdown menu visibility is also managed in active_links.js
// TODO: Move menu visibility logic from active_links.js to this file
// to achieve a clean separation of concerns

import { toggleMenu, removeMenu } from "./toggle_or_remove_menu_narrow_screen.js";

// Toggle hamburger menu
document.getElementById("hamburger_menu").addEventListener("click", toggleMenu);

const liWithDropdownCollection = document.getElementsByClassName("li_with_dropdown");
for (const liWithDropdown of liWithDropdownCollection) {
    liWithDropdown.addEventListener("click", function (event) {

        const dropdownMenu = this.querySelector(".dropdown_menu");
        const menuHeading = dropdownMenu.querySelector(".menu_heading");

        // On touch and narrow-screen devices, the dropdown can be toggled
        // by clicking the heading above it.
        // See dual_input.js: Any pointerdown event outside the currently open dropdown
        // closes it, regardless of device type.
        if (((!window.matchMedia("(hover: hover)").matches) ||
            (!window.matchMedia("screen and (min-width: 70rem)").matches)) &&
            (!event.composedPath().includes(dropdownMenu))) {
            liWithDropdown.classList.toggle("visible_dropdown");
        }

        // Handle navigation to an anchor on the currently active page
        if ((event.composedPath().includes(dropdownMenu)) &&
            (!event.composedPath().includes(menuHeading)) &&
            (this.classList.contains("active"))) {
            // On large hover screens: Hide the dropdown and restore it on pointer enter
            if (window.matchMedia("screen and (min-width: 70rem) and (hover: hover)").matches) {
                // See dual_input.js
                this.classList.remove("show_dropdown");
                this.classList.remove("show_dropdown_hover_problem");
                // Hide the dropdown menu. This is necessary because the page will not reload. 
                this.classList.add("disable_hover");
                // Dropdown visibility on hover is restored on pointer enter
                this.addEventListener("pointerenter", function () {
                    this.classList.remove("disable_hover");
                }, { once: true });

                // On large touch screens: Hide dropdown
            } else if (window.matchMedia("screen and (min-width: 70rem) and (hover: none)").matches) {
                this.classList.remove("visible_dropdown");

                // On narrow screens: Collapse the entire hamburger menu
            } else if (!window.matchMedia("screen and (min-width: 70rem)").matches) {
                removeMenu();
            }
        }
    });
}
