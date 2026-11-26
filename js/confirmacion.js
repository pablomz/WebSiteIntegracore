/* IntegraCore · Página de confirmación del formulario (destino de la redirección de Zoho).
   Solo afirma «recibimos» si esta pestaña envió el formulario en esta sesión (marca técnica sin datos personales)
   y llegó aquí por la redirección de Zoho. Si alguien abre la URL directamente, no se afirma nada. */
(() => {
  const box = document.getElementById('conf-cuerpo'); if (!box) return;
  let env = null; try { env = JSON.parse(sessionStorage.getItem('ic_envio') || 'null'); } catch (e) {}
  const mail = '<a href="mailto:pablo@integracoretech.com">pablo@integracoretech.com</a>';
  const agenda = '<a href="https://calendar.app.google/J1nHAJsJ6yLDKBkW7" target="_blank" rel="noopener noreferrer">agenda una reunión de 45 minutos</a>';
  const add = (h) => { box.insertAdjacentHTML('beforeend', h); };
  if (env && env.t && Date.now() - env.t < 30 * 60 * 1000) {
    env.ok = Date.now(); try { sessionStorage.setItem('ic_envio', JSON.stringify(env)); } catch (e) {}
    add('<h2 class="t-h1">Recibimos tu solicitud.</h2><p class="t-body">El equipo de IntegraCore se pondrá en contacto contigo para coordinar la conversación. No necesitas enviar el formulario otra vez.</p><p class="t-body">Si quieres avanzar más rápido, ' + agenda + '.</p>');
  } else {
    add('<h2 class="t-h1">Esta página confirma el envío del formulario de contacto.</h2><p class="t-body">No encontramos un envío reciente en esta sesión, así que no podemos confirmar ninguna solicitud desde aquí. Si enviaste el formulario y no ves un aviso de recepción, no lo reenvíes: escríbenos a ' + mail + ' o ' + agenda + '.</p><p class="t-body"><a href="../">Ir al formulario de contacto</a></p>');
  }
  const h = box.querySelector('h2'); if (h) { h.setAttribute('tabindex', '-1'); h.focus(); }
})();
