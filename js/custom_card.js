"use strict";

class CustomCard extends HTMLElement {
    connectedCallback() {
        const title = this.getAttribute("title");
        const href = this.getAttribute("href");
        const thumbnail = this.getAttribute("thumbnail");
        const video = this.getAttribute("video");

        this.innerHTML = `
            <article>
                <figure>
                    <a href="${href}" class="media_container">
                        <img class="thumbnail"
                            src="https://res.cloudinary.com/dfurtwadh/image/upload/q_auto/f_auto/${thumbnail}"
                            alt="${title}" />
                        <video class="video" muted loop playsinline preload="none">
                            <source
                                src="https://res.cloudinary.com/dfurtwadh/video/upload/q_auto/f_auto/${video}"
                                type="video/mp4">
                        </video>
                    </a>
                    <figcaption>
                        <h3 class="card_title">${title}</h3>
                    </figcaption>
                </figure>
            </article>
        `;
    }
}

customElements.define("custom-card", CustomCard);
