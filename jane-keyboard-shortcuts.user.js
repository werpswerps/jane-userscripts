// ==UserScript==
// @name         Jane – Keyboard Shortcuts
// @match        https://*.janeapp.com/*
// @description  Adds keyboard shortcuts for navigating to the Day view (Shift+0), Settings (Shift+,), and toggling Break mode (Shift+B). Also injects a Custom Shortcuts reference into Jane's built-in keyboard shortcuts popup (Shift+?).
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

  // Shift + B → Toggle Break mode
  if (e.shiftKey && !e.metaKey && !e.ctrlKey && e.key === 'B') {
    e.preventDefault();
    var breakBtn = document.querySelector('#user-list-bottom button') || document.querySelector('button[aria-label="Break"]');
    if (breakBtn) breakBtn.click();
  }

});

// ── Inject custom shortcuts into the keyboard shortcuts modal ────────────────

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
