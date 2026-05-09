"use strict";

const playerArray = [];

if (!window.YT) {
    const scriptTag = document.createElement("script");
    scriptTag.src = "https://www.youtube.com/iframe_api";
    document.body.appendChild(scriptTag);
}

const domReadyPromise = new Promise(resolve => {
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", resolve);
    } else {
        resolve();
    }
});

const ytReadyPromise = new Promise(resolve => {
    function checkYT() {
        if (window.YT && window.YT.Player) {
            resolve();
        } else {
            requestAnimationFrame(checkYT);
        }
    }
    checkYT();
});

Promise.all([domReadyPromise, ytReadyPromise]).then(() => {
    onDomAndYTReadyFunction();
});

// Reset player state and return to thumbnail view
function pause(cP) {
    cP.thumbnail.style.display = "block";
    cP.iframe.style.display = "none";

    if (cP.isReady) {
        cP.player.pauseVideo();
        cP.player.seekTo(0, true);
    } else {
        cP.pendingAction = "pause";
    }
}

// play video and pause and reset all other videos
function play(cP) {
    cP.thumbnail.style.display = "none";
    cP.iframe.style.display = "block";

    for (const pl of playerArray) {
        if (pl !== cP) {
            pause(pl);
        }
    }

    if (cP.isReady) {
        cP.player.playVideo();
    } else {
        cP.pendingAction = "play";
    }
}

// TODO: Break this function into smaller functions
function onDomAndYTReadyFunction() {
    const grid = document.querySelector(".card_grid");
    const numElements = grid.childElementCount;
    for (let i = 0; i < numElements; i++) {
        const card = grid.children[i];
        const thumbnail = card.querySelector(".thumbnail")
        const iframe = card.querySelector(".video");

        const cardPlayer = {
            player: null,
            thumbnail,
            iframe,
            isReady: false,
            pendingAction: null,
            hoverTimeout: null,
        };

        cardPlayer.player = new YT.Player(iframe, {
            events: {
                onReady: () => {
                    cardPlayer.isReady = true;

                    if (cardPlayer.pendingAction === "play") {
                        play(cardPlayer);
                    }
                    if (cardPlayer.pendingAction === "pause") {
                        pause(cardPlayer);
                    }

                    cardPlayer.pendingAction = null;
                }
            }
        });

        playerArray.push(cardPlayer);

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
            clearTimeout(cardPlayer.hoverTimeout);
            pause(cardPlayer);
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
                card.style.transform = "scale(1.5)";
            }

            // Ensure only one hover timeout is active
            clearTimeout(cardPlayer.hoverTimeout);
            cardPlayer.hoverTimeout = null;

            cardPlayer.hoverTimeout = setTimeout(() => {
                if (cardPlayer.isReady) {
                    play(cardPlayer);
                } else {
                    cardPlayer.pendingAction = "play";
                }
            }, 1000);
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
