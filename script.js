// 1. CONFIGURAÇÕES DO SUPABASE E ADMIN
const SUPABASE_URL = "https://uilegqmbxrtxgauccbpy.supabase.co";
const SUPABASE_KEY = "sb_publishable_P5IF22W7EqooeYWhrDKe7w_6J82t5mU";
const ADMIN_PASSWORD = "mfsq&iars26092026"; // Senha para acessar a Área dos Noivos

// Criando a conexão
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// 2. LISTA COMPLETA DE PRESENTES (Itens clássicos + 44 itens da imagem)
const gifts = [
  // ITENS CLÁSSICOS ANTERIORES
  { id: 1, icon: "🍽️", title: "Jogo de jantar", description: "Para nossa nova casa.", price: "R$ 250,00" },
  { id: 2, icon: "🍳", title: "Air Fryer", description: "Um presente para nossa cozinha.", price: "R$ 600,00" },
  { id: 3, icon: "🛏️", title: "Jogo de cama", description: "Para deixar nosso quarto aconchegante.", price: "R$ 300,00" },
  { id: 4, icon: "☕", title: "Cafeteira", description: "Para os cafés das manhãs de casados.", price: "R$ 450,00" },
  { id: 5, icon: "🧳", title: "Cota para lua de mel", description: "Uma contribuição para uma lembrança inesquecível.", price: "R$ 500,00" },
  { id: 6, icon: "🏠", title: "Cota para casa nova", description: "Ajude-nos a construir nosso cantinho.", price: "R$ 200,00" },

  // COZINHA (Itens da Imagem)
  { id: 7, icon: "🍴", title: "Jogo de talheres", description: "Cozinha", price: "Sugestão" },
  { id: 8, icon: "🥛", title: "Jogo de copos", description: "Cozinha", price: "Sugestão" },
  { id: 9, icon: "🍨", title: "Jogo de sobremesa", description: "Cozinha", price: "Sugestão" },
  { id: 10, icon: "🔪", title: "Faqueiro", description: "Cozinha", price: "Sugestão" },
  { id: 11, icon: "🍷", title: "Conjunto de taças", description: "Cozinha", price: "Sugestão" },
  { id: 12, icon: "🍟", title: "Air freyer", description: "Cozinha", price: "Sugestão" },
  { id: 13, icon: "🍳", title: "Jogo de panelas", description: "Cozinha", price: "Sugestão" },
  { id: 14, icon: "🍽️", title: "Jogo de pratos", description: "Cozinha", price: "Sugestão" },
  { id: 15, icon: "🥤", title: "Liquidificador", description: "Cozinha", price: "Sugestão" },
  { id: 16, icon: "🧁", title: "Batedeira", description: "Cozinha", price: "Sugestão" },
  { id: 17, icon: "☕", title: "Jogo de xícaras", description: "Cozinha", price: "Sugestão" },
  { id: 18, icon: "🥪", title: "Sanduicheira", description: "Cozinha", price: "Sugestão" },
  { id: 19, icon: "☕", title: "Cafeteira", description: "Cozinha", price: "Sugestão" },
  { id: 20, icon: "🍽️", title: "Escorredor de louças", description: "Cozinha", price: "Sugestão" },
  { id: 21, icon: "🏺", title: "Garrafa térmica", description: "Cozinha", price: "Sugestão" },
  { id: 22, icon: "🥘", title: "Panela de pressão", description: "Cozinha", price: "Sugestão" },
  { id: 23, icon: "🥄", title: "Utilidades de silicone", description: "Cozinha", price: "Sugestão" },
  { id: 24, icon: "🥧", title: "Formas", description: "Cozinha", price: "Sugestão" },
  { id: 25, icon: "🔥", title: "Forno", description: "Cozinha", price: "Sugestão" },
  { id: 26, icon: "🧵", title: "Pano de prato", description: "Cozinha", price: "Sugestão" },
  { id: 27, icon: "🫙", title: "Potes", description: "Cozinha", price: "Sugestão" },
  { id: 28, icon: "🧊", title: "Jarra de vidro", description: "Cozinha", price: "Sugestão" },
  { id: 29, icon: "🍯", title: "Açucareiro", description: "Cozinha", price: "Sugestão" },
  { id: 30, icon: "🧂", title: "Saleiro", description: "Cozinha", price: "Sugestão" },
  { id: 31, icon: "🪵", title: "Descanso de panela", description: "Cozinha", price: "Sugestão" },
  { id: 32, icon: "🍽️", title: "Jogo americano", description: "Cozinha", price: "Sugestão" },
  { id: 33, icon: "🫖", title: "Bule", description: "Cozinha", price: "Sugestão" },
  { id: 34, icon: "🧀", title: "Ralador", description: "Cozinha", price: "Sugestão" },
  { id: 35, icon: "🍽️", title: "Travessa (Pequena, Média e Grande)", description: "Cozinha", price: "Sugestão" },
  { id: 36, icon: "🌿", title: "Porta Tempero", description: "Cozinha", price: "Sugestão" },
  { id: 37, icon: "🍴", title: "Utensílio de Cozinha", description: "Cozinha", price: "Sugestão" },
  { id: 38, icon: "👕", title: "Varal de roupas", description: "Cozinha", price: "Sugestão" },
  { id: 39, icon: "🪑", title: "Cadeira", description: "Cozinha", price: "Sugestão" },

  // QUARTO (Itens da Imagem)
  { id: 40, icon: "🛏️", title: "Jogo de cama de casal Queen", description: "Quarto", price: "Sugestão" },
  { id: 41, icon: "🛏️", title: "Fronha", description: "Quarto", price: "Sugestão" },
  { id: 42, icon: "🛌", title: "Edredom", description: "Quarto", price: "Sugestão" },
  { id: 43, icon: "🛏️", title: "Lençol", description: "Quarto", price: "Sugestão" },

  // BANHEIRO (Itens da Imagem)
  { id: 44, icon: "🛁", title: "Jogo de toalhas de banho", description: "Banheiro", price: "Sugestão" },
  { id: 45, icon: "🧖", title: "Jogo de toalhas de rosto", description: "Banheiro", price: "Sugestão" },
  { id: 46, icon: "🧴", title: "Porta sabonete líquido", description: "Banheiro", price: "Sugestão" },
  { id: 47, icon: "🦷", title: "Porta escova", description: "Banheiro", price: "Sugestão" },
  { id: 48, icon: "🧼", title: "Porta sabonete", description: "Banheiro", price: "Sugestão" },
  { id: 49, icon: "🗑️", title: "Lixeira de inox", description: "Banheiro", price: "Sugestão" },
  { id: 50, icon: "🧶", title: "Jogo de tapetes", description: "Banheiro", price: "Sugestão" }
];

let state = { guests: [], claims: [], allowed: [] };
let selectedGift = null;

const esc = s => String(s ?? "").replace(/[&<>"']/g, m => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[m]));
const claimsFor = id => state.claims.filter(c => Number(c.gift_id) === Number(id));

// 3. CARREGAR DADOS DO SUPABASE
async function loadData() {
  try {
    const { data: guests, error: errGuests } = await supabaseClient.from('guests').select('*');
    const { data: claims, error: errClaims } = await supabaseClient.from('claims').select('*');
    const { data: allowed, error: errAllowed } = await supabaseClient.from('allowed_guests').select('*').order('name', { ascending: true });

    if (errGuests) console.error("Erro ao carregar convidados:", errGuests);
    if (errClaims) console.error("Erro ao carregar presentes:", errClaims);
    if (errAllowed) console.error("Erro ao carregar lista de autorizados:", errAllowed);

    state.guests = guests || [];
    state.claims = claims || [];
    state.allowed = allowed || [];

    renderAllowedGuestsSelect();
    renderAll();
  } catch (err) {
    console.error("Falha ao se conectar com o banco de dados:", err);
  }
}

// 4. ALIMENTAR MENU DA LISTA FECHADA
function renderAllowedGuestsSelect() {
  const select = document.getElementById("rsvpName");
  if (!select) return;

  if (!state.allowed.length) {
    select.innerHTML = '<option value="">Nenhum nome cadastrado na lista</option>';
    return;
  }

  select.innerHTML = '<option value="">-- Selecione seu nome --</option>' + 
    state.allowed.map(g => `<option value="${esc(g.name)}" data-max="${g.max_guests}">${esc(g.name)}</option>`).join("");
}

// Limitar acompanhantes dinamicamente dependendo da pessoa selecionada
const rsvpNameEl = document.getElementById("rsvpName");
if (rsvpNameEl) {
  rsvpNameEl.addEventListener("change", (e) => {
    const selectedOption = e.target.options[e.target.selectedIndex];
    const maxGuests = Number(selectedOption ? selectedOption.dataset.max : 0) || 0;
    const guestsSelect = document.getElementById("rsvpGuests");

    let options = '<option value="0">Somente eu</option>';
    for (let i = 1; i <= maxGuests; i++) {
      options += `<option value="${i}">+ ${i} acompanhante(s)</option>`;
    }
    if (guestsSelect) guestsSelect.innerHTML = options;
  });
}

// 5. PRESENTES
function renderGifts() {
  const giftGrid = document.getElementById("giftGrid");
  if (!giftGrid) return;

  giftGrid.innerHTML = gifts.map(g => {
    const count = claimsFor(g.id).length;
    return `<article class="gift">
      <div class="gift-icon">${g.icon}</div>
      <h3>${g.title}</h3>
      <p>${g.description}</p>
      <div class="price">${g.price}</div>
      ${count ? `<div class="already">✓ Este presente já foi escolhido ${count === 1 ? "uma vez" : count + " vezes"}.<br>Você também pode escolher o mesmo presente, se desejar.</div>` : ""}
      <button class="btn primary" onclick="openGift(${g.id})">${count ? "Escolher mesmo assim" : "Escolher este presente"}</button>
    </article>`;
  }).join("");
}

window.openGift = function(id) {
  selectedGift = gifts.find(g => g.id === id);
  if (!selectedGift) return;

  const count = claimsFor(id).length;
  document.getElementById("modalTitle").textContent = selectedGift.title;
  document.getElementById("modalPrice").textContent = selectedGift.description;
  document.getElementById("modalWarning").textContent = count 
    ? `Este presente já foi escolhido por ${count === 1 ? "outro convidado" : "outros convidados"}. Mesmo assim, você pode presentear com este mesmo item.` 
    : "Você está escolhendo este presente para os noivos.";
  document.getElementById("giftName").value = "";
  document.getElementById("giftModal").classList.remove("hidden");
};

function closeGift() {
  const modal = document.getElementById("giftModal");
  if (modal) modal.classList.add("hidden");
  selectedGift = null;
}

const closeModalBtn = document.getElementById("closeModal");
if (closeModalBtn) closeModalBtn.onclick = closeGift;

const cancelGiftBtn = document.getElementById("cancelGift");
if (cancelGiftBtn) cancelGiftBtn.onclick = closeGift;

const confirmGiftBtn = document.getElementById("confirmGift");
if (confirmGiftBtn) {
  confirmGiftBtn.onclick = async () => {
    const name = document.getElementById("giftName").value.trim();
    if (!name) return alert("Informe seu nome.");
    if (!selectedGift) return alert("Nenhum presente selecionado.");

    const { error } = await supabaseClient.from('claims').insert([{ gift_id: selectedGift.id, name }]);
    if (error) {
      console.error(error);
      return alert("Erro ao salvar presente.");
    }

    await loadData();
    closeGift();
    alert("Presente registrado com sucesso! Obrigado pelo carinho.");
  };
}

// 6. ENVIAR RESPOSTA DA CONFIRMAÇÃO
async function addGuest(name, people, status, source, phone = "") {
  const { error } = await supabaseClient.from('guests').insert([{
    name,
    people: Number(people) + 1,
    status,
    source,
    phone
  }]);

  if (error) {
    console.error(error);
    alert("Erro ao salvar confirmação.");
    return false;
  }
  
  await loadData();
  return true;
}

const rsvpForm = document.getElementById("rsvpForm");
if (rsvpForm) {
  rsvpForm.onsubmit = async e => {
    e.preventDefault();
    const name = document.getElementById("rsvpName").value;
    if (!name) return alert("Por favor, selecione seu nome na lista.");

    const answer = e.submitter ? e.submitter.dataset.answer : "sim";
    const people = Number(document.getElementById("rsvpGuests").value);
    const source = document.getElementById("rsvpSource").value;

    const success = await addGuest(name, people, answer, source);

    if (success) {
      const m = document.getElementById("rsvpMessage");
      m.classList.remove("hidden");
      m.innerHTML = answer === "sim" 
        ? `<b>Presença confirmada!</b><br>Obrigado, ${esc(name)}. Você está confirmado.` 
        : `<b>Sentiremos sua falta!</b><br>Obrigado por avisar, ${esc(name)}. Você pode acessar nossa lista abaixo.`;

      if (answer === "nao") document.getElementById("presentes").scrollIntoView({ behavior: "smooth" });
    }
  };
}

// 7. PAINEL DOS NOIVOS (PROTEÇÃO POR SENHA)
const adminLoginBtn = document.getElementById("adminLoginBtn");
if (adminLoginBtn) {
  adminLoginBtn.onclick = () => {
    const inputPass = document.getElementById("adminPassword").value.trim();
    const errorMsg = document.getElementById("adminError");

    if (inputPass === ADMIN_PASSWORD) {
      document.getElementById("adminAuth").classList.add("hidden");
      document.getElementById("adminContent").classList.remove("hidden");
      errorMsg.classList.add("hidden");
    } else {
      errorMsg.classList.remove("hidden");
    }
  };
}

function renderAdmin() {
  const yes = state.guests.filter(g => g.status === "sim");
  const no = state.guests.filter(g => g.status === "nao");

  const confirmedCountEl = document.getElementById("confirmedCount");
  if (confirmedCountEl) confirmedCountEl.textContent = yes.length;

  const declinedCountEl = document.getElementById("declinedCount");
  if (declinedCountEl) declinedCountEl.textContent = no.length;

  const peopleCountEl = document.getElementById("peopleCount");
  if (peopleCountEl) peopleCountEl.textContent = yes.reduce((a, g) => a + Number(g.people), 0);

  const guestTable = document.getElementById("guestTable");
  if (guestTable) {
    guestTable.innerHTML = state.guests.length 
      ? state.guests.map(g => `<tr>
          <td><b>${esc(g.name)}</b>${g.phone ? `<br><small>${esc(g.phone)}</small>` : ""}</td>
          <td class="${g.status === "sim" ? "status-yes" : "status-no"}">${g.status === "sim" ? "✓ Vai" : "Não vai"}</td>
          <td>${g.status === "sim" ? g.people : "—"}</td>
          <td>${g.source === "organizador" ? "Você" : "Convidado"}</td>
          <td><button class="mini" onclick="deleteGuest(${g.id})">Excluir</button></td>
        </tr>`).join("") 
      : `<tr><td colspan="5">Nenhum registro.</td></tr>`;
  }

  const giftTable = document.getElementById("giftTable");
  if (giftTable) {
    giftTable.innerHTML = gifts.map(g => {
      const c = claimsFor(g.id);
      return `<tr>
        <td>${g.icon} ${g.title} (${g.description})</td>
        <td>${c.length}</td>
        <td>${c.length ? c.map(x => esc(x.name)).join("<br>") : "—"}</td>
        <td>${c.length ? c.map(x => new Date(x.created_at).toLocaleDateString("pt-BR")).join("<br>") : "—"}</td>
        <td>${c.length ? `<button class="mini" onclick="releaseClaims(${g.id})">Liberar registros</button>` : "—"}</td>
      </tr>`;
    }).join("");
  }
}

// FORM MANUAL (DENTRO DA ÁREA DOS NOIVOS)
const manualForm = document.getElementById("manualForm");
if (manualForm) {
  manualForm.onsubmit = async e => {
    e.preventDefault();
    const name = document.getElementById("manualName").value.trim();
    const people = document.getElementById("manualGuests").value;
    const phone = document.getElementById("manualPhone").value.trim();

    if (!name) return alert("Digite o nome.");

    await addGuest(name, people, "sim", "organizador", phone);
    showManual("Presença de " + name + " registrada.");
    e.target.reset();
  };
}

const manualDeclineBtn = document.getElementById("manualDecline");
if (manualDeclineBtn) {
  manualDeclineBtn.onclick = async () => {
    const name = document.getElementById("manualName").value.trim();
    const phone = document.getElementById("manualPhone").value.trim();
    if (!name) return alert("Digite o nome.");

    await addGuest(name, 0, "nao", "organizador", phone);
    showManual("Ausência de " + name + " registrada.");
    document.getElementById("manualForm").reset();
  };
}

function showManual(t) {
  const m = document.getElementById("manualMessage");
  if (m) {
    m.textContent = t;
    m.classList.remove("hidden");
  }
}

window.deleteGuest = async function(id) {
  if (confirm("Excluir este convidado?")) {
    await supabaseClient.from('guests').delete().eq('id', id);
    await loadData();
  }
};

window.releaseClaims = async function(giftId) {
  if (confirm("Excluir todas as escolhas deste presente?")) {
    await supabaseClient.from('claims').delete().eq('gift_id', giftId);
    await loadData();
  }
};

// COMPORTAMENTO DAS ABAS NO PAINEL DOS NOIVOS
document.querySelectorAll(".tab").forEach(b => {
  b.onclick = () => {
    document.querySelectorAll(".tab").forEach(x => x.classList.remove("active"));
    b.classList.add("active");
    document.querySelectorAll(".tab-content").forEach(x => x.classList.add("hidden"));
    const targetTab = document.getElementById(b.dataset.tab);
    if (targetTab) targetTab.classList.remove("hidden");
  };
});

function renderAll() {
  renderGifts();
  renderAdmin();
}

// Execução imediata e escuta do DOM
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", loadData);
} else {
  loadData();
}