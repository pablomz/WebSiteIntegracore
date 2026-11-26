/* IntegraCore · Formulario de contacto (Zoho CRM Web-to-Lead) · edición pública G4
   Envío: POST nativo de nivel superior al endpoint de Zoho. Zoho debe redirigir a /contacto/confirmacion/ (acción nativa
   «redirigir a una URL» del formulario). El sitio no lee la respuesta de Zoho (no hay fetch, no hay no-cors).
   Éxito = el navegador vuelve a /contacto/confirmacion/ en la misma pestaña que envió el formulario.
   Si no vuelve, se muestra «No podemos confirmar la recepción» y se bloquea el reenvío.
   Sin analítica ni cookies. Única marca en el navegador: sessionStorage «ic_envio» (hora y número al azar, sin datos personales). */
(() => {
  const form = document.getElementById('webform707752000004806004');
  if (!form) return;
  const status = document.getElementById('form-status');
  const submit = document.getElementById('formsubmit');
  const consent = document.getElementById('consent');
  const AGENDA = 'https://calendar.app.google/J1nHAJsJ6yLDKBkW7';
  const MAIL = 'pablo@integracoretech.com';
  const VENTANA = 30 * 60 * 1000;          // bloqueo de reenvío tras un envío en esta sesión
  const ESPERA_MAX = 25 * 1000;            // si la página sigue aquí tras este tiempo, no hubo confirmación
  const t0 = Date.now();

  const TEMAS = {
    datos: 'Datos, Data Warehouse o Business Intelligence', ia: 'Soluciones e implementaciones de IA',
    coe: 'Centro de Excelencia de IA', formacion: 'Formación especializada en IA',
    alianza: 'Posible colaboración o alianza', otro: 'Otro desafío o consulta',
  };
  const params = new URLSearchParams(window.location.search);
  const t = params.get('tema');
  if (t && Object.prototype.hasOwnProperty.call(TEMAS, t)) form.elements['LEADCF1'].value = TEMAS[t];

  const ZOHO_EMAIL_OK = (v) => { const a = v.indexOf('@'), d = v.lastIndexOf('.'); return !(a < 1 || d < a + 2 || d + 2 >= v.length); };
  const FIELDS = [
    { id: 'LEADCF1', msg: 'Selecciona qué deseas explorar.', ok: (v) => v !== '' && v !== '-None-' },
    { id: 'First_Name', msg: 'Indica tu nombre.', ok: (v) => v.trim() !== '' },
    { id: 'Last_Name', msg: 'Indica tus apellidos.', ok: (v) => v.trim() !== '' },
    { id: 'Company', msg: 'Indica tu empresa u organización.', ok: (v) => v.trim() !== '' },
    { id: 'Email', msg: 'Revisa el correo electrónico.', ok: (v) => v.trim() !== '' && ZOHO_EMAIL_OK(v.trim()) },
  ];
  const setErr = (id, msg, on) => {
    const el = document.getElementById(id), m = document.getElementById('err-' + id);
    m.textContent = on ? msg : ''; m.hidden = !on;
    if (on) el.setAttribute('aria-invalid', 'true'); else el.removeAttribute('aria-invalid');
  };
  const check = (f) => { const ok = f.ok(document.getElementById(f.id).value); setErr(f.id, f.msg, !ok); return ok; };
  const checkConsent = () => { const ok = consent.checked; setErr('consent', 'Para enviar tu solicitud necesitamos que aceptes la Política de privacidad.', !ok); return ok; };
  FIELDS.forEach((f) => {
    const el = document.getElementById(f.id);
    el.addEventListener(f.id === 'LEADCF1' ? 'change' : 'input', () => { if (el.getAttribute('aria-invalid') === 'true' && f.ok(el.value)) setErr(f.id, f.msg, false); });
    el.addEventListener('blur', () => { if (f.id !== 'LEADCF1' && el.value !== '') check(f); });
  });
  consent.addEventListener('change', () => { if (consent.checked) setErr('consent', '', false); });

  const show = (cls, html, focus = true) => { status.className = 'form-status ' + cls; status.innerHTML = html; status.hidden = false; if (focus) status.focus(); };
  const SIN_CONFIRMAR = '<p class="t-h3">No podemos confirmar la recepción.</p><p class="t-small">No reenvíes el formulario. Escríbenos a <a href="mailto:' + MAIL + '">' + MAIL +
    '</a> o <a href="' + AGENDA + '" target="_blank" rel="noopener noreferrer">agenda una reunión de 45 minutos</a>.</p>';
  const bloquear = () => { submit.disabled = true; submit.setAttribute('aria-disabled', 'true'); };

  const leer = () => { try { return JSON.parse(sessionStorage.getItem('ic_envio') || 'null'); } catch (e) { return null; } };
  const previo = () => { const e = leer(); return e && e.t && Date.now() - e.t < VENTANA ? e : null; };

  // Al volver a esta página (atrás del navegador o recarga) con un envío ya iniciado y sin confirmación: no se asume nada.
  const revisarPrevio = () => { const e = previo(); if (e && !e.ok) { bloquear(); show('is-error', SIN_CONFIRMAR, false); } else if (e && e.ok) { bloquear(); show('is-ok', '<p class="t-h3">Ya recibimos tu solicitud.</p><p class="t-small">No necesitas enviarla de nuevo.</p>', false); } };
  window.addEventListener('pageshow', revisarPrevio);
  revisarPrevio();

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (submit.disabled) return;
    status.hidden = true;
    const hp = form.elements['aG9uZXlwb3Q']; if (hp && hp.value !== '') return;      // señuelo antispam de Zoho: no se envía
    const res = FIELDS.map(check); const okC = checkConsent();
    const bad = FIELDS.find((f, i) => !res[i]);
    if (bad || !okC) {
      show('is-error', '<p class="t-h3">Revisa los campos marcados.</p>', false);
      document.getElementById(bad ? bad.id : 'consent').focus();
      return;
    }
    if (previo()) { bloquear(); show('is-error', SIN_CONFIRMAR, false); return; }
    if (Date.now() - t0 < 2500) { show('is-error', '<p class="t-h3">Espera un momento y vuelve a pulsar Enviar.</p>', false); return; }
    try { sessionStorage.setItem('ic_envio', JSON.stringify({ t: Date.now(), n: Math.random().toString(36).slice(2, 10) })); } catch (err) { /* sin almacenamiento: se envía igual; la protección de reenvío no estará activa */ }
    bloquear(); submit.textContent = 'Enviando…'; submit.setAttribute('aria-busy', 'true');
    show('is-demo', '<p class="t-h3">Enviando…</p><p class="t-small">No cierres ni recargues la página.</p>', false);
    consent.disabled = true;                      // la casilla de privacidad no es un campo de Zoho: no viaja
    setTimeout(() => {                            // si seguimos aquí, el navegador no volvió de Zoho: no hay confirmación
      submit.removeAttribute('aria-busy'); submit.textContent = 'Enviar'; show('is-error', SIN_CONFIRMAR);
    }, ESPERA_MAX);
    HTMLFormElement.prototype.submit.call(form);   // POST nativo, nivel superior
  });
})();
