"use strict";

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", manageCards);
} else {
    manageCards();
}

// Return to thumbnail view
function pause(cardObj) {
    cardObj.video.pause();
    cardObj.video.classList.remove("opaque");
}

// Play video
function play(cardObj) {
    cardObj.video.classList.add("opaque");
    cardObj.video.play();
}

// TODO: Break this function into smaller functions
function manageCards() {
    const grid = document.querySelector(".card_grid");
    const numElements = grid.childElementCount;
    for (let i = 0; i < numElements; i++) {
        const card = grid.children[i];
        const cardObject = {
            element : card,
            thumbnail: card.querySelector(".thumbnail"),
            video: card.querySelector(".video"),
            hoverTimeout: null,
        }

        // TODO: Move callLeaveFunction, leaveFunction, enterFunction, and activateCard out of the loop
        // TODO: Replace inline styles with CSS classes

        function callLeaveFunction(e) {
            if ((card.classList.contains("activated")) && (!card.contains(e.target))) {
                card.classList.remove("activated");
                leaveFunction();
            }
        }

        function leaveFunction() {
            card.style.transitionDelay = "0s, 0.5s, 0s";
            card.style.zIndex = "0";
            card.style.boxShadow = "initial";
            card.style.transform = "scale(1)";
            document.removeEventListener("pointerdown", callLeaveFunction);
            document.removeEventListener("pointermove", callLeaveFunction);
            clearTimeout(cardObject.hoverTimeout);
            pause(cardObject);
        }

        function enterFunction() {
            document.addEventListener("pointerdown", callLeaveFunction);
            document.addEventListener("pointermove", callLeaveFunction);
            const initialWidthStr = window.getComputedStyle(card).width;
            const currentWidth = card.getBoundingClientRect().width;
            const initialWidth = Number(initialWidthStr.substring(0, initialWidthStr.indexOf("px")));
            if (currentWidth > (initialWidth + 2)) {
                card.style.transitionDelay = "0s, 0s, 0s";
            } else {
                card.style.transitionDelay = "0.5s, 0.5s, 0.5s";
            }
            card.style.zIndex = "1";
            card.style.boxShadow = window.getComputedStyle(document.body).getPropertyValue("--card_shadow");
            const colCount = getColumnCount(grid);
            if (colCount > 1) {
                setTransformOrigin(colCount, numElements, i, card);
                card.style.transform = "scale(1.25)";
            }

            // Ensure only one hover timeout is active
            clearTimeout(cardObject.hoverTimeout);
            cardObject.hoverTimeout = null;

            cardObject.video.currentTime = 0;

            cardObject.hoverTimeout = setTimeout(() => {
                play(cardObject);
            }, 500);
        }

        function activateCard() {
            if (!card.classList.contains("activated")) {
                card.classList.add("activated");
                enterFunction();
            }
        }

        // pointerenter may not fire if the pointer is already inside,
        // so pointermove and pointerdown act as fallbacks
        card.addEventListener("pointerenter", activateCard);
        card.addEventListener("pointermove", activateCard);
        card.addEventListener("pointerdown", activateCard);

        card.addEventListener("pointerleave", function (e) {
            if ((card.classList.contains("activated")) &&
                ((e.pointerType === "mouse") || (e.pointerType === "pen"))) {
                card.classList.remove("activated");
                leaveFunction();
            }
        });
    }
}

function getColumnCount(grid) {
    const gridCompStyle = window.getComputedStyle(grid);
    const gridTemplateColumns = gridCompStyle.getPropertyValue("grid-template-columns");
    const n = gridTemplateColumns.split(" ").length;
    return n;
}

function setTransformOrigin(numCols, numElements, cardIndex, card) {
    // Get number of rows
    const numRows = Math.ceil(numElements / numCols);

    const isFirstCol = cardIndex % numCols === 0;
    const isLastCol = (cardIndex + 1) % numCols === 0;
    const isFirstRow = cardIndex < numCols;
    const isLastRow = cardIndex >= numCols * (numRows - 1);

    // Set transform origin for elements in the first/last row and column
    let str = "";
    let isSpecialCol = false;
    if (isFirstCol) {
        str += "left";
        isSpecialCol = true;
    } else if (isLastCol) {
        str += "right";
        isSpecialCol = true;
    }
    if (isFirstRow) {
        if (isSpecialCol) {
            str += " ";
        }
        str += "top";
    } else if (isLastRow) {
        if (isSpecialCol) {
            str += " ";
        }
        str += "bottom";
    }
    card.style.transformOrigin = str;
}
