/* =========================================================
   Lucas & Heloísa — comportamento do site
   Não precisa mexer aqui. Tudo que muda está em config.js
   ========================================================= */

(function () {
  "use strict";

  var C = window.CONFIG || {};
  var semMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- 1. Aplica os links vindos do config ------------- */

  document.querySelectorAll("[data-link]").forEach(function (el) {
    var destino = (C[el.dataset.link] || "").trim();

    if (destino) {
      el.setAttribute("href", destino);
      if (/^https?:/i.test(destino)) {
        el.setAttribute("target", "_blank");
        el.setAttribute("rel", "noopener");
      }
      return;
    }

    // Link ainda não preenchido: desativa e explica o que falta.
    el.removeAttribute("href");
    el.classList.add("link-pendente");
    el.setAttribute("aria-disabled", "true");

    var aviso = el.querySelector(".aviso-pendente") ||
      (el.parentElement && el.parentElement.querySelector(".aviso-pendente"));
    if (aviso) aviso.hidden = false;
  });

  /* ---- 2. Aplica os textos vindos do config ------------ */

  document.querySelectorAll("[data-texto]").forEach(function (el) {
    var valor = C[el.dataset.texto];
    if (valor) el.textContent = valor;
  });

  /* ---- 3. Círculos de cor do traje dos padrinhos ------- */

  var paletaTraje = document.querySelector("[data-paleta-traje]");
  if (paletaTraje && Array.isArray(C.coresTraje)) {
    paletaTraje.innerHTML = C.coresTraje.map(function (t) {
      return '<div class="tom"><i style="background:' + t.cor + '"></i><span>' + t.nome + "</span></div>";
    }).join("");
  }

  /* ---- 4. Contagem regressiva -------------------------- */

  var relogio = document.querySelector("[data-contagem]");
  if (relogio) {
    var alvo = new Date(C.cerimonia || "2027-07-18T17:00:00-03:00").getTime();

    var campos = {
      dias: relogio.querySelector('[data-campo="dias"]'),
      horas: relogio.querySelector('[data-campo="horas"]'),
      minutos: relogio.querySelector('[data-campo="minutos"]'),
      segundos: relogio.querySelector('[data-campo="segundos"]')
    };

    var atualiza = function () {
      var falta = alvo - Date.now();

      if (falta <= 0) {
        relogio.innerHTML = '<p class="script" style="color:var(--terracota)">É hoje!</p>';
        clearInterval(tique);
        return;
      }

      var s = Math.floor(falta / 1000);
      var pad = function (n) { return String(n).padStart(2, "0"); };

      campos.dias.textContent = Math.floor(s / 86400);
      campos.horas.textContent = pad(Math.floor(s / 3600) % 24);
      campos.minutos.textContent = pad(Math.floor(s / 60) % 60);
      campos.segundos.textContent = pad(s % 60);
    };

    atualiza();
    var tique = setInterval(atualiza, 1000);
  }

  /* ---- 5. Revelação no scroll -------------------------- */

  var alvos = document.querySelectorAll(".revela");

  if (semMovimento || !("IntersectionObserver" in window)) {
    alvos.forEach(function (el) { el.classList.add("visivel"); });
  } else {
    var observador = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("visivel");
          observador.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });

    alvos.forEach(function (el, i) {
      el.style.transitionDelay = (i % 4) * 90 + "ms";
      observador.observe(el);
    });
  }

  /* ---- 6. Pétalas ------------------------------------- */

  var ceu = document.querySelector(".petalas");
  if (ceu && !semMovimento) {
    var tons = ["#E9BDB6", "#F3DBD4", "#E9D4A3", "#CD827B"];
    var fragmento = document.createDocumentFragment();

    for (var i = 0; i < 14; i++) {
      var p = document.createElement("i");
      p.style.left = Math.random() * 98 + "vw";
      p.style.background = tons[i % tons.length];
      p.style.animationDuration = (16 + Math.random() * 16).toFixed(1) + "s";
      p.style.animationDelay = "-" + (Math.random() * 22).toFixed(1) + "s";
      p.style.transform = "scale(" + (0.6 + Math.random() * 0.8).toFixed(2) + ")";
      fragmento.appendChild(p);
    }
    ceu.appendChild(fragmento);
  }

})();
