/* ==========================================================================
   room.js: "Design your bedroom" concept tool (no libraries).
   One state object drives one drawn SVG scene (CSS variables for colour and light,
   .v groups for variants) and a generated control panel. Swatches that show a material
   use crops of the studio's real photographs. Nothing here is a product, price or quote.
   ========================================================================== */
(() => {
  'use strict';
  const lab = document.getElementById('design');
  const svg = document.getElementById('room');
  if (!lab || !svg) return;

  const $ = (s, r = lab) => r.querySelector(s);
  const $$ = (s, r = lab) => [...r.querySelectorAll(s)];
  const root = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const IMG = 'img/aayaadi/web/';
  const STORE = 'aayaadi_room_v1';

  /* ---------- colour helpers ---------- */
  const toRgb = (h) => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
  const toHex = (a) => '#' + a.map(v => Math.round(Math.min(255, Math.max(0, v))).toString(16).padStart(2, '0')).join('');
  const mix = (a, b, t) => { const x = toRgb(a), y = toRgb(b); return toHex(x.map((v, i) => v + (y[i] - v) * t)); };
  const lighten = (h, t) => mix(h, '#ffffff', t);
  const darken = (h, t) => mix(h, '#000000', t);
  const KELVIN = [[2200, '#ff9a45'], [2700, '#ffb766'], [3000, '#ffc98a'], [3500, '#ffe0b5'], [4000, '#fff1dc']];
  function kelvin(k) {
    for (let i = 1; i < KELVIN.length; i++) {
      if (k <= KELVIN[i][0]) { const [k0, c0] = KELVIN[i - 1], [k1, c1] = KELVIN[i]; return mix(c0, c1, (k - k0) / (k1 - k0)); }
    }
    return KELVIN[KELVIN.length - 1][1];
  }
  const kWord = (k) => k < 2500 ? 'Candle' : k < 3000 ? 'Warm white' : k < 3500 ? 'Soft white' : 'Neutral white';

  /* ---------- options ---------- */
  const WALLS = [['bone', 'Bone', '#ece2d0'], ['sand', 'Sand', '#d6c3a0'], ['clay', 'Clay', '#c39a7e'], ['sage', 'Sage', '#aab39a'], ['mist', 'Mist', '#c5cbcc'], ['umber', 'Umber', '#5b4a3c']];
  const FABRICS = [['ivory', 'Ivory', '#eee7d8'], ['blush', 'Blush', '#d3a59d'], ['pebble', 'Pebble', '#9b9a95'], ['sage', 'Sage', '#8d9a80'], ['slate', 'Slate', '#5f7287'], ['chocolate', 'Chocolate', '#5a3a2d']];
  const RUGS = [['none', 'None', null], ['oat', 'Oatmeal', '#d9ccb2'], ['char', 'Charcoal', '#4a4745'], ['rust', 'Rust', '#a35f43']];
  const HARDWARE = [['brass', 'Brass', '#b88a3e'], ['black', 'Black', '#1e1a17'], ['nickel', 'Nickel', '#b8bbbe']];
  const col = (list) => list.map(([id, name, c]) => ({ id, name, c }));

  const ic = (body) => '<svg viewBox="0 0 64 44" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' + body + '</svg>';
  const ICONS = {
    rounded: ic('<path d="M8 40V26a8 8 0 0 1 16 0v14M24 40V16a8 8 0 0 1 16 0v24M40 40V26a8 8 0 0 1 16 0v14"/>'),
    tufted: ic('<rect x="8" y="8" width="48" height="32" rx="3"/><path d="M20 8l12 16-12 16M44 8 32 24l12 16M8 24h48"/>'),
    channel: ic('<rect x="8" y="8" width="48" height="32" rx="3"/><path d="M20 8v32M32 8v32M44 8v32"/>'),
    lamp: ic('<path d="M24 8h16l4 16H20Z"/><path d="M32 24v12M25 38h14"/>'),
    sconce: ic('<rect x="28" y="6" width="8" height="30" rx="4"/><path d="M25 8h14M27 40h10"/>'),
    pendant: ic('<path d="M32 4v18"/><circle cx="32" cy="31" r="10"/>'),
    cnone: ic('<rect x="18" y="8" width="28" height="28" rx="2"/><path d="M32 8v28M18 22h28"/>'),
    sheer: ic('<path d="M10 6h44"/><path d="M14 8c4 10 4 20 0 30M22 8c4 10 4 20 0 30M42 8c-4 10-4 20 0 30M50 8c-4 10-4 20 0 30"/>'),
    heavy: ic('<path d="M10 6h44"/><path d="M12 8c10 4 10 26 0 30ZM52 8c-10 4-10 26 0 30Z"/>')
  };

  const GROUPS = [
    { tab: 'walls', id: 'wall', label: 'Wall colour', kind: 'color', opts: col(WALLS) },
    { tab: 'walls', id: 'feature', label: 'Feature wall', kind: 'photo', opts: [
      { id: 'plain', name: 'Plain', plain: true },
      { id: 'slat', name: 'Slat panel', img: '19-photo-480', pos: '50% 8%', z: 2.4 },
      { id: 'moulded', name: 'Moulded', img: '06-photo-480', pos: '50% 34%', z: 2 },
      { id: 'fluted', name: 'Fluted', img: '07-photo-480', pos: '92% 50%', z: 2.6 },
      { id: 'stone', name: 'Veined stone', img: '01-photo-800', pos: '42% 6%', z: 2.2 }] },
    { tab: 'bed', id: 'head', label: 'Headboard', kind: 'icon', opts: [
      { id: 'rounded', name: 'Rounded', icon: 'rounded' }, { id: 'tufted', name: 'Tufted', icon: 'tufted' }, { id: 'channel', name: 'Channel', icon: 'channel' }] },
    { tab: 'bed', id: 'hbc', label: 'Headboard fabric', kind: 'color', opts: col(FABRICS) },
    { tab: 'bed', id: 'linen', label: 'Bed linen', kind: 'color', opts: col(FABRICS) },
    { tab: 'bed', id: 'throw', label: 'Throw and cushions', kind: 'color', opts: col(FABRICS) },
    { tab: 'floor', id: 'floor', label: 'Flooring', kind: 'photo', opts: [
      { id: 'herring', name: 'Herringbone', img: '16-photo-480', pos: '50% 97%', z: 2.8 },
      { id: 'plank', name: 'Oak planks', css: 'repeating-linear-gradient(90deg,#c9a77a 0 22px,#b99567 22px 24px)' },
      { id: 'marble', name: 'Veined marble', img: '07-photo-480', pos: '30% 99%', z: 2.8 }] },
    { tab: 'floor', id: 'rug', label: 'Rug', kind: 'color', opts: col(RUGS) },
    { tab: 'light', id: 'cove', label: 'Cove lighting', kind: 'switch' },
    { tab: 'light', id: 'temp', label: 'Colour temperature', kind: 'range', min: 2200, max: 4000, step: 100, cls: 'range--temp', fmt: (v) => v + 'K · ' + kWord(v) },
    { tab: 'light', id: 'dim', label: 'Dimmer', kind: 'range', min: 10, max: 100, step: 5, fmt: (v) => v + '%' },
    { tab: 'light', id: 'bedside', label: 'Bedside lighting', kind: 'icon', opts: [
      { id: 'lamp', name: 'Table lamps', icon: 'lamp' }, { id: 'sconce', name: 'Wall sconces', icon: 'sconce' }, { id: 'pendant', name: 'Pendants', icon: 'pendant' }] },
    { tab: 'details', id: 'ward', label: 'Wardrobe', kind: 'photo', opts: [
      { id: 'none', name: 'None', none: true },
      { id: 'fluted', name: 'Fluted', img: '07-photo-480', pos: '94% 60%', z: 2.4 },
      { id: 'arched', name: 'Arched', img: '07-photo-480', pos: '8% 50%', z: 2.4 }] },
    { tab: 'details', id: 'curtain', label: 'Curtains', kind: 'icon', opts: [
      { id: 'none', name: 'None', icon: 'cnone' }, { id: 'sheer', name: 'Sheer', icon: 'sheer' }, { id: 'heavy', name: 'Heavy drape', icon: 'heavy' }] },
    { tab: 'details', id: 'hw', label: 'Hardware finish', kind: 'color', opts: col(HARDWARE) }
  ];
  const TABS = [['walls', 'Walls'], ['bed', 'Bed'], ['floor', 'Floor'], ['light', 'Light'], ['details', 'Details']];
  const G = Object.fromEntries(GROUPS.map(g => [g.id, g]));
  const optName = (gid, v) => (G[gid].opts.find(o => o.id === v) || {}).name || '';

  const DEFAULT = { wall: 'bone', feature: 'slat', head: 'rounded', hbc: 'ivory', linen: 'pebble', throw: 'sage', floor: 'herring', rug: 'oat', cove: true, temp: 2700, dim: 70, bedside: 'sconce', ward: 'fluted', curtain: 'sheer', hw: 'brass', time: 'day' };
  const PRESETS = [
    { name: 'Quiet Sand', s: DEFAULT },
    { name: 'Evening Bronze', s: { wall: 'umber', feature: 'stone', head: 'tufted', hbc: 'chocolate', linen: 'pebble', throw: 'blush', floor: 'marble', rug: 'char', cove: true, temp: 2400, dim: 60, bedside: 'pendant', ward: 'none', curtain: 'heavy', hw: 'brass', time: 'eve' } },
    { name: 'Sage and Brass', s: { wall: 'sage', feature: 'moulded', head: 'channel', hbc: 'ivory', linen: 'ivory', throw: 'slate', floor: 'plank', rug: 'oat', cove: true, temp: 3000, dim: 75, bedside: 'lamp', ward: 'arched', curtain: 'sheer', hw: 'brass', time: 'day' } },
    { name: 'Blush and Grey', s: { wall: 'mist', feature: 'slat', head: 'rounded', hbc: 'pebble', linen: 'blush', throw: 'pebble', floor: 'marble', rug: 'none', cove: true, temp: 2700, dim: 80, bedside: 'lamp', ward: 'fluted', curtain: 'none', hw: 'black', time: 'eve' } }
  ];

  /* ---------- state ---------- */
  const valid = (s) => s && GROUPS.every(g => g.kind === 'switch' ? typeof s[g.id] === 'boolean' : g.kind === 'range' ? typeof s[g.id] === 'number' : g.opts.some(o => o.id === s[g.id])) && (s.time === 'day' || s.time === 'eve');
  let state = { ...DEFAULT };
  try { const saved = JSON.parse(localStorage.getItem(STORE) || 'null'); if (valid(saved)) state = saved; } catch (e) { /* storage blocked: start from the default room */ }
  let touched = false;

  /* ---------- build controls ---------- */
  const tabsEl = $('#lab-tabs'), pagesEl = $('#lab-pages'), presetsEl = $('#lab-presets');
  const ind = $('.lab__ind', tabsEl);
  const esc = (s) => String(s).replace(/"/g, '&quot;');

  function optHTML(g, o, n) {
    const base = 'type="button" role="radio" class="opt" aria-checked="false" tabindex="-1" data-g="' + g.id + '" data-v="' + o.id + '" style="--i:' + n + '"';
    if (g.kind === 'color') {
      return '<button ' + base + '><span class="chip' + (o.c ? '' : ' chip--none') + '"' + (o.c ? ' style="--c:' + o.c + '"' : '') + '></span><span class="opt__name">' + o.name + '</span></button>';
    }
    if (g.kind === 'photo') {
      let media = '<span class="media media--plain"></span>';
      if (o.img) media = '<span class="media"><img src="' + IMG + 'aayaadi-google-' + o.img + '.webp" alt="" loading="lazy" decoding="async" width="240" height="240" style="--pos:' + o.pos + ';--z:' + o.z + '"></span>';
      else if (o.css) media = '<span class="media" style="background:' + esc(o.css) + '"></span>';
      else if (o.none) media = '<span class="media media--none"></span>';
      return '<button ' + base + '>' + media + '<span class="opt__name">' + o.name + '</span></button>';
    }
    return '<button ' + base + '><span class="glyph">' + ICONS[o.icon] + '</span><span class="opt__name">' + o.name + '</span></button>';
  }

  function groupHTML(g) {
    const head = '<div class="grp__head"><h3 class="grp__label" id="gl-' + g.id + '">' + g.label + '</h3><span class="grp__val" data-val="' + g.id + '"></span></div>';
    let body = '';
    if (g.kind === 'switch') {
      body = '<button type="button" class="switch" role="switch" aria-checked="false" aria-labelledby="gl-' + g.id + '" data-g="' + g.id + '"><span class="switch__thumb" aria-hidden="true"></span></button>';
    } else if (g.kind === 'range') {
      body = '<div class="range ' + (g.cls || '') + '"><input type="range" min="' + g.min + '" max="' + g.max + '" step="' + g.step + '" aria-labelledby="gl-' + g.id + '" data-g="' + g.id + '"></div>';
    } else {
      body = '<div class="opts opts--' + g.kind + '" role="radiogroup" aria-labelledby="gl-' + g.id + '">' + g.opts.map((o, n) => optHTML(g, o, n)).join('') + '</div>';
    }
    return '<section class="grp' + (g.kind === 'switch' ? ' grp--row' : '') + '" data-grp="' + g.id + '">' + head + body + '</section>';
  }

  TABS.forEach(([id, label], n) => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'lab__tab'; b.setAttribute('role', 'tab'); b.id = 'tab-lab-' + id;
    b.setAttribute('aria-controls', 'page-lab-' + id); b.dataset.tab = id; b.textContent = label;
    tabsEl.insertBefore(b, ind);
    const p = document.createElement('div');
    p.className = 'lab__page'; p.id = 'page-lab-' + id; p.setAttribute('role', 'tabpanel'); p.setAttribute('aria-labelledby', b.id);
    p.innerHTML = GROUPS.filter(g => g.tab === id).map(groupHTML).join('');
    p.hidden = n !== 0;
    pagesEl.appendChild(p);
  });
  presetsEl.innerHTML = PRESETS.map((p, n) => '<button type="button" class="pre" data-preset="' + n + '">' + p.name + '</button>').join('');
  $$('.lab__tab').forEach((b, n) => { b.setAttribute('aria-selected', String(n === 0)); b.tabIndex = n === 0 ? 0 : -1; });

  /* ---------- tabs ---------- */
  let activeTab = 'walls';
  function placeInd() {
    const b = $('.lab__tab[aria-selected="true"]', tabsEl);
    if (!b) return;
    ind.style.width = b.offsetWidth + 'px';
    ind.style.transform = 'translateX(' + b.offsetLeft + 'px)';
  }
  function setTab(id, quiet) {
    if (id === activeTab && !quiet) return;
    activeTab = id;
    $$('.lab__tab').forEach(b => { const on = b.dataset.tab === id; b.setAttribute('aria-selected', String(on)); b.tabIndex = on ? 0 : -1; });
    $$('.lab__page').forEach(p => {
      const on = p.id === 'page-lab-' + id;
      p.hidden = !on;
      if (on && !reduced.matches) { p.classList.remove('is-entering'); void p.offsetWidth; p.classList.add('is-entering'); }
    });
    placeInd();
    const sel = $('.lab__tab[aria-selected="true"]', tabsEl);
    if (sel && sel.scrollIntoView) tabsEl.scrollTo({ left: Math.max(0, sel.offsetLeft - 24), behavior: reduced.matches ? 'auto' : 'smooth' });
  }
  tabsEl.addEventListener('click', (e) => { const b = e.target.closest('.lab__tab'); if (b) setTab(b.dataset.tab); });
  tabsEl.addEventListener('keydown', (e) => {
    const tabs = $$('.lab__tab'), i = tabs.indexOf(document.activeElement);
    if (i < 0) return;
    let n = -1;
    if (e.key === 'ArrowRight') n = (i + 1) % tabs.length; else if (e.key === 'ArrowLeft') n = (i - 1 + tabs.length) % tabs.length;
    else if (e.key === 'Home') n = 0; else if (e.key === 'End') n = tabs.length - 1;
    if (n < 0) return;
    e.preventDefault(); tabs[n].focus(); setTab(tabs[n].dataset.tab);
  });

  /* ---------- apply state to the scene and the controls ---------- */
  const set = (k, v) => svg.style.setProperty(k, v);
  const rows = $('#lab-brief');
  function apply() {
    const s = state, eve = s.time === 'eve';
    const wall = G.wall.opts.find(o => o.id === s.wall).c;
    const hb = G.hbc.opts.find(o => o.id === s.hbc).c;
    const linen = G.linen.opts.find(o => o.id === s.linen).c;
    const thr = G.throw.opts.find(o => o.id === s.throw).c;
    const rug = G.rug.opts.find(o => o.id === s.rug).c;
    const hw = G.hw.opts.find(o => o.id === s.hw).c;
    const glow = kelvin(s.temp), d = s.dim / 100;
    const vars = {
      '--wall': wall, '--wall-hi': lighten(wall, .35), '--wall-lo': darken(wall, .16),
      '--hb': hb, '--hb-lo': darken(hb, .22),
      '--linen': linen, '--linen-hi': lighten(linen, .3), '--pillow': lighten(linen, .42),
      '--throw': thr, '--throw-hi': lighten(thr, .22), '--drape': darken(thr, .12),
      '--rug': rug || '#000', '--hw': hw,
      '--glow': glow, '--globe': lighten(glow, .45),
      '--cove': s.cove ? ((.25 + .75 * d) * (eve ? 1 : .32)).toFixed(3) : '0',
      '--lamp': (d * (eve ? 1 : .22)).toFixed(3),
      '--night': eve ? (.46 + (1 - d) * .14).toFixed(3) : '0',
      '--day': eve ? '0' : '.9',
      '--sky1': eve ? '#0e1624' : '#dfeaf2', '--sky2': eve ? '#1d2942' : '#f8f6ee',
      '--fl-timber': '#b98c5c', '--fl-plank': '#c9a77a'
    };
    Object.keys(vars).forEach(k => set(k, vars[k]));
    lab.style.setProperty('--room-wall', wall);

    $$('.v', svg).forEach(g => {
      const k = g.dataset.k, v = g.dataset.v;
      g.classList.toggle('is-on', k === 'rug' ? (s.rug !== 'none') : k === 'ward' ? s.ward === v : s[k] === v);
    });

    $$('.opt', lab).forEach(b => {
      const on = state[b.dataset.g] === b.dataset.v;
      b.setAttribute('aria-checked', String(on)); b.tabIndex = on ? 0 : -1;
    });
    $$('.switch', lab).forEach(b => b.setAttribute('aria-checked', String(!!state[b.dataset.g])));
    $$('.range input', lab).forEach(inp => {
      const g = G[inp.dataset.g];
      if (+inp.value !== state[g.id]) inp.value = state[g.id];
      inp.style.setProperty('--p', ((state[g.id] - g.min) / (g.max - g.min) * 100) + '%');
      inp.setAttribute('aria-valuetext', g.fmt(state[g.id]));
    });
    GROUPS.forEach(g => {
      const out = $('[data-val="' + g.id + '"]');
      if (!out) return;
      out.textContent = g.kind === 'switch' ? (state[g.id] ? 'On' : 'Off') : g.kind === 'range' ? g.fmt(state[g.id]) : optName(g.id, state[g.id]);
    });
    const timeEl = $('#lab-time');
    timeEl.dataset.v = s.time;
    $$('[data-time]', timeEl).forEach(b => b.setAttribute('aria-checked', String(b.dataset.time === s.time)));
    $$('.pre').forEach((b, n) => b.classList.toggle('is-on', JSON.stringify(PRESETS[n].s) === JSON.stringify(s)));
    renderBrief();
    try { localStorage.setItem(STORE, JSON.stringify(s)); } catch (e) { /* ignore */ }
  }

  /* ---------- the brief ---------- */
  const low = (t) => t.toLowerCase();
  function briefRows() {
    const s = state, n = (g) => optName(g, s[g]);
    return [
      ['Walls', n('wall') + ', ' + (s.feature === 'plain' ? 'plain feature wall' : low(n('feature')) + ' feature wall')],
      ['Bed', n('head') + ' headboard in ' + n('hbc') + '; ' + n('linen') + ' linen; ' + n('throw') + ' throw and cushions'],
      ['Floor', n('floor') + (s.rug === 'none' ? ', no rug' : ', ' + low(n('rug')) + ' rug')],
      ['Light', (s.cove ? 'Cove lighting on' : 'No cove lighting') + ', ' + s.temp + 'K ' + low(kWord(s.temp)) + ', dimmed to ' + s.dim + '%; ' + low(n('bedside')) + ' by the bed; ' + (s.time === 'eve' ? 'evening' : 'daytime') + ' view'],
      ['Details', (s.ward === 'none' ? 'No wardrobe' : n('ward') + ' wardrobe') + '; ' + (s.curtain === 'none' ? 'no curtains' : low(n('curtain')) + ' curtains') + '; ' + low(n('hw')) + ' hardware']
    ];
  }
  function renderBrief() { rows.innerHTML = briefRows().map(([k, v]) => '<div class="brief__row"><dt>' + k + '</dt><dd>' + v + '</dd></div>').join(''); }

  const copyBtn = $('#lab-copy');
  let copyT = 0;
  copyBtn.addEventListener('click', async () => {
    const text = 'Bedroom brief (concept tool, not a quote)\n' + briefRows().map(([k, v]) => k + ': ' + v).join('\n');
    let ok = false;
    try { await navigator.clipboard.writeText(text); ok = true; } catch (e) {
      const ta = document.createElement('textarea'); ta.value = text; ta.style.cssText = 'position:fixed;opacity:0'; document.body.appendChild(ta); ta.select();
      try { ok = document.execCommand('copy'); } catch (er) { ok = false; } ta.remove();
    }
    copyBtn.textContent = ok ? 'Copied' : 'Copy failed';
    clearTimeout(copyT); copyT = setTimeout(() => { copyBtn.textContent = 'Copy brief'; }, 1800);
  });

  /* ---------- interactions ---------- */
  const hint = $('#lab-hint');
  function touch() { if (!touched) { touched = true; hint.classList.add('is-gone'); } }
  function change(patch) { touch(); Object.assign(state, patch); apply(); }

  pagesEl.addEventListener('click', (e) => {
    const o = e.target.closest('.opt'); if (o) { change({ [o.dataset.g]: o.dataset.v }); return; }
    const sw = e.target.closest('.switch'); if (sw) change({ [sw.dataset.g]: !state[sw.dataset.g] });
  });
  pagesEl.addEventListener('keydown', (e) => {
    const o = e.target.closest('.opt'); if (!o) return;
    const arrows = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
    if (!(e.key in arrows)) return;
    e.preventDefault();
    const list = $$('.opt[data-g="' + o.dataset.g + '"]'), i = list.indexOf(o);
    const nx = list[(i + arrows[e.key] + list.length) % list.length];
    nx.focus(); change({ [nx.dataset.g]: nx.dataset.v });
  });
  let rafR = 0;
  pagesEl.addEventListener('input', (e) => {
    const inp = e.target.closest('input[type="range"]'); if (!inp) return;
    const g = inp.dataset.g, v = +inp.value;
    cancelAnimationFrame(rafR);
    rafR = requestAnimationFrame(() => change({ [g]: v }));
  });
  presetsEl.addEventListener('click', (e) => { const b = e.target.closest('.pre'); if (b) change({ ...PRESETS[+b.dataset.preset].s }); });
  $('#lab-time').addEventListener('click', (e) => { const b = e.target.closest('[data-time]'); if (b) change({ time: b.dataset.time }); });
  $('#lab-reset').addEventListener('click', () => change({ ...DEFAULT }));

  const rnd = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const shuffleBtn = $('#lab-shuffle');
  shuffleBtn.addEventListener('click', () => {
    const next = { time: state.time, cove: Math.random() > .15, temp: 2200 + 100 * Math.floor(Math.random() * 14), dim: 50 + 5 * Math.floor(Math.random() * 11) };
    GROUPS.forEach(g => { if (g.opts) next[g.id] = rnd(g.opts).id; });
    if (next.hbc === next.wall) next.hbc = rnd(G.hbc.opts.filter(o => o.id !== next.wall)).id;
    shuffleBtn.classList.remove('is-spin'); void shuffleBtn.offsetWidth; shuffleBtn.classList.add('is-spin');
    change(next);
  });

  /* tap the room to jump to the matching control */
  const tip = $('#lab-tip'), canvas = $('#lab-canvas');
  const hotOf = (t) => {
    const h = t.closest && t.closest('[data-hot]');
    if (!h) return null;
    const v = h.closest('.v'); // a hot spot that is itself a hidden variant is not tappable
    return v && !v.classList.contains('is-on') ? null : h;
  };
  function jumpTo(hot) {
    const [tab, gid] = hot.split(':');
    setTab(tab);
    const el = $('[data-grp="' + gid + '"]'); if (!el) return;
    el.classList.remove('is-pulse'); void el.offsetWidth; el.classList.add('is-pulse');
    const wide = matchMedia('(min-width: 1024px)').matches;
    const off = wide ? -110 : -(($('.lab__stage').offsetHeight || 0) + ($('.lab__tabs').offsetHeight || 0) + 12);
    if (window.__lenis) window.__lenis.scrollTo(el, { offset: off, duration: .9 });
    else window.scrollTo({ top: el.getBoundingClientRect().top + scrollY + off, behavior: reduced.matches ? 'auto' : 'smooth' });
  }
  svg.addEventListener('click', (e) => {
    const h = hotOf(e.target); if (!h) return;
    touch(); jumpTo(h.dataset.hot);
  });
  if (fine) {
    svg.addEventListener('pointermove', (e) => {
      const h = hotOf(e.target);
      if (!h) { tip.classList.remove('is-on'); return; }
      const g = G[h.dataset.hot.split(':')[1]], r = canvas.getBoundingClientRect();
      tip.textContent = 'Edit ' + low(g.label);
      tip.style.transform = 'translate3d(' + Math.min(r.width - 150, e.clientX - r.left + 14) + 'px,' + (e.clientY - r.top + 16) + 'px,0)';
      tip.classList.add('is-on');
    });
    svg.addEventListener('pointerleave', () => tip.classList.remove('is-on'));
  }

  /* ---------- layout, entrance, page-level state ---------- */
  const stage = $('.lab__stage');
  const sync = () => { lab.style.setProperty('--stage-h', stage.offsetHeight + 'px'); placeInd(); };
  if ('ResizeObserver' in window) new ResizeObserver(sync).observe(stage);
  addEventListener('resize', sync, { passive: true });

  if ('IntersectionObserver' in window) {
    new IntersectionObserver((es) => es.forEach(en => { root.classList.toggle('lab-active', en.isIntersecting); }), { rootMargin: '-30% 0px -30% 0px' }).observe(lab);
    const built = new IntersectionObserver((es) => es.forEach(en => { if (en.isIntersecting || en.boundingClientRect.bottom < 0) { lab.classList.add('is-built'); built.disconnect(); } }), { threshold: 0.05, rootMargin: '0px 0px -12% 0px' });
    built.observe($('.lab__grid'));
  } else lab.classList.add('is-built');

  apply();
  setTab('walls', true);
  requestAnimationFrame(sync);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(sync);
})();
