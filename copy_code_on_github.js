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
 * - when text is successfully copied to clipboard, the modal is shown. To close it,
 * it's enough to scroll the window or press any key.
 */

(() => {
  const codeElements = document.querySelectorAll('code');
  if (!codeElements.length) return;

  const createElement = (type, { style = {}, onClick, ...rest }) => {
    const el = document.createElement(type);
    Object.assign(el.style, style);
    if (onClick) el.addEventListener('click', onClick);
    Object.assign(el, rest);
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
      }
    });

    modal.prepend(
      createElement('h2', {
        style: { textAlign: 'center', borderBottom: '1px solid black' },
        innerHTML: headerText
      })
    );

    modal.appendChild(createElement('div', { textContent: text }));

    const onKeyDownAndScroll = () => closeAlert();
    ['keydown', 'scroll'].forEach((ev) => window.addEventListener(ev, onKeyDownAndScroll));

    closeAlert = () => {
      [modal, shadow].forEach((el) => document.body.removeChild(el));
      ['keydown', 'scroll'].forEach((ev) => window.removeEventListener(ev, onKeyDownAndScroll));
    };

    [modal, shadow].forEach((el) => document.body.appendChild(el));
  };

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
    customAlert(str, 'The folowing code<br>was copied to clipboard');
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
    if (['SPAN', 'P', 'A', 'STRONG'].some((name) => el.parentNode.nodeName === name)) return;
    const button = createElement('button', {
      innerHTML: 'Copy',
      onClick: () => copySelection(el) || copyToClipboard(el.textContent),
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
