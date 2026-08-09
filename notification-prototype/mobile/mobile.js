/* Mobile gallery — filter which app is shown (click or #parent / #admin hash) */
const switcher = document.getElementById('switcher');

function applyFilter(f) {
  switcher.querySelectorAll('button').forEach(x => x.classList.toggle('on', x.dataset.f === f));
  document.querySelectorAll('.group').forEach(g => {
    g.style.display = (f === 'all' || g.dataset.group === f) ? '' : 'none';
  });
}

switcher.addEventListener('click', (e) => {
  const b = e.target.closest('button[data-f]');
  if (!b) return;
  applyFilter(b.dataset.f);
  history.replaceState(null, '', b.dataset.f === 'all' ? location.pathname : '#' + b.dataset.f);
});

const h = (location.hash || '').replace('#', '');
applyFilter(h === 'parent' || h === 'admin' ? h : 'all');
