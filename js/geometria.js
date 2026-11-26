/* IntegraCore · Geometría v1.0
   Dibuja cada SVG .geo cuando entra en pantalla (M.01 se dibuja, no aparece).
   Las capas llevan --i para el orden; el punto verde llega al final.
   Un .geo con data-draw="load" se dibuja al cargar (el hero). */
{
  const root = document.documentElement;
  root.classList.add('js');

  const draw = (el) => el.classList.add('is-drawn');
  const all = document.querySelectorAll('.geo');

  // Movimiento reducido o navegador sin IntersectionObserver: todo dibujado.
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced || !('IntersectionObserver' in window)) {
    all.forEach(draw);
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { draw(e.target); io.unobserve(e.target); }
      });
    }, { threshold: 0.35 });
    all.forEach((el) => {
      if (el.dataset.draw === 'load') requestAnimationFrame(() => requestAnimationFrame(() => draw(el)));
      else io.observe(el);
    });
  }
}
