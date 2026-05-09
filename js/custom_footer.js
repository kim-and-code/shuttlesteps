"use strict";

class CustomFooter extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <footer>
                <a href="privacy_policy.html">Privacy Policy</a>
            </footer>
        `;
    }
}

customElements.define("custom-footer", CustomFooter);
