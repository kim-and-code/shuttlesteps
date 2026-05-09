"use strict";

class CustomHeader extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <div id="hamburger_menu">
                <div id="hamburger_menu_bar_1"></div>
                <div id="hamburger_menu_bar_2"></div>
                <div id="hamburger_menu_bar_3"></div>
            </div>

            <a class="home_narrow_screen" href="index.html">
                <img class="logo" src="images/logo.svg" alt="ShuttleSteps">
                <span class="brand_name">ShuttleSteps</span>
            </a>

            <button type="button" id="dark_mode_button">
            </button>
            
            <nav>
                <ul id="nav_ul">
                    <li><a class="home_wide_screen" href="index.html">
                        <img class="logo" src="images/logo.svg" alt="ShuttleSteps">
                        <span class="brand_name">ShuttleSteps</span>
                    </a></li>
                    <li class="li_with_dropdown">
                        <a href="footwork.html"><span class="heading_above_dropdown">Footwork</span><span class="nav_arrowhead"></span></a>
                        <div class="dropdown_menu" data-id="dropdown_menu_footwork">
                            <ul>
                                <li class="menu_heading"><a href="footwork.html">Footwork</a></li>
                                <li><a href="footwork.html#principles">Principles</a></li>
                                <li><a href="footwork.html#court_coverage">Court Coverage</a></li>
                            </ul>
                        </div>
                    </li>
                    <li><a href="training.html">Training</a></li>
                    <li class="li_with_dropdown">
                        <a href="strategy.html"><span class="heading_above_dropdown">Strategy</span><span class="nav_arrowhead"></span></a>
                        <div class="dropdown_menu" data-id="dropdown_menu_strategy">
                            <ul>
                                <li class="menu_heading"><a href="strategy.html">Strategy</a></li>
                                <li><a href="strategy.html#the_attack-defense_spectrum">The Attack-Defense Spectrum</a></li>
                                <li><a href="strategy.html#shot_selection">Shot Selection</a></li>
                            </ul>
                        </div>
                    </li>
                </ul>
            </nav>
        `;
    }
}

customElements.define("custom-header", CustomHeader);
