// ==UserScript==
// @name         JaneApp - AI Scribe Cursor Placement Fix
// @version      1.2
// @author       werpswerps
// @match        https://*.janeapp.com/admin*
// @updateURL    https://raw.githubusercontent.com/werpswerps/jane-userscripts/refs/heads/main/jane-ai-scribe-cursor-fix.user.js
// @downloadURL  https://raw.githubusercontent.com/werpswerps/jane-userscripts/refs/heads/main/jane-ai-scribe-cursor-fix.user.js
// @description  Fixes bug where clicking AI Scribe textboxes sometimes places the cursor at the end of the text instead of where it was clicked.
// @grant        none
// ==/UserScript==

// Bug: Clicking an unfocused AI Scribe field places the cursor at the wrong position.
// Cause: The symbols bar renders on focus, reflowing the editor layout after the browser
//        has already resolved the click coordinates against the pre-reflow geometry.
// Fix:  Suppress the browser's cursor placement on mousedown, manually focus the editor,
//       then re-resolve the cursor position after two rAFs (enough time for the reflow to
//       settle). A mousemove/mouseup pair handles drag selection across the same delay.

(function () {
  "use strict";

  document.addEventListener(
    "mousedown",
    function (e) {
      const editor = e.target.closest(".chart-entry .ql-editor");
      if (!editor) return;
      if (document.activeElement === editor) return;

      const startX = e.clientX;
      const startY = e.clientY;

      // Suppress browser cursor placement; re-resolved manually post-reflow
      e.preventDefault();
      editor.focus();

      let latestX = startX;
      let latestY = startY;
      let dragging = false;
      let anchorPlaced = false;

      function onMouseMove(me) {
        dragging = true;
        latestX = me.clientX;
        latestY = me.clientY;

        // Extend selection in real time once anchor is placed
        if (anchorPlaced) {
          const extRange = document.caretRangeFromPoint(latestX, latestY);
          if (extRange && editor.contains(extRange.startContainer)) {
            try {
              window
                .getSelection()
                .extend(extRange.startContainer, extRange.startOffset);
            } catch (err) {}
          }
        }
      }

      function onMouseUp() {
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
      }

      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);

      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          // Place cursor at the original click coordinates (post-reflow layout)
          const anchorRange = document.caretRangeFromPoint(startX, startY);
          if (anchorRange && editor.contains(anchorRange.startContainer)) {
            const sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(anchorRange);
            anchorPlaced = true;

            // Catch up selection if drag began during rAF delay
            if (dragging) {
              const extRange = document.caretRangeFromPoint(latestX, latestY);
              if (extRange && editor.contains(extRange.startContainer)) {
                try {
                  sel.extend(extRange.startContainer, extRange.startOffset);
                } catch (err) {}
              }
            }
          }
        });
      });
    },
    true,
  );
})();
