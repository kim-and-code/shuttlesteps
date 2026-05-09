"use strict";

// Align dropdowns with the ads banner to prevent overlap

import { onRootFontSizeChange } from "./observe_root_font_size.js";
import { onResizeThrottled } from "./throttling.js";

updateDropdownPositions();

onResizeThrottled(updateDropdownPositions);

onRootFontSizeChange(updateDropdownPositions);

const hoverCapability = window.matchMedia("(hover: hover)");
hoverCapability.addEventListener("change", updateDropdownPositions);

function updateDropdownPositions() {
    const liWithDropdownNodeList = document.querySelectorAll(".li_with_dropdown");
    const ads = document.querySelector(".ads");
    const bar = document.getElementById("bar");
    const barClone = bar.cloneNode(true);
    barClone.removeAttribute("id");

    barClone.style.position = "absolute";
    barClone.style.left = "-10000px";
    barClone.style.top = "-10000px";
    barClone.style.visibility = "hidden";
    barClone.style.opacity = 0;

    // Write phase
    document.body.appendChild(barClone);
    const dropdownCloneArray = Array.from(barClone.querySelectorAll(".dropdown_menu"));
    for (const dropdownClone of dropdownCloneArray) {
        dropdownClone.style.display = "block";
    }

    // Read phase
    const dropdownCloneRectMap = new Map();
    for (const dropdownClone of dropdownCloneArray) {
        dropdownCloneRectMap.set(dropdownClone.dataset.id, dropdownClone.getBoundingClientRect());
    }
    let adsLeft;
    if (window.getComputedStyle(ads).display === "none") {
        adsLeft = window.innerWidth;
    } else {
        adsLeft = ads.getBoundingClientRect().left;
    }
    const liWithDropdownRectArray = [];
    liWithDropdownNodeList.forEach((liWithDropdown, i) => {
        liWithDropdownRectArray[i] = liWithDropdown.getBoundingClientRect();
    });

    // Write phase (set css variables)
    liWithDropdownNodeList.forEach((liWithDropdown, i) => {
        const dropdown = liWithDropdown.querySelector(".dropdown_menu");
        const dropdownCloneRect = dropdownCloneRectMap.get(dropdown.dataset.id);

        const width = dropdownCloneRect.width;
        const widthPlusOffset = width + liWithDropdownRectArray[i].left;
        const result = adsLeft - widthPlusOffset;
        dropdown.style.setProperty("--result", result + "px");
    });

    barClone.remove();
}
