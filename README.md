# Userscripts for Jane App EHR

## Table of Contents
- [About Userscripts](#about-userscripts)
	- [Installing Userscripts](#installing-userscripts)
- [Jane Userscripts](#jane-userscripts)
	- [Multi-line notes on schedule breaks](#multi-line-notes-on-schedule-breaks)
	- [Additional Keyboard Shortcuts](#additional-keyboard-shortcuts)
	- [Calendar Buffer Visualizer](#calendar-buffer-visualizer)

---

## About Userscripts
Userscripts are small pieces of code that run in your browser and modify how a webpage looks or behaves, without changing anything on the server side. Think of them like custom settings that only exist on your computer. They can be set up to work with every website you view, only specific websites, or even limited to certain sections of one website.

### Installing Userscripts
To use a userscript in your browser, you first need to install a browser extension that manages userscripts. There are multiple userscript extensions available for different browsers, here are my recommendations:

- **Safari:** [Userscripts](https://apps.apple.com/us/app/userscripts/id1463298887)
- **Firefox, Brave, Opera:** [Violentmonkey](https://violentmonkey.github.io)
- **Chrome, Edge:** [Tampermonkey](https://www.tampermonkey.net)

Once the extension is installed, click an install link (like those in the section below) to begin installation:
- **Safari (Userscripts):** After clicking the install link you'll see a page with the userscript code. Click the Userscripts icon in your browser toolbar and select "Userscript Detected: Click to install."
- **Tampermonkey / Violentmonkey:** Clicking the install link should automatically prompt you to confirm installation.

Once installed, the script will run automatically whenever you're on the relevant page(s).

**Optional:** After installing, open the script in your extension's editor and replace the first `*` at the start of the URL in the `// @match` line (usually line 5) with your clinic's subdomain. For example, if your clinic's Jane URL is `https://myclinic.janeapp.com`, the line should read:
```
// @match       https://myclinic.janeapp.com/admin*
```
This ensures the script only runs on *your* Jane clinic and not any others that you might visit.

> [!important]
> These instructions are for desktop only. Mobile installation is possible but more involved and varies significantly by device and browser. Look up instructions for your specific setup.

> [!warning]
> These scripts interact directly with Jane's underlying code and may break if Jane updates their interface. If something stops working, you can disable the script in your extension's dashboard until an update becomes available — check back here for updates.

---

## Jane Userscripts
(More will be added soon. If you've written your own userscripts, contributions are welcome!)

| Script                                                                      |                                                                                                                  |
| --------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| [Multi-line notes on schedule breaks](#multi-line-notes-on-schedule-breaks) | [Install](https://github.com/werpswerps/jane-userscripts/raw/refs/heads/main/jane-multiline-break-notes.user.js) |
| [Additional Keyboard Shortcuts](#additional-keyboard-shortcuts)             | [Install](https://github.com/werpswerps/jane-userscripts/raw/refs/heads/main/jane-keyboard-shortcuts.user.js)    |
| [Calendar Buffer Visualizer](#calendar-buffer-visualizer)                   | [Install](https://github.com/werpswerps/jane-userscripts/raw/refs/heads/main/jane-calendar-buffer-visualizer.user.js) |

---

### Multi-line notes on schedule breaks
Preserves line breaks when adding notes to a break on the Jane schedule. Without this, all lines run together into a single line. No added markup is necessary when writing your notes.
[Install](https://github.com/werpswerps/jane-userscripts/raw/refs/heads/main/jane-multiline-break-notes.user.js)

#### Before
<img width="480" height="370" alt="Multiline Break Note - Before" src="https://github.com/user-attachments/assets/d51dedf8-a1b6-485f-85e4-438499273434" />

#### After
<img width="480" height="370" alt="Multiline Break Note - After" src="https://github.com/user-attachments/assets/719956ca-441b-4411-b59e-8cf10859c50a" />

---

### Additional Keyboard Shortcuts
Adds keyboard shortcuts for navigating to the Day view (Shift+0), Settings (Shift+,), toggling Break mode (Shift+B), and pausing/resuming (Cmd+Shift+M) or finishing (Cmd+Shift+F) AI Scribe recording. Also injects a Custom Shortcuts reference into Jane's built-in keyboard shortcuts popup (Shift+?).
[Install](https://github.com/werpswerps/jane-userscripts/raw/refs/heads/main/jane-keyboard-shortcuts.user.js)

#### Keyboard Shortcuts Popup
<img width="598" height="652" alt="Keyboard Shortcut Modal_001" src="https://github.com/user-attachments/assets/6ed1fefe-10a4-47b5-8e7d-dd6cb0553c47" />

---

### Calendar Buffer Visualizer
Visually separates buffer time from actual treatment time on the calendar, and corrects the displayed appointment end time to reflect when the treatment ends rather than when the scheduled block ends. Buffer duration is calculated automatically from your appointment type settings — no configuration needed.
[Install](https://github.com/werpswerps/jane-userscripts/raw/refs/heads/main/jane-calendar-buffer-visualizer.user.js)

#### Before
<img width="247" height="579" alt="Calendar Buffer - Before" src="https://github.com/user-attachments/assets/d71b85d8-b54b-44f0-85f1-86cfa7c0c705" />

#### After
<img width="247" height="579" alt="Calendar Buffer - After" src="https://github.com/user-attachments/assets/794b8402-d08f-4fe1-9959-8c39e6ce7246" />
