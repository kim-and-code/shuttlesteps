"use strict";

const callbacks = [];

const remReference = document.createElement("div");
remReference.id = "rem_ref";
remReference.style.visibility = "hidden";
remReference.style.position = "absolute";
remReference.style.left = "-100px";
remReference.style.top = "-100px";
remReference.style.width = "1rem";
remReference.style.height = "1rem";

let lastRootFontSize = null;
const resizeObs = new ResizeObserver(function (entries) {
    const rootFontSize = entries[0].contentRect.width;
    if ((lastRootFontSize !== null) && (lastRootFontSize !== rootFontSize)) {
        runCallbacks();
    }
    lastRootFontSize = rootFontSize;
});

let isObserving = false;

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startObserving);
} else {
    startObserving();
}

function runCallbacks() {
    for (const cb of callbacks) {
        try {
            cb();
        } catch (e) {
            console.log("Error in root font size resize observer callback:", e);
        }
    }
}

function startObserving() {
    if (isObserving) {
        return;
    }
    isObserving = true;

    document.body.appendChild(remReference);
    resizeObs.observe(remReference);
}

export function onRootFontSizeChange(callback) {
    if (!callbacks.includes(callback)) {
        callbacks.push(callback);
    }
}
