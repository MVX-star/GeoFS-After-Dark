// Create Cesium ellipse entities for each city
        cities.forEach(city => {
            const size = city.radius
                ? city.radius
                : Math.min(Math.max(Math.sqrt(city.pop) / 80, 8), 55);

            const intensity = Math.min(Math.max(city.pop / 12000000, 0.5), 2.3);
            const color = getRegionColor(city.lat, city.lon);
            city.color = color;

            city.entity = geofs.api.viewer.entities.add({
                position: Cesium.Cartesian3.fromDegrees(city.lon, city.lat, 2000),
                ellipse: {
                    semiMajorAxis: size * 1000,
                    semiMinorAxis: size * 1000,
                    material: new Cesium.ImageMaterialProperty({
                        image: glowCanvas(intensity, city.pop, color),
                        transparent: true
                    })
                }
            });

            city.brightness = 0;
        });

        // Hide lights until explicitly enabled
        cities.forEach(city => {
            if (city.entity) {
                city.entity.show = false;
            }
        });

        let afterDarkEnabled = false;
        let afterDarkBrightness = 1;
        let afterDarkAdvanced = false;

        const afterDarkTimezones = [
            -12, -11, -10, -9, -8, -7, -6, -5, -4, -3,
            -2, -1, 0, 1, 2, 3, 3.5, 4, 5, 5.5,
            5.75, 6, 7, 8, 9, 9.5, 10, 11, 12, 13
        ];

        let afterDarkSelectedTimezones = new Set();

        const AFTER_DARK_LOGO =
            "https://github.com/MVX-star/GeoFS-After-Dark/raw/main/image-removebg-preview%20(1).png";
        const AFTER_DARK_ICON =
            "https://github.com/MVX-star/GeoFS-After-Dark/raw/main/After_dark__4_-removebg-preview.png";

        function updateAfterDarkLights() {
            if (!afterDarkEnabled) {
                cities.forEach(city => {
                    if (city.entity) {
                        city.entity.show = false;
                    }
                });
                return;
            }

            if (afterDarkAdvanced) {
                cities.forEach(city => {
                    if (!city.entity) return;
                    city.entity.show = afterDarkSelectedTimezones.has(city.timezone ?? 0);
                });
                return;
            }

            cities.forEach(city => {
                if (city.entity) {
                    city.entity.show = true;
                }
            });
        }

        function toggleAfterDarkLights() {
            afterDarkEnabled = !afterDarkEnabled;

            if (afterDarkEnabled) {
                afterDarkAdvanced = false;
                if (typeof automaticCheckbox !== "undefined") {
                    automaticCheckbox.checked = false;
                }
                cities.forEach(city => {
                    if (city.entity) {
                        city.entity.show = true;
                    }
                });
            } else {
                cities.forEach(city => {
                    if (city.entity) {
                        city.entity.show = false;
                    }
                });
            }

            updateAfterDarkUI();
        }

        function formatAfterDarkTimezone(tz) {
            return "UTC" + (tz >= 0 ? "+" : "") + tz;
        }

        // UI panel construction
        const afterDarkPanel = document.createElement("div");
        afterDarkPanel.id = "afterDarkPanel";
        afterDarkPanel.className = "geofs-list geofs-toggle-panel after-dark-panel";
        afterDarkPanel.setAttribute("data-noblur", "true");
        afterDarkPanel.style.maxHeight = "90vh";
        afterDarkPanel.style.overflowY = "auto";

        const afterDarkTitle = document.createElement("div");
        const afterDarkLogo = document.createElement("img");
        afterDarkLogo.src = AFTER_DARK_LOGO;
        afterDarkLogo.alt = "GeoFS: After Dark";
        afterDarkLogo.style.width = "calc(100% + 20px)";
        afterDarkLogo.style.maxWidth = "none";
        afterDarkLogo.style.height = "auto";
        afterDarkLogo.style.display = "block";
        afterDarkLogo.style.margin = "0 auto 10px auto";
        afterDarkLogo.style.objectFit = "contain";
        afterDarkTitle.appendChild(afterDarkLogo);
        afterDarkPanel.appendChild(afterDarkTitle);

        const lightButton = document.createElement("button");
        lightButton.id = "afterDarkLightButton";
        lightButton.className = "mdl-button mdl-js-button mdl-button--raised mdl-button--colored";
        lightButton.style.width = "100%";
        lightButton.onclick = toggleAfterDarkLights;
        afterDarkPanel.appendChild(lightButton);

        const timezoneStatus = document.createElement("div");
        timezoneStatus.id = "afterDarkTimezoneStatus";
        timezoneStatus.style.marginTop = "10px";
        afterDarkPanel.appendChild(timezoneStatus);

        const searchBox = document.createElement("input");
        searchBox.type = "text";
        searchBox.placeholder = "Search city...";
        ["keydown", "keyup", "keypress"].forEach(eventName => {
            searchBox.addEventListener(eventName, event => {
                event.stopPropagation();
            }, true);
        });
        searchBox.className = "mdl-textfield__input address-input";
        searchBox.style.width = "100%";
        searchBox.style.marginTop = "10px";

        const searchResults = document.createElement("div");
        searchResults.style.maxHeight = "120px";
        searchResults.style.overflowY = "auto";
        searchResults.style.marginTop = "5px";

        searchBox.addEventListener("input", function () {
            const query = this.value.trim().toLowerCase();
            searchResults.innerHTML = "";
            if (!query) return;

            const matches = cities
                .filter(city => city.name.toLowerCase().includes(query))
                .slice(0, 6);

            matches.forEach(city => {
                const result = document.createElement("div");
                result.textContent = city.name + " (" + formatAfterDarkTimezone(city.timezone ?? 0) + ")";
                result.style.cursor = "pointer";
                result.style.padding = "5px";
                result.style.borderBottom = "1px solid rgba(255,255,255,0.1)";
                result.onclick = function () {
                    afterDarkEnabled = true;
                    afterDarkAdvanced = true;
                    afterDarkSelectedTimezones.clear();
                    afterDarkSelectedTimezones.add(city.timezone ?? 0);
                    updateAfterDarkLights();
                    updateAfterDarkUI();
                    searchBox.value = "";
                    searchResults.innerHTML = "";
                };
                searchResults.appendChild(result);
            });
        });

        afterDarkPanel.appendChild(searchBox);
        afterDarkPanel.appendChild(searchResults);

        const advancedButton = document.createElement("button");
        advancedButton.className = "mdl-button mdl-js-button mdl-button--raised";
        advancedButton.style.width = "100%";
        advancedButton.style.marginTop = "12px";
        advancedButton.textContent = "Advanced Mode";
        advancedButton.onclick = function () {
            afterDarkAdvanced = true;
            afterDarkSelectedTimezones.clear();
            refreshTimezoneCheckboxes();
            showAdvancedPanel();
        };
        afterDarkPanel.appendChild(advancedButton);

        const advancedPanel = document.createElement("div");
        advancedPanel.id = "afterDarkAdvancedPanel";
        advancedPanel.style.display = "none";
        advancedPanel.style.marginTop = "10px";

        const advancedTitle = document.createElement("h5");
        advancedTitle.textContent = "Advanced Mode";
        advancedPanel.appendChild(advancedTitle);

        const selectAll = document.createElement("button");
        selectAll.className = "mdl-button mdl-js-button mdl-button--raised";
        selectAll.textContent = "Select All";
        selectAll.onclick = function () {
            afterDarkSelectedTimezones = new Set(afterDarkTimezones);
            refreshTimezoneCheckboxes();
            afterDarkEnabled = true;
            updateAfterDarkLights();
            updateAfterDarkUI();
        };
        advancedPanel.appendChild(selectAll);

        const clearAll = document.createElement("button");
        clearAll.className = "mdl-button mdl-js-button mdl-button--raised";
        clearAll.textContent = "Clear All";
        clearAll.style.marginLeft = "5px";
        clearAll.onclick = function () {
            afterDarkSelectedTimezones.clear();
            refreshTimezoneCheckboxes();
            afterDarkEnabled = false;
            updateAfterDarkLights();
            updateAfterDarkUI();
        };
        advancedPanel.appendChild(clearAll);

        const timezoneList = document.createElement("div");
        timezoneList.style.marginTop = "10px";

        afterDarkTimezones.forEach(tz => {
            const label = document.createElement("label");
            label.style.display = "block";

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.dataset.afterDarkTimezone = tz;
            checkbox.onchange = function () {
                if (this.checked) {
                    afterDarkSelectedTimezones.add(tz);
                } else {
                    afterDarkSelectedTimezones.delete(tz);
                }
                afterDarkEnabled = afterDarkSelectedTimezones.size > 0;
                updateAfterDarkLights();
                updateAfterDarkUI();
            };

            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(" " + formatAfterDarkTimezone(tz)));
            timezoneList.appendChild(label);
        });

        advancedPanel.appendChild(timezoneList);

        const backButton = document.createElement("button");
        backButton.className = "mdl-button mdl-js-button mdl-button--raised";
        backButton.textContent = "← Back";
        backButton.style.marginTop = "10px";
        backButton.onclick = function () {
            afterDarkAdvanced = false;
            advancedPanel.style.display = "none";
            afterDarkTitle.style.display = "";
            lightButton.style.display = "";
            timezoneStatus.style.display = "";
            searchBox.style.display = "";
            searchResults.style.display = "";
            advancedButton.style.display = "";
            updateAfterDarkLights();
            updateAfterDarkUI();
        };
        advancedPanel.appendChild(backButton);
        afterDarkPanel.appendChild(advancedPanel);

        function showAdvancedPanel() {
            afterDarkTitle.style.display = "none";
            lightButton.style.display = "none";
            timezoneStatus.style.display = "none";
            searchBox.style.display = "none";
            searchResults.style.display = "none";
            advancedButton.style.display = "none";
            advancedPanel.style.display = "block";
            updateAfterDarkLights();
            updateAfterDarkUI();
        }

        function refreshTimezoneCheckboxes() {
            timezoneList
                .querySelectorAll("input[data-afterdark-timezone]")
                .forEach(checkbox => {
                    const tz = parseFloat(checkbox.dataset.afterDarkTimezone);
                    checkbox.checked = afterDarkSelectedTimezones.has(tz);
                });
        }

        function updateAfterDarkButton() {
            lightButton.textContent = afterDarkEnabled ? " LIGHTS ON" : " LIGHTS OFF";
        }

        function updateAfterDarkUI() {
            updateAfterDarkButton();
            if (afterDarkAdvanced) {
                timezoneStatus.textContent =
                    "Advanced Mode • " + afterDarkSelectedTimezones.size + " timezone(s) selected";
            } else {
                timezoneStatus.textContent = afterDarkEnabled ? "City Lights On" : "City Lights Off";
            }
        }

        const geofsLeft = document.querySelector(".geofs-ui-left");
        if (geofsLeft) {
            geofsLeft.appendChild(afterDarkPanel);
        }

        const geofsBottom = document.querySelector(".geofs-ui-bottom");
        if (geofsBottom && !document.getElementById("afterDarkButton")) {
            const afterDarkButton = document.createElement("button");
            afterDarkButton.id = "afterDarkButton";
            afterDarkButton.title = "GeoFS-After-Dark";
            afterDarkButton.className =
                "mdl-button mdl-js-button geofs-f-standard-ui geofs-mediumScreenOnly";
            afterDarkButton.setAttribute("data-toggle-panel", ".after-dark-panel");
            afterDarkButton.setAttribute("data-tooltip-classname", "mdl-tooltip--top");
            afterDarkButton.innerHTML =
                '<img src="' +
                AFTER_DARK_ICON +
                '" alt="GeoFS: After Dark" style="width:32px;height:32px;object-fit:contain;">';

            const insertPosition = geofs.version >= 3.6 ? 4 : 3;
            if (geofsBottom.children.length > insertPosition) {
                geofsBottom.insertBefore(afterDarkButton, geofsBottom.children[insertPosition]);
            } else {
                geofsBottom.appendChild(afterDarkButton);
            }
        }

        // Periodic refresh while in advanced timezone mode
        setInterval(() => {
            if (afterDarkEnabled && afterDarkAdvanced) {
                updateAfterDarkLights();
                updateAfterDarkUI();
            }
        }, 5000);

        updateAfterDarkLights();
        updateAfterDarkUI();
    }
})();
