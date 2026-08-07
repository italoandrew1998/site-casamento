const SUPABASE_URL = "SUA_URL_AQUI"; // uilegqmbxrtxgauccbpy
const SUPABASE_KEY = "SUA_CHAVE_ANON_AQUI"; // sb_publishable_P5IF22W7EqooeYWhrDKe7w_6J82t5mU<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Nosso Casamento</title><link rel="stylesheet" href="style.css">
</head>
<body>
<header class="hero" id="inicio">
<nav><a class="brand" href="#inicio">Nosso Casamento</a>
<div class="navlinks"><a href="#presenca">Presença</a><a href="#presentes">Presentes</a><a href="#admin">Área dos noivos</a></div></nav>
<div class="hero-content"><div class="eyebrow">UM DIA PARA CELEBRAR O AMOR</div>
<h1>Estamos nos casando!</h1><p>Sua presença fará parte da nossa história.</p>
<div class="actions"><a class="btn primary" href="#presenca">Confirmar presença</a><a class="btn light" href="#presentes">Lista de presentes</a></div></div>
</header>
<main>
<section class="section" id="presenca"><div class="section-title"><div class="eyebrow">01 · PRESENÇA</div>
<h2>Você estará conosco?</h2><p>Você pode confirmar sua própria presença. Se preferir, outra pessoa pode registrar por você.</p></div>
<div class="card"><form id="rsvpForm">
<label>Nome completo</label><input id="rsvpName" required placeholder="Digite seu nome">
<label>Acompanhantes</label><select id="rsvpGuests"><option value="0">Somente eu</option><option value="1">+ 1 acompanhante</option><option value="2">+ 2 acompanhantes</option><option value="3">+ 3 acompanhantes</option><option value="4">+ 4 acompanhantes</option></select>
<label>Quem está preenchendo?</label><select id="rsvpSource"><option value="convidado">O próprio convidado</option><option value="organizador">Outra pessoa pelo convidado</option></select>
<div class="choice-grid"><button type="submit" class="choice yes" data-answer="sim"><b>✓ Vou ao casamento</b><small>Confirmar presença</small></button>
<button type="submit" class="choice no" data-answer="nao"><b>♡ Não poderei comparecer</b><small>Registrar ausência e ir aos presentes</small></button></div>
</form><div id="rsvpMessage" class="message hidden"></div></div></section>

<section class="section gifts" id="presentes"><div class="section-title"><div class="eyebrow">02 · CARINHO</div>
<h2>Lista de presentes</h2><p>Se um presente já tiver sido escolhido, você será avisado, mas poderá escolher o mesmo item se quiser.</p></div>
<div id="giftGrid" class="gift-grid"></div></section>

<section class="section admin" id="admin"><div class="section-title"><div class="eyebrow">03 · ORGANIZAÇÃO</div>
<h2>Área dos noivos</h2><p>Controle de convidados e presentes.</p></div>
<div class="admin-tabs"><button class="tab active" data-tab="guestsTab">Convidados</button><button class="tab" data-tab="giftsTab">Presentes escolhidos</button><button class="tab" data-tab="addTab">Registrar pelo convidado</button></div>
<div id="guestsTab" class="tab-content"><div class="stats"><div><strong id="confirmedCount">0</strong><span>Confirmados</span></div><div><strong id="declinedCount">0</strong><span>Não irão</span></div><div><strong id="peopleCount">0</strong><span>Pessoas confirmadas</span></div></div>
<div class="table-wrap"><table><thead><tr><th>Convidado</th><th>Resposta</th><th>Pessoas</th><th>Confirmado por</th><th>Ação</th></tr></thead><tbody id="guestTable"></tbody></table></div></div>
<div id="giftsTab" class="tab-content hidden"><div class="table-wrap"><table><thead><tr><th>Presente</th><th>Quantidade</th><th>Quem escolheu</th><th>Data</th><th>Ação</th></tr></thead><tbody id="giftTable"></tbody></table></div></div>
<div id="addTab" class="tab-content hidden"><div class="manual-box"><h3>Registrar confirmação manualmente</h3><p>Ideal para idosos ou convidados que confirmarem por telefone.</p>
<form id="manualForm"><label>Nome</label><input id="manualName" required placeholder="Nome completo"><label>Telefone (opcional)</label><input id="manualPhone" placeholder="(00) 00000-0000">
<label>Acompanhantes</label><select id="manualGuests"><option value="0">Somente o convidado</option><option value="1">+ 1 acompanhante</option><option value="2">+ 2 acompanhantes</option><option value="3">+ 3 acompanhantes</option></select>
<div class="manual-actions"><button class="btn primary">Registrar que vai</button><button type="button" id="manualDecline" class="btn secondary">Registrar que não vai</button></div></form><div id="manualMessage" class="message hidden"></div></div></div>
</section></main>
<footer><strong>Nome dos Noivos</strong> · Com amor ♥</footer>

<div id="giftModal" class="modal hidden"><div class="modal-box"><button id="closeModal" class="close">×</button>
<div class="eyebrow">LISTA DE PRESENTES</div><h2 id="modalTitle"></h2><p id="modalPrice" class="price"></p><p id="modalWarning" class="warning"></p>
<label>Seu nome</label><input id="giftName" placeholder="Nome de quem está presenteando">
<button id="confirmGift" class="btn primary full">Confirmar este presente</button><button id="cancelGift" class="btn secondary full">Voltar</button>
</div></div>
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script src="script.js"></script>
</body></html>
// CONFIGURAÇÃO DA SENHA DOS NOIVOS
// Altere o valor abaixo para a senha que você desejar:
const ADMIN_PASSWORD = "1234"; // <-- Coloque sua senha aqui!

document.getElementById("adminLoginBtn").onclick = () => {
  const inputPass = document.getElementById("adminPassword").value.trim();
  const errorMsg = document.getElementById("adminError");

  if (inputPass === ADMIN_PASSWORD) {
    // Esconde o campo de login e exibe o painel
    document.getElementById("adminAuth").classList.add("hidden");
    document.getElementById("adminContent").classList.remove("hidden");
    errorMsg.classList.add("hidden");
  } else {
    // Exibe mensagem de erro
    errorMsg.classList.remove("hidden");
  }
};