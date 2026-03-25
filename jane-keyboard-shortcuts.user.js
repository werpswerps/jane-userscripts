// ==UserScript==
// @name         Jane – Keyboard Shortcuts
// @version      1.6
// @author       werpswerps
// @match        https://*.janeapp.com/*
// @description  Adds keyboard shortcuts for navigating to the Day view (Shift+0), Settings (Shift+,), toggling Break mode (Shift+B), and pausing/resuming (Cmd+Shift+M) or finishing (Cmd+Shift+F) AI Scribe recording. Also injects a Custom Shortcuts reference into Jane's built-in keyboard shortcuts popup (Shift+?). AI Scribe shortcuts are labeled with a sparkles icon in the popup.
// @grant        none
// ==/UserScript==

// ── Keyboard shortcut handlers ──────────────────────────────────────────────

window.addEventListener('keydown', function (e) {
  if (document.activeElement && (document.activeElement.tagName === 'INPUT' ||
      document.activeElement.tagName === 'TEXTAREA')) return;

  // Shift + 0 → Day
  if (e.shiftKey && !e.metaKey && !e.ctrlKey && e.key === ')') {
    e.preventDefault();
    var dayLink = document.querySelector('a[href="/admin#today"]');
    if (dayLink) dayLink.click();
    else window.location.href = '/admin#today';
  }

  // Shift + , → Settings
  if (e.shiftKey && !e.metaKey && !e.ctrlKey && e.key === '<') {
    e.preventDefault();
    var settingsLink = document.querySelector('a[data-tab-label="nav-btn-settings"]');
    if (settingsLink) settingsLink.click();
    else window.location.href = '/admin/company';
  }

  // Cmd + Shift + M → Pause/Resume AI Scribe recording
  if (e.shiftKey && e.metaKey && !e.ctrlKey && e.key === 'm') {
    e.preventDefault();
    var notice = document.getElementById('patient-recordings-global-notice');
    if (!notice) return;
    var scribeBtn = Array.from(notice.querySelectorAll('button'))
      .find(function (b) { return b.textContent.trim() === 'Pause' || b.textContent.trim() === 'Resume'; });
    if (scribeBtn) scribeBtn.click();
  }

  // Cmd + Shift + F → Finish AI Scribe recording
  if (e.shiftKey && e.metaKey && !e.ctrlKey && e.key === 'f') {
    e.preventDefault();
    var noticeFinish = document.getElementById('patient-recordings-global-notice');
    if (!noticeFinish) return;
    var finishBtn = Array.from(noticeFinish.querySelectorAll('button'))
      .find(function (b) { return b.textContent.trim() === 'Finish'; });
    if (finishBtn) finishBtn.click();
  }

  // Shift + B → Toggle Break mode
  if (e.shiftKey && !e.metaKey && !e.ctrlKey && e.key === 'B') {
    e.preventDefault();
    var breakBtn = document.querySelector('#user-list-bottom button') || document.querySelector('button[aria-label="Break"]');
    if (breakBtn) breakBtn.click();
  }

});

// ── Inject custom shortcuts into the keyboard shortcuts modal ────────────────

var sparkles = '<svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="sparkles"' +
  ' class="svg-inline--fa fa-sparkles" style="width:0.875em;margin-right:4px;vertical-align:-0.1em;"' +
  ' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">' +
  '<path fill="currentColor" d="M327.5 85.2c-4.5 1.7-7.5 6-7.5 10.8s3 9.1 7.5 10.8L384 128l21.2 56.5' +
  'c1.7 4.5 6 7.5 10.8 7.5s9.1-3 10.8-7.5L448 128l56.5-21.2c4.5-1.7 7.5-6 7.5-10.8s-3-9.1-7.5-10.8L448 64' +
  ' 426.8 7.5C425.1 3 420.8 0 416 0s-9.1 3-10.8 7.5L384 64 327.5 85.2zM9.3 240C3.6 242.6 0 248.3 0 254.6' +
  's3.6 11.9 9.3 14.5L26.3 277l8.1 3.7 .6 .3 88.3 40.8L164.1 410l.3 .6 3.7 8.1 7.9 17.1c2.6 5.7 8.3 9.3' +
  ' 14.5 9.3s11.9-3.6 14.5-9.3l7.9-17.1 3.7-8.1 .3-.6 40.8-88.3L346 281l.6-.3 8.1-3.7 17.1-7.9' +
  'c5.7-2.6 9.3-8.3 9.3-14.5s-3.6-11.9-9.3-14.5l-17.1-7.9-8.1-3.7-.6-.3-88.3-40.8L217 99.1l-.3-.6' +
  ' L213 90.3l-7.9-17.1c-2.6-5.7-8.3-9.3-14.5-9.3s-11.9 3.6-14.5 9.3l-7.9 17.1-3.7 8.1-.3 .6' +
  '-40.8 88.3L35.1 228.1l-.6 .3-8.1 3.7L9.3 240zm83 14.5l51.2-23.6c10.4-4.8 18.7-13.1 23.5-23.5' +
  'l23.6-51.2 23.6 51.2c4.8 10.4 13.1 18.7 23.5 23.5l51.2 23.6-51.2 23.6c-10.4 4.8-18.7 13.1-23.5 23.5' +
  'l-23.6 51.2-23.6-51.2c-4.8-10.4-13.1-18.7-23.5-23.5L92.3 254.6zM384 384l-56.5 21.2c-4.5 1.7-7.5 6' +
  '-7.5 10.8s3 9.1 7.5 10.8L384 448l21.2 56.5c1.7 4.5 6 7.5 10.8 7.5s9.1-3 10.8-7.5L448 448l56.5-21.2' +
  'c4.5-1.7 7.5-6 7.5-10.8s-3-9.1-7.5-10.8L448 384l-21.2-56.5c-1.7-4.5-6-7.5-10.8-7.5s-9.1 3-10.8 7.5' +
  'L384 384z"/></svg>';

function buildKey(label) {
  return '<span class="label label-light-grey"><strong>' + label + '</strong></span>';
}

function buildItem(name, keys) {
  var keysHtml = keys.map(buildKey).join('<strong> + </strong>');
  return '<li tabindex="0">' +
    '<div class="row">' +
      '<div class="col-xs-6 text-right" style="display:inline-block;">' + name + '</div>' +
      '<div class="col-xs-6" style="display:inline-block;">' + keysHtml + '</div>' +
    '</div>' +
  '</li>';
}

function injectCustomShortcuts() {
  var modal = document.querySelector('#modal .shortcuts-modal');
  if (!modal) return;
  if (modal.querySelector('.custom-shortcuts-section')) return;

  var section = document.createElement('div');
  section.className = 'custom-shortcuts-section schedule-section';
  section.style.marginTop = '16px';
  section.style.borderTop = 'solid 1px #ccc';
  section.innerHTML =
    '<span class="gap-24 gap-top text-center block strong margin-bottom block text-selectable text-body">' +
      ' Custom Shortcuts ' +
    '</span>' +
    '<ul class="list-unstyled gap-24 gap-bottom">' +
      buildItem('Day', ['Shift', '0']) +
      buildItem('Settings', ['Shift', ',']) +
      buildItem('Toggle Break Mode', ['Shift', 'B']) +
      buildItem(sparkles + 'Pause / Resume', ['Cmd', 'Shift', 'M']) +
      buildItem(sparkles + 'Finish Recording', ['Cmd', 'Shift', 'F']) +
    '</ul>';

  var rightCol = modal.querySelector('.modal-body .col-xs-6.schedule-section');
  if (rightCol) rightCol.appendChild(section);
}

// Watch #modal for attribute changes (display/class toggled, not DOM insertion)
var modalEl = document.getElementById('modal');
if (modalEl) {
  new MutationObserver(function () {
    if (modalEl.style.display === 'block') injectCustomShortcuts();
  }).observe(modalEl, { attributes: true, attributeFilter: ['style', 'class'] });
} else {
  // #modal not in DOM yet — wait for it
  new MutationObserver(function (mutations, obs) {
    var el = document.getElementById('modal');
    if (!el) return;
    obs.disconnect();
    new MutationObserver(function () {
      if (el.style.display === 'block') injectCustomShortcuts();
    }).observe(el, { attributes: true, attributeFilter: ['style', 'class'] });
  }).observe(document.body, { childList: true, subtree: true });
}
