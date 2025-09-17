document.addEventListener("DOMContentLoaded", () => {
  document.getElementById('anoAtual').textContent = new Date().getFullYear();

  const frase = "Recuperação de senha rápida!";
  const alvo = document.getElementById("BoasVindas");
  let indice = 0;

  function digitar() {
    if (indice <= frase.length) {
      alvo.textContent = frase.substring(0, indice);
      indice++;
      setTimeout(digitar, 80 + Math.random() * 80);
    }
  }

  alvo.classList.add("digitando");
  digitar();

  const btnVoltar = document.getElementById("VoltarLogin");
  if (btnVoltar) {
    btnVoltar.type = "button"; 
    btnVoltar.addEventListener("click", () => {
      window.location.href = "login.html"; 
    });
  }

  // Listener do form
  const form = document.getElementById("ControleForm");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const mensagem = document.getElementById("ControleMensagem");
      mensagem.textContent = "Se o e-mail existir, instruções foram enviadas!";
      mensagem.classList.remove("ControleErro");
      mensagem.classList.add("ControleSucesso");
    });
  }
});
