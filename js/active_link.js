"use strict";

const fullPathname = window.location.pathname;
const pathnameIndex = fullPathname.lastIndexOf("/");
const slicedPathname = fullPathname.slice(pathnameIndex + 1);
// Run as soon as #nav_ul exists to prevent FOUC.
// A MutationObserver is used to detect when it is added to the DOM.
const observer = new MutationObserver(function () {
    const navUl = document.getElementById("nav_ul");
    if (navUl) {
        const navLinkElements = Array.from(navUl.children);
        for (const navLinkElement of navLinkElements) {
            const link = navLinkElement.querySelector("a");
            if (!link) {
                continue;
            }
            const fullNavLink = link.href;
            const linkIndex = fullNavLink.lastIndexOf("/");
            const slicedNavLink = fullNavLink.slice(linkIndex + 1);
            const isSamePage = slicedPathname === slicedNavLink;
            const isIndexPage = (fullPathname === "/") && (fullNavLink.includes("/index.htm"));
            if (isSamePage || isIndexPage) {
                navLinkElement.classList.add("active");
                // TODO: Add "dropdown_disabled" only if the navLink has a dropdown menu
                navLinkElement.classList.add("dropdown_disabled");

                // Require the user to move the pointer once before re-enabling dropdown hover.
                // This helps reduce FOUC when loading a page with a dropdown.
                if (navLinkElement.classList.contains("li_with_dropdown")) {
                    document.addEventListener("mousemove", handleDropdown);
                }
                // TODO: Move handleDropdown outside the loop to avoid redefining it on each iteration
                function handleDropdown() {
                    function enableDropdown() {
                        navLinkElement.classList.remove("dropdown_disabled");
                        document.removeEventListener("pointermove", enableDropdown);
                        document.removeEventListener("pointerdown", enableDropdown);
                    }
                    document.addEventListener("pointermove", enableDropdown, { once: true });
                    document.addEventListener("pointerdown", enableDropdown, { once: true });
                    document.removeEventListener("mousemove", handleDropdown);
                }
                // Stop after finding the active link
                break;
            }
        }
        observer.disconnect();
    }
});

observer.observe(document.documentElement, {
    subtree: true,
    childList: true
});
