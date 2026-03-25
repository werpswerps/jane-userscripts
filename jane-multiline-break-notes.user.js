// ==UserScript==
// @name         JaneApp - Multiline break notes
// @version      1.2
// @author       werpswerps
// @match        https://*.janeapp.com/admin*
// @updateURL    https://raw.githubusercontent.com/werpswerps/jane-userscripts/refs/heads/main/jane-multiline-break-notes.user.js
// @downloadURL  https://raw.githubusercontent.com/werpswerps/jane-userscripts/refs/heads/main/jane-multiline-break-notes.user.js
// @description  Preserves line breaks when adding notes to a break on the Jane schedule. Without this, all lines run together into a single line.
// @grant        none
// ==/UserScript==

// Bug:   Notes added to schedule breaks display as a single run-on line on the calendar.
// Cause: The notes container div has no white-space property set, so the browser collapses newlines.
// Fix:   Injects CSS setting white-space: pre-line on the notes div adjacent to .time.

const style = document.createElement("style");
style.textContent = `
  .event-inner.break .inner-padding .time + div {
    white-space: pre-line;
  }
`;
document.head.appendChild(style);
