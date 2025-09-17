export default function main(){
  document.addEventListener("DOMContentLoaded", () => {
  const frase = "Bem-vindo de volta!";
  const alvo = document.getElementById("BoasVindas");
  let indice = 0;

  function digitar() {
    if (indice <= frase.length) {
      alvo.textContent = frase.substring(0, indice);
      indice++;
      let delay = 80 + Math.random() * 80;
      setTimeout(digitar, delay);
    } else {
      alvo.classList.remove("digitando");
    }
  }

  alvo.classList.add("digitando");
  digitar();

  const inputSenha = document.getElementById("senha");
  const btnOlho = document.getElementById("ControleSenha");

  // Inicializa com olho fechado e senha escondida
  inputSenha.type = "password";
  btnOlho.innerHTML = '<i class="fa-regular fa-eye-slash"></i>';

  btnOlho.addEventListener("click", () => {
    if (inputSenha.type === "password") {
      inputSenha.type = "text";
      btnOlho.innerHTML = '<i class="fa-regular fa-eye"></i>';
    } else {
      inputSenha.type = "password";
      btnOlho.innerHTML = '<i class="fa-regular fa-eye-slash"></i>';
    }
  });

  const btnEsqueci = document.getElementById("ControleEsqueci");
  if (btnEsqueci) {
    btnEsqueci.addEventListener("click", (e) => {
      e.preventDefault();
      window.location.href = "esqueciSenha.html";
    });
  }

  const btnCriar = document.getElementById("ControleCriar");
  if (btnCriar) {
    btnCriar.addEventListener("click", () => {
      window.location.href = "index.html";
    });
  }

  const anoAtual = document.getElementById("anoAtual");
  if (anoAtual) {
    anoAtual.textContent = new Date().getFullYear();
  }
});
}