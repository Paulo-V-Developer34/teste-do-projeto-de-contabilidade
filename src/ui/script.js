document.getElementById('btnEntrar').addEventListener('click', () => {
  window.location.href = 'login.html';
});

document.getElementById('btnCadastrar').addEventListener('click', () => {
  window.location.href = 'index.html';
});



const contadoresConfiguracao = [
  { el: 'cont1', para: 128 },
  { el: 'cont2', para: 4320 },
  { el: 'cont3', para: 10240 }
];

for (let i = 0; i < contadoresConfiguracao.length; i++) {
  const cfg = contadoresConfiguracao[i];
  const elemento = document.getElementById(cfg.el);
  let valorAtual = 0;
  const passo = Math.ceil(cfg.para / 70);
  const intervalo = setInterval(function () {
    valorAtual = valorAtual + passo;
    if (valorAtual >= cfg.para) {
      elemento.textContent = cfg.para.toLocaleString('pt-BR');
      clearInterval(intervalo);
    } else {
      elemento.textContent = valorAtual.toLocaleString('pt-BR');
    }
  }, 18);
}

const slides = document.getElementById('slides');
const pontos = document.querySelectorAll('.controle-ponto');
const setaEsq = document.getElementById('setaEsq');
const setaDir = document.getElementById('setaDir');

let indiceSlide = 0;
let quantidadeSlides = slides.children.length;
let timerCarrossel;

function irParaSlide(i) {
  indiceSlide = (i + quantidadeSlides) % quantidadeSlides;
  slides.style.transform = 'translateX(-' + (indiceSlide * 100) + '%)';
  for (let j = 0; j < pontos.length; j++) {
    if (j === indiceSlide) {
      pontos[j].classList.add('controle-ativo');
    } else {
      pontos[j].classList.remove('controle-ativo');
    }
  }
}

function iniciarAutoPlay() {
  clearInterval(timerCarrossel);
  timerCarrossel = setInterval(function () {
    irParaSlide(indiceSlide + 1);
  }, 4500);
}

setaEsq.onclick = function () {
  irParaSlide(indiceSlide - 1);
  iniciarAutoPlay();
};

setaDir.onclick = function () {
  irParaSlide(indiceSlide + 1);
  iniciarAutoPlay();
};

for (let k = 0; k < pontos.length; k++) {
  (function (kk) {
    pontos[kk].onclick = function () {
      const i = parseInt(pontos[kk].dataset.i, 10);
      irParaSlide(i);
      iniciarAutoPlay();
    };
  })(k);
}

iniciarAutoPlay();

const textosFerramenta = {
  agendamento: {
    titulo: 'Agendamento',
    descricao: 'Confirmação automática por SMS/e-mail, lembretes programados, fila de espera inteligente e reagendamento com um clique. Relatórios de faltas, integração com calendários e lembretes personalizados para tutores.'
  },
  prontuario: {
    titulo: 'Prontuário',
    descricao: 'Histórico clínico completo com imagens, anexos e exames; prescrições digitais e notas colaborativas entre profissionais. Controle de alergias, vacinas, protocolos e anexos por consulta.'
  },
  planos: {
    titulo: 'Planos',
    descricao: 'Assinaturas flexíveis com cobranças recorrentes, controle de renovações, benefícios exclusivos e relatórios de retenção. Gestão de pacotes, upgrades automáticos e faturamento consolidado.'
  },
  estoque: {
    titulo: 'Estoque',
    descricao: 'Gestão por lotes e validade, inventário multi-depósito, alertas automáticos de reposição e relatórios de consumo para compras inteligentes. Integração com fornecedores, controle de custo e ajuste por devolução.'
  },
  loja: {
    titulo: 'Loja',
    descricao: 'Catálogo online com promoções, carrinho e PDV integrado, sincronização em tempo real com o estoque e opções de entrega/retirada. Gerenciamento de cupons, variações de produto e histórico de vendas.'
  }
};

const itensFerramenta = document.querySelectorAll('.controle-item-ferramenta');
const imagemFerramenta = document.getElementById('imgFerramenta');
const tituloFerramenta = document.getElementById('tituloFerramenta');
const descricaoFerramenta = document.getElementById('descFerramenta');

function atualizarImagemFerramenta(caminho) {
  if (!caminho) {
    return;
  }
  imagemFerramenta.style.transition = 'opacity .28s';
  imagemFerramenta.style.opacity = '0';

  const preload = new Image();
  const separador = caminho.indexOf('?') === -1 ? '?' : '&';
  const caminhoComVersao = caminho + separador + 'v=' + Date.now();

  preload.onload = function () {
    imagemFerramenta.src = caminhoComVersao;
    setTimeout(function () {
      imagemFerramenta.style.opacity = '1';
    }, 50);
  };
  preload.onerror = function () {
    imagemFerramenta.style.opacity = '1';
  };
  preload.src = caminhoComVersao;
}

function ativarItemFerramenta(el) {
  if (!el) {
    return;
  }
  for (let i = 0; i < itensFerramenta.length; i++) {
    itensFerramenta[i].classList.remove('controle-ativo');
  }
  el.classList.add('controle-ativo');
  const chave = el.dataset.chave;
  if (chave && textosFerramenta && textosFerramenta[chave]) {
    tituloFerramenta.textContent = textosFerramenta[chave].titulo;
    descricaoFerramenta.textContent = textosFerramenta[chave].descricao;
  }
  const caminhoImg = el.dataset.img;
  if (caminhoImg) {
    atualizarImagemFerramenta(caminhoImg);
  }
}

for (let i = 0; i < itensFerramenta.length; i++) {
  (function (idx) {
    itensFerramenta[idx].addEventListener('click', function () {
      ativarItemFerramenta(itensFerramenta[idx]);
    });
  })(i);
}

(function inicializarImagemAtiva() {
  let ativo = document.querySelector('.controle-item-ferramenta.controle-ativo');
  if (!ativo) {
    ativo = itensFerramenta[0];
    if (ativo) {
      ativo.classList.add('controle-ativo');
    }
  }
  if (ativo) {
    setTimeout(function () {
      const caminho = ativo.dataset.img;
      if (caminho) {
        atualizarImagemFerramenta(caminho);
      }
      const chave = ativo.dataset.chave;
      if (chave && textosFerramenta && textosFerramenta[chave]) {
        tituloFerramenta.textContent = textosFerramenta[chave].titulo;
        descricaoFerramenta.textContent = textosFerramenta[chave].descricao;
      }
    }, 120);
  }
})();

const contexto = document.getElementById('graficoAtendimentos').getContext('2d');

const etiquetasBase = (function () {
  const arr = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dia = String(d.getDate()).padStart(2, '0');
    const mes = String(d.getMonth() + 1).padStart(2, '0');
    arr.push(dia + '/' + mes);
  }
  return arr;
})();

function serieDeterministica(seed) {
  const usado = new Set();
  const resultado = [];

  for (let i = 0; i < etiquetasBase.length; i++) {
    let valor;
    let tentativas = 0;

    do {
      valor = 2 + Math.abs(Math.floor(((i + 1) * (seed + 3) * (i + seed)) % 9));
      tentativas++;
    } while (usado.has(valor) && tentativas < 20);

    usado.add(valor);
    resultado.push(valor);
  }

  return resultado;
}


const dadosPorFiltro = {
  todos: serieDeterministica(1),
  caes: serieDeterministica(2),
  gatos: serieDeterministica(3),
  exoticos: serieDeterministica(4)
};



const degradado = contexto.createLinearGradient(0, 0, 0, 300);
degradado.addColorStop(0, 'rgba(31,138,89,0.9)');
degradado.addColorStop(1, 'rgba(31,138,89,0.12)');

const graficoConfig = {
  type: 'line',
  data: {
    labels: etiquetasBase,
    datasets: [
      {
        label: 'Atendimentos (7 dias)',
        data: dadosPorFiltro.todos.slice(0),
        fill: true,
        backgroundColor: degradado,
        borderColor: '#1f8a59',
        borderWidth: 3,
        pointRadius: 5,
        pointHoverRadius: 7,
        pointBackgroundColor: '#fff',
        pointBorderColor: '#1f8a59',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#1f8a59',
        tension: 0.45,
        cubicInterpolationMode: 'monotone'
      }
    ]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(6,61,42,.95)',
        titleColor: '#fff',
        bodyColor: '#e6fff2',
        padding: 10,
        borderColor: 'rgba(255,255,255,.15)',
        borderWidth: 1
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#063b2a' }
      },
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(2,6,4,.08)' },
        ticks: { color: '#063b2a' }
      }
    }
  }
};

const grafico = new Chart(contexto, graficoConfig);

function ajustarMaximoY(novaSerie) {
  const maxVal = Math.max.apply(null, novaSerie);
  grafico.options.scales.y.suggestedMax = maxVal + Math.ceil(maxVal * 0.03); /* menos folga */
  grafico.update();
}

ajustarMaximoY(grafico.data.datasets[0].data);

const elementoChips = document.getElementById('chips');
let filtroAtual = 'todos';

elementoChips.addEventListener('click', function (evento) {
  const botao = evento.target.closest('.controle-filtro');
  if (!botao) {
    return;
  }
  const chave = botao.dataset.key;
  if (!chave) {
    return;
  }
  if (chave === filtroAtual) {
    return;
  }
  const todosBotoes = document.querySelectorAll('.controle-filtro');
  for (let i = 0; i < todosBotoes.length; i++) {
    todosBotoes[i].classList.remove('controle-ativo');
  }
  botao.classList.add('controle-ativo');

  const novosDados = dadosPorFiltro[chave];
  grafico.data.datasets[0].data = novosDados.slice(0);
  ajustarMaximoY(novosDados);
  filtroAtual = chave;
});

const produtos = [
  { t: 'Ração Adulto 3kg', p: 'R$ 89,90', img: 'Imagens/produto1.png' },
  { t: 'Coleira antipulgas', p: 'R$ 39,90', img: 'Imagens/produto2.png' },
  { t: 'Shampoo Hipoalergênico', p: 'R$ 29,90', img: 'Imagens/produto3.png' },
  { t: 'Brinquedo de pelúcia', p: 'R$ 24,90', img: 'Imagens/produto4.png' },
  { t: 'Areia Sanitária 4kg', p: 'R$ 32,90', img: 'Imagens/produto5.png' },
  { t: 'Suplemento Ômega', p: 'R$ 54,90', img: 'Imagens/produto6.png' },
  { t: 'Pente Removedor', p: 'R$ 19,90', img: 'Imagens/produto7.png' },
  { t: 'Antisséptico Spray', p: 'R$ 27,50', img: 'Imagens/produto8.png' }
];

const gradeProdutos = document.getElementById('gradeProdutos');

for (let p = 0; p < produtos.length; p++) {
  const produto = produtos[p];
  const el = document.createElement('div');
  el.className = 'controle-produto controle-revelar';
  el.innerHTML = ''
    + '<img src="' + produto.img + '" alt="' + produto.t + '">'
    + '<strong>' + produto.t + '</strong>'
    + '<small>' + produto.p + '</small>'
    + '<div class="controle-acoes-produto"><button class="controle-botao controle-botao--claro">Comprar</button><button class="controle-botao controle-botao--escuro">Carrinho</button></div>';
  gradeProdutos.appendChild(el);
}

const depoimentos = [
  { 
    nome: 'Dra. Ana — Clínica São Lucas', 
    texto: 'Reduzimos faltas e ganhamos tempo com o lembrete automático.',
    img: 'imagens/perfil1.jpg'
  },
  { 
    nome: 'Dr. Pedro — VetCare', 
    texto: 'Relatórios práticos e suporte rápido, recomendo.',
    img: 'imagens/perfil2.jpeg'
  },
  { 
    nome: 'Clínica Bicho Feliz', 
    texto: 'A integração com a loja aumentou nossa receita de venda em 12%.',
    img: 'imagens/perfil3.jpg'
  }
];

const pistaDepoimentos = document.getElementById('testimonialTrack');
const containerDotsDepoimentos = document.getElementById('testiDots');

for (let d = 0; d < depoimentos.length; d++) {
  const item = depoimentos[d];
  const el = document.createElement('div');
  el.className = 'controle-cartao-depoimento controle-revelar';
  el.style.minWidth = '100%';
el.innerHTML = ''
  + '<img class="controle-foto-depoimento" src="' + item.img + '" alt="' + item.nome + '">'
  + '<div class="controle-texto-depoimento">'
  +   '<strong>' + item.nome + '</strong>'
  +   '<div style="margin-top:6px;color:#355b44">' + item.texto + '</div>'
  + '</div>';
  pistaDepoimentos.appendChild(el);
  const dot = document.createElement('div');
  dot.className = 'controle-ponto-depoimento';
  if (d === 0) {
    dot.classList.add('controle-ativo');
  }
  dot.dataset.i = d;
  containerDotsDepoimentos.appendChild(dot);
}

let indiceDepo = 0;
function moverDepoimentos(i) {
  indiceDepo = (i + depoimentos.length) % depoimentos.length;
  pistaDepoimentos.style.transform = 'translateX(-' + (indiceDepo * 100) + '%)';
  const dotsDepo = document.querySelectorAll('.controle-ponto-depoimento');
  for (let dd = 0; dd < dotsDepo.length; dd++) {
    if (dd === indiceDepo) {
      dotsDepo[dd].classList.add('controle-ativo');
    } else {
      dotsDepo[dd].classList.remove('controle-ativo');
    }
  }
}

let timerDepo = setInterval(function () {
  moverDepoimentos(indiceDepo + 1);
}, 4500);

document.getElementById('testiLeft').onclick = function () {
  moverDepoimentos(indiceDepo - 1);
  clearInterval(timerDepo);
  timerDepo = setInterval(function () {
    moverDepoimentos(indiceDepo + 1);
  }, 4500);
};

document.getElementById('testiRight').onclick = function () {
  moverDepoimentos(indiceDepo + 1);
  clearInterval(timerDepo);
  timerDepo = setInterval(function () {
    moverDepoimentos(indiceDepo + 1);
  }, 4500);
};

document.getElementById('testiDots').addEventListener('click', function (e) {
  const alvo = e.target.closest('.controle-ponto-depoimento');
  if (!alvo) {
    return;
  }
  moverDepoimentos(parseInt(alvo.dataset.i, 10));
  clearInterval(timerDepo);
  timerDepo = setInterval(function () {
    moverDepoimentos(indiceDepo + 1);
  }, 4500);
});

const planos = document.querySelectorAll('.controle-plano');

for (let pp = 0; pp < planos.length; pp++) {
  (function (idx) {
    planos[idx].addEventListener('click', function () {
      for (let qq = 0; qq < planos.length; qq++) {
        planos[qq].classList.remove('controle-plano--destaque');
      }
      planos[idx].classList.add('controle-plano--destaque');
    });
  })(pp);
}

const observador = new IntersectionObserver(function (entradas) {
  for (let i = 0; i < entradas.length; i++) {
    const en = entradas[i];
    if (en.isIntersecting) {
      en.target.classList.add('controle-ativo');
    }
  }
}, { threshold: 0.12 });

const todosReveals = document.querySelectorAll('.controle-revelar');

for (let r = 0; r < todosReveals.length; r++) {
  observador.observe(todosReveals[r]);
}

const modalProduto = document.getElementById('modalProduto');
const modalImg = document.getElementById('modalImgProduto');
const modalTitulo = document.getElementById('modalTituloProduto');
const modalPreco = document.getElementById('modalPrecoProduto');

document.querySelectorAll('.controle-produto .controle-botao--claro').forEach((btn, index) => {
  btn.addEventListener('click', () => {
    const produto = produtos[index];
    modalImg.src = produto.img;
    modalTitulo.textContent = produto.t;
    modalPreco.textContent = produto.p;
    modalProduto.style.display = 'flex';
  });
});

document.querySelector('#modalProduto .controle-fechar').onclick = () => {
  modalProduto.style.display = 'none';
};

modalProduto.addEventListener('click', (e) => {
  if (e.target === modalProduto) {
    modalProduto.style.display = 'none';
  }
});
