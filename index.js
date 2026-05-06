// ==UserScript==
// @name         VRChat Website Friends Tweaks
// @namespace    https://vrchat.com/
// @version      0.1.0
// @description  Compact layout and mode switcher for the VRChat web friends sidebar/list.
// @author       Map1en
// @match        https://vrchat.com/home*
// @run-at       document-start
// @grant        GM_addStyle
// ==/UserScript==

(function () {
  "use strict";

  const STORAGE_KEY = "vrcfl.layoutMode";
  const DEFAULT_MODE = "2";
  const MODES = new Set(["1", "2", "3"]);

  const normalizeMode = (value) => (MODES.has(String(value)) ? String(value) : DEFAULT_MODE);

  const getMode = () => {
    try {
      return normalizeMode(localStorage.getItem(STORAGE_KEY) || DEFAULT_MODE);
    } catch (_) {
      return DEFAULT_MODE;
    }
  };

  const updateModeButtons = () => {
    const nextMode = document.documentElement.dataset.vrcflMode || DEFAULT_MODE;
    document.querySelectorAll(".vrcfl-mode-button").forEach((button) => {
      button.setAttribute("aria-pressed", button.dataset.mode === nextMode ? "true" : "false");
    });
  };

  const setMode = (mode) => {
    const nextMode = normalizeMode(mode);
    document.documentElement.dataset.vrcflMode = nextMode;

    try {
      localStorage.setItem(STORAGE_KEY, nextMode);
    } catch (_) {
      // Ignore storage failures; the current page still updates.
    }

    updateModeButtons();
  };

  setMode(getMode());

  const css = `
:root {
  --vrcfl-border: rgba(255, 255, 255, 0.08);
  --vrcfl-border-weak: rgba(255, 255, 255, 0.05);
  --vrcfl-muted: rgba(210, 222, 234, 0.72);
  --vrcfl-dim: rgba(210, 222, 234, 0.56);
  --vrcfl-title-size: 18px;
}

html[data-vrcfl-mode="2"] {
  --vrcfl-card-gap: 3px;
  --vrcfl-card-pad-x: 7px;
  --vrcfl-card-pad-y: 4px;
  --vrcfl-avatar-size: 36px;
  --vrcfl-location-pad-x: 0px;
  --vrcfl-location-pad-y: 0px;
  --vrcfl-name-size: 13px;
  --vrcfl-status-size: 11px;
  --vrcfl-location-size: 12px;
  --vrcfl-button-size: 11px;
  --vrcfl-count-width: 31px;
}

html[data-vrcfl-mode="3"] {
  --vrcfl-card-gap: 2px;
  --vrcfl-card-pad-x: 5px;
  --vrcfl-card-pad-y: 3px;
  --vrcfl-avatar-size: 30px;
  --vrcfl-location-pad-x: 0px;
  --vrcfl-location-pad-y: 0px;
  --vrcfl-name-size: 12px;
  --vrcfl-status-size: 11px;
  --vrcfl-location-size: 11px;
  --vrcfl-button-size: 11px;
  --vrcfl-count-width: 23px;
}

.vrcfl-toolbar {
  display: grid !important;
  grid-template-columns: minmax(0, 1fr) 76px 38px !important;
  align-items: center !important;
  gap: 5px !important;
}

.vrcfl-toolbar > :first-child {
  grid-column: 1 / -1 !important;
  min-height: 28px !important;
  margin-bottom: 0 !important;
}

.vrcfl-toolbar > :first-child > div:first-child {
  width: 24px !important;
  height: 24px !important;
  flex: 0 0 24px !important;
}

.vrcfl-toolbar > :first-child > div:first-child svg {
  width: 24px !important;
  height: 24px !important;
}

:where(html[data-vrcfl-mode="2"], html[data-vrcfl-mode="3"]) [aria-label="Friends Total"] {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  min-width: 0 !important;
  font-size: var(--vrcfl-title-size) !important;
  font-weight: 500 !important;
  line-height: 24px !important;
}

:where(html[data-vrcfl-mode="2"], html[data-vrcfl-mode="3"]) [aria-label="Friends Total"] span {
  font-size: inherit !important;
  line-height: inherit !important;
}

:where(html[data-vrcfl-mode="2"], html[data-vrcfl-mode="3"]) [aria-label="Friends Total"] svg {
  width: 14px !important;
  height: 14px !important;
  margin-left: 5px !important;
}

.vrcfl-search {
  min-width: 0 !important;
  margin: 0 !important;
}

.vrcfl-search input[aria-label="Search Friends"] {
  width: 100% !important;
  min-height: 30px !important;
  height: 30px !important;
  padding: 3px 9px !important;
  font-size: 14px !important;
}

.vrcfl-sort {
  width: 76px !important;
  min-width: 76px !important;
  max-width: 76px !important;
  height: 30px !important;
  min-height: 30px !important;
  margin: 0 !important;
  overflow: visible !important;
}

.vrcfl-sort > div,
.vrcfl-sort button > div {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  min-height: 30px !important;
  height: 30px !important;
  min-width: 0 !important;
}

.vrcfl-sort button {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  gap: 3px !important;
  width: 76px !important;
  min-height: 30px !important;
  height: 30px !important;
  padding: 0 6px !important;
  overflow: hidden !important;
}

.vrcfl-sort button > div > div:first-child {
  display: none !important;
}

.vrcfl-sort [role="note"] {
  display: block !important;
  min-width: 0 !important;
  font-size: 12px !important;
  line-height: 14px !important;
  text-align: center !important;
  text-overflow: ellipsis !important;
  white-space: nowrap !important;
  overflow: hidden !important;
}

.vrcfl-sort svg {
  width: 8px !important;
  min-width: 8px !important;
  height: 8px !important;
  margin-left: 0 !important;
}

.vrcfl-settings {
  position: relative !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

.vrcfl-settings-button {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  width: 38px !important;
  height: 30px !important;
  padding: 0 !important;
  border: 1px solid #0bbbd3 !important;
  border-radius: 5px !important;
  background: rgba(11, 187, 211, 0.16) !important;
  color: #d2f6fb !important;
  font-size: 12px !important;
  font-weight: 700 !important;
  line-height: 1 !important;
}

.vrcfl-settings-menu {
  position: absolute !important;
  top: calc(100% + 5px) !important;
  right: 0 !important;
  z-index: 2147483646 !important;
  display: none !important;
  min-width: 142px !important;
  padding: 5px !important;
  border: 1px solid rgba(31, 209, 237, 0.28) !important;
  border-radius: 7px !important;
  background: #0b0f12 !important;
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.42) !important;
}

.vrcfl-settings[data-open="true"] .vrcfl-settings-menu {
  display: grid !important;
  gap: 3px !important;
}

.vrcfl-mode-button {
  width: 100% !important;
  padding: 5px 8px !important;
  border: 0 !important;
  border-radius: 5px !important;
  background: transparent !important;
  color: var(--vrcfl-muted) !important;
  font-size: 12px !important;
  line-height: 16px !important;
  text-align: left !important;
}

.vrcfl-mode-button:hover,
.vrcfl-mode-button[aria-pressed="true"] {
  background: rgba(31, 209, 237, 0.14) !important;
  color: #f8f9fa !important;
}

:where(html[data-vrcfl-mode="2"], html[data-vrcfl-mode="3"]) [role="list"][aria-label="Friends List"] {
  gap: var(--vrcfl-card-gap) !important;
  padding: 3px 4px 10px !important;
}

:where(html[data-vrcfl-mode="2"], html[data-vrcfl-mode="3"]) [role="list"][aria-label="Friends List"] .vrcfl-section-spacer {
  display: block !important;
  flex: 0 0 var(--vrcfl-spacer-height, 0px) !important;
  height: var(--vrcfl-spacer-height, 0px) !important;
  min-height: var(--vrcfl-spacer-height, 0px) !important;
  margin: 0 !important;
  padding: 0 !important;
  border: 0 !important;
  opacity: 0 !important;
  pointer-events: none !important;
}

:where(html[data-vrcfl-mode="2"], html[data-vrcfl-mode="3"]) [role="list"][aria-label="Friends List"] > div:not([role="listitem"]) {
  min-height: 20px !important;
  margin: 4px 0 2px !important;
  padding: 1px 5px !important;
  border-radius: 5px !important;
  color: var(--vrcfl-muted) !important;
  font-size: 13px !important;
  line-height: 18px !important;
}

:where(html[data-vrcfl-mode="2"], html[data-vrcfl-mode="3"]) [role="list"][aria-label="Friends List"] > div:not([role="listitem"]) svg {
  width: 10px !important;
  height: 10px !important;
  margin-right: 4px !important;
}

:where(html[data-vrcfl-mode="2"], html[data-vrcfl-mode="3"]) [role="list"][aria-label="Friends List"] [role="listitem"][aria-label="User Card"] {
  min-height: 0 !important;
  margin: 0 0 var(--vrcfl-card-gap) !important;
  padding: var(--vrcfl-card-pad-y) var(--vrcfl-card-pad-x) !important;
  border: 1px solid var(--vrcfl-border-weak) !important;
  border-radius: 7px !important;
  background: rgba(14, 16, 19, 0.5) !important;
  box-shadow: none !important;
}

:where(html[data-vrcfl-mode="2"], html[data-vrcfl-mode="3"]) [role="list"][aria-label="Friends List"] [role="listitem"][aria-label="User Card"]:hover {
  background: rgba(31, 209, 237, 0.07) !important;
  border-color: rgba(31, 209, 237, 0.16) !important;
}

:where(html[data-vrcfl-mode="2"], html[data-vrcfl-mode="3"]) [role="list"][aria-label="Friends List"] [role="listitem"][aria-label="User Card"] > div:first-child {
  display: grid !important;
  grid-template-columns: var(--vrcfl-avatar-size) minmax(0, 1fr) !important;
  align-items: center !important;
  gap: 0 8px !important;
  min-width: 0 !important;
}

:where(html[data-vrcfl-mode="2"], html[data-vrcfl-mode="3"]) [role="list"][aria-label="Friends List"] a[aria-label="User Image"] {
  width: var(--vrcfl-avatar-size) !important;
  min-width: var(--vrcfl-avatar-size) !important;
  height: var(--vrcfl-avatar-size) !important;
  min-height: var(--vrcfl-avatar-size) !important;
  border-radius: 6px !important;
  overflow: hidden !important;
}

:where(html[data-vrcfl-mode="2"], html[data-vrcfl-mode="3"]) [role="list"][aria-label="Friends List"] a[aria-label="User Image"] > div:last-child {
  width: var(--vrcfl-avatar-size) !important;
  height: var(--vrcfl-avatar-size) !important;
  min-height: var(--vrcfl-avatar-size) !important;
  border-radius: 6px !important;
  background-size: cover !important;
  background-position: center !important;
}

:where(html[data-vrcfl-mode="2"], html[data-vrcfl-mode="3"]) [role="list"][aria-label="Friends List"] a[aria-label="User Image"] > div:first-child {
  font-size: 0 !important;
}

:where(html[data-vrcfl-mode="2"], html[data-vrcfl-mode="3"]) [role="list"][aria-label="Friends List"] [role="group"][aria-label="User Info"] {
  display: grid !important;
  grid-template-columns: minmax(0, 1fr) !important;
  align-items: center !important;
  row-gap: 0 !important;
  min-width: 0 !important;
}

:where(html[data-vrcfl-mode="2"], html[data-vrcfl-mode="3"]) [role="list"][aria-label="Friends List"] [role="group"][aria-label="User Info"] > div:first-child {
  display: flex !important;
  align-items: center !important;
  gap: 5px !important;
  min-width: 0 !important;
  overflow: visible !important;
}

:where(html[data-vrcfl-mode="2"], html[data-vrcfl-mode="3"]) [role="list"][aria-label="Friends List"] [role="group"][aria-label="User Info"] a[href*="/home/user/"] {
  min-width: 0 !important;
  max-width: 100% !important;
  overflow: hidden !important;
  color: #f8f9fa !important;
  font-size: var(--vrcfl-name-size) !important;
  font-weight: 700 !important;
  line-height: calc(var(--vrcfl-name-size) + 4px) !important;
  text-overflow: ellipsis !important;
  white-space: nowrap !important;
}

:where(html[data-vrcfl-mode="2"], html[data-vrcfl-mode="3"]) [role="list"][aria-label="Friends List"] [role="note"][aria-label^="User Status:"] {
  width: 8px !important;
  min-width: 8px !important;
  height: 8px !important;
  min-height: 8px !important;
  margin-right: 0 !important;
}

:where(html[data-vrcfl-mode="2"], html[data-vrcfl-mode="3"]) [role="list"][aria-label="Friends List"] [role="note"][aria-label="User World Location"] {
  display: none !important;
}

:where(html[data-vrcfl-mode="2"], html[data-vrcfl-mode="3"]) [role="list"][aria-label="Friends List"] [aria-label="User Status Description"] {
  max-width: 100% !important;
  overflow: hidden !important;
  color: var(--vrcfl-dim) !important;
  font-size: var(--vrcfl-status-size) !important;
  line-height: calc(var(--vrcfl-status-size) + 4px) !important;
  text-align: left !important;
  text-overflow: ellipsis !important;
  white-space: nowrap !important;
}

:where(html[data-vrcfl-mode="2"], html[data-vrcfl-mode="3"]) [role="list"][aria-label="Friends List"] [role="group"][aria-label="User Info"] > [role="note"]:not([aria-label^="User Status:"]):not([aria-label="User World Location"]) {
  max-width: 100% !important;
  overflow: hidden !important;
  color: var(--vrcfl-dim) !important;
  font-size: var(--vrcfl-status-size) !important;
  line-height: calc(var(--vrcfl-status-size) + 4px) !important;
  text-overflow: ellipsis !important;
  white-space: nowrap !important;
}

:where(html[data-vrcfl-mode="2"], html[data-vrcfl-mode="3"]) [role="list"][aria-label="Friends List"] [role="group"][aria-label="User Location Info"] {
  margin-top: 0 !important;
  margin-left: calc(var(--vrcfl-avatar-size) + 8px) !important;
  padding: 0 !important;
  border: 0 !important;
  background: transparent !important;
  box-shadow: none !important;
}

:where(html[data-vrcfl-mode="2"], html[data-vrcfl-mode="3"]) [role="list"][aria-label="Friends List"] [role="group"][aria-label="User Location Info"] > div {
  display: block !important;
  width: 100% !important;
  min-height: 0 !important;
  min-width: 0 !important;
  margin: 0 !important;
  padding: var(--vrcfl-location-pad-y) var(--vrcfl-location-pad-x) 0 !important;
  border: 0 !important;
  outline: 0 !important;
  border-radius: 0 !important;
  background: transparent !important;
  box-shadow: none !important;
}

:where(html[data-vrcfl-mode="2"], html[data-vrcfl-mode="3"]) [role="list"][aria-label="Friends List"] [role="group"][aria-label="User Location Info"] a[href*="/home/launch"][url] {
  display: none !important;
}

:where(html[data-vrcfl-mode="2"], html[data-vrcfl-mode="3"]) [role="list"][aria-label="Friends List"] [role="group"][aria-label="User Location Info"] a[href*="/home/launch"][url] > div {
  font-size: 0 !important;
  line-height: 0 !important;
}

:where(html[data-vrcfl-mode="2"], html[data-vrcfl-mode="3"]) [role="list"][aria-label="Friends List"] [role="group"][aria-label="User Location Info"] .flex-grow-1 {
  display: grid !important;
  grid-template-columns: auto auto auto minmax(0, 1fr) auto !important;
  grid-template-areas:
    "world world world world invite"
    "count region type spacer invite" !important;
  align-items: center !important;
  gap: 0 6px !important;
  min-width: 0 !important;
  min-height: 0 !important;
}

:where(html[data-vrcfl-mode="2"], html[data-vrcfl-mode="3"]) [role="list"][aria-label="Friends List"] [role="group"][aria-label="User Location Info"] .flex-grow-1 > div:first-child,
:where(html[data-vrcfl-mode="2"], html[data-vrcfl-mode="3"]) [role="list"][aria-label="Friends List"] [role="group"][aria-label="User Location Info"] .flex-grow-1 > div:last-child {
  display: contents !important;
}

:where(html[data-vrcfl-mode="2"], html[data-vrcfl-mode="3"]) [role="list"][aria-label="Friends List"] a[aria-label="Location Link"] {
  min-width: 0 !important;
  max-width: 100% !important;
  overflow: hidden !important;
  color: #c9f2f7 !important;
  font-size: var(--vrcfl-location-size) !important;
  font-weight: 400 !important;
  line-height: calc(var(--vrcfl-location-size) + 3px) !important;
  text-overflow: ellipsis !important;
  white-space: nowrap !important;
  grid-area: world !important;
  display: block !important;
}

:where(html[data-vrcfl-mode="2"], html[data-vrcfl-mode="3"]) [role="list"][aria-label="Friends List"] [role="note"][aria-label="Friends in the instance"] {
  display: inline-flex !important;
  grid-area: count !important;
  align-self: center !important;
  justify-self: start !important;
  align-items: center !important;
  justify-content: center !important;
  box-sizing: border-box !important;
  width: var(--vrcfl-count-width) !important;
  min-width: var(--vrcfl-count-width) !important;
  max-width: var(--vrcfl-count-width) !important;
  height: 14px !important;
  margin-top: 0 !important;
  margin-left: 10px !important;
  padding: 1px 4px !important;
  border: 1px solid rgba(210, 222, 234, 0.08) !important;
  border-radius: 4px !important;
  background-color: rgba(255, 255, 255, 0.035) !important;
  background-image: none !important;
  color: rgba(210, 222, 234, 0.58) !important;
  box-shadow: none !important;
  font-size: 10px !important;
  font-weight: 400 !important;
  line-height: 12px !important;
  white-space: nowrap !important;
  overflow: hidden !important;
}

:where(html[data-vrcfl-mode="2"], html[data-vrcfl-mode="3"]) [role="list"][aria-label="Friends List"] [role="note"][aria-label="Friends in the instance"] svg {
  width: 10px !important;
  height: 10px !important;
  min-width: 10px !important;
  margin-left: 2px !important;
  opacity: 0.72 !important;
}

:where(html[data-vrcfl-mode="2"], html[data-vrcfl-mode="3"]) [role="list"][aria-label="Friends List"] [aria-label="Region Badge"] {
  grid-area: region !important;
  align-self: center !important;
  justify-self: start !important;
}

:where(html[data-vrcfl-mode="2"], html[data-vrcfl-mode="3"]) [role="list"][aria-label="Friends List"] [aria-label="Region Badge"] img {
  width: 16px !important;
  height: 10px !important;
  border-radius: 1px !important;
  object-fit: contain !important;
}

html[data-vrcfl-mode="3"] [role="list"][aria-label="Friends List"] [aria-label="User Status Description"] {
  display: none !important;
}

:where(html[data-vrcfl-mode="2"], html[data-vrcfl-mode="3"]) [role="list"][aria-label="Friends List"] [role="note"][aria-label="Instance Type"] {
  grid-area: type !important;
  align-self: center !important;
  justify-self: end !important;
  color: var(--vrcfl-muted) !important;
  font-size: var(--vrcfl-status-size) !important;
  line-height: calc(var(--vrcfl-status-size) + 4px) !important;
  white-space: nowrap !important;
}

:where(html[data-vrcfl-mode="2"], html[data-vrcfl-mode="3"]) [role="list"][aria-label="Friends List"] [role="group"][aria-label="User Location Info"] button {
  grid-area: invite !important;
  align-self: center !important;
  justify-self: end !important;
  min-height: 22px !important;
  padding: 1px 7px !important;
  border-color: rgba(31, 209, 237, 0.3) !important;
  border-radius: 5px !important;
  background: rgba(31, 209, 237, 0.035) !important;
  color: rgba(134, 230, 244, 0.56) !important;
  box-shadow: none !important;
  font-size: var(--vrcfl-button-size) !important;
  line-height: calc(var(--vrcfl-button-size) + 4px) !important;
  opacity: 0.68 !important;
  transition: background 120ms ease, border-color 120ms ease, color 120ms ease, opacity 120ms ease !important;
  white-space: nowrap !important;
}

:where(html[data-vrcfl-mode="2"], html[data-vrcfl-mode="3"]) [role="list"][aria-label="Friends List"] [role="listitem"][aria-label="User Card"]:hover [role="group"][aria-label="User Location Info"] button,
:where(html[data-vrcfl-mode="2"], html[data-vrcfl-mode="3"]) [role="list"][aria-label="Friends List"] [role="group"][aria-label="User Location Info"] button:focus-visible {
  border-color: rgba(31, 209, 237, 0.95) !important;
  background: rgba(31, 209, 237, 0.11) !important;
  color: #28ddf4 !important;
  opacity: 1 !important;
}

html[data-vrcfl-mode="3"] [role="list"][aria-label="Friends List"] [role="group"][aria-label="User Location Info"] .flex-grow-1 {
  grid-template-columns: minmax(0, 1fr) auto auto auto auto !important;
  grid-template-areas: "world count region type invite" !important;
  gap: 0 5px !important;
}

html[data-vrcfl-mode="3"] [role="list"][aria-label="Friends List"] [role="group"][aria-label="User Location Info"] button {
  min-height: 20px !important;
  padding: 0 6px !important;
}

:where(html[data-vrcfl-mode="2"], html[data-vrcfl-mode="3"]) [role="list"][aria-label="Friends List"] [role="listitem"][aria-label="User Card"] {
  display: grid !important;
  grid-template-columns: var(--vrcfl-avatar-size) minmax(0, 1fr) auto auto auto auto !important;
  grid-template-areas:
    "avatar identity identity identity identity invite"
    "avatar world world world world invite"
    "avatar count region type spacer invite" !important;
  align-items: center !important;
  column-gap: 7px !important;
  row-gap: 0 !important;
}

:where(html[data-vrcfl-mode="2"], html[data-vrcfl-mode="3"]) [role="list"][aria-label="Friends List"] [role="listitem"][aria-label="User Card"] > div:first-child,
:where(html[data-vrcfl-mode="2"], html[data-vrcfl-mode="3"]) [role="list"][aria-label="Friends List"] [role="listitem"][aria-label="User Card"] > div:first-child > div:first-child,
:where(html[data-vrcfl-mode="2"], html[data-vrcfl-mode="3"]) [role="list"][aria-label="Friends List"] [role="group"][aria-label="User Location Info"],
:where(html[data-vrcfl-mode="2"], html[data-vrcfl-mode="3"]) [role="list"][aria-label="Friends List"] [role="group"][aria-label="User Location Info"] > div,
:where(html[data-vrcfl-mode="2"], html[data-vrcfl-mode="3"]) [role="list"][aria-label="Friends List"] [role="group"][aria-label="User Location Info"] .flex-grow-1,
:where(html[data-vrcfl-mode="2"], html[data-vrcfl-mode="3"]) [role="list"][aria-label="Friends List"] [role="group"][aria-label="User Location Info"] .flex-grow-1 > div {
  display: contents !important;
}

:where(html[data-vrcfl-mode="2"], html[data-vrcfl-mode="3"]) [role="list"][aria-label="Friends List"] [role="group"][aria-label="User Location Info"] .align-items-center:has(> [aria-label="Region Badge"]):has(> [role="note"][aria-label="Instance Type"]) {
  display: inline-flex !important;
  grid-column: 3 / -1 !important;
  grid-row: 3 !important;
  align-self: center !important;
  justify-self: end !important;
  align-items: center !important;
  justify-content: flex-end !important;
  gap: 6px !important;
  min-width: 0 !important;
  margin-left: auto !important;
}

:where(html[data-vrcfl-mode="2"], html[data-vrcfl-mode="3"]) [role="list"][aria-label="Friends List"] a[aria-label="User Image"] {
  grid-area: avatar !important;
  align-self: start !important;
}

:where(html[data-vrcfl-mode="2"], html[data-vrcfl-mode="3"]) [role="list"][aria-label="Friends List"] [role="group"][aria-label="User Info"] {
  grid-area: identity !important;
  align-self: end !important;
}

:where(html[data-vrcfl-mode="2"], html[data-vrcfl-mode="3"]) [role="list"][aria-label="Friends List"] a[aria-label="Location Link"] {
  grid-area: world !important;
  align-self: center !important;
}

:where(html[data-vrcfl-mode="2"], html[data-vrcfl-mode="3"]) [role="list"][aria-label="Friends List"] [role="note"][aria-label="Friends in the instance"] {
  grid-area: count !important;
}

:where(html[data-vrcfl-mode="2"], html[data-vrcfl-mode="3"]) [role="list"][aria-label="Friends List"] [aria-label="Region Badge"] {
  grid-area: region !important;
}

:where(html[data-vrcfl-mode="2"], html[data-vrcfl-mode="3"]) [role="list"][aria-label="Friends List"] [role="note"][aria-label="Instance Type"] {
  grid-area: type !important;
}

:where(html[data-vrcfl-mode="2"], html[data-vrcfl-mode="3"]) [role="list"][aria-label="Friends List"] [role="group"][aria-label="User Location Info"] button {
  grid-area: invite !important;
  align-self: center !important;
}

html[data-vrcfl-mode="3"] [role="list"][aria-label="Friends List"] [role="listitem"][aria-label="User Card"] {
  grid-template-columns: var(--vrcfl-avatar-size) minmax(0, 1fr) var(--vrcfl-count-width) 153px !important;
  grid-template-areas:
    "avatar identity identity meta"
    "avatar world count meta" !important;
  column-gap: 5px !important;
}

html[data-vrcfl-mode="3"] [role="list"][aria-label="Friends List"] [role="group"][aria-label="User Location Info"] .align-items-center:has(> [aria-label="Region Badge"]):has(> [role="note"][aria-label="Instance Type"]) {
  display: inline-flex !important;
  grid-area: meta !important;
  grid-column: auto !important;
  grid-row: auto !important;
  align-self: center !important;
  justify-self: end !important;
  align-items: center !important;
  justify-content: flex-end !important;
  gap: 6px !important;
  min-width: 0 !important;
  margin-left: 0 !important;
}

html[data-vrcfl-mode="3"] [role="list"][aria-label="Friends List"] [aria-label="Region Badge"] {
  grid-area: auto !important;
  flex: 0 0 16px !important;
}

html[data-vrcfl-mode="3"] [role="list"][aria-label="Friends List"] [role="note"][aria-label="Instance Type"] {
  grid-area: auto !important;
  flex: 0 0 63px !important;
  min-width: 0 !important;
  overflow: hidden !important;
  text-align: left !important;
  text-overflow: ellipsis !important;
  white-space: nowrap !important;
}

html[data-vrcfl-mode="3"] [role="list"][aria-label="Friends List"] [role="group"][aria-label="User Location Info"] button {
  grid-area: auto !important;
  flex: 0 0 63px !important;
}

@media (max-width: 900px) {
  .vrcfl-toolbar {
    grid-template-columns: minmax(0, 1fr) 72px 36px !important;
    gap: 5px !important;
  }

  .vrcfl-sort {
    width: 72px !important;
    min-width: 72px !important;
    max-width: 72px !important;
  }

  .vrcfl-sort button {
    width: 72px !important;
  }

  :where(html[data-vrcfl-mode="2"], html[data-vrcfl-mode="3"]) [role="list"][aria-label="Friends List"] [role="group"][aria-label="User Info"] {
    grid-template-columns: minmax(0, 1fr) !important;
  }

  :where(html[data-vrcfl-mode="2"], html[data-vrcfl-mode="3"]) [role="list"][aria-label="Friends List"] [aria-label="User Status Description"] {
    max-width: 100% !important;
    text-align: left !important;
  }
}
`;

  if (typeof GM_addStyle === "function") {
    GM_addStyle(css);
  } else {
    const style = document.createElement("style");
    style.textContent = css;
    document.documentElement.appendChild(style);
  }

  const findCommonParent = (first, second) => {
    let node = first;
    while (node && node !== document.body) {
      if (node.contains(second)) {
        return node;
      }
      node = node.parentElement;
    }
    return null;
  };

  const makeModeButton = (mode, label) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "vrcfl-mode-button";
    button.dataset.mode = mode;
    button.textContent = label;
    button.setAttribute("aria-pressed", document.documentElement.dataset.vrcflMode === mode ? "true" : "false");
    button.addEventListener("click", () => {
      setMode(mode);
      button.closest(".vrcfl-settings")?.setAttribute("data-open", "false");
    });
    return button;
  };

  const createSettings = () => {
    const wrapper = document.createElement("div");
    wrapper.className = "vrcfl-settings";
    wrapper.setAttribute("data-open", "false");

    const trigger = document.createElement("button");
    trigger.type = "button";
    trigger.className = "vrcfl-settings-button";
    trigger.textContent = "Set";
    trigger.title = "Friends list layout";
    trigger.setAttribute("aria-label", "Friends list layout");
    trigger.addEventListener("click", (event) => {
      event.stopPropagation();
      wrapper.setAttribute("data-open", wrapper.getAttribute("data-open") === "true" ? "false" : "true");
    });

    const menu = document.createElement("div");
    menu.className = "vrcfl-settings-menu";
    menu.setAttribute("role", "menu");

    menu.append(
      makeModeButton("1", "1 Original"),
      makeModeButton("2", "2 Medium"),
      makeModeButton("3", "3 Small")
    );

    wrapper.append(trigger, menu);
    return wrapper;
  };

  let preloadSpacerFrame = 0;
  let preloadSpacerTimer = 0;
  let preloadSpacerInstalled = false;

  const isFriendCard = (node) => node?.getAttribute?.("role") === "listitem";
  const isSectionHeader = (node) => node && !isFriendCard(node) && !node.classList?.contains("vrcfl-section-spacer");

  const findFriendsScrollParent = (node) => {
    let current = node?.parentElement || null;
    while (current && current !== document.body) {
      const style = window.getComputedStyle(current);
      if (/(auto|scroll)/.test(style.overflowY)) {
        return current;
      }
      current = current.parentElement;
    }
    return null;
  };

  const getMeasuredCardPitch = (cards) => {
    if (cards.length >= 2) {
      const first = cards[0].getBoundingClientRect();
      const second = cards[1].getBoundingClientRect();
      const pitch = Math.round(second.top - first.top);
      if (pitch > 0) {
        return pitch;
      }
    }

    if (cards.length === 1) {
      return Math.max(45, Math.round(cards[0].getBoundingClientRect().height + 4));
    }

    return 72;
  };

  const removePreloadSpacer = () => {
    document.querySelectorAll('[role="list"][aria-label="Friends List"] > .vrcfl-section-spacer').forEach((spacer) => {
      spacer.remove();
    });
  };

  const installPreloadSpacer = () => {
    preloadSpacerFrame = 0;

    if (preloadSpacerInstalled) {
      return;
    }

    const list = document.querySelector('[role="list"][aria-label="Friends List"]');
    if (!list) {
      return;
    }

    const children = [...list.children];
    const firstHeaderIndex = children.findIndex(isSectionHeader);
    if (firstHeaderIndex < 0) {
      return;
    }

    const nextHeaderIndex = children.findIndex((child, index) => index > firstHeaderIndex && isSectionHeader(child));
    if (nextHeaderIndex < 0) {
      return;
    }

    const nextHeader = children[nextHeaderIndex];
    const sectionCards = children.slice(firstHeaderIndex + 1, nextHeaderIndex).filter(isFriendCard);
    if (sectionCards.length <= 0) {
      return;
    }

    const pitch = getMeasuredCardPitch(sectionCards);
    const spacer = document.createElement("div");
    spacer.className = "vrcfl-section-spacer";
    spacer.setAttribute("aria-hidden", "true");
    spacer.style.setProperty("--vrcfl-spacer-height", `${20 * pitch}px`);
    list.insertBefore(spacer, nextHeader);
    preloadSpacerInstalled = true;

    const scrollParent = findFriendsScrollParent(list);
    if (scrollParent) {
      const originalScrollTop = scrollParent.scrollTop;
      window.requestAnimationFrame(() => {
        const maxScrollTop = Math.max(0, scrollParent.scrollHeight - scrollParent.clientHeight);
        if (maxScrollTop <= 0) {
          return;
        }

        scrollParent.scrollTop = Math.min(maxScrollTop, originalScrollTop + Math.max(24, Math.round(pitch / 2)));
        scrollParent.dispatchEvent(new Event("scroll", { bubbles: true }));

        window.requestAnimationFrame(() => {
          scrollParent.scrollTop = Math.min(originalScrollTop, Math.max(0, scrollParent.scrollHeight - scrollParent.clientHeight));
          scrollParent.dispatchEvent(new Event("scroll", { bubbles: true }));
        });
      });
    }

    window.clearTimeout(preloadSpacerTimer);
    preloadSpacerTimer = window.setTimeout(removePreloadSpacer, 1500);
  };

  const schedulePreloadSpacer = () => {
    if (preloadSpacerFrame || preloadSpacerInstalled) {
      return;
    }
    preloadSpacerFrame = window.requestAnimationFrame(installPreloadSpacer);
  };

  const installControls = () => {
    const searchInput = document.querySelector('input[aria-label="Search Friends"]');
    const sortSelect = document.querySelector('[role="combobox"][aria-label="Sort By"]');
    if (!searchInput || !sortSelect) {
      return false;
    }

    const searchWrap = searchInput.parentElement;
    const toolbar = findCommonParent(searchWrap, sortSelect);
    if (!searchWrap || !toolbar) {
      return false;
    }

    toolbar.classList.add("vrcfl-toolbar");
    searchWrap.classList.add("vrcfl-search");
    sortSelect.classList.add("vrcfl-sort");

    if (!toolbar.querySelector(":scope > .vrcfl-settings")) {
      toolbar.insertBefore(createSettings(), sortSelect.nextSibling);
    }

    updateModeButtons();
    schedulePreloadSpacer();
    return true;
  };

  window.setInterval(installControls, 1200);
  document.addEventListener("click", () => {
    document.querySelectorAll(".vrcfl-settings[data-open='true']").forEach((settings) => {
      settings.setAttribute("data-open", "false");
    });
  });
})();
