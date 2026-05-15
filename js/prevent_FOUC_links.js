"use strict";

// Prevent FOUC by adding a temporary "pending" state on navigation click

const listElementNodeList = document.querySelectorAll("#nav_ul > li");

for (const listElement of listElementNodeList) {
    listElement.addEventListener("click", function (e) {
        if ((window.matchMedia("(hover: hover)").matches) &&
            (window.matchMedia("screen and (min-width: 70rem)").matches)) {
            if ((!this.classList.contains("active")) && (!this.classList.contains("show_dropdown")) &&
                (e.pointerType !== "touch")) {
                removePendingStatusFromAllLinks();
                this.classList.add("pending");
            }
        }
    });
}

function removePendingStatusFromAllLinks() {
    for (const listElement of listElementNodeList) {
        listElement.classList.remove("pending");
    }
}
