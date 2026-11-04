/* D&V Placas NFC — Plano Pro: mapa de calor dos toques, infográficos e visita guiada.
 * Usado no site (demonstração) e no Painel do Cliente (dados reais ou demonstração).
 * Os toques guardam só a data e a hora: nada sobre quem toca. */
(function () {
  var DIAS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
  var DIAS_L = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];
  var MESES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

  var css = `
.pro-ui{--pg:var(--gold,#d4ad5b);--pg2:var(--gold-2,var(--gold2,#f0d38d));--pc:var(--card,#17171b);--pc2:var(--card-2,var(--card2,#1e1e23));--pl:var(--line,#2b2a30);--pm:var(--muted,#a9a397);--pf:var(--fg,#f3efe6);color:var(--pf)}
.pro-ui *{box-sizing:border-box}
.pro-tabs{display:grid;grid-template-columns:1fr 1fr;gap:6px;padding:5px;border:1px solid var(--pl);border-radius:16px;background:var(--pc)}
.pro-tabs button{border:0;border-radius:12px;padding:12px 8px;background:transparent;color:var(--pm);font:700 15px/1.2 inherit;cursor:pointer;display:grid;gap:2px}
.pro-tabs button small{font-weight:500;font-size:12px}
.pro-tabs button[aria-selected=true]{background:linear-gradient(180deg,var(--pg2),var(--pg));color:#1a1408}
.pro-win{margin-top:14px;border:1px solid var(--pl);border-radius:22px;background:#111114;overflow:hidden;box-shadow:0 30px 60px rgba(0,0,0,.35)}
.pro-bar{display:flex;align-items:center;gap:7px;padding:11px 16px;border-bottom:1px solid var(--pl);font-size:12.5px;color:var(--pm)}
.pro-bar i{width:9px;height:9px;border-radius:50%;background:#2f2e35}.pro-bar span{margin-left:6px}
.pro-bar .ex{margin-left:auto;font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--pg);border:1px solid var(--pg);border-radius:999px;padding:2px 8px}
.pro-body{padding:14px;display:grid;gap:12px}
.pro-kpis{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}
.pro-kpi{background:var(--pc);border:1px solid var(--pl);border-radius:14px;padding:12px}
.pro-kpi .l{font-size:12px;color:var(--pm)}.pro-kpi .n{font-family:"Sora",sans-serif;font-weight:800;font-size:26px;line-height:1.15;margin-top:2px}
.pro-kpi .d{font-size:12px;font-weight:600;margin-top:2px}.pro-up{color:#7fd3a0}.pro-down{color:#ff8f8f}.pro-eq{color:var(--pm)}
.pro-box{background:var(--pc);border:1px solid var(--pl);border-radius:16px;padding:14px}
.pro-box h4{margin:0;font-family:"Sora",sans-serif;font-size:15px;display:flex;justify-content:space-between;align-items:baseline;gap:8px}
.pro-box h4 small{font-family:inherit;font-weight:500;font-size:12px;color:var(--pm)}
.pro-heat{display:grid;grid-template-columns:30px repeat(var(--cols),minmax(0,1fr));gap:3px;margin-top:12px;font-size:11px;color:var(--pm)}
.pro-heat .dl{display:flex;align-items:center}
.pro-heat button{aspect-ratio:1;border:0;border-radius:4px;padding:0;cursor:pointer;background:#242329;outline-offset:1px}
.pro-heat button[aria-pressed=true]{outline:2px solid var(--pf)}
.pro-hx{display:grid;grid-template-columns:30px repeat(var(--cols),minmax(0,1fr));gap:3px;font-size:10.5px;color:var(--pm);margin-top:4px}
.pro-hx span{text-align:left;white-space:nowrap}
.pro-leg{display:flex;align-items:center;gap:4px;font-size:11px;color:var(--pm);margin-top:10px}.pro-leg i{width:14px;height:10px;border-radius:3px}
.pro-det{margin-top:10px;font-weight:700;color:var(--pg);font-size:14px;min-height:20px}
.pro-sum{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin-top:12px;padding-top:12px;border-top:1px solid var(--pl)}
.pro-sum div{font-size:12px;color:var(--pm)}.pro-sum b{display:block;color:var(--pf);font-size:15px;margin-top:2px}
.pro-bars{display:flex;align-items:flex-end;gap:8px;height:130px;margin-top:12px}
.pro-bars div{flex:1;display:flex;flex-direction:column;justify-content:flex-end;align-items:center;gap:5px;height:100%}
.pro-bars i{display:block;width:100%;border-radius:7px 7px 3px 3px;background:linear-gradient(180deg,var(--pg2),var(--pg));min-height:3px;transition:height .5s}
.pro-bars i.antes{background:#3a3940}
.pro-bars b{font-size:12px}.pro-bars span{font-size:11px;color:var(--pm)}
.pro-line{width:100%;height:auto;margin-top:10px;display:block}
.pro-kv{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:12px}
.pro-kv div{background:var(--pc2);border-radius:12px;padding:10px 12px;font-size:12px;color:var(--pm)}.pro-kv b{display:block;font-family:"Sora",sans-serif;font-size:22px;color:var(--pf)}
.pro-dest{display:flex;flex-wrap:wrap;gap:6px;margin-top:12px}
.pro-dest button{border:1px solid var(--pl);background:var(--pc2);color:var(--pf);border-radius:999px;padding:8px 12px;font:600 13px/1 inherit;cursor:pointer}
.pro-dest button[aria-pressed=true]{border-color:var(--pg);color:var(--pg);background:rgba(212,173,91,.10)}
.pro-phone{margin:12px auto 0;width:180px;border-radius:26px;border:6px solid #2a2a30;background:#0b0b0d;padding:14px 12px;text-align:center;min-height:200px;display:grid;align-content:center;gap:8px}
.pro-phone .ic{font-size:30px}.pro-phone b{font-size:14px}.pro-phone small{font-size:11px;color:var(--pm)}
.pro-wa{margin-top:12px;background:#0b141a;border-radius:14px;padding:12px}
.pro-wa p{margin:0;background:#1f2c33;border-radius:10px 10px 10px 2px;padding:10px 12px;font-size:13px;line-height:1.5;color:#e9edef;max-width:92%}
.pro-wa p small{display:block;text-align:right;color:#8696a0;font-size:10.5px;margin-top:4px}
.pro-sl{position:relative}
.pro-sl-vp{overflow:hidden;transition:height .35s ease}
.pro-sl-track{display:flex;overflow-x:auto;scroll-snap-type:x mandatory;scroll-behavior:smooth;-webkit-overflow-scrolling:touch;scrollbar-width:none;align-items:flex-start}
.pro-sl-track::-webkit-scrollbar{display:none}
.pro-sl-s{flex:0 0 100%;scroll-snap-align:start;scroll-snap-stop:always;padding:2px;box-sizing:border-box;min-width:0}
.pro-sl-cap{padding:6px 4px 12px}
.pro-sl-cap .k{font-size:11px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:var(--pg)}
.pro-sl-cap h4{margin:6px 0 4px;font-family:"Sora",sans-serif;font-size:19px;line-height:1.2}
.pro-sl-cap p{margin:0;color:var(--pm);font-size:14px;line-height:1.5}
.pro-sl-s .pro-box{margin-top:0}
.pro-sl-nav{display:flex;align-items:center;gap:10px;margin-top:14px}
.pro-sl-nav .ar{flex:none;width:46px;height:46px;border-radius:50%;border:1px solid var(--pl);background:var(--pc2);color:var(--pf);font:700 20px/1 inherit;cursor:pointer;display:grid;place-items:center}
.pro-sl-nav .ar:disabled{opacity:.35;cursor:default}
.pro-sl-dots{flex:1;display:flex;justify-content:center;gap:8px}
.pro-sl-dots button{width:9px;height:9px;padding:0;border-radius:9px;border:0;background:var(--pl);cursor:pointer;transition:width .3s,background .3s}
.pro-sl-dots button[aria-current=true]{width:26px;background:var(--pg)}
.pro-sl-cta{display:block;width:100%;margin-top:12px;padding:14px;border-radius:12px;border:0;background:linear-gradient(180deg,var(--pg2),var(--pg));color:#1a1408;font:700 15px/1 inherit;cursor:pointer}
.pro-sl-hint{font-size:12px;color:var(--pm);text-align:center;margin-top:8px}
.pro-tour{position:sticky;bottom:calc(10px + env(safe-area-inset-bottom,0px));z-index:3;box-shadow:0 -10px 30px rgba(0,0,0,.45);background-color:#17171b;margin-top:16px;border:1px solid var(--pg);border-radius:20px;padding:16px;background:linear-gradient(180deg,#241f14,#17171b 70%)}
.pro-tour .k{font-size:11px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:var(--pg)}
.pro-tour h4{margin:6px 0 4px;font-family:"Sora",sans-serif;font-size:18px}
.pro-tour p{margin:0;color:var(--pm);font-size:14px}
.pro-dots{display:flex;gap:6px;margin-top:12px}.pro-dots i{height:6px;flex:1;border-radius:6px;background:var(--pl)}.pro-dots i.on{background:var(--pg)}
.pro-nav{display:flex;gap:8px;margin-top:12px}
.pro-nav button{flex:1;padding:12px;border-radius:12px;border:1px solid var(--pl);background:var(--pc2);color:var(--pf);font:700 14px/1 inherit;cursor:pointer}
.pro-nav button.go{background:linear-gradient(180deg,var(--pg2),var(--pg));color:#1a1408;border-color:transparent}
.pro-nav button:disabled{opacity:.4;cursor:default}
.pro-ui [data-p]{scroll-margin-top:84px}
.pro-foco{box-shadow:0 0 0 2px var(--pg),0 0 30px rgba(212,173,91,.25);transition:box-shadow .3s}
@media (max-width:420px){.pro-kpi .n{font-size:22px}.pro-heat{gap:2px}.pro-hx{gap:2px}}
@media (prefers-reduced-motion:reduce){.pro-bars i{transition:none}}
.evo-wrap{margin-top:8px}.pro-evo{width:100%;height:auto;display:block;margin-top:6px}
.evo-leg{display:flex;flex-wrap:wrap;gap:14px;font-size:12.5px;color:var(--pm)}.evo-leg span{display:flex;align-items:center;gap:6px}
.evo-leg i{display:inline-block;width:22px;height:0;border-top:3px solid #f0d38d}.evo-leg i.lg-proj{border-top:3px dashed #8d887e}
.evo-res{margin-top:6px;font-size:14px;color:var(--pf)}.evo-res b{font-family:"Sora",sans-serif;font-size:22px;color:#7fd3a0;margin-right:4px}
.pro-vazio{font-size:12px;color:var(--pm);margin:6px 0 0}
.evo-real,.evo-antes{stroke-dasharray:1;stroke-dashoffset:1;animation:evoDraw 1.6s ease-out forwards}
.evo-antes{animation-duration:.7s}.evo-real{animation-delay:.7s}
.evo-proj{opacity:0;animation:evoFade .6s ease-out .7s forwards}
.evo-area{opacity:0;animation:evoFade .8s ease-out 1.6s forwards}
.evo-dot{opacity:0;animation:evoFade .4s ease-out 2.2s forwards}.evo-dot2{opacity:0;animation:evoFade .4s ease-out 1.3s forwards}
@keyframes evoDraw{to{stroke-dashoffset:0}}@keyframes evoFade{to{opacity:1}}
@media (prefers-reduced-motion:reduce){.evo-real,.evo-antes{animation:none;stroke-dashoffset:0}.evo-proj,.evo-area,.evo-dot,.evo-dot2{animation:none;opacity:1}}
`;
  function addCss() { if (document.getElementById("pro-css")) return; var s = document.createElement("style"); s.id = "pro-css"; s.textContent = css; document.head.appendChild(s); }
  function esc(t) { var d = document.createElement("div"); d.textContent = t == null ? "" : String(t); return d.innerHTML; }
  function fmt(n) { return Number(n || 0).toLocaleString("pt-PT"); }
  function delta(a, b, txt) {
    if (!b) return a ? "<span class='pro-up'>▲ novo</span>" : "<span class='pro-eq'>–</span>";
    var p = Math.round((a - b) / b * 100);
    return "<span class='" + (p > 0 ? "pro-up" : p < 0 ? "pro-down" : "pro-eq") + "'>" + (p > 0 ? "▲ +" : p < 0 ? "▼ " : "") + p + "%" + (txt ? " " + txt : "") + "</span>";
  }
  var COR = ["#242329", "#3b3427", "#6b5a2f", "#a8893f", "#d4ad5b", "#f0d38d"];
  function cor(v, max) { if (!v) return COR[0]; var i = Math.ceil(v / max * 5); return COR[Math.max(1, Math.min(5, i))]; }

  /* Mapa de calor: cells = [[dia 0-6, hora 0-23, n], ...] */
  function mapa(el, cells, opt) {
    addCss(); opt = opt || {}; el.classList.add("pro-ui");
    var g = {}, max = 1, porDia = [0, 0, 0, 0, 0, 0, 0], porHora = {}, tot = 0, hMin = 8, hMax = 21;
    (cells || []).forEach(function (c) {
      var d = +c[0], h = +c[1], n = +c[2]; g[d + "-" + h] = (g[d + "-" + h] || 0) + n;
      porDia[d] += n; porHora[h] = (porHora[h] || 0) + n; tot += n;
      if (n) { hMin = Math.min(hMin, h); hMax = Math.max(hMax, h); }
    });
    Object.keys(g).forEach(function (k) { max = Math.max(max, g[k]); });
    var cols = hMax - hMin + 1, h = "";
    h += "<div class='pro-heat' style='--cols:" + cols + "' role='grid' aria-label='Toques por dia da semana e hora'>";
    for (var d = 0; d < 7; d++) {
      h += "<span class='dl'>" + DIAS[d] + "</span>";
      for (var x = hMin; x <= hMax; x++) { var v = g[d + "-" + x] || 0; h += "<button type='button' data-d='" + d + "' data-h='" + x + "' data-v='" + v + "' style='background:" + cor(v, max) + "' aria-label='" + DIAS_L[d] + ", " + x + "h: " + v + " toques'></button>"; }
    }
    h += "</div><div class='pro-hx' style='--cols:" + cols + "'><span></span>";
    for (var y = hMin; y <= hMax; y++) h += "<span>" + ((y - hMin) % 4 === 0 ? y + "h" : "") + "</span>";
    h += "</div><div class='pro-leg'>Menos " + COR.map(function (c) { return "<i style='background:" + c + "'></i>"; }).join("") + " Mais</div>";
    h += "<div class='pro-det' aria-live='polite'>" + (tot ? "Toque num quadrado para ver esse momento." : "Ainda sem toques suficientes para o mapa.") + "</div>";
    var dTop = porDia.indexOf(Math.max.apply(null, porDia)), hTop = null, hv = -1;
    Object.keys(porHora).forEach(function (k) { if (porHora[k] > hv) { hv = porHora[k]; hTop = +k; } });
    var best = null, bv = 0; Object.keys(g).forEach(function (k) { if (g[k] > bv) { bv = g[k]; best = k; } });
    if (tot) {
      var bb = best.split("-");
      h += "<div class='pro-sum'><div>Dia mais forte<b>" + DIAS_L[dTop] + "</b></div><div>Hora de pico<b>" + hTop + "h–" + (hTop + 1) + "h</b></div><div>Melhor momento<b>" + DIAS[+bb[0]] + " " + bb[1] + "h</b></div></div>";
    }
    el.innerHTML = h;
    var det = el.querySelector(".pro-det"), media = opt.semanas || 13;
    el.querySelector(".pro-heat").addEventListener("click", function (e) {
      var b = e.target.closest("button"); if (!b) return;
      el.querySelectorAll(".pro-heat button[aria-pressed=true]").forEach(function (o) { o.setAttribute("aria-pressed", "false"); });
      b.setAttribute("aria-pressed", "true");
      var v = +b.dataset.v, hh = +b.dataset.h;
      det.textContent = DIAS_L[+b.dataset.d] + ", " + hh + "h–" + (hh + 1) + "h: " + fmt(v) + " toques" + (opt.periodo ? " " + opt.periodo : "") + (v ? " · cerca de " + Math.max(1, Math.round(v / media)) + " por semana" : "");
    });
  }

  function kpis(p) {
    return "<div class='pro-kpis'><div class='pro-kpi'><div class='l'>Hoje</div><div class='n'>" + fmt(p.hoje) + "</div><div class='d'>" +
      (p.hoje - p.ontem >= 0 ? "<span class='pro-up'>▲ +" + (p.hoje - p.ontem) + " vs ontem</span>" : "<span class='pro-down'>▼ " + (p.hoje - p.ontem) + " vs ontem</span>") + "</div></div>" +
      "<div class='pro-kpi'><div class='l'>7 dias</div><div class='n'>" + fmt(p.sem) + "</div><div class='d'>" + delta(p.sem, p.semAnt) + "</div></div>" +
      "<div class='pro-kpi'><div class='l'>30 dias</div><div class='n'>" + fmt(p.mes) + "</div><div class='d'>" + delta(p.mes, p.mesAnt) + "</div></div></div>";
  }
  function barras(lista, antesAte) {
    var max = Math.max.apply(null, lista.map(function (x) { return x.n; }).concat([1]));
    return "<div class='pro-bars'>" + lista.map(function (x, i) { return "<div><b>" + fmt(x.n) + "</b><i class='" + (antesAte != null && i < antesAte ? "antes" : "") + "' style='height:" + Math.max(3, Math.round(x.n / max * 100)) + "%'></i><span>" + esc(x.l) + "</span></div>"; }).join("") + "</div>";
  }
  function linha(pts, marca) {
    var W = 320, H = 120, P = 10, mx = Math.max.apply(null, pts), mn = Math.min.apply(null, pts);
    var xy = pts.map(function (v, i) { return [P + i * (W - 2 * P) / (pts.length - 1), H - P - (mx === mn ? .5 : (v - mn) / (mx - mn)) * (H - 2 * P - 14)]; });
    var d = xy.map(function (p, i) { return (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1); }).join(" ");
    var mxp = xy[marca] ? xy[marca][0] : null;
    return "<svg class='pro-line' viewBox='0 0 " + W + " " + H + "' role='img' aria-label='Evolução das avaliações'><defs><linearGradient id='pg' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='#d4ad5b' stop-opacity='.35'/><stop offset='1' stop-color='#d4ad5b' stop-opacity='0'/></linearGradient></defs>" +
      (mxp != null ? "<line x1='" + mxp + "' y1='4' x2='" + mxp + "' y2='" + (H - 4) + "' stroke='#a9a397' stroke-dasharray='3 4'/><text x='" + (mxp + 5) + "' y='14' fill='#a9a397' font-size='10'>placa instalada</text>" : "") +
      "<path d='" + d + " L" + xy[xy.length - 1][0] + " " + (H - 2) + " L" + xy[0][0] + " " + (H - 2) + " Z' fill='url(#pg)'/><path d='" + d + "' fill='none' stroke='#f0d38d' stroke-width='2.5' stroke-linejoin='round' stroke-linecap='round'/>" +
      xy.map(function (p, i) { return i === xy.length - 1 ? "<circle cx='" + p[0] + "' cy='" + p[1] + "' r='4.5' fill='#f0d38d'/>" : ""; }).join("") + "</svg>";
  }


  /* Evolução das avaliações: duas linhas sobrepostas.
   * Dourada = com a placa (real). Cinzenta tracejada = ritmo que tinha antes da placa, prolongado.
   * serie: [{t: ms, n}], inst: {t: ms, n}; opt.ritmo: avaliações/dia antes da placa (se não houver histórico). */
  var gid = 0;
  function evolucao(serie, inst, opt) {
    addCss(); opt = opt || {}; gid++;
    var pts = (serie || []).filter(function (p) { return p && isFinite(p.t) && isFinite(p.n); }).sort(function (a, b) { return a.t - b.t; });
    if (inst && isFinite(inst.t) && isFinite(inst.n) && !pts.some(function (p) { return Math.abs(p.t - inst.t) < 864e5; })) pts.push({ t: inst.t, n: inst.n });
    pts.sort(function (a, b) { return a.t - b.t; });
    var agora = opt.ate || Date.now();
    if (!pts.length) return "<p class='pro-vazio'>Ainda sem leituras do Google.</p>";
    if (!inst) inst = pts[0];
    var antes = pts.filter(function (p) { return p.t <= inst.t; }), depois = pts.filter(function (p) { return p.t >= inst.t; });
    var ult = pts[pts.length - 1]; if (ult.t < agora - 864e5) agora = Math.max(ult.t, agora);
    // ritmo antes da placa (avaliações por dia)
    var ritmo = opt.ritmo != null ? opt.ritmo : null;
    if (antes.length >= 2) { var a0 = antes[0], a1 = antes[antes.length - 1]; if (a1.t - a0.t >= 7 * 864e5) ritmo = Math.max(0, (a1.n - a0.n) / ((a1.t - a0.t) / 864e5)); }
    var semDados = ritmo == null; if (semDados) ritmo = 0;
    var fim = Math.max(agora, ult.t, inst.t + 7 * 864e5), ini = Math.min(pts[0].t, inst.t - Math.max(14 * 864e5, (fim - inst.t) * 0.25));
    var proj = inst.n + ritmo * (fim - inst.t) / 864e5, real = ult.n;
    var vmax = Math.max(real, proj, inst.n) , vmin = Math.min(pts[0].n, inst.n);
    var pad = Math.max(2, (vmax - vmin) * 0.12); vmax += pad; vmin = Math.max(0, vmin - pad);
    var W = 640, H = 260, L = 34, R = 16, T = 22, B = 28;
    var X = function (t) { return L + (t - ini) / (fim - ini) * (W - L - R); }, Y = function (v) { return T + (1 - (v - vmin) / ((vmax - vmin) || 1)) * (H - T - B); };
    var path = function (arr) { return arr.map(function (p, i) { return (i ? "L" : "M") + X(p.t).toFixed(1) + " " + Y(p.n).toFixed(1); }).join(" "); };
    var linhaAntes = antes.length >= 2 ? path(antes) : path([{ t: ini, n: inst.n - ritmo * (inst.t - ini) / 864e5 }, inst]);
    var linhaProj = path([inst, { t: fim, n: proj }]);
    var reais = depois.length ? depois.concat(ult.t < fim ? [{ t: fim, n: real }] : []) : [inst, { t: fim, n: inst.n }];
    var linhaReal = path(reais);
    var area = linhaReal + " L" + X(fim).toFixed(1) + " " + Y(proj).toFixed(1) + " L" + X(inst.t).toFixed(1) + " " + Y(inst.n).toFixed(1) + " Z";
    var ganho = Math.round(real - proj);
    // grelha
    var g = "", passos = 4;
    for (var i = 0; i <= passos; i++) { var v = vmin + (vmax - vmin) * i / passos, y = Y(v); g += "<line x1='" + L + "' x2='" + (W - R) + "' y1='" + y.toFixed(1) + "' y2='" + y.toFixed(1) + "' stroke='#2b2a30' stroke-width='1'/><text x='" + (L - 6) + "' y='" + (y + 4).toFixed(1) + "' text-anchor='end' fill='#a9a397' font-size='11'>" + Math.round(v) + "</text>"; }
    var fmtD = function (t) { var d = new Date(t); return d.getDate() + " " + MESES[d.getMonth()]; };
    g += "<text x='" + L + "' y='" + (H - 8) + "' fill='#a9a397' font-size='11'>" + fmtD(ini) + "</text><text x='" + (W - R) + "' y='" + (H - 8) + "' text-anchor='end' fill='#a9a397' font-size='11'>hoje</text>";
    var xi = X(inst.t);
    var svg = "<svg class='pro-evo' viewBox='0 0 " + W + " " + H + "' role='img' aria-label='Avaliações Google: com a placa " + real + ", ao ritmo anterior seriam " + Math.round(proj) + "'>" +
      "<defs><linearGradient id='evg" + gid + "' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='#f0d38d' stop-opacity='.38'/><stop offset='1' stop-color='#d4ad5b' stop-opacity='.04'/></linearGradient></defs>" + g +
      "<line x1='" + xi.toFixed(1) + "' x2='" + xi.toFixed(1) + "' y1='" + (T - 8) + "' y2='" + (H - B) + "' stroke='#a9a397' stroke-dasharray='3 4'/><text x='" + (xi + 6).toFixed(1) + "' y='" + (T + 2) + "' fill='#a9a397' font-size='11.5'>placa instalada</text>" +
      (ganho > 0 ? "<path class='evo-area' d='" + area + "' fill='url(#evg" + gid + ")'/>" : "") +
      "<path class='evo-l evo-antes' pathLength='1' d='" + linhaAntes + "' fill='none' stroke='#8d887e' stroke-width='3' stroke-linecap='round'/>" +
      "<path class='evo-l evo-proj' d='" + linhaProj + "' fill='none' stroke='#8d887e' stroke-width='2.5' stroke-dasharray='7 6' stroke-linecap='round'/>" +
      "<path class='evo-l evo-real' pathLength='1' d='" + linhaReal + "' fill='none' stroke='#f0d38d' stroke-width='3.5' stroke-linejoin='round' stroke-linecap='round'/>" +
      "<circle class='evo-dot' cx='" + X(fim).toFixed(1) + "' cy='" + Y(real).toFixed(1) + "' r='5.5' fill='#f0d38d'/>" +
      "<circle class='evo-dot2' cx='" + X(fim).toFixed(1) + "' cy='" + Y(proj).toFixed(1) + "' r='4' fill='#8d887e'/>" +
      "<text class='evo-dot' x='" + (X(fim) - 10).toFixed(1) + "' y='" + (Y(real) - 10).toFixed(1) + "' text-anchor='end' fill='#f0d38d' font-size='13' font-weight='800'>" + real + "</text>" +
      "<text class='evo-dot2' x='" + (X(fim) - 10).toFixed(1) + "' y='" + (Y(proj) + 18).toFixed(1) + "' text-anchor='end' fill='#a9a397' font-size='12' font-weight='700'>" + Math.round(proj) + "</text></svg>";
    var leg = "<div class='evo-leg'><span><i class='lg-real'></i>Com a placa</span><span><i class='lg-proj'></i>" + (semDados ? "Sem a placa (ficava nas " + inst.n + ")" : "Sem a placa (ritmo anterior)") + "</span></div>";
    var res = ganho > 0 ? "<div class='evo-res'><b>+" + ganho + "</b> avaliações a mais do que teria sem a placa</div>" : "";
    return "<div class='pro-ui evo-wrap'>" + leg + svg + res + (semDados && !opt.semNota ? "<p class='pro-vazio'>Como ainda não temos leituras de antes da placa, a linha cinzenta mostra o número com que começou.</p>" : "") + "</div>";
  }

  function evolucaoDe(aval, base, instalada) {
    var serie = (aval || []).map(function (p) { return { t: new Date(p.data).getTime(), n: +p.n }; });
    var bt = base && base.data ? new Date(base.data).getTime() : NaN, bn = base && base.n != null ? +base.n : null;
    if (bn != null && isFinite(bt)) serie.push({ t: bt, n: bn });
    serie = serie.filter(function (p) { return isFinite(p.t) && isFinite(p.n); }).sort(function (a, b) { return a.t - b.t; });
    if (!serie.length) return evolucao([], null);
    var it = instalada ? new Date(instalada).getTime() : (isFinite(bt) ? bt : serie[0].t);
    var ate = serie.filter(function (p) { return p.t <= it + 864e5; }), n = ate.length ? ate[ate.length - 1].n : (bn != null ? bn : serie[0].n);
    return evolucao(serie, { t: it, n: n });
  }

  /* Dados de exemplo: um café com mais movimento ao almoço e ao fim da tarde, sábado forte, domingo fraco. */
  function exemplo() {
    var cells = [], peso = [0.8, 0.85, 0.9, 1, 1.15, 1.35, 0.45];
    for (var d = 0; d < 7; d++) for (var h = 8; h <= 21; h++) {
      var base = 1 + 9 * Math.exp(-Math.pow(h - 12.5, 2) / 2.2) + 6 * Math.exp(-Math.pow(h - 19, 2) / 2.5) + (h < 10 ? 2 : 0);
      var ruido = ((d * 7 + h * 13) % 5) - 2;
      cells.push([d, h, Math.max(0, Math.round(base * peso[d] + ruido * 0.6))]);
    }
    var meses = [], hoje = new Date();
    [64, 71, 118, 176, 204, 238].forEach(function (n, i) { var m = new Date(hoje.getFullYear(), hoje.getMonth() - 5 + i, 1); meses.push({ l: MESES[m.getMonth()], n: n }); });
    return { cells: cells, per: { hoje: 11, ontem: 8, sem: 61, semAnt: 53, mes: 238, mesAnt: 204 }, meses: meses, aval: [23, 24, 24, 25, 31, 38, 44, 52, 61], marca: 3, notaAntes: 4.3, notaAgora: 4.6 };
  }

  var DESTINOS = [["🌟", "Avaliações Google", "Formulário de avaliação aberto"], ["🍽️", "Menu do dia", "Ementa de hoje, sempre atualizada"], ["🎁", "Promoção", "Café + pastel de nata por 2 €"], ["📸", "Instagram", "Perfil aberto, pronto a seguir"]];
  var PASSOS = [
    ["kpis", "Veja quantos clientes tocam", "Cada toque na placa é contado. Compare hoje com ontem e esta semana com a anterior."],
    ["mapa", "Descubra as horas fortes", "O mapa mostra os dias e as horas com mais toques. Toque num quadrado para ver esse momento."],
    ["meses", "Acompanhe mês a mês", "Veja a placa a trabalhar ao longo do tempo, sem fazer contas."],
    ["google", "Compare antes e depois da placa", "As avaliações e a nota do Google são lidas automaticamente todas as semanas."],
    ["destino", "Mude o destino quando quiser", "Com o link gerido, a mesma placa pode abrir as avaliações, o menu do dia ou uma promoção. Sem trocar a placa."],
    ["relatorio", "Receba o resumo no WhatsApp", "Todos os meses recebe um resumo simples com os números do seu negócio."]
  ];


  /* Demonstração em slides: um passo por cartão, desliza para o lado. */
  function demoSlides(el, opt) {
    var ex = exemplo(), nome = opt.nome || "Café Aurora", dest = 0, cur = 0;
    var a = ex.aval, ant = a[ex.marca], ag = a[a.length - 1];
    var semana = 7 * 864e5, t0 = Date.now() - (a.length - 1) * semana, serie = a.map(function (n, i) { return { t: t0 + i * semana, n: n }; });
    function destHtml() { return "<h4>Destino da placa <small>mude quando quiser</small></h4><div class='pro-dest'>" + DESTINOS.map(function (x, i) { return "<button type='button' data-dest='" + i + "' aria-pressed='" + (i === dest) + "'>" + x[0] + " " + x[1] + "</button>"; }).join("") + "</div><div class='pro-phone'><div class='ic'>" + DESTINOS[dest][0] + "</div><b>" + DESTINOS[dest][1] + "</b><small>" + DESTINOS[dest][2] + "</small></div>"; }
    var CONT = {
      kpis: function () { return kpis(ex.per); },
      mapa: function () { return "<div class='pro-box'><h4>Quando tocam mais? <small>últimos 90 dias</small></h4><div class='pro-map'></div></div>"; },
      meses: function () { return "<div class='pro-box'><h4>Toques por mês <small>últimos 6 meses</small></h4>" + barras(ex.meses) + "</div>"; },
      google: function () { return "<div class='pro-box'><h4>Avaliações no Google <small>leitura semanal automática</small></h4>" + evolucao(serie, serie[ex.marca]) + "<div class='pro-kv'><div>Antes da placa<b>" + ant + "</b></div><div>Agora<b>" + ag + " <span class='pro-up' style='font-size:14px'>+" + (ag - ant) + "</span></b></div><div>Nota antes<b>" + String(ex.notaAntes).replace(".", ",") + " ★</b></div><div>Nota agora<b style='color:var(--pg)'>" + String(ex.notaAgora).replace(".", ",") + " ★</b></div></div></div>"; },
      destino: function () { return "<div class='pro-box pro-destbox'>" + destHtml() + "</div>"; },
      relatorio: function () { return "<div class='pro-box'><h4>Resumo mensal <small>no seu WhatsApp</small></h4><div class='pro-wa'><p>Olá! Resumo de " + ex.meses[5].l + " da " + esc(nome) + ":<br>• " + ex.meses[5].n + " toques na placa (+" + Math.round((ex.meses[5].n - ex.meses[4].n) / ex.meses[4].n * 100) + "%)<br>• Dia mais forte: sábado, 12h–13h<br>• " + ag + " avaliações no Google (+" + (ag - ant) + " desde a placa)<br>Bom mês! D&amp;V Placas NFC<small>09:00</small></p></div></div>" + (opt.cta ? "<button type='button' class='pro-sl-cta' data-cta='1'>" + esc(opt.ctaTexto || "Quero o Plano Pro") + "</button>" : ""); }
    };
    var N = PASSOS.length;
    el.classList.add("pro-ui");
    el.innerHTML = "<div class='pro-win pro-sl'><div class='pro-bar'><i></i><i></i><i></i><span>Painel D&amp;V · " + esc(nome) + "</span><b class='ex'>Exemplo</b></div><div class='pro-body'>" +
      "<div class='pro-sl-vp'><div class='pro-sl-track' tabindex='0' aria-roledescription='carrossel' aria-label='Visita ao Plano Pro'>" +
      PASSOS.map(function (p, i) { return "<section class='pro-sl-s' aria-roledescription='passo' aria-label='Passo " + (i + 1) + " de " + N + "'><div class='pro-sl-cap'><div class='k'>Passo " + (i + 1) + " de " + N + "</div><h4>" + p[1] + "</h4><p>" + p[2] + "</p></div>" + CONT[p[0]]() + "</section>"; }).join("") +
      "</div></div><div class='pro-sl-nav'><button type='button' class='ar' data-sl='-1' aria-label='Passo anterior'>‹</button><div class='pro-sl-dots'>" + PASSOS.map(function (p, i) { return "<button type='button' data-ir='" + i + "' aria-label='Ir para o passo " + (i + 1) + "'></button>"; }).join("") + "</div><button type='button' class='ar' data-sl='1' aria-label='Passo seguinte'>›</button></div><p class='pro-sl-hint'>Deslize para o lado ou use as setas</p></div></div>";
    var tr = el.querySelector(".pro-sl-track"), vp = el.querySelector(".pro-sl-vp"), ss = [].slice.call(el.querySelectorAll(".pro-sl-s"));
    var m = el.querySelector(".pro-map"); if (m) mapa(m, ex.cells, { periodo: "em 90 dias" });
    function altura() { var s = ss[cur]; if (s) vp.style.height = s.offsetHeight + "px"; }
    function marcar() {
      el.querySelectorAll(".pro-sl-dots button").forEach(function (b, i) { b.setAttribute("aria-current", String(i === cur)); });
      el.querySelector("[data-sl='-1']").disabled = cur === 0; el.querySelector("[data-sl='1']").disabled = cur === N - 1;
      altura();
    }
    function ir(i) { cur = Math.max(0, Math.min(N - 1, i)); tr.scrollTo({ left: cur * tr.clientWidth }); marcar(); }
    var tm; tr.addEventListener("scroll", function () { clearTimeout(tm); tm = setTimeout(function () { var i = Math.round(tr.scrollLeft / tr.clientWidth); if (i !== cur) { cur = i; marcar(); } }, 60); }, { passive: true });
    tr.addEventListener("keydown", function (e) { if (e.key === "ArrowRight") { e.preventDefault(); ir(cur + 1); } else if (e.key === "ArrowLeft") { e.preventDefault(); ir(cur - 1); } });
    el.addEventListener("click", function (e) {
      var b = e.target.closest("[data-sl]"); if (b) { ir(cur + +b.dataset.sl); return; }
      var d = e.target.closest("[data-ir]"); if (d) { ir(+d.dataset.ir); return; }
      var ds = e.target.closest("[data-dest]"); if (ds) { dest = +ds.dataset.dest; el.querySelector(".pro-destbox").innerHTML = destHtml(); altura(); return; }
      var c = e.target.closest("[data-cta]"); if (c && opt.cta) opt.cta();
    });
    addEventListener("resize", function () { tr.scrollLeft = cur * tr.clientWidth; altura(); });
    if (window.ResizeObserver) new ResizeObserver(altura).observe(ss[0]);
    marcar(); setTimeout(altura, 50);
  }

  /* Demonstração completa (site e painel no plano grátis). */
  function demo(el, opt) {
    addCss(); opt = opt || {};
    if (opt.modo !== "completo") return demoSlides(el, opt);
    var ex = exemplo(), nome = opt.nome || "Café Aurora", tab = "toques", passo = -1, dest = 0;
    el.classList.add("pro-ui");
    el.innerHTML = "<div class='pro-tabs' role='tablist'><button role='tab' data-t='toques' aria-selected='true'>Toques na placa<small>quando e quantas vezes</small></button><button role='tab' data-t='google' aria-selected='false'>Google<small>avaliações e nota</small></button></div>" +
      "<div class='pro-win'><div class='pro-bar'><i></i><i></i><i></i><span>Painel D&amp;V · " + esc(nome) + "</span><b class='ex'>Exemplo</b></div><div class='pro-body'></div></div>" +
      (opt.tour === false ? "" : "<div class='pro-tour'></div>");
    var body = el.querySelector(".pro-body"), tour = el.querySelector(".pro-tour");
    function wa() {
      return "<div class='pro-box' data-p='relatorio'><h4>Resumo mensal <small>no seu WhatsApp</small></h4><div class='pro-wa'><p>Olá! Resumo de " + ex.meses[5].l + " da " + esc(nome) + ":<br>• " + ex.meses[5].n + " toques na placa (+" + Math.round((ex.meses[5].n - ex.meses[4].n) / ex.meses[4].n * 100) + "%)<br>• Dia mais forte: sábado, 12h–13h<br>• " + ex.aval[ex.aval.length - 1] + " avaliações no Google (+" + (ex.aval[ex.aval.length - 1] - ex.aval[ex.marca]) + " desde a placa)<br>Bom mês! D&amp;V Placas NFC<small>09:00</small></p></div></div>";
    }
    function desenhar() {
      el.querySelectorAll(".pro-tabs button").forEach(function (b) { b.setAttribute("aria-selected", String(b.dataset.t === tab)); });
      var h = "";
      if (tab === "toques") {
        h += "<div data-p='kpis'>" + kpis(ex.per) + "</div>";
        h += "<div class='pro-box' data-p='mapa'><h4>Quando tocam mais? <small>últimos 90 dias</small></h4><div class='pro-map'></div></div>";
        h += "<div class='pro-box' data-p='meses'><h4>Toques por mês <small>últimos 6 meses</small></h4>" + barras(ex.meses) + "</div>";
        h += "<div class='pro-box' data-p='destino'><h4>Destino da placa <small>mude quando quiser</small></h4><div class='pro-dest'>" + DESTINOS.map(function (x, i) { return "<button type='button' data-dest='" + i + "' aria-pressed='" + (i === dest) + "'>" + x[0] + " " + x[1] + "</button>"; }).join("") + "</div><div class='pro-phone'><div class='ic'>" + DESTINOS[dest][0] + "</div><b>" + DESTINOS[dest][1] + "</b><small>" + DESTINOS[dest][2] + "</small></div></div>";
        h += wa();
      } else {
        var a = ex.aval, ant = a[ex.marca], ag = a[a.length - 1];
        var semana = 7 * 864e5, t0 = Date.now() - (a.length - 1) * semana, serie = a.map(function (n, i) { return { t: t0 + i * semana, n: n }; });
        h += "<div class='pro-box' data-p='google'><h4>Avaliações no Google <small>leitura semanal automática</small></h4>" + evolucao(serie, serie[ex.marca]) +
          "<div class='pro-kv'><div>Antes da placa<b>" + ant + "</b></div><div>Agora<b>" + ag + " <span class='pro-up' style='font-size:14px'>+" + (ag - ant) + "</span></b></div><div>Nota antes<b>" + String(ex.notaAntes).replace(".", ",") + " ★</b></div><div>Nota agora<b style='color:var(--pg)'>" + String(ex.notaAgora).replace(".", ",") + " ★</b></div></div></div>";
        h += "<div class='pro-box'><h4>Avaliações novas por mês</h4>" + barras([{ l: "antes", n: 1 }, { l: "1.º mês", n: 6 }, { l: "2.º mês", n: 7 }, { l: "3.º mês", n: 8 }, { l: "4.º mês", n: 9 }], 1) + "</div>";
        h += wa();
      }
      body.innerHTML = h;
      var m = body.querySelector(".pro-map"); if (m) mapa(m, ex.cells, { periodo: "em 90 dias" });
      focar();
    }
    function focar() {
      body.querySelectorAll(".pro-foco").forEach(function (x) { x.classList.remove("pro-foco"); });
      if (passo < 0) return;
      var t = body.querySelector("[data-p='" + PASSOS[passo][0] + "']");
      if (t) { t.classList.add("pro-foco"); if (opt.scroll !== false) t.scrollIntoView({ behavior: "smooth", block: "start" }); }
    }
    function tourHtml() {
      if (!tour) return;
      if (passo < 0) { tour.innerHTML = "<div class='k'>Experimente o Plano Pro</div><h4>Uma visita guiada em " + PASSOS.length + " passos</h4><p>Veja, com dados de exemplo, tudo o que o painel mostra ao dono do negócio.</p><div class='pro-nav'><button type='button' class='go' data-go='1'>Começar a visita</button></div>"; return; }
      var p = PASSOS[passo];
      tour.innerHTML = "<div class='k'>Passo " + (passo + 1) + " de " + PASSOS.length + "</div><h4>" + p[1] + "</h4><p>" + p[2] + "</p><div class='pro-dots'>" + PASSOS.map(function (_, i) { return "<i class='" + (i <= passo ? "on" : "") + "'></i>"; }).join("") + "</div>" +
        "<div class='pro-nav'><button type='button' data-go='-1'" + (passo === 0 ? " disabled" : "") + ">Anterior</button>" + (passo < PASSOS.length - 1 ? "<button type='button' class='go' data-go='1'>Seguinte</button>" : (opt.cta ? "<button type='button' class='go' data-cta='1'>" + esc(opt.ctaTexto || "Quero o Plano Pro") + "</button>" : "<button type='button' class='go' data-go='reset'>Ver outra vez</button>")) + "</div>";
    }
    el.addEventListener("click", function (e) {
      var t = e.target.closest("[data-t]"); if (t) { tab = t.dataset.t; desenhar(); return; }
      var ds = e.target.closest("[data-dest]"); if (ds) { dest = +ds.dataset.dest; desenhar(); return; }
      var c = e.target.closest("[data-cta]"); if (c && opt.cta) { opt.cta(); return; }
      var g = e.target.closest("[data-go]"); if (!g) return;
      if (g.dataset.go === "reset") passo = -1; else passo = Math.max(0, Math.min(PASSOS.length - 1, passo + +g.dataset.go));
      var precisa = passo >= 0 && PASSOS[passo][0] === "google" ? "google" : passo >= 0 && PASSOS[passo][0] !== "relatorio" ? "toques" : tab;
      if (precisa !== tab) { tab = precisa; desenhar(); } else focar();
      tourHtml();
    });
    desenhar(); tourHtml();
  }

  window.DVPro = { evolucao: evolucao, evolucaoDe: evolucaoDe, mapa: mapa, kpis: function (p) { addCss(); return "<div class='pro-ui'>" + kpis(p) + "</div>"; }, barras: function (l) { addCss(); return barras(l); }, demo: demo };
})();
