/* Aviso de cookies – D&V Placas NFC
 * O site não usa cookies de publicidade nem de rastreio. Este aviso só informa
 * e guarda neste aparelho que a pessoa já o leu (chave "dv-cookies-v1"). */
(function () {
  "use strict";
  var KEY = "dv-cookies-v1";
  try { if (localStorage.getItem(KEY)) return; } catch (e) { /* sem armazenamento: mostra sempre */ }
  var base = /\/(produtos|pagar|painel)\//.test(location.pathname) ? "../" : "";
  var css = [
    "#dvCookies{position:fixed;left:calc(14px + env(safe-area-inset-left,0px));bottom:calc(14px + env(safe-area-inset-bottom,0px));z-index:60;max-width:430px;",
    "width:calc(100% - 28px);background:#17171b;color:#f3efe6;border:1px solid #2b2a30;border-top:2px solid #d4ad5b;border-radius:16px;",
    "padding:16px 18px;box-shadow:0 18px 50px rgba(0,0,0,.55);font:15px/1.5 'Figtree','Segoe UI',system-ui,sans-serif;",
    "transform:translateY(20px);opacity:0;transition:transform .35s ease,opacity .35s ease}",
    "#dvCookies.on{transform:none;opacity:1}",
    "#dvCookies strong{display:flex;align-items:center;gap:8px;font-family:'Sora','Segoe UI',sans-serif;font-size:15px;color:#f0d38d;margin-bottom:6px}",
    "#dvCookies p{margin:0 0 12px;color:#cfc8ba}",
    "#dvCookies .dc-act{display:flex;gap:10px;align-items:center;flex-wrap:wrap}",
    "#dvCookies button{background:#d4ad5b;color:#1a1408;border:0;border-radius:999px;padding:10px 20px;font:600 15px 'Figtree',sans-serif;cursor:pointer}",
    "#dvCookies button:hover{background:#f0d38d}",
    "#dvCookies button:focus-visible,#dvCookies a:focus-visible{outline:2px solid #f0d38d;outline-offset:3px}",
    "#dvCookies a{color:#d4ad5b;text-underline-offset:3px}",
    "body.dv-cookies-on .wa-float{bottom:calc(18px + var(--dvck,0px))}",
    "@media (prefers-reduced-motion:reduce){#dvCookies{transition:none}}"
  ].join("");
  function mostrar() {
    var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);
    var d = document.createElement("div");
    d.id = "dvCookies"; d.setAttribute("role", "dialog"); d.setAttribute("aria-live", "polite"); d.setAttribute("aria-label", "Aviso de cookies");
    d.innerHTML =
      '<strong><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l7 3v5c0 4.5-3 8.3-7 10-4-1.7-7-5.5-7-10V6z"/><path d="m9 12 2 2 4-4"/></svg>A sua privacidade está protegida</strong>' +
      '<p>Este site <b>não usa cookies de publicidade nem de rastreio</b> e não sabe quem o visita. Contamos as visitas de forma anónima, sem cookies e sem guardar o endereço IP. Só ao pagar é que o Stripe usa cookies próprios, para proteger o pagamento.</p>' +
      '<div class="dc-act"><button type="button">Entendi</button><a href="' + base + 'privacidade.html#cookies">Saber mais</a></div>';
    document.body.appendChild(d);
    document.body.classList.add("dv-cookies-on");
    var ajusta = function () { document.body.style.setProperty("--dvck", (window.innerWidth < 640 ? d.offsetHeight + 14 : 0) + "px"); };
    ajusta(); window.addEventListener("resize", ajusta);
    requestAnimationFrame(function () { d.classList.add("on"); });
    d.querySelector("button").addEventListener("click", function () {
      try { localStorage.setItem(KEY, new Date().toISOString()); } catch (e) {}
      d.classList.remove("on"); document.body.classList.remove("dv-cookies-on");
      window.removeEventListener("resize", ajusta);
      setTimeout(function () { d.remove(); }, 380);
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mostrar); else setTimeout(mostrar, 600);
})();
