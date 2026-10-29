/* ==========================================================================
   brand.js: typographic wordmark (concept placeholder, not Aayaadi's logo)
   --------------------------------------------------------------------------
   <div data-wordmark="AAYAADI">AAYAADI</div>               letters in spans
   <div data-wordmark="AAYAADI" data-slot="3">AAYAADI</div>  loader version: splits into
       [left letters][slot letter][right letters] so the intro tile can grow
       from the slot letter and push the others aside.

   The HTML keeps the word as plain text, so the name still reads if this
   script never runs. Swap in the studio's approved logo when one is supplied.
   ========================================================================== */
(function () {
  'use strict';

  function letter(ch) {
    const span = document.createElement('span');
    span.className = 'glyph';
    span.textContent = ch;
    return span;
  }

  function build(el) {
    if (el.dataset.built) return;
    const word = (el.dataset.wordmark || el.textContent).trim();
    if (!word) return;
    el.setAttribute('role', 'img');
    el.setAttribute('aria-label', el.getAttribute('aria-label') || word);
    el.textContent = '';
    const slot = el.dataset.slot === undefined ? -1 : parseInt(el.dataset.slot, 10);
    if (slot < 0 || slot >= word.length) {
      [...word].forEach(ch => el.appendChild(letter(ch)));
    } else {
      const left = document.createElement('span'), mid = document.createElement('span'), right = document.createElement('span');
      left.className = 'mark__side mark__side--l'; mid.className = 'mark__mid'; right.className = 'mark__side mark__side--r';
      [...word].forEach((ch, i) => (i < slot ? left : i === slot ? mid : right).appendChild(letter(ch)));
      mid.firstChild.classList.add('glyph--slot');
      el.append(left, mid, right);
    }
    el.dataset.built = '1';
  }

  document.querySelectorAll('[data-wordmark]').forEach(build);
  window.Brand = { build };
})();
