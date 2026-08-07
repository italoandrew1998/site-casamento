// 1. CONFIGURAÇÕES DO SUPABASE E ADMIN
const SUPABASE_URL = "https://huilegqmbxrtxgauccbpy.supabase.co";
const SUPABASE_KEY = "sb_publishable_P5IF22W7EqooeYWhrDKe7w_6J82t5mU";
const ADMIN_PASSWORD = "mfsq&iars26092026"; // Senha padrão para acessar a Área dos Noivos

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// 2. LISTA FIXA DE PRESENTES
const gifts = [
  { id: 1, icon: "🍽️", title: "Jogo de jantar", description: "Para nossa nova casa.", price: "R$ 250,00" },
  { id: 2, icon: "🍳", title: "Air Fryer", description: "Um presente para nossa cozinha.", price: "R$ 600,00" },
  { id: 3, icon: "🛏️", title: "Jogo de cama", description: "Para deixar nosso quarto aconchegante.", price: "R$ 300,00" },
  { id: 4, icon: "☕", title: "Cafeteira", description: "Para os cafés das manhãs de casados.", price: "R$ 450,00" },
  { id: 5, icon: "🧳", title: "Cota para lua de mel", description: "Uma contribuição para uma lembrança inesquecível.", price: "R$ 500,00" },
  { id: 6, icon: "🏠", title: "Cota para casa nova", description: "Ajude-nos a construir nosso cantinho.", price: "R$ 200,00" }
];

let state = { guests: [], claims: [], allowed: [] };
let selectedGift = null;

const esc = s => String(s ?? "").replace(/[&<>"']/g, m => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[m]));
const claimsFor = id => state.claims.filter(c => Number(c.gift_id) === Number(id));

// 3. CARREGAR DADOS DO SUPABASE
async function loadData() {
  const { data: guests } = await supabase.from('guests').select('*');
  const { data: claims } = await supabase.from('claims').select('*');
  const { data: allowed } = await supabase.from('allowed_guests').select('*').order('name', { ascending: true });

  state.guests = guests || [];
  state.claims = claims || [];
  state.allowed = allowed || [];

  renderAllowedGuestsSelect();
  renderAll();
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
    const maxGuests = Number(selectedOption.dataset.max || 0);
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
    return `<article class="gift"><div class="gift-icon">${g.icon}</div><h3>${g.title}</h3><p>${g.description}</p><div class="price">${g.price}</div>
    ${count ? `<div class="already">✓ Este presente já foi escolhido ${count === 1 ? "uma vez" : count + " vezes"}.<br>Você também pode escolher o mesmo presente, se desejar.</div>` : ""}
    <button class="btn primary" onclick="openGift(${g.id})">${count ? "Escolher mesmo assim" : "Escolher este presente"}</button></article>`;
  }).join("");
}

function openGift(id) {
  selectedGift = gifts.find(g => g.id === id);
  const count = claimsFor(id).length;
  document.getElementById("modalTitle").textContent = selectedGift.title;
  document.getElementById("modalPrice").textContent = selectedGift.price;
  document.getElementById("modalWarning").textContent = count ? `Este presente já foi escolhido por ${count === 1 ? "outro convidado" : "outros convidados"}. Mesmo assim, você pode presentear com este mesmo item.` : "Você está escolhendo este presente para os noivos.";
  document.getElementById("giftName").value = "";
  document.getElementById("giftModal").classList.remove("hidden");
}

function closeGift() {
  document.getElementById("giftModal").classList.add("hidden");
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

    const { error } = await supabase.from('claims').insert([{ gift_id: selectedGift.id, name }]);
    if (error) return alert("Erro ao salvar presente.");

    await loadData();
    closeGift();
    alert("Presente registrado com sucesso! Obrigado pelo carinho.");
  };
}

// 6. ENVIAR RESPOSTA
async function addGuest(name, people, status, source, phone = "") {
  const { error } = await supabase.from('guests').insert([{
    name,
    people: Number(people) + 1,
    status,
    source,
    phone
  }]);

  if (error) return alert("Erro ao salvar confirmação.");
  await loadData();
}

const rsvpForm = document.getElementById("rsvpForm");
if (rsvpForm) {
  rsvpForm.onsubmit = async e => {
    e.preventDefault();
    const name = document.getElementById("rsvpName").value;
    if (!name) return alert("Por favor, selecione seu nome na lista.");

    const answer = e.submitter.dataset.answer;
    const people = Number(document.getElementById("rsvpGuests").value);
    const source = document.getElementById("rsvpSource").value;

    await addGuest(name, people, answer, source);

    const m = document.getElementById("rsvpMessage");
    m.classList.remove("hidden");
    m.innerHTML = answer === "sim" 
      ? `<b>Presença confirmada!</b><br>Obrigado, ${esc(name)}. Você está confirmado.` 
      : `<b>Sentiremos sua falta!</b><br>Obrigado por avisar, ${esc(name)}. Você pode acessar nossa lista abaixo.`;

    if (answer === "nao") document.getElementById("presentes").scrollIntoView({ behavior: "smooth" });
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
      ? state.guests.map(g => `<tr><td><b>${esc(g.name)}</b>${g.phone ? `<br><small>${esc(g.phone)}</small>` : ""}</td><td class="${g.status === "sim" ? "status-yes" : "status-no"}">${g.status === "sim" ? "✓ Vai" : "Não vai"}</td><td>${g.status === "sim" ? g.people : "—"}</td><td>${g.source === "organizador" ? "Você" : "Convidado"}</td><td><button class="mini" onclick="deleteGuest(${g.id})">Excluir</button></td></tr>`).join("") 
      : `<tr><td colspan="5">Nenhum registro.</td></tr>`;
  }

  const giftTable = document.getElementById("giftTable");
  if (giftTable) {
    giftTable.innerHTML = gifts.map(g => {
      const c = claimsFor(g.id);
      return `<tr><td>${g.icon} ${g.title}</td><td>${c.length}</td><td>${c.length ? c.map(x => esc(x.name)).join("<br>") : "—"}</td><td>${c.length ? c.map(x => new Date(x.created_at).toLocaleDateString("pt-BR")).join("<br>") : "—"}</td><td>${c.length ? `<button class="mini" onclick="releaseClaims(${g.id})">Liberar registros</button>` : "—"}</td></tr>`;
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
  };
}

function showManual(t) {
  const m = document.getElementById("manualMessage");
  if (m) {
    m.textContent = t;
    m.classList.remove("hidden");
  }
}

async function deleteGuest(id) {
  if (confirm("Excluir este convidado?")) {
    await supabase.from('guests').delete().eq('id', id);
    await loadData();
  }
}

async function releaseClaims(giftId) {
  if (confirm("Excluir todas as escolhas deste presente?")) {
    await supabase.from('claims').delete().eq('gift_id', giftId);
    await loadData();
  }
}

document.querySelectorAll(".tab").forEach(b => b.onclick = () => {
  document.querySelectorAll(".tab").forEach(x => x.classList.remove("active"));
  b.classList.add("active");
  document.querySelectorAll(".tab-content").forEach(x => x.classList.add("hidden"));
  document.getElementById(b.dataset.tab).classList.remove("hidden");
});

function renderAll() {
  renderGifts();
  renderAdmin();
}

loadData();