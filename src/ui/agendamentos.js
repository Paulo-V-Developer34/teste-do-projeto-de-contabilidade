(function(){
  'use strict';

  const currentUser = 'Dra. Ana';

  var gridDias = document.getElementById('controle-grid-dias');
  var mesAno = document.getElementById('controle-mes-ano');
  var prevMes = document.getElementById('controle-prev-mes');
  var nextMes = document.getElementById('controle-next-mes');
  var diaTitulo = document.getElementById('controle-dia-titulo');
  var diaSub = document.getElementById('controle-dia-sub');
  var horariosLista = document.getElementById('controle-horarios-lista');
  var botaoNovoRapido = document.getElementById('controle-botao-agendar-rapido');
  var filtroProf = document.getElementById('controle-filtro-profissional');

  var resumoTotalNum = document.getElementById('resumo-total-num');
  var resumoHojeNum = document.getElementById('resumo-hoje-num');
  var resumoVagasNum = document.getElementById('resumo-vagas-num');
  var resumoOcupNum = document.getElementById('resumo-ocup-num');

  var modalOverlay = document.getElementById('controle-modal-overlay');
  var fecharModal = document.getElementById('controle-fechar-modal');
  var form = document.getElementById('controle-form-agendamento');
  var inputData = document.getElementById('controle-input-data');
  var inputHora = document.getElementById('controle-input-hora');
  var inputProf = document.getElementById('controle-input-profissional');
  var inputCliente = document.getElementById('controle-input-cliente');
  var inputPaciente = document.getElementById('controle-input-paciente');
  var inputServico = document.getElementById('controle-input-servico');
  var botaoCancela = document.getElementById('controle-cancela-modal');
  var botaoApaga = document.getElementById('controle-apaga-agendamento');

  var confirmOverlay = document.getElementById('controle-confirm-overlay');
  var confirmContainer = confirmOverlay && confirmOverlay.querySelector('.controle-confirm');

  var painelNotif = document.getElementById('painel-notif');
  var painelPerfil = document.getElementById('painel-perfil');

  const STORAGE_KEY = 'wevet_agendamentos_v1';
  var hoje = new Date();
  var viewMes = hoje.getMonth();
  var viewAno = hoje.getFullYear();
  var diaSelecionado = null;
  var editId = null;
  var PRINCIPAL_SLOTS = ['09:00','11:00','14:00','16:00'];

  var agendamentos = load();

  if (!agendamentos || !Array.isArray(agendamentos) || agendamentos.length === 0) {
    agendamentos = [
      { id: uid(), data: formatISODate(addDays(hoje, 0)), hora:'09:00', profissional:'Dra. Ana', cliente:'Maria Silva', paciente:'Rex', servico:'Consulta' },
      { id: uid(), data: formatISODate(addDays(hoje, 0)), hora:'11:00', profissional:'Dra. Ana', cliente:'João', paciente:'Luna', servico:'Vacinação' },
      { id: uid(), data: formatISODate(addDays(hoje, 0)), hora:'14:00', profissional:'Dr. Bruno', cliente:'Carlos', paciente:'Nina', servico:'Estética' },
      { id: uid(), data: formatISODate(addDays(hoje, 0)), hora:'16:00', profissional:'Dra. Ana', cliente:'Ana Paula', paciente:'Thor', servico:'Consulta' },
      { id: uid(), data: formatISODate(addDays(hoje, 1)), hora:'09:00', profissional:'Dr. Bruno', cliente:'Marcos', paciente:'Bela', servico:'Vacinação' },
      { id: uid(), data: formatISODate(addDays(hoje, 1)), hora:'16:00', profissional:'Dra. Ana', cliente:'Lucia', paciente:'Zeca', servico:'Consulta' }
    ];
    save();
  }

  if (filtroProf) filtroProf.value = 'todos';

  if (inputProf) {
    inputProf.innerHTML = '<option>' + currentUser + '</option>';
    inputProf.value = currentUser;
    inputProf.disabled = true;
  }

  function closeAllPopups(){
    if (modalOverlay) { modalOverlay.setAttribute('aria-hidden','true'); modalOverlay.style.display='none'; }
    if (confirmOverlay) { confirmOverlay.setAttribute('aria-hidden','true'); confirmOverlay.style.display='none'; }
    if (painelNotif) painelNotif.setAttribute('aria-hidden','true');
    if (painelPerfil) painelPerfil.setAttribute('aria-hidden','true');
  }

  function normalizeClass(s){
    if (!s) return '';
    try { s = s.normalize('NFD').replace(/[̀-\u036f]/g, ''); } catch(e){}
    return String(s).replace(/\s+/g,'-').replace(/[^a-zA-Z0-9\-_]/g,'');
  }

  function uid(){ return 'ag_'+Math.random().toString(36).slice(2,9); }
  function addDays(d,n){ var t=new Date(d.getFullYear(),d.getMonth(),d.getDate()); t.setDate(t.getDate()+n); return t; }
  function formatISODate(d){ if (!d) return ''; var y=d.getFullYear(); var m=String(d.getMonth()+1).padStart(2,'0'); var day=String(d.getDate()).padStart(2,'0'); return y+'-'+m+'-'+day; }
  function parseISODate(iso){ if (!iso) return null; var parts = String(iso).split('-'); return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2])); }
  function isSameDay(a,b){ return a.getFullYear()===b.getFullYear() && a.getMonth()===b.getMonth() && a.getDate()===b.getDate(); }
  function capitalize(s){ return s.charAt(0).toUpperCase()+s.slice(1); }
  function save(){ try { localStorage.setItem(STORAGE_KEY, JSON.stringify(agendamentos)); } catch(e){ console.warn('save error', e); } }
  function load(){ try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch(e){ return []; } }
  function filtroMatch(item){ if (!filtroProf || filtroProf.value==='todos') return true; return item.profissional===filtroProf.value; }

  var _initialLoad = true;

  function formatNumber(val, tipo) {
    if (tipo === 'currency') {
      return Number(val).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }
    return Number(val).toLocaleString('pt-BR');
  }

  function animarNumeroElemento(el, target, duration) {
    if (!el) return;
    if (duration === undefined) duration = 900;
    var tipo = (el.dataset && el.dataset.format) ? el.dataset.format : 'int';

    var isPercent = false;
    var targetNum = 0;
    if (typeof target === 'string' && target.indexOf('%') !== -1) {
      isPercent = true;
      targetNum = Number(String(target).replace('%','')) || 0;
    } else {
      targetNum = Number(target) || 0;
    }

    var start = 0;
    var t0 = performance.now();
    function passo(now) {
      var p = Math.min((now - t0) / duration, 1);
      var atual = Math.round(start + (targetNum - start) * p);

      if (tipo === 'currency') {
        el.textContent = formatNumber(atual, 'currency');
      } else if (isPercent || tipo === 'percent') {
        el.textContent = String(atual) + '%';
      } else {
        el.textContent = formatNumber(atual, 'int');
      }

      if (p < 1) {
        requestAnimationFrame(passo);
      }
    }
    requestAnimationFrame(passo);
  }

  function pulse(el){
    if (!el) return;
    el.style.transition = 'transform 220ms ease';
    el.style.transform = 'translateY(-6px)';
    setTimeout(function(){ el.style.transform = ''; }, 220);
  }

  function iniciarIndicadores() {
    if (!_initialLoad) return;
    var nodes = document.querySelectorAll('.controle-numero-interativo');
    for (var idx = 0; idx < nodes.length; idx = idx + 1) {
      var el = nodes[idx];
      var parent = el.closest('[data-target-num]');
      var target = 0;
      if (parent && parent.dataset && parent.dataset.targetNum) {
        target = Number(parent.dataset.targetNum);
      } else if (el.dataset && el.dataset.targetNum) {
        target = Number(el.dataset.targetNum);
      } else {
        var raw = el.textContent.replace(/[^\d,-]/g,'').replace(',','.');
        target = Number(raw) || 0;
      }
      animarNumeroElemento(el, target, 900);
      pulse(el);
    }
    setTimeout(function(){ _initialLoad = false; }, 1100);
  }

  function renderMes(ano, mes){
    gridDias.innerHTML = '';
    var primeiro = new Date(ano, mes, 1);
    var ultimo = new Date(ano, mes + 1, 0);
    var diaSemanaPrimeiro = primeiro.getDay();
    var desloc = (diaSemanaPrimeiro === 0) ? 6 : (diaSemanaPrimeiro - 1);
    var mesesPt = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
    mesAno.textContent = mesesPt[mes] + ' • ' + ano;
    var totalCells = desloc + ultimo.getDate();
    var rounds = Math.ceil(totalCells / 7) * 7;

    for (var i = 0; i < rounds; i++) {
      var cell = document.createElement('div');
      cell.className = 'controle-dia';
      if (i < desloc || i >= desloc + ultimo.getDate()) {
        cell.setAttribute('aria-hidden','true');
      } else {
        var diaNum = i - desloc + 1;
        var cellDate = new Date(ano, mes, diaNum);
        var iso = formatISODate(cellDate);
        var ags = agendamentos.filter(function(a){ return a.data === iso && filtroMatch(a); });
        var count = ags.length;

        var numero = document.createElement('div');
        numero.className = 'numero';
        numero.textContent = diaNum;
        numero.style.background = 'rgba(14,136,79,0.05)';
        numero.style.padding = '6px 8px';
        numero.style.borderRadius = '8px';
        numero.style.display = 'inline-block';
        numero.style.marginBottom = '6px';
        cell.appendChild(numero);

        // cria o traço (em vez da bolinha)
        var pontoVis = document.createElement('span');
        var threshold = PRINCIPAL_SLOTS.length;
        pontoVis.className = 'ponto ' + (count === 0 ? 'ponto-livre' : (count < threshold ? 'ponto-parcial' : 'ponto-cheio'));
        if (count === 0) pontoVis.classList.add('ponto-peq');
        else if (count < threshold) pontoVis.classList.add('ponto-med');
        else pontoVis.classList.add('ponto-grd');
        pontoVis.setAttribute('aria-hidden','true');
        cell.appendChild(pontoVis);

        if (isSameDay(cellDate, hoje)) cell.classList.add('selecionado');

        (function(d){ cell.addEventListener('click', function(){ selecionarDia(d); }); })(cellDate);
        cell.setAttribute('role','button');
        cell.setAttribute('tabindex','0');
        cell.addEventListener('keydown', function(ev){ if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); this.click(); } });
      }
      gridDias.appendChild(cell);
    }
  }

  function selecionarDia(d){
    diaSelecionado = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    var nodes = gridDias.querySelectorAll('.controle-dia');
    nodes.forEach(function(n){
      n.classList.remove('selecionado');
      var num = n.querySelector('.numero');
      if (num && Number(num.textContent) === diaSelecionado.getDate()) n.classList.add('selecionado');
    });

    var optData = diaSelecionado.toLocaleDateString('pt-BR', { weekday:'long', day:'2-digit', month:'long' });
    diaTitulo.textContent = capitalize(optData);
    diaSub.textContent = '';

    gerarHorariosParaDia(diaSelecionado);
  }

  function gerarHorariosParaDia(d){
    horariosLista.innerHTML = '';
    var iso = formatISODate(d);
    var mapa = {};
    var agsDoDia = agendamentos.filter(function(a){ return a.data === iso && filtroMatch(a); });
    agsDoDia.forEach(function(a){ if (!mapa[a.hora]) mapa[a.hora]=[]; mapa[a.hora].push(a); });

    PRINCIPAL_SLOTS.forEach(function(hora){
      var slot = document.createElement('div');
      slot.className = 'controle-slot';
      var info = document.createElement('div');
      info.className = 'info';
      var horaEl = document.createElement('div');
      horaEl.className = 'hora';
      horaEl.textContent = hora;
      var servEl = document.createElement('div');
      servEl.className = 'servico';
      var ocupados = mapa[hora] ? mapa[hora].length : 0;
      servEl.textContent = ocupados > 0 ? ocupados + ' ocupado(s)' : 'Livre';
      info.appendChild(horaEl);
      info.appendChild(servEl);

      var acoes = document.createElement('div');
      acoes.className = 'acoes';

      if (ocupados === 0) {
        var btn = document.createElement('button');
        btn.className = 'controle-botao-primario ripple';
        btn.textContent = 'Agendar';
        btn.addEventListener('click', function(e){ e.stopPropagation(); abrirModalParaHora(iso, hora); });
        acoes.appendChild(btn);
      } else {
        mapa[hora].forEach(function(item){
          var mini = document.createElement('div');
          var cls = 'servico-' + normalizeClass(item.servico);
          mini.className = 'chip-ag ' + cls;
          mini.style.minWidth = '180px';
          mini.style.padding = '12px 14px';
          var top = document.createElement('div');
          top.style.fontWeight='800';
          top.style.fontSize='15px';
          top.textContent = item.paciente + ' • ' + item.profissional;
          var bot = document.createElement('div');
          bot.style.fontSize='13px';
          bot.style.color='var(--controle-cinza)';
          bot.textContent = item.servico;
          mini.appendChild(top); mini.appendChild(bot);
          mini.title = item.cliente + ' — ' + item.servico;
          mini.tabIndex = 0;
          mini.addEventListener('click', function(e){ e.stopPropagation(); abrirModalParaEdicao(item.id); });
          mini.addEventListener('keydown', function(e){ if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); this.click(); } });
          acoes.appendChild(mini);
        });
      }

      slot.appendChild(info);
      slot.appendChild(acoes);
      horariosLista.appendChild(slot);
    });

    attachRipples();
  }

  function abrirModalParaNova(d){
    closeAllPopups();
    editId = null;
    modalOverlay && modalOverlay.setAttribute('aria-hidden','false');
    modalOverlay && (modalOverlay.style.display='flex');
    document.getElementById('modal-titulo').textContent = 'Novo agendamento';
    botaoApaga && (botaoApaga.style.display='none');

    if (d instanceof Date) inputData.value = formatISODate(d);
    else inputData.value = d;

    inputHora.innerHTML = '';
    preencherOpcoesHoras(inputData.value, null);
    inputProf.value = currentUser;
    inputCliente.value=''; inputPaciente.value=''; inputServico.value='Consulta';
    setTimeout(function(){ inputHora && inputHora.focus(); }, 60);
  }

  function abrirModalParaHora(isoData, hora){
    abrirModalParaNova(parseISODate(isoData));
    setTimeout(function(){ inputHora.value = hora; }, 10);
  }

  function abrirModalParaEdicao(id){
    closeAllPopups();
    var ag = agendamentos.find(function(a){ return a.id === id; });
    if (!ag) return;
    editId = id;
    modalOverlay && modalOverlay.setAttribute('aria-hidden','false');
    modalOverlay && (modalOverlay.style.display='flex');
    document.getElementById('modal-titulo').textContent = 'Editar agendamento';
    botaoApaga && (botaoApaga.style.display='inline-block');
    inputData.value = ag.data;
    inputHora.innerHTML = '';
    preencherOpcoesHoras(ag.data, ag.hora, ag.id);
    inputProf.value = ag.profissional;
    inputCliente.value = ag.cliente; inputPaciente.value = ag.paciente; inputServico.value = ag.servico;
  }

  function preencherOpcoesHoras(dataIso, selectedHora, editingId){
    inputHora.innerHTML = '';
    var ocupados = agendamentos.filter(function(a){ return a.data === dataIso && a.profissional === currentUser; });
    var ocupMap = {};
    ocupados.forEach(function(o){ if (!editingId || o.id !== editingId) ocupMap[o.hora]=true; });
    PRINCIPAL_SLOTS.forEach(function(h){
      var opt = document.createElement('option');
      opt.value = h;
      opt.textContent = h + (ocupMap[h] && h !== selectedHora ? ' (ocupado)' : '');
      opt.disabled = !!(ocupMap[h] && h !== selectedHora);
      if (h === selectedHora) opt.selected = true;
      inputHora.appendChild(opt);
    });
    if (!selectedHora && inputHora.options.length) inputHora.selectedIndex = 0;
  }

  function fechaModal(){
    editId=null;
    modalOverlay && modalOverlay.setAttribute('aria-hidden','true');
    modalOverlay && (modalOverlay.style.display='none');
    form && form.reset();
  }

  function showConfirm(message){
    return new Promise(function(resolve){
      closeAllPopups();
      if (!confirmOverlay || !confirmContainer) {
        resolve(confirm(message));
        return;
      }

      confirmContainer.innerHTML = '\n        <div class="confirm-icone"><i class="fa-solid fa-triangle-exclamation"></i></div>\n        <div class="confirm-body">\n          <h3>Excluir agendamento</h3>\n          <p>' + (message || 'Este agendamento será permanentemente excluído. Esta ação não pode ser desfeita.') + '</p>\n        </div>\n        <div class="confirm-actions">\n          <button class="btn-confirm-no">Não</button>\n          <button class="btn-confirm-yes">Excluir</button>\n        </div>\n      ';

      confirmOverlay && confirmOverlay.setAttribute('aria-hidden','false');
      confirmOverlay && (confirmOverlay.style.display='flex');

      var btnNao = confirmContainer.querySelector('.btn-confirm-no');
      var btnSim = confirmContainer.querySelector('.btn-confirm-yes');

      function cleanup(){
        confirmOverlay && confirmOverlay.setAttribute('aria-hidden','true');
        confirmOverlay && (confirmOverlay.style.display='none');
        btnSim && btnSim.removeEventListener('click', onSim);
        btnNao && btnNao.removeEventListener('click', onNao);
      }
      function onSim(){ cleanup(); resolve(true); }
      function onNao(){ cleanup(); resolve(false); }

      btnSim && btnSim.addEventListener('click', onSim);
      btnNao && btnNao.addEventListener('click', onNao);
    });
  }

  function showAlert(message){
    return new Promise(function(resolve){
      closeAllPopups();
      if (!confirmOverlay || !confirmContainer) { alert(message); resolve(); return; }

      confirmContainer.innerHTML = '\n        <div class="confirm-icone"><i class="fa-solid fa-circle-info"></i></div>\n        <div class="confirm-body">\n          <h3>Aviso</h3>\n          <p>' + (message || '') + '</p>\n        </div>\n        <div class="confirm-actions">\n          <button class="btn-confirm-yes">OK</button>\n        </div>\n      ';

      confirmOverlay && confirmOverlay.setAttribute('aria-hidden','false');
      confirmOverlay && (confirmOverlay.style.display='flex');

      var btnOk = confirmContainer.querySelector('.btn-confirm-yes');
      function cleanup(){ confirmOverlay && confirmOverlay.setAttribute('aria-hidden','true'); confirmOverlay && (confirmOverlay.style.display='none'); }
      function onOk(){ cleanup(); resolve(); }
      btnOk && btnOk.addEventListener('click', onOk);
    });
  }

  function atualizarResumo(animate){
    var filtro = (filtroProf && filtroProf.value && filtroProf.value !== 'todos') ? filtroProf.value : null;
    var total = agendamentos.filter(function(a){ return !filtro || a.profissional === filtro; }).length;
    var isoHoje = formatISODate(hoje);
    var hojeCount = agendamentos.filter(function(a){ return a.data === isoHoje && (!filtro || a.profissional === filtro); }).length;
    var ocupadosHojeMap = {};
    agendamentos.filter(function(a){ return a.data === isoHoje && (!filtro || a.profissional === filtro); }).forEach(function(a){ ocupadosHojeMap[a.hora]=true; });
    var ocupadosCount = 0;
    PRINCIPAL_SLOTS.forEach(function(s){ if (ocupadosHojeMap[s]) ocupadosCount++; });
    var vagas = Math.max(0, PRINCIPAL_SLOTS.length - ocupadosCount);
    var ocupPercent = PRINCIPAL_SLOTS.length > 0 ? Math.round((ocupadosCount / PRINCIPAL_SLOTS.length) * 100) : 0;

    if (animate && _initialLoad) {
      animarNumeroElemento(resumoTotalNum, total, 900);
      pulse(resumoTotalNum);
      animarNumeroElemento(resumoHojeNum, hojeCount, 900);
      pulse(resumoHojeNum);
      animarNumeroElemento(resumoVagasNum, vagas, 900);
      pulse(resumoVagasNum);
      animarNumeroElemento(resumoOcupNum, ocupPercent, 900);
      pulse(resumoOcupNum);
    } else {
      resumoTotalNum.textContent = formatNumber(total);
      resumoHojeNum.textContent = formatNumber(hojeCount);
      resumoVagasNum.textContent = formatNumber(vagas);
      resumoOcupNum.textContent = String(ocupPercent) + '%';
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
          ripple.style.position='absolute';
          ripple.style.borderRadius='50%';
          ripple.style.opacity='0.16';
          ripple.style.background='var(--controle-acento)';
          ripple.style.transform='scale(0)';
          ripple.style.transition='transform .6s ease, opacity .6s ease';
          this.style.position = this.style.position || 'relative';
          this.appendChild(ripple);
          setTimeout(function(){ ripple.style.transform='scale(1)'; ripple.style.opacity='0'; }, 10);
          setTimeout(function(){ ripple.remove(); }, 700);
        });
      })(elems[a]);
    }
  }

  (function ajustarAlturas(){
    function doAdjust(){
      var principal = document.getElementById('controle-principal'); if(!principal) return;
      var reserved = 140;
      var disponivel = principal.clientHeight - reserved;
      if (disponivel < 260) disponivel = 260;
      var cal = document.querySelector('.controle-calendario');
      var dia = document.querySelector('.controle-dia-detalhes');
      if (cal) cal.style.maxHeight = disponivel + 'px';
      if (dia) dia.style.maxHeight = disponivel + 'px';
    }
    window.addEventListener('resize', doAdjust);
    document.addEventListener('DOMContentLoaded', function(){ doAdjust(); setTimeout(doAdjust,300); });
    setTimeout(doAdjust, 600);
  })();

  if (prevMes) prevMes.addEventListener('click', function(){ mudaMes(-1); renderMes(viewAno, viewMes); atualizarResumo(false); });
  if (nextMes) nextMes.addEventListener('click', function(){ mudaMes(1); renderMes(viewAno, viewMes); atualizarResumo(false); });
  if (botaoNovoRapido) botaoNovoRapido.addEventListener('click', function(){ abrirModalParaNova( diaSelecionado || hoje ); });
  if (filtroProf) filtroProf.addEventListener('change', function(){ renderMes(viewAno, viewMes); atualizarResumo(false); });

  if (fecharModal) fecharModal.addEventListener('click', fechaModal);
  if (botaoCancela) botaoCancela.addEventListener('click', fechaModal);
  if (modalOverlay) modalOverlay.addEventListener('click', function(e){ if (e.target === modalOverlay) fechaModal(); });

  if (inputData) inputData.addEventListener('change', function(){ preencherOpcoesHoras(inputData.value, inputHora.value); });

  if (form) form.addEventListener('submit', function(ev){
    ev.preventDefault();
    var data = inputData.value;
    var hora = inputHora.value;
    var profissional = inputProf.value || currentUser;
    var cliente = inputCliente.value.trim();
    var paciente = inputPaciente.value.trim();
    var servico = inputServico.value;
    if (!data || !hora || !cliente || !paciente) { showAlert('Preencha data, hora, cliente e paciente.'); return; }

    var conflitante = agendamentos.find(function(a){
      return a.data === data && a.hora === hora && a.profissional === profissional && a.id !== editId;
    });
    if (conflitante) { showAlert('Já existe um agendamento para esse horário com este profissional.'); return; }

    if (editId) {
      var idx = agendamentos.findIndex(function(a){ return a.id === editId; });
      if (idx >= 0) { agendamentos[idx] = { ...agendamentos[idx], data:data, hora:hora, profissional:profissional, cliente:cliente, paciente:paciente, servico:servico }; }
    } else {
      agendamentos.push({ id: uid(), data:data, hora:hora, profissional:profissional, cliente:cliente, paciente:paciente, servico:servico });
    }
    save();
    fechaModal();
    renderMes(viewAno, viewMes);
    diaSelecionado = parseISODate(data);
    selecionarDia(diaSelecionado);
    atualizarResumo(false);
  });

  if (botaoApaga) botaoApaga.addEventListener('click', function(){
    if (!editId) return;
    showConfirm('Este agendamento será permanentemente excluído. Deseja continuar?').then(function(ok){
      if (!ok) return;
      agendamentos = agendamentos.filter(function(a){ return a.id !== editId; });
      save();
      fechaModal();
      renderMes(viewAno, viewMes);
      if (diaSelecionado) selecionarDia(diaSelecionado);
      atualizarResumo(false);
    });
  });

  var btnNotif = document.getElementById('controle-botao-notif');
  var btnPerfil = document.getElementById('controle-dropdown-perfil');
  if (btnNotif && painelNotif) {
    btnNotif.addEventListener('click', function(e){
      e.stopPropagation();
      var vis = painelNotif.getAttribute('aria-hidden') === 'false';
      closeAllPopups();
      painelNotif.setAttribute('aria-hidden', vis ? 'true' : 'false');
    });
  }
  if (btnPerfil && painelPerfil) {
    btnPerfil.addEventListener('click', function(e){
      e.stopPropagation();
      var vis = painelPerfil.getAttribute('aria-hidden') === 'false';
      closeAllPopups();
      painelPerfil.setAttribute('aria-hidden', vis ? 'true' : 'false');
    });
  }
  document.addEventListener('click', function(ev){
    var target = ev.target;
    if (painelNotif && painelNotif.getAttribute('aria-hidden') === 'false' && !(target.closest && target.closest('#painel-notif')) && !(target.closest && target.closest('#controle-botao-notif'))) { painelNotif.setAttribute('aria-hidden','true'); }
    if (painelPerfil && painelPerfil.getAttribute('aria-hidden') === 'false' && !(target.closest && target.closest('#painel-perfil')) && !(target.closest && target.closest('#controle-dropdown-perfil'))) { painelPerfil.setAttribute('aria-hidden','true'); }
  });

  var menuButtons = document.querySelectorAll('.controle-item-menu');
  var activeMenuButton = document.querySelector('.controle-item-menu.controle-ativo') || (menuButtons[0] || null);
  if (activeMenuButton) activeMenuButton.classList.add('controle-ativo');
  window.wevetModuloAtual = activeMenuButton ? (activeMenuButton.dataset ? activeMenuButton.dataset.modulo : null) : null;

  function setActiveMenu(btn){ if (!btn) return; menuButtons.forEach(function(b){ b.classList.remove('controle-ativo'); }); btn.classList.add('controle-ativo'); activeMenuButton = btn; window.wevetModuloAtual = btn.dataset ? btn.dataset.modulo : null; }

  menuButtons.forEach(function(b){ b.addEventListener('click', function(){ setActiveMenu(this); atualizarResumo(false); }); });

  renderMes(viewAno, viewMes);
  selecionarDia(hoje);
  iniciarIndicadores();
  atualizarResumo(false);

  window.wevetAtualizarResumo = function(){ atualizarResumo(false); };

  function mudaMes(delta){ viewMes += delta; if (viewMes < 0) { viewMes = 11; viewAno -= 1; } if (viewMes > 11) { viewMes = 0; viewAno += 1; } renderMes(viewAno, viewMes); }

})();
