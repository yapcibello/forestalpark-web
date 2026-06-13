/**
 * Manejo de formularios Fusion en el sitio estático Astro.
 *
 * El WordPress original enviaba los formularios Fusion por AJAX a
 * admin-ajax.php (que ya no existe). Este script intercepta el envío en
 * FASE DE CAPTURA (preempta el handler jQuery de Fusion con
 * stopImmediatePropagation) y lo redirige al endpoint /api/contacto.php.
 *
 * Cubre los dos formularios del sitio:
 *  - Newsletter: solo campo `email`.
 *  - Contacto:   `your_name`, `your_email`, `mensaje`.
 *
 * Nota: se omite el token reCAPTCHA v3 de Fusion (lo generaba su propio JS).
 * La protección actual es el honeypot del endpoint PHP. Revisar reCAPTCHA
 * propio si aumenta el spam (ver plan F0).
 */
(function () {
  'use strict';

  function isEn() {
    return (document.documentElement.lang || '').toLowerCase().indexOf('en') === 0;
  }

  document.addEventListener(
    'submit',
    function (e) {
      var form = e.target;
      if (!form || form.tagName !== 'FORM' || !form.classList.contains('fusion-form')) return;

      // Preempta el envío AJAX de Fusion y el submit nativo.
      e.preventDefault();
      e.stopImmediatePropagation();

      var en = isEn();
      var btn = form.querySelector('[type="submit"]');
      var data = new FormData(form);

      if (btn) btn.disabled = true;

      fetch('/api/contacto.php', { method: 'POST', body: data })
        .then(function (r) { return r.json().catch(function () { return { ok: false }; }); })
        .then(function (json) {
          if (json && json.ok) {
            window.location.href = en ? '/en/thank-you/' : '/gracias/';
          } else {
            window.alert(
              en
                ? 'Sorry, your message could not be sent. Please try again or email us at reservas@forestalparktenerife.es.'
                : 'Lo sentimos, no se pudo enviar el mensaje. Inténtalo de nuevo o escríbenos a reservas@forestalparktenerife.es.'
            );
            if (btn) btn.disabled = false;
          }
        })
        .catch(function () {
          window.alert(
            en
              ? 'Connection error. Please try again later.'
              : 'Error de conexión. Inténtalo de nuevo más tarde.'
          );
          if (btn) btn.disabled = false;
        });
    },
    true // captura: se ejecuta antes que el handler de Fusion (bubble)
  );
})();
