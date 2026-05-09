"use strict";

const html = document.documentElement;

function isMouseOrPen(e) {
    return e.pointerType === "mouse" || e.pointerType === "pen";
}

// Get the current pointer type
let currentPointerType = null;
function updatePointerType(e) {
    if (e.pointerType === currentPointerType) {
        return;
    }
    currentPointerType = e.pointerType;
    if (currentPointerType === "touch") {
        html.classList.add("touch_mode");
        html.classList.remove("mouse_or_pen_mode");
    } else if ((currentPointerType === "mouse") || (currentPointerType === "pen")) {
        html.classList.add("mouse_or_pen_mode");
        html.classList.remove("touch_mode");
    }
}
window.addEventListener("pointerdown", updatePointerType);
window.addEventListener("pointermove", updatePointerType);

// Show dropdown on touch
let isDropdownRemoved = false;
const linkCollection = document.querySelectorAll(".li_with_dropdown > a");
for (const link of linkCollection) {
    link.addEventListener("click", function (e) {
        if ((window.matchMedia("screen and (min-width: 51rem) and (hover: hover)").matches)) {
            const parent = this.parentElement;
            if ((e.pointerType === "touch") && (!parent.classList.contains("show_dropdown")) &&
                (!parent.isMouseOrPenOverLi)) {
                e.preventDefault();
                parent.classList.add("show_dropdown");
                isDropdownRemoved = false;
            }
        }
    });
}

const liWithDropdownCollection = document.getElementsByClassName("li_with_dropdown");

function closeOtherDropdowns(currentLi) {
    if (!isDropdownRemoved) {
        for (const liWithDropdownInnerLoop of liWithDropdownCollection) {
            if (currentLi !== liWithDropdownInnerLoop) {
                liWithDropdownInnerLoop.classList.remove("show_dropdown", "show_dropdown_hover_problem");
                isDropdownRemoved = true;
            }
        }
    }
}

for (const liWithDropdown of liWithDropdownCollection) {
    // Evaluate whether the mouse or pen is over the li element with a dropdown
    // TODO: better use Map or dataset instead of custom property on DOM element
    liWithDropdown.isMouseOrPenOverLi = false;
    liWithDropdown.addEventListener("pointerenter", function (e) {
        if (isMouseOrPen(e)) {
            this.isMouseOrPenOverLi = true;
        }
    });
    liWithDropdown.addEventListener("pointermove", function (e) {
        if (isMouseOrPen(e)) {
            this.isMouseOrPenOverLi = true;
        }
    });
    liWithDropdown.addEventListener("pointerleave", function (e) {
        if (isMouseOrPen(e)) {
            this.isMouseOrPenOverLi = false;
        }
    });

    // When hovering over a li element with a dropdown, remove .show_dropdown from all others
    liWithDropdown.addEventListener("pointerenter", (e) => closeOtherDropdowns(e.currentTarget));
    liWithDropdown.addEventListener("pointermove", (e) => closeOtherDropdowns(e.currentTarget));

    // Allow selecting a submenu link via touch while hovering over a li element with a dropdown
    liWithDropdown.addEventListener("pointerdown", function (e) {
        if ((e.pointerType === "touch") && (this.matches(":hover"))) {
            this.classList.add("show_dropdown_hover_problem");
            isDropdownRemoved = false;
        }
    });

    liWithDropdown.addEventListener("pointerleave", function (e) {
        if (isMouseOrPen(e)) {
            this.classList.remove("show_dropdown", "show_dropdown_hover_problem");
        }
    });

    // TODO: Move this out of the loop 
    // (currently this adds a document event listener for every li element with a dropdown)
    document.addEventListener("pointerdown", function (e) {
        if (!liWithDropdown.contains(e.target)) {
            liWithDropdown.classList.remove("show_dropdown", "show_dropdown_hover_problem");

            // TODO: This does not handle dual-input and should be moved to menu_visibility.js.
            liWithDropdown.classList.remove("visible_dropdown");
        }
    });
}
