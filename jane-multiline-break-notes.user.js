// ==UserScript==
// @name        JaneApp - Multiline break notes
// @description Preserves line breaks when adding notes to a break on the Jane schedule. Without this, all lines run together into a single line.
// @match       https://*.janeapp.com/admin*
// ==/UserScript==

const style = document.createElement('style');
style.textContent = `
  .event-inner.break .inner-padding .time + div {
    white-space: pre-line;
  }
`;
document.head.appendChild(style);
