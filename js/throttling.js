"use strict";

// Throttle resize events using requestAnimationFrame 
// to ensure callbacks run at most once per animation frame

const callbacks = [];

let requestedFrame = null;
window.addEventListener("resize", function () {
    if (requestedFrame !== null) {
        return;
    }
    requestedFrame = requestAnimationFrame(function () {
        runCallbacks();
        requestedFrame = null;
    });
});

function runCallbacks() {
    for (const cb of callbacks) {
        try {
            cb();
        } catch (e) {
            console.log("Resize callback error", e);
        }
    }
}

export function onResizeThrottled(callback) {
    if (!callbacks.includes(callback)) {
        callbacks.push(callback);
    }
}
