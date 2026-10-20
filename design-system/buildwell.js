// Buildwell Plus prototype — shared interactions
(function () {
  // notification bell dropdown
  document.querySelectorAll('.bw-bell-btn').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      btn.parentElement.querySelector('.bw-bell-menu').classList.toggle('open');
    });
  });

  // status dropdowns
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
        pill.textContent = s + ' \u25be';
        pill.className = 'bw-pill ' + (
          s === 'New' ? 'bw-pill-new' :
          s === 'Contacted' ? 'bw-pill-contacted' : 'bw-pill-tbc');
        var row = wrap.closest('tr');
        if (row) {
          row.classList.remove('is-new');
          var lu = row.querySelector('.last-updated');
          if (lu) lu.textContent = s === 'New' ? 'never' : 'today at ' + new Date().toLocaleTimeString([], {hour:'numeric', minute:'2-digit'});
        }
        menu.classList.remove('open');
      });
    });
  });

  document.addEventListener('click', function () {
    document.querySelectorAll('.bw-status-menu.open, .bw-bell-menu.open').forEach(function (m) { m.classList.remove('open'); });
  });
})();
