// ==UserScript==
// @name         JaneApp - Multiline break notes
// @version      1.1
// @author       werpswerps
// @match        https://*.janeapp.com/admin*
// @description  Preserves line breaks when adding notes to a break on the Jane schedule. Without this, all lines run together into a single line.
// @grant        none
// ==/UserScript==

const style = document.createElement('style');
style.textContent = `
  .event-inner.break .inner-padding .time + div {
    white-space: pre-line;
  }
`;
document.head.appendChild(style);
