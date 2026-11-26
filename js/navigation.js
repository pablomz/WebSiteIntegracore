/* IntegraCore · Navegación v0.1
   Menú móvil (abrir/cerrar, Escape, foco) y submenú de Soluciones en escritorio.
   Sin dependencias. Sin JS, la navegación queda visible y funciona como lista de enlaces. */
(() => {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('nav-panel');
  const subBtn = document.querySelector('.sub-toggle');
  const subList = document.getElementById('sub-soluciones');
  if (!nav) return;
  const mq = window.matchMedia('(max-width: 960px)');

  const setMenu = (open, returnFocus) => {
    if (!toggle) return;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.querySelector('.nav-toggle__label').textContent = open ? 'Cerrar' : 'Menú';
    nav.classList.toggle('is-open', open);
    if (!open && returnFocus) toggle.focus();
  };
  const setSub = (open, returnFocus) => {
    if (!subBtn || !subList) return;
    subBtn.setAttribute('aria-expanded', String(open));
    subList.classList.toggle('is-open', open);
    if (!open && returnFocus) subBtn.focus();
  };

  if (toggle) toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
  if (subBtn) subBtn.addEventListener('click', () => setSub(subBtn.getAttribute('aria-expanded') !== 'true'));

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (subBtn && subBtn.getAttribute('aria-expanded') === 'true') { setSub(false, true); return; }
    if (toggle && toggle.getAttribute('aria-expanded') === 'true') setMenu(false, true);
  });
  document.addEventListener('click', (e) => {
    if (subBtn && !e.target.closest('.has-sub')) setSub(false);
    if (mq.matches && toggle && !e.target.closest('.site-head')) setMenu(false);
  });
  // Un enlace del menú cierra el panel (anclas dentro de la misma página).
  nav.addEventListener('click', (e) => {
    if (e.target.closest('a')) { setMenu(false); setSub(false); }
  });
  // Si el foco sale del submenú de escritorio, se cierra.
  if (subList) subList.addEventListener('focusout', (e) => {
    if (!e.relatedTarget || !e.relatedTarget.closest('.has-sub')) setSub(false);
  });
  mq.addEventListener('change', () => { setMenu(false); setSub(false); });
})();
