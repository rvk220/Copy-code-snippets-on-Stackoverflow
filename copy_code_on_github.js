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
 * the selected text will be copied; else whole code snippet will be copied;
 * - when text is successfully copied to the clipboard, the modal is shown. To close it,
 * it's enough to scroll the window, click mouse outside the modal
 * or press any key (except ctrl and alt).
 */

(() => {
  const codeElements = document.querySelectorAll('code');
  if (!codeElements.length) return;

  const createElement = (type, { style = {}, onClick, children = [], ...rest }) => {
    const el = document.createElement(type);
    Object.assign(el.style, style);
    if (onClick) el.addEventListener('click', onClick);
    Object.assign(el, rest);
    children.forEach((ch) => el.appendChild(ch));
    return el;
  };

  const customAlert = (text, headerText) => {
    let closeAlert;

    const shadow = createElement('div', {
      onClick: () => closeAlert(),
      style: {
        position: 'fixed',
        top: 0,
        height: '100vh',
        width: '100vw',
        backgroundColor: 'black',
        opacity: 0.5,
        zIndex: 9998
      }
    });

    const modal = createElement('div', {
      style: {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '500px',
        maxHeight: '90vh',
        backgroundColor: 'white',
        border: '1px solid black',
        borderRadius: '5px',
        zIndex: 9999,
        padding: '5px',
        overflow: 'auto',
        whiteSpace: 'pre'
      },
      children: [
        createElement('h2', { style: { textAlign: 'center' }, textContent: headerText }),
        createElement('div', { textContent: text })
      ]
    });

    [shadow, modal].forEach((el) => document.body.appendChild(el));

    const onKeyDownAndScroll = (e) => e.altKey || e.ctrlKey || closeAlert();
    ['keydown', 'scroll'].forEach((ev) => window.addEventListener(ev, onKeyDownAndScroll));

    closeAlert = () => {
      [modal, shadow].forEach((el) => document.body.removeChild(el));
      ['keydown', 'scroll'].forEach((ev) => window.removeEventListener(ev, onKeyDownAndScroll));
    };
  };

  const copyToClipboard = (str) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(str);
    } else {
      const el = createElement('textarea', { value: str });
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
    customAlert(str, 'The folowing code\nwas copied to the clipboard:');
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

  codeElements.forEach((el) => {
    el.addEventListener('click', ({ altKey }) => {
      if (altKey) copySelection(el) || copyToClipboard(el.textContent);
    });
    if (el.parentNode.nodeName !== 'PRE') return;
    const button = createElement('button', {
      textContent: 'Copy',
      onClick() {
        copySelection(el) || copyToClipboard(el.textContent);
        button.blur();
      },
      style: {
        position: 'relative',
        top: '-5px',
        left: '50%',
        transform: 'translateX(-50%)',
        border: '1px solid black',
        borderRadius: '2px',
        cursor: 'pointer'
      }
    });
    [document.createElement('br'), button].forEach((el2) => el.parentNode.prepend(el2));
    el.parentNode.prepend(button);
  });
})();
