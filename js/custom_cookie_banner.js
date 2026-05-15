"use strict";

class CustomCookieBanner extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <div id="cookie_banner_content">
                <p>
                    This website includes embedded YouTube videos. If you allow it, YouTube content may be
                    loaded and data may be sent to Google. If you decline, you can continue using the website without
                    videos.
                </p>
                <div id="cookie_button_container">
                    <button type="button" class="button" id="accept_button">Allow YouTube Content</button>
                    <button type="button" class="button" id="decline_button">Continue without YouTube</button>
                </div>
            </div>
        `;
    }
}

customElements.define("custom-cookie-banner", CustomCookieBanner);
