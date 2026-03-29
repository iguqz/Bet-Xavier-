let saldo = 100;
let apostas = [];

// LOGIN
function login() {
  const loginTela = document.getElementById("loginTela");
  const site = document.getElementById("site");

  loginTela.style.display = "none";
  site.style.display = "block";
}

function toggleSenha() {
  const input = document.getElementById("senha");
  input.type = input.type === "password" ? "text" : "password";
}

// MENU USER
function toggleMenu(event) {
  event.stopPropagation();
  const menu = document.getElementById("menuUser");
  menu.style.display = menu.style.display === "block" ? "none" : "block";
}

document.addEventListener("click", function () {
  const menu = document.getElementById("menuUser");
  if (menu) {
    menu.style.display = "none";
  }
});

function depositar(event) {
  event.stopPropagation();
  const valor = parseFloat(prompt("Valor do depósito:"));
  if (!isNaN(valor) && valor > 0) {
    saldo += valor;
    atualizarSaldo();
  }
}

function sacar(event) {
  event.stopPropagation();
  const valor = parseFloat(prompt("Valor do saque:"));
  if (!isNaN(valor) && valor > 0 && valor <= saldo) {
    saldo -= valor;
    atualizarSaldo();
  }
}

function logout(event) {
  event.stopPropagation();
  document.getElementById("site").style.display = "none";
  document.getElementById("loginTela").style.display = "flex";
  document.getElementById("menuUser").style.display = "none";
}

function atualizarSaldo() {
  document.getElementById("saldo").innerText = saldo.toFixed(2);
}

// SUPERODD
function apostarSuperodd(elemento) {
  const jaSelecionada = elemento.classList.contains("selecionado");

  // limpa tudo
  document.querySelectorAll(".odd, .superodd").forEach((el) => {
    el.classList.remove("selecionado");
  });
  apostas = [];

  if (!jaSelecionada) {
    elemento.classList.add("selecionado");
    apostas.push({
      chave: "Superodd",
      nome: "Superodd",
      odd: 5.0
    });
  }

  recalcular();
}

// APOSTAS NORMAIS
function apostar(nome, odd, elemento) {
  // se superodd estiver ativa, não combina
  const superodd = document.getElementById("superodd");
  if (superodd.classList.contains("selecionado")) {
    superodd.classList.remove("selecionado");
    apostas = [];
  }

  const jogo = elemento.closest(".jogo");
  const chaveJogo = jogo.querySelector(".times").innerText;
  const jaSelecionada = elemento.classList.contains("selecionado");

  // remove seleção do próprio jogo
  jogo.querySelectorAll(".odd").forEach((o) => o.classList.remove("selecionado"));

  // remove a aposta antiga desse jogo
  apostas = apostas.filter((a) => a.chave !== chaveJogo);

  // se clicou na já selecionada, só remove
  if (!jaSelecionada) {
    elemento.classList.add("selecionado");
    apostas.push({
      chave: chaveJogo,
      nome: nome,
      odd: odd
    });
  }

  recalcular();
}

function recalcular() {
  const lista = document.getElementById("listaApostas");
  const oddTotalEl = document.getElementById("oddTotal");
  const retornoEl = document.getElementById("retorno");
  const valorInput = document.getElementById("valor");

  lista.innerHTML = "";

  let oddTotal = 1;

  if (apostas.length === 0) {
    oddTotalEl.innerText = "0.00";
    retornoEl.innerText = "0.00";
    return;
  }

  apostas.forEach((a) => {
    oddTotal *= a.odd;

    lista.innerHTML += `
      <div class="itemBoletim">
        ${a.nome} (${a.odd.toFixed(2)})
      </div>
    `;
  });

  oddTotalEl.innerText = oddTotal.toFixed(2);

  const valor = parseFloat(valorInput.value) || 0;
  const retorno = valor * oddTotal;
  retornoEl.innerText = retorno.toFixed(2);
}

document.addEventListener("DOMContentLoaded", function () {
  const valorInput = document.getElementById("valor");
  if (valorInput) {
    valorInput.addEventListener("input", recalcular);
  }
});

function finalizarAposta() {
  const valor = parseFloat(document.getElementById("valor").value) || 0;

  if (apostas.length === 0) {
    alert("Selecione uma aposta.");
    return;
  }

  if (valor <= 0) {
    alert("Digite um valor válido.");
    return;
  }

  if (valor > saldo) {
    alert("Saldo insuficiente.");
    return;
  }

  saldo -= valor;
  atualizarSaldo();

  alert("Aposta realizada!");

  apostas = [];
  document.getElementById("valor").value = "";
  document.querySelectorAll(".odd, .superodd").forEach((el) => {
    el.classList.remove("selecionado");
  });

  recalcular();
}