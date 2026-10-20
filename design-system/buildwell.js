// Buildwell Plus prototype — shared interactions
(function () {
  function openCount() {
    return document.querySelectorAll('.bw-pill').length
      ? Array.prototype.filter.call(document.querySelectorAll('.bw-pill'), function (p) {
          return p.textContent.trim().indexOf('Open') === 0;
        }).length
      : null; // not on introductions page
  }

  var stored = localStorage.getItem('bw-open-count');
  if (stored !== null) refreshBadges(parseInt(stored, 10) || 0);

  function refreshBadges(count) {
    localStorage.setItem('bw-open-count', count);
    document.querySelectorAll('.bw-bell-count').forEach(function (c) {
      c.style.display = count ? '' : 'none';
      c.textContent = count;
    });
    document.querySelectorAll('.bw-badge-new').forEach(function (b) {
      b.style.display = count ? '' : 'none';
      b.textContent = count + ' new';
    });
  }

  // notification bell dropdown
  document.querySelectorAll('.bw-bell-btn').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      btn.parentElement.querySelector('.bw-bell-menu').classList.toggle('open');
    });
  });

  // mark all as read
  document.querySelectorAll('.bw-bell-clear').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault(); e.stopPropagation();
      var menu = btn.closest('.bw-bell-menu');
      menu.querySelectorAll('.bw-bell-item').forEach(function (i) { i.remove(); });
      btn.outerHTML = '<div class="bw-bell-empty">No new notifications</div>';
      refreshBadges(0);
    });
  });

  // status dropdowns — persisted per row in localStorage
  var savedStatuses = {};
  try { savedStatuses = JSON.parse(localStorage.getItem('bw-statuses') || '{}'); } catch (e) {}
  Object.keys(savedStatuses).forEach(function (k) {
    if (savedStatuses[k].s === 'New') savedStatuses[k].s = 'Open'; // legacy label
  });

  function pillClass(s) {
    return 'bw-pill ' + (s === 'Open' ? 'bw-pill-new' : s === 'Contacted' ? 'bw-pill-contacted' : 'bw-pill-tbc');
  }

  function applyStatus(wrap, s, stamp) {
    var pill = wrap.querySelector('.bw-pill');
    pill.textContent = s + ' \u25be';
    pill.className = pillClass(s);
    var row = wrap.closest('tr');
    if (row) {
      row.classList.toggle('is-new', s === 'Open');
      var lu = row.querySelector('.last-updated');
      if (lu) lu.textContent = s === 'Open' ? 'never' : (stamp || 'today at ' + new Date().toLocaleTimeString([], {hour:'numeric', minute:'2-digit'}));
    }
  }

  // restore saved statuses on load
  document.querySelectorAll('.bw-status').forEach(function (wrap) {
    var row = wrap.closest('tr');
    var id = row && row.id;
    if (id && savedStatuses[id]) applyStatus(wrap, savedStatuses[id].s, savedStatuses[id].t);
  });
  var c0 = openCount();
  if (c0 !== null) refreshBadges(c0);

  document.querySelectorAll('.bw-status').forEach(function (wrap) {
    var pill = wrap.querySelector('.bw-pill');
    var menu = wrap.querySelector('.bw-status-menu');
    pill.addEventListener('click', function (e) {
      e.stopPropagation();
      document.querySelectorAll('.bw-status-menu.open').forEach(function (m) { m.classList.remove('open'); });
      menu.classList.toggle('open');
    });
    menu.querySelectorAll('button[data-status]').forEach(function (opt) {
      opt.addEventListener('click', function (e) {
        e.stopPropagation();
        var s = opt.dataset.status;
        var stamp = s === 'Open' ? null : 'today at ' + new Date().toLocaleTimeString([], {hour:'numeric', minute:'2-digit'});
        applyStatus(wrap, s, stamp);
        var row = wrap.closest('tr');
        if (row && row.id) {
          savedStatuses[row.id] = {s: s, t: stamp};
          localStorage.setItem('bw-statuses', JSON.stringify(savedStatuses));
        }
        menu.classList.remove('open');
        var c = openCount();
        if (c !== null) refreshBadges(c);
      });
    });
  });

  document.addEventListener('click', function () {
    document.querySelectorAll('.bw-status-menu.open, .bw-bell-menu.open').forEach(function (m) { m.classList.remove('open'); });
    document.querySelectorAll('.bw-fab.open').forEach(function (f) { f.classList.remove('open'); });
  });

  // ---- floating action button (home / reset) ----
  var inSub = /\/(mvp|deck-flow)\//.test(location.pathname);
  var fab = document.createElement('div');
  fab.className = 'bw-fab';
  fab.innerHTML =
    '<div class="bw-fab-opts">' +
      '<a class="bw-fab-opt" href="' + (inSub ? '../index.html' : 'index.html') + '">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/></svg>Go back home</a>' +
      (document.body.dataset.fab === 'home-only' ? '' :
      '<button class="bw-fab-opt" id="bw-fab-reset">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/></svg>Reset state</button>') +
    '</div>' +
    '<button class="bw-fab-main" aria-label="Demo tools">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h10M18 8h2M4 16h4M12 16h8"/><circle cx="16" cy="8" r="2.2"/><circle cx="9" cy="16" r="2.2"/></svg>' +
    '</button>';
  document.body.appendChild(fab);
  fab.querySelector('.bw-fab-main').addEventListener('click', function (e) {
    e.stopPropagation(); fab.classList.toggle('open');
  });
  var rst = fab.querySelector('#bw-fab-reset');
  if (rst) rst.addEventListener('click', function () {
    localStorage.clear(); location.reload();
  });
})();
