"use strict";

const banner = document.getElementById("cookie_banner");

bannerRoutine();

document.getElementById("cookie_reset_button").addEventListener("click", () => {
    localStorage.setItem("cookie_reset_button_action", "clicked");
    reviewPrivacySettings();
});

document.addEventListener("click", (event) => {
    const videoPlaceholder = event.target.closest(".video_placeholder");
    if (!videoPlaceholder) {
        return;
    } else {
        reviewPrivacySettings();
    }
});

function reviewPrivacySettings() {
    localStorage.removeItem("youtube_consent");
    location.reload();
}

function bannerRoutine() {
    const consent = localStorage.getItem("youtube_consent");
    const cookieResetButtonAction = localStorage.getItem("cookie_reset_button_action");
    if (cookieResetButtonAction !== "clicked") {
        if (consent === "declined") {
            // Do nothing
        } else if (consent === "accepted") {
            initiateYT();
        } else if (window.location.pathname.includes("footwork_videos")) {
            showBanner();
        }
    } else {
        showBanner();
        localStorage.removeItem("cookie_reset_button_action");
    }
}

function showBanner() {
    banner.classList.remove("hidden");
    document.getElementById("accept_button").addEventListener("click", () => {
        localStorage.setItem("youtube_consent", "accepted");
        banner.remove();
        initiateYT();
    });

    document.getElementById("decline_button").addEventListener("click", () => {
        localStorage.setItem("youtube_consent", "declined");
        banner.remove();
    });
}

function initiateYT() {
    // TODO: This currently only handles YouTube videos in footwork_videos.html.
    if (!window.location.pathname.includes("footwork_videos")) {
        return;
    }
    const lessonNodeList = document.querySelectorAll(".lesson");
    for (const lesson of lessonNodeList) {
        const videoContainer = lesson.querySelector(".video_container");
        const ytId = videoContainer.dataset.youtubeId;
        const heading = lesson.querySelector(".lesson_heading");

        const iframe = document.createElement("iframe");
        iframe.title = heading.textContent;
        iframe.classList.add("large_video");
        iframe.src = "https://www.youtube-nocookie.com/embed/" + ytId + "?playsinline=1&rel=0";
        iframe.allow = "encrypted-media; picture-in-picture; web-share";
        iframe.allowFullscreen = true;
        iframe.loading = "lazy";
        iframe.referrerPolicy = "strict-origin-when-cross-origin";

        const placeholder = videoContainer.querySelector(".video_placeholder");
        placeholder.remove();

        videoContainer.appendChild(iframe);
    }
}