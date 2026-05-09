"use strict";

// TODO:
// 1) Ensure consistent naming of variables and functions (e.g., topLi vs topLiElement)
// 2) Avoid code golfing to maintain readability
// 3) Ensure a consistent order of function declarations and calls (top-down vs bottom-up)

import { onRootFontSizeChange } from "./observe_root_font_size.js";
import { onResizeThrottled } from "./throttling.js";

onRootFontSizeChange(updateGridRowSpanAll);

const topics = document.getElementsByClassName("topics")[0];
const topLevelLiElements = topics.children;
const topicsComputedStyle = getComputedStyle(topics);
// I think gap and borderWidth do not have to be calculated inside calculateGridRowSpan. 
// As far as I know, if the user zooms in, gap and borderWidth would still
// have the same value because CSS pixels remain the same; only the mapping
// to physical pixels changes.
const gap = parseFloat(topicsComputedStyle.rowGap);
const borderWidth = parseFloat(topicsComputedStyle.getPropertyValue("--grid_item_border_width"));
const topAndBottomBorderPlusGap = (2 * borderWidth) + gap;

onResizeThrottled(updateGridRowSpanAll);
updateGridRowSpanAll();

const liElements = topics.getElementsByTagName("li");
// TODO: Use classes instead of indices
for (const li of liElements) {
    if (li.children.length > 0) {
        const ul = li.children[1];
        li.addEventListener("click", function (event) {
            if (this.classList.contains("collapsed")) {
                this.classList.remove("collapsed");
                this.classList.add("expanded");
                event.stopPropagation();
            }
            const topLi = getTopLevelLi(this);
            updateGridRowSpan(topLi);
        });

        li.children[0].addEventListener("click", function (event) {
            if (li.classList.contains("expanded")) {
                li.classList.add("collapsed");
                li.classList.remove("expanded");
                event.stopPropagation();
                // This is where .expanded is needed
                const subLiElements = li.querySelectorAll(".expanded");
                for (const subLiElement of subLiElements) {
                    subLiElement.classList.add("collapsed");
                    subLiElement.classList.remove("expanded");
                }
                const parentLi = this.parentElement;
                const topLi = getTopLevelLi(parentLi);
                updateGridRowSpan(topLi);
            }
        });
    }
}

const expandAllButton = document.getElementById("expand_all_button");
expandAllButton.addEventListener("click", function () {
    const collapsedLiElements = topics.querySelectorAll(".collapsed");
    for (const collapsedLiElement of collapsedLiElements) {
        collapsedLiElement.classList.remove("collapsed");
        collapsedLiElement.classList.add("expanded");
    }
    updateGridRowSpanAll();
});

const collapseAllButton = document.getElementById("collapse_all_button");
collapseAllButton.addEventListener("click", function () {
    const expandedLiElements = topics.querySelectorAll(".expanded");
    for (const expandedLiElement of expandedLiElements) {
        expandedLiElement.classList.remove("expanded");
        expandedLiElement.classList.add("collapsed");
    }
    updateGridRowSpanAll();
});

// TODO: Only update the grid elements whose height has changed
function updateGridRowSpanAll() {
    for (const topLi of topLevelLiElements) {
        updateGridRowSpan(topLi);
    }
}

function updateGridRowSpan(topLi) {
    topLi.style.gridRowEnd = "auto"
    const gridRowSpan = calculateGridRowSpan(topLi);
    topLi.style.gridRowEnd = "span " + gridRowSpan;
}

function calculateGridRowSpan(item) {
    // To get the row span count n, solve the following equation:
    // n*gridRowHeight + (n-1)*gap >= scrollHeight + topAndBottomBorder
    // which yields:
    // n = (scrollHeight + topAndBottomBorder + gap)/(gridRowHeight + gap)

    // Row height equals client height plus border. Add gap to both sides.
    const rowHeightPlusGap = item.clientHeight + topAndBottomBorderPlusGap
    const scrollHeightPlusBorderPlusGap = item.scrollHeight + topAndBottomBorderPlusGap;
    const approxN = Math.ceil(scrollHeightPlusBorderPlusGap / rowHeightPlusGap);

    // clientHeight and scrollHeight do not return subpixel values. 
    // To account for rounding errors, add a margin of safety of 1px for 
    // every row except the first one (approxN - 1). 
    // Usually (when using block layout) scrollHeight returns the content plus the vertical padding. 
    // However, when using grid layout and the grid item overflows the row track size
    // (caused by grid-auto-rows), scrollHeight returns only the content plus the top padding. 
    // To account for this, add some extra padding. 
    let extraPadding = 0;
    if (approxN > 1) {
        extraPadding = 4;
    }
    return Math.ceil((scrollHeightPlusBorderPlusGap + (approxN - 1) + extraPadding) / rowHeightPlusGap);
}

function getTopLevelLi(liElement) {
    for (const topLevelLiElement of topLevelLiElements) {
        if (topLevelLiElement.contains(liElement)) {
            return topLevelLiElement;
        }
    }
}
