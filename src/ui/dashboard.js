/* dashboard.js - versão atualizada: export resiliente, menu robusto, toggle funcionalidade */
'use strict';

/* --- dados de exemplo --- */
var controleDados = {
  meses6: ['Abr','Mai','Jun','Jul','Ago','Set'],
  valoresVendas6: [4200,5200,4900,6100,7200,6800],
  meses12: ['Out/24','Nov/24','Dez/24','Jan/25','Fev/25','Mar/25','Abr/25','Mai/25','Jun/25','Jul/25','Ago/25','Set/25'],
  valoresVendas12: [3000,3400,3800,4100,4800,5200,4200,5200,4900,6100,7200,6800],
  atendimentosTipos: ['Consultas','Vacinação','Estética','Cirurgia','Emergência','Exames','Internação','Retorno'],
  atendimentosValores: [220,140,60,18,24,72,10,48],
  produtosVendidos: ['Antipulgas','Ração Sênior','Soro 500ml','Vacina A'],
  produtosUnidades: [120,85,52,40],
  tendenciaDias30: []
};

/* preencher tendenciaDias30 */
var i;
for (i = 0; i < 30; i = i + 1) {
  var v = Math.round(20 + 10 * Math.sin(i / 4) + (Math.random() * 6 - 3));
  controleDados.tendenciaDias30.push(v);
}

/* chart instances */
var graf1 = null;
var graf2 = null;
var graf3 = null;
var graf4 = null;

/* Chart.js defaults (se existir) */
if (window.Chart) {
  Chart.defaults.font.family = "'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, Arial";
  Chart.defaults.font.size = 12;
  Chart.defaults.color = '#0b3b2b';
  Chart.defaults.devicePixelRatio = window.devicePixelRatio || 1;
}

/* util: criar gradient */
function criarGradient(ctx, height) {
  var g = ctx.createLinearGradient(0,0,0,height || 260);
  g.addColorStop(0,'rgba(31,138,89,0.20)');
  g.addColorStop(0.6,'rgba(31,138,89,0.06)');
  g.addColorStop(1,'rgba(31,138,89,0.01)');
  return g;
}

/* --- GRAFICOS --- */

/* grafico 1 - linha (receita) */
function criarGrafico1(periodo) {
  if (periodo === undefined) periodo = 6;
  var canvas = document.getElementById('controle-graf1');
  if (!canvas || !window.Chart) return;
  var ctx = canvas.getContext('2d');
  var labels;
  var data;
  if (periodo === 6) {
    labels = controleDados.meses6;
    data = controleDados.valoresVendas6;
  } else {
    labels = controleDados.meses12;
    data = controleDados.valoresVendas12;
  }
  if (graf1) { graf1.destroy(); graf1 = null; }
  var gradient = criarGradient(ctx, canvas.clientHeight || 260);
  graf1 = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Receita',
        data: data,
        tension: .32,
        fill: true,
        backgroundColor: gradient,
        borderColor: '#1f8a59',
        borderWidth: 2.5,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: '#fff',
        pointBorderWidth: 2,
        pointBorderColor: '#1f8a59'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#fff',
          titleColor: '#063b2a',
          bodyColor: '#052b20',
          padding: 12,
          boxPadding: 6,
          callbacks: {
            label: function(ctx) {
              return 'R$ ' + Number(ctx.parsed.y).toLocaleString('pt-BR');
            }
          }
        }
      },
      scales: {
        x: { grid: { display: false }, ticks: { color: '#315a48' } },
        y: {
          beginAtZero: true,
          grid: { color: 'rgba(6,59,42,0.06)' },
          ticks: { callback: function(v) { return 'R$ ' + Number(v).toLocaleString('pt-BR'); } }
        }
      },
      animation: { duration: 700, easing: 'easeOutCubic' }
    }
  });
}

/* grafico 2 - barras (atendimentos) - atualizado pelo periodo */
function criarGrafico2(periodo) {
  if (periodo === undefined) periodo = 6;
  var canvas = document.getElementById('controle-graf2');
  if (!canvas || !window.Chart) return;
  var ctx = canvas.getContext('2d');
  if (graf2) { graf2.destroy(); graf2 = null; }

  var factor = periodo / 6;
  var data = [];
  var j;
  for (j = 0; j < controleDados.atendimentosValores.length; j = j + 1) {
    data.push(Math.round(controleDados.atendimentosValores[j] * factor));
  }

  var cores = ['#1f8a59','#0b5a3a','#4fa67a','#7bd0a0','#2f6b4c','#6fc28f','#a6d9bb','#3a6b4f'];
  graf2 = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: controleDados.atendimentosTipos,
      datasets: [{
        label: 'Atendimentos',
        data: data,
        borderRadius: 12,
        backgroundColor: cores
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { backgroundColor: '#fff', titleColor: '#063b2a', bodyColor: '#052b20' }
      },
      scales: {
        y: { beginAtZero: true, grid: { color: 'rgba(6,59,42,0.06)' } },
        x: { grid: { display: false } }
      },
      animation: { duration: 600 }
    }
  });
}

/* grafico 3 - top produtos (donut) */
function criarGrafico3() {
  var canvas = document.getElementById('controle-graf3');
  if (!canvas || !window.Chart) return;
  var ctx = canvas.getContext('2d');
  if (graf3) { graf3.destroy(); graf3 = null; }
  var colors = ['#1f8a59','#4fa67a','#7bd0a0','#a6d9bb'];
  graf3 = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: controleDados.produtosVendidos,
      datasets: [{
        data: controleDados.produtosUnidades,
        backgroundColor: colors,
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: 'bottom' }, tooltip: { backgroundColor: '#fff', titleColor: '#063b2a', bodyColor: '#052b20' } },
      animation: { duration: 600 }
    }
  });
}

/* grafico 4 - tendencia 30 dias */
function criarGrafico4() {
  var canvas = document.getElementById('controle-graf4');
  if (!canvas || !window.Chart) return;
  var ctx = canvas.getContext('2d');
  if (graf4) { graf4.destroy(); graf4 = null; }
  var labels = [];
  var k;
  for (k = 1; k <= controleDados.tendenciaDias30.length; k = k + 1) {
    labels.push(String(k));
  }
  var gradient = criarGradient(ctx, canvas.clientHeight || 160);
  graf4 = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Presença',
        data: controleDados.tendenciaDias30,
        tension: .25,
        fill: true,
        backgroundColor: gradient,
        borderColor: '#1f8a59',
        borderWidth: 2,
        pointRadius: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { backgroundColor: '#fff', titleColor: '#063b2a', bodyColor: '#052b20' } },
      scales: { x: { grid: { display: false } }, y: { grid: { color: 'rgba(6,59,42,0.06)' }, beginAtZero: true } },
      animation: { duration: 600 }
    }
  });
}

/* --- utilitarios --- */
function formatNumber(val, tipo) {
  if (tipo === 'currency') {
    return Number(val).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }
  return Number(val).toLocaleString('pt-BR');
}

function animarNumeroElemento(el, target, duration) {
  if (duration === undefined) duration = 900;
  var tipo = el.dataset.format || 'int';
  var start = 0;
  var t0 = performance.now();
  function passo(now) {
    var p = Math.min((now - t0) / duration, 1);
    var atual = Math.round(start + (target - start) * p);
    if (tipo === 'currency') {
      el.textContent = formatNumber(atual, 'currency');
    } else {
      el.textContent = formatNumber(atual, 'int');
    }
    if (p < 1) {
      requestAnimationFrame(passo);
    }
  }
  requestAnimationFrame(passo);
}

function iniciarIndicadores() {
  var nodes = document.querySelectorAll('.controle-numero-interativo');
  var idx;
  for (idx = 0; idx < nodes.length; idx = idx + 1) {
    var el = nodes[idx];
    var parent = el.closest('.controle-resumo-item');
    var target = 0;
    if (parent && parent.dataset && parent.dataset.targetNum) {
      target = Number(parent.dataset.targetNum);
    } else if (el.dataset && el.dataset.targetNum) {
      target = Number(el.dataset.targetNum);
    }
    if (isNaN(target)) { continue; }
    (function(localEl, localTarget){
      animarNumeroElemento(localEl, localTarget, 900);
      localEl.closest('.controle-resumo-item').addEventListener('click', function(){
        var novo = Math.round(localTarget * (1 + Math.random() * 0.12));
        animarNumeroElemento(localEl, novo, 600);
      });
    })(el, target);
  }
}

function attachRipples() {
  var elems = document.querySelectorAll('.ripple');
  var a;
  for (a = 0; a < elems.length; a = a + 1) {
    (function(el){
      el.addEventListener('click', function(e){
        var rect = this.getBoundingClientRect();
        var ripple = document.createElement('span');
        ripple.className = 'ripple-ef';
        var size = Math.max(rect.width, rect.height) * 1.2;
        ripple.style.width = size + 'px';
        ripple.style.height = size + 'px';
        ripple.style.left = (e.clientX - rect.left - size/2) + 'px';
        ripple.style.top = (e.clientY - rect.top - size/2) + 'px';
        this.appendChild(ripple);
        setTimeout(function(){ ripple.remove(); }, 700);
      });
    })(elems[a]);
  }
}

/* --- export XLSX + fallback CSV com tratamento --- */
function exportDashboardXLSX() {

  function exportCSVFallback() {
    try {
      var linhas = [];
      linhas.push(['Produto','Unidades']);
      var k;
      for (k = 0; k < controleDados.produtosVendidos.length; k = k + 1) {
        linhas.push([controleDados.produtosVendidos[k], controleDados.produtosUnidades[k]]);
      }
      var csv = '';
      var r;
      for (r = 0; r < linhas.length; r = r + 1) {
        var row = linhas[r];
        var parts = [];
        var c;
        for (c = 0; c < row.length; c = c + 1) {
          var cell = String(row[c]).replace(/"/g, '""');
          parts.push('"' + cell + '"');
        }
        csv += parts.join(',') + '\n';
      }
      var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = 'wevet_dashboard_export.csv';
      a.click();
      URL.revokeObjectURL(url);
    } catch (errCsv) {
      console.error('Erro no fallback CSV:', errCsv);
    }
  }

  try {
    if (typeof XLSX === 'undefined') {
      console.warn('XLSX não encontrado, usando fallback CSV.');
      exportCSVFallback();
      return;
    }

    var wb = XLSX.utils.book_new();

    /* Vendas */
    var periodo = document.getElementById('controle-filtro-periodo');
    var p = 6;
    if (periodo) { p = Number(periodo.value); }
    var vendasHead = ['Mês','Receita'];
    var vendasArr = [vendasHead];
    var labelsV;
    var dataV;
    if (p === 6) {
      labelsV = controleDados.meses6;
      dataV = controleDados.valoresVendas6;
    } else {
      labelsV = controleDados.meses12;
      dataV = controleDados.valoresVendas12;
    }
    var ii;
    for (ii = 0; ii < labelsV.length; ii = ii + 1) {
      vendasArr.push([labelsV[ii], dataV[ii]]);
    }
    var wsV = XLSX.utils.aoa_to_sheet(vendasArr);
    XLSX.utils.book_append_sheet(wb, wsV, 'Vendas');

    /* Atendimentos */
    var atendHead = ['Tipo','Quantidade'];
    var atendArr = [atendHead];
    for (ii = 0; ii < controleDados.atendimentosTipos.length; ii = ii + 1) {
      atendArr.push([controleDados.atendimentosTipos[ii], controleDados.atendimentosValores[ii]]);
    }
    var wsA = XLSX.utils.aoa_to_sheet(atendArr);
    XLSX.utils.book_append_sheet(wb, wsA, 'Atendimentos');

    /* Produtos */
    var prodHead = ['Produto','Unidades'];
    var prodArr = [prodHead];
    for (ii = 0; ii < controleDados.produtosVendidos.length; ii = ii + 1) {
      prodArr.push([controleDados.produtosVendidos[ii], controleDados.produtosUnidades[ii]]);
    }
    var wsP = XLSX.utils.aoa_to_sheet(prodArr);
    XLSX.utils.book_append_sheet(wb, wsP, 'Produtos');

    try {
      XLSX.writeFile(wb, 'wevet_dashboard_export.xlsx');
    } catch (errWrite) {
      console.error('Erro ao gerar XLSX:', errWrite);
      exportCSVFallback();
    }
  } catch (err) {
    console.error('Erro exportDashboardXLSX:', err);
    exportCSVFallback();
  }
}

/* --- DOM / interactions --- */
document.addEventListener('DOMContentLoaded', function(){

  /* inicialização dos charts principais */
  criarGrafico1(6);
  criarGrafico2(6);
  iniciarIndicadores();
  attachRipples();

  /* filtros que atualizam graf1 e graf2 */
  var filtro1 = document.getElementById('controle-filtro-graf1');
  if (filtro1) {
    filtro1.addEventListener('change', function(e){
      var val = Number(e.target.value);
      criarGrafico1(val);
      criarGrafico2(val);
    });
  }

  var filtroPeriodo = document.getElementById('controle-filtro-periodo');
  if (filtroPeriodo) {
    filtroPeriodo.addEventListener('change', function(e){
      var val = Number(e.target.value);
      criarGrafico1(val);
      criarGrafico2(val);
    });
  }

  /* export button */
  var exportBtn = document.getElementById('controle-export');
  if (exportBtn) {
    exportBtn.addEventListener('click', function(){
      exportDashboardXLSX();
    });
  }

  /* 'Ver mais' - load graf3/graf4 */
  var botaoMais = document.getElementById('toggle-mais');
  var areaMais = document.getElementById('area-mais');
  if (botaoMais && areaMais) {
    /* garantir estado inicial */
    if (!areaMais.style.display) { areaMais.style.display = 'none'; }
    botaoMais.addEventListener('click', function(){
      var visible = areaMais.style.display !== 'none' && areaMais.style.display !== '';
      if (visible) {
        areaMais.style.display = 'none';
        botaoMais.textContent = 'Ver mais';
        if (graf3) { graf3.destroy(); graf3 = null; }
        if (graf4) { graf4.destroy(); graf4 = null; }
      } else {
        areaMais.style.display = 'grid';
        areaMais.style.gridTemplateColumns = 'repeat(2,1fr)';
        botaoMais.textContent = 'Fechar';
        criarGrafico3();
        criarGrafico4();
      }
    });
  }

  /* menu mobile open/close */
  var btnMenu = document.getElementById('controle-btn-menu');
  var lateral = document.getElementById('controle-lateral');
  var sombra = document.getElementById('controle-sombra');
  var fecharLateral = document.getElementById('controle-fechar-lateral');

  function abrirMenuMobile(){
    if (lateral) { lateral.setAttribute('aria-hidden','false'); }
    document.body.classList.add('menu-ativo');
    if (btnMenu) { btnMenu.setAttribute('aria-expanded','true'); }
    if (sombra) { sombra.style.display = 'block'; sombra.setAttribute('aria-hidden','false'); }
  }
  function fecharMenuMobile(){
    if (lateral) { lateral.setAttribute('aria-hidden','true'); }
    document.body.classList.remove('menu-ativo');
    if (btnMenu) { btnMenu.setAttribute('aria-expanded','false'); }
    if (sombra) { sombra.style.display = 'none'; sombra.setAttribute('aria-hidden','true'); }
  }

  if (btnMenu && lateral && sombra) {
    btnMenu.addEventListener('click', function(){
      var aberto = btnMenu.getAttribute('aria-expanded') === 'true';
      if (aberto) { fecharMenuMobile(); } else { abrirMenuMobile(); }
    });
    sombra.addEventListener('click', fecharMenuMobile);
    if (fecharLateral) { fecharLateral.addEventListener('click', fecharMenuMobile); }
  }

  /* ativar item do menu - robusto (usa closest) */
  document.addEventListener('click', function(ev){
    var menuBtn = ev.target.closest && ev.target.closest('.controle-item-menu');
    if (!menuBtn) return;
    // remove active de todos
    var all = document.querySelectorAll('.controle-item-menu');
    var m;
    for (m = 0; m < all.length; m = m + 1) {
      all[m].classList.remove('controle-ativo');
      all[m].setAttribute('aria-pressed', 'false');
      all[m].setAttribute('aria-selected', 'false');
    }
    menuBtn.classList.add('controle-ativo');
    menuBtn.setAttribute('aria-pressed', 'true');
    menuBtn.setAttribute('aria-selected', 'true');

    // fecha lateral no mobile
    if (window.innerWidth <= 760 && lateral) {
      lateral.setAttribute('aria-hidden','true');
    }
  });

  /* comportamento genérico para elementos .funcionalidade (borda verde) */
  document.addEventListener('click', function(ev){
    var el = ev.target.closest && ev.target.closest('.funcionalidade');
    if (!el) return;
    if (el.classList.contains('selecionado')) {
      el.classList.remove('selecionado');
      el.setAttribute('aria-pressed','false');
    } else {
      el.classList.add('selecionado');
      el.setAttribute('aria-pressed','true');
    }
  });

  /* logout (placeholder) */
  var logout = document.getElementById('controle-logout');
  if (logout) {
    logout.addEventListener('click', function(e){
      e.preventDefault();
    });
  }

  /* notificacoes e perfil dropdowns (toggle e fechar ao clicar fora) */
  var btnNotif = document.getElementById('controle-botao-notif');
  var painelNotif = document.getElementById('painel-notif');
  var badge = document.getElementById('badge-notif');
  var btnMarcar = document.getElementById('marcar-lidas');
  if (btnNotif && painelNotif) {
    btnNotif.addEventListener('click', function(e){
      e.stopPropagation();
      var aberto = btnNotif.getAttribute('aria-expanded') === 'true';
      if (aberto) {
        painelNotif.style.display = 'none';
        btnNotif.setAttribute('aria-expanded','false');
        painelNotif.setAttribute('aria-hidden','true');
      } else {
        painelNotif.style.display = 'block';
        btnNotif.setAttribute('aria-expanded','true');
        painelNotif.setAttribute('aria-hidden','false');
      }
    });
    if (btnMarcar) {
      btnMarcar.addEventListener('click', function(ev){
        ev.preventDefault();
        if (badge) { badge.textContent = '0'; badge.classList.remove('pulse'); }
        btnNotif.setAttribute('aria-expanded','false');
        painelNotif.style.display = 'none';
      });
    }
  }

  var btnPerfil = document.getElementById('controle-dropdown-perfil');
  var painelPerfil = document.getElementById('painel-perfil');
  if (btnPerfil && painelPerfil) {
    btnPerfil.addEventListener('click', function(e){
      e.stopPropagation();
      var aberto = btnPerfil.getAttribute('aria-expanded') === 'true';
      if (aberto) {
        painelPerfil.style.display = 'none';
        btnPerfil.setAttribute('aria-expanded','false');
        painelPerfil.setAttribute('aria-hidden','true');
      } else {
        painelPerfil.style.display = 'block';
        btnPerfil.setAttribute('aria-expanded','true');
        painelPerfil.setAttribute('aria-hidden','false');
      }
    });
  }

  /* listener única para fechar dropdowns ao clicar fora */
  document.addEventListener('click', function(ev){
    var target = ev.target;
    // fechar notificações
    if (painelNotif && painelNotif.style.display === 'block' && !(target.closest && target.closest('#painel-notif')) && !(target.closest && target.closest('#controle-botao-notif'))) {
      painelNotif.style.display = 'none';
      if (btnNotif) { btnNotif.setAttribute('aria-expanded','false'); }
      painelNotif.setAttribute('aria-hidden','true');
    }
    // fechar perfil
    if (painelPerfil && painelPerfil.style.display === 'block' && !(target.closest && target.closest('#painel-perfil')) && !(target.closest && target.closest('#controle-dropdown-perfil'))) {
      painelPerfil.style.display = 'none';
      if (btnPerfil) { btnPerfil.setAttribute('aria-expanded','false'); }
      painelPerfil.setAttribute('aria-hidden','true');
    }
  });

  /* badge pulse */
  if (badge && Number(badge.textContent) > 0) {
    badge.classList.add('pulse');
    setTimeout(function(){ badge.classList.remove('pulse'); }, 2200);
  }

  /* resize charts */
  window.addEventListener('resize', function(){
    if (graf1) graf1.resize();
    if (graf2) graf2.resize();
    if (graf3) graf3.resize();
    if (graf4) graf4.resize();
  });
});
