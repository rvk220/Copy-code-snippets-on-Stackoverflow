/**
 * How to install:
 * 1) Install and turn on the extension "Custom JavaScript for websites" for Chrome;
 * 2) open a stackoverflow page, hit the butoon "CJS" in the top left cornen in the browser,
 * paste the code in the window which is opened and press "Save";
 * 3) the code will be automatically executed each time you open a page on Stackoverflow.
 *
 * How to use:
 * - you can copy code pressing alt key + left mouse key;
 * - you can copy code pressing a button "Copy" (only for extended code snippets);
 * - if a specific part of code is selected and the browser supports getSelection,
 * the selected text will be copied; else whole code snippet will be copied
 */

(() => {
  const copyToClipboardFn = navigator.clipboard
    ? (str) => navigator.clipboard.writeText(str)
    : (str) => {
        const el = document.createElement('textarea');
        el.value = str;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
      };

  const copyToClipboard = (str) => {
    copyToClipboardFn(str);
    alert(`The following code was copied to clipboard:${'\n```\n'}${str}${'\n```'}`);
  };

  const copySelection = window.getSelection
    ? (el) => {
        const selection = window.getSelection().toString();
        if (selection && el.textContent.includes(selection)) {
          copyToClipboard(selection);
          return true;
        }
        return false;
      }
    : () => false;

  document.querySelectorAll('code').forEach((el) => {
    el.addEventListener('click', ({ altKey }) => {
      if (altKey) copySelection(el) || copyToClipboard(el.textContent);
    });
    if (!el.getAttribute('class')) return;
    const button = document.createElement('button');
    button.setAttribute(
      'style',
      'position:relative;top:-5px;left:50%;transform:translateX(-50%);border:1px solid black;border-radius:2px;cursor:pointer;'
    );
    button.innerHTML = 'Copy';
    [document.createElement('br'), button].forEach((el2) => el.parentNode.prepend(el2));
    el.parentNode.prepend(button);
    button.addEventListener('click', () => {
      copySelection(el) || copyToClipboard(el.textContent);
    });
  });
})();
