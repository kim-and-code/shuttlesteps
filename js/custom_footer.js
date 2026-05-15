"use strict";

class CustomFooter extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <footer>
                <a href="privacy_policy.html">Privacy Policy</a>
                <button type="button" id="cookie_reset_button" class="button">Review Privacy Settings</button>
            </footer>
        `;
    }
}

customElements.define("custom-footer", CustomFooter);
