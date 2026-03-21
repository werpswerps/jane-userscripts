// ==UserScript==
// @name         JaneApp - Calendar Buffer Visualizer
// @version      2.0
// @author       werpswerps
// @match        https://*.janeapp.com/admin*
// @description  Visually separates buffer time from treatment time on the calendar, and corrects displayed appointment end times to reflect actual treatment end rather than scheduled block end.
// @grant        none
// ==/UserScript==

(function () {

  // --- Lookup table: appointment name → { treatmentMins, scheduledMins } ---
  let treatmentLookup = {};

  async function loadTreatments() {
    try {
      const response = await fetch('/admin/api/v2/treatments/boot_treatments');
      if (!response.ok) return;
      const data = await response.json();
      data.forEach(t => {
        treatmentLookup[t.name] = {
          treatmentMins: Math.round(t.treatment_duration / 60),
          scheduledMins: Math.round(t.scheduled_duration / 60)
        };
      });
    } catch (e) {
      console.warn('[Buffer Visualizer] Failed to load treatment types:', e);
    }
  }

  // --- Adjust displayed end time by subtracting buffer ---
  function adjustEndTime(timeText, bufferMinutes) {
    const match = timeText.match(
      /(\d{1,2}):(\d{2})(?:\s*(AM|PM))?\s*-\s*(\d{1,2}):(\d{2})\s*(AM|PM)/i
    );
    if (!match) return timeText;

    let [, sh, sm, sp, eh, em, ep] = match;
    sh = parseInt(sh, 10);
    sm = parseInt(sm, 10);
    eh = parseInt(eh, 10);
    em = parseInt(em, 10);
    if (!sp) sp = ep;

    const toMinutes = (h, m, period) => {
      let hour24 = h % 12;
      if (period.toUpperCase() === 'PM') hour24 += 12;
      return hour24 * 60 + m;
    };

    let endTotal = toMinutes(eh, em, ep) - bufferMinutes;
    endTotal = (endTotal + 1440) % 1440;

    const newHour24 = Math.floor(endTotal / 60);
    const newMinute = endTotal % 60;
    const newPeriod = newHour24 >= 12 ? 'PM' : 'AM';
    let newHour12 = newHour24 % 12;
    if (newHour12 === 0) newHour12 = 12;

    const paddedMinute = String(newMinute).padStart(2, '0');
    const startText = sp
      ? `${sh}:${String(sm).padStart(2, '0')} ${sp}`
      : `${sh}:${String(sm).padStart(2, '0')}`;

    return `${startText} - ${newHour12}:${paddedMinute} ${newPeriod}`;
  }

  // --- Process a single calendar event element ---
  function processEvent(eventEl) {
    const treatmentEl = eventEl.querySelector('.treatment');
    const timeEl = eventEl.querySelector('.time .hide-condensed');
    if (!treatmentEl || !timeEl) return;

    const name = treatmentEl.textContent.replace(/^[\s\-]+/, '').trim();
    const lookup = treatmentLookup[name];
    if (!lookup) return;

    const { treatmentMins, scheduledMins } = lookup;
    const bufferMins = scheduledMins - treatmentMins;
    if (bufferMins <= 0) return;

    // Correct the displayed end time
    if (!timeEl.dataset.bufferAdjusted) {
      timeEl.textContent = adjustEndTime(timeEl.textContent, bufferMins);
      timeEl.dataset.bufferAdjusted = 'true';
    }

    // Inject buffer overlay
    if (!eventEl.dataset.bufferProcessed) {
      const pxPerMinute = eventEl.getBoundingClientRect().height / scheduledMins;
      const bufferHeight = Math.round(pxPerMinute * bufferMins);

      const overlay = document.createElement('div');
      overlay.style.cssText = `
        position: absolute;
        left: 0; right: 0; bottom: 0;
        height: ${bufferHeight}px;
        background: rgba(255, 255, 255, 0.85);
        opacity: 0;
        transition: opacity 200ms ease-out;
        pointer-events: none;
      `;

      eventEl.style.position = 'relative';
      eventEl.appendChild(overlay);
      requestAnimationFrame(() => { overlay.style.opacity = '1'; });

      eventEl.dataset.bufferProcessed = 'true';
    }
  }

  // --- Init: load treatments, then start observing ---
  loadTreatments().then(() => {
    document.querySelectorAll('[data-testid="event"]').forEach(processEvent);

    const observer = new MutationObserver(() => {
      document.querySelectorAll('[data-testid="event"]').forEach(processEvent);
    });

    observer.observe(document.body, { childList: true, subtree: true });
  });

})();
