// Buildwell Plus hifi — shared interactions (same storage keys as lo-fi so state carries over)
(function () {
  function openCount() {
    if (!document.querySelectorAll('.pill').length) return null;
    return Array.prototype.filter.call(document.querySelectorAll('.pill'), function (p) {
      return p.textContent.trim().indexOf('Open') === 0;
    }).length;
  }
  function refreshBadges(count) {
    localStorage.setItem('bw-open-count', count);
    document.querySelectorAll('.bell-count').forEach(function (c) {
      c.style.display = count ? '' : 'none'; c.textContent = count;
    });
    document.querySelectorAll('.badge-new').forEach(function (b) {
      b.style.display = count ? '' : 'none'; b.textContent = count + ' new';
    });
  }
  var stored = localStorage.getItem('bw-open-count');
  if (stored !== null) refreshBadges(parseInt(stored, 10) || 0);

  document.querySelectorAll('.bell-btn').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      btn.parentElement.querySelector('.bell-menu').classList.toggle('open');
    });
  });
  document.querySelectorAll('.bell-clear').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault(); e.stopPropagation();
      var menu = btn.closest('.bell-menu');
      menu.querySelectorAll('.bell-item').forEach(function (i) { i.remove(); });
      btn.outerHTML = '<div class="bell-empty">No new notifications</div>';
      refreshBadges(0);
    });
  });

  var savedStatuses = {};
  try { savedStatuses = JSON.parse(localStorage.getItem('bw-statuses') || '{}'); } catch (e) {}
  Object.keys(savedStatuses).forEach(function (k) {
    if (savedStatuses[k].s === 'New') savedStatuses[k].s = 'Open';
  });
  function pillClass(s) {
    return 'pill ' + (s === 'Open' ? 'pill-open' : s === 'Contacted' ? 'pill-contacted' : 'pill-tbc');
  }
  function applyStatus(wrap, s, stamp) {
    var pill = wrap.querySelector('.pill');
    pill.textContent = s;
    pill.className = pillClass(s);
    var row = wrap.closest('tr');
    if (row) {
      row.classList.toggle('is-new', s === 'Open');
      var lu = row.querySelector('.last-updated');
      if (lu) lu.textContent = s === 'Open' ? 'never' : (stamp || 'today at ' + new Date().toLocaleTimeString([], {hour:'numeric', minute:'2-digit'}));
    }
  }
  document.querySelectorAll('.st').forEach(function (wrap) {
    var row = wrap.closest('tr');
    var id = row && row.id;
    if (id && savedStatuses[id]) applyStatus(wrap, savedStatuses[id].s, savedStatuses[id].t);
  });
  var c0 = openCount();
  if (c0 !== null) refreshBadges(c0);

  document.querySelectorAll('.st').forEach(function (wrap) {
    var pill = wrap.querySelector('.pill');
    var menu = wrap.querySelector('.st-menu');
    pill.addEventListener('click', function (e) {
      e.stopPropagation();
      document.querySelectorAll('.st-menu.open').forEach(function (m) { m.classList.remove('open'); });
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
    document.querySelectorAll('.st-menu.open, .bell-menu.open').forEach(function (m) { m.classList.remove('open'); });
    document.querySelectorAll('.bw-fab.open').forEach(function (f) { f.classList.remove('open'); });
  });

  // FAB (same as lo-fi)
  var inSub = /\/(mvp|deck-flow|hifi|research)\//.test(location.pathname);
  var fab = document.createElement('div');
  fab.className = 'bw-fab';
  fab.innerHTML =
    '<div class="bw-fab-opts">' +
      '<a class="bw-fab-opt" href="' + (inSub ? '../index.html' : 'index.html') + '">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/></svg>Go back home</a>' +
      '<button class="bw-fab-opt" id="bw-fab-reset">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/></svg>Reset state</button>' +
    '</div>' +
    '<button class="bw-fab-main" aria-label="Demo tools">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h10M18 8h2M4 16h4M12 16h8"/><circle cx="16" cy="8" r="2.2"/><circle cx="9" cy="16" r="2.2"/></svg>' +
    '</button>';
  document.body.appendChild(fab);
  fab.querySelector('.bw-fab-main').addEventListener('click', function (e) {
    e.stopPropagation(); fab.classList.toggle('open');
  });
  var rst = fab.querySelector('#bw-fab-reset');
  if (rst) rst.addEventListener('click', function () { localStorage.clear(); location.reload(); });
})();
