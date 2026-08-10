// 1. CONFIGURAÇÕES DO SUPABASE E ADMIN
const SUPABASE_URL = "https://uilegqmbxrtxgauccbpy.supabase.co";
const SUPABASE_KEY = "sb_publishable_P5IF22W7EqooeYWhrDKe7w_6J82t5mU";
const ADMIN_PASSWORD = "mfsq&iars26092026"; 

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Variáveis de Estado
let state = { guests: [], claims: [], allowed: [] };
let selectedGift = null;
let currentGuestName = ""; // MEMÓRIA: Guarda o nome de quem confirmou presença
let pendingRsvpData = null; // Guarda os dados antes da confirmação final

const gifts = [
  // ... (MANTENHA AQUI A SUA LISTA DE PRESENTES INTACTA DA MENSAGEM ANTERIOR)
  { id: 20, icon: "✈️", title: "Cota para lua de mel", description: '<div style="text-align: center;">Cotas / Presentes em dinheiro</div>', price: "R$ 500,00" },
  { id: 21, icon: "🛋️", title: "Cota para móveis", description: '<div style="text-align: center;">Cotas / Presentes em dinheiro</div>', price: "R$ 300,00" },
  { id: 22, icon: "⚡", title: "Cota para eletrodomésticos", description: '<div style="text-align: center;">Cotas / Presentes em dinheiro</div>', price: "R$ 300,00" },
  { id: 23, icon: "🖼️", title: "Cota para decoração", description: '<div style="text-align: center;">Cotas / Presentes em dinheiro</div>', price: "R$ 200,00" },
  { id: 24, icon: "🎁", title: "Cota para algum item especial da casa", description: '<div style="text-align: center;">Cotas / Presentes em dinheiro</div>', price: "R$ 250,00" }
];

const esc = s => String(s ?? "").replace(/[&<>"']/g, m => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[m]));
const claimsFor = id => state.claims.filter(c => Number(c.gift_id) === Number(id));

// 3. CARREGAR DADOS DO SUPABASE
async function loadData() {
  try {
    const { data: guests, error: errGuests } = await supabaseClient.from('guests').select('*');
    const { data: claims, error: errClaims } = await supabaseClient.from('claims').select('*');
    const { data: allowed, error: errAllowed } = await supabaseClient.from('allowed_guests').select('*').order('name', { ascending: true });

    state.guests = guests || [];
    state.claims = claims || [];
    state.allowed = allowed || [];

    renderAllSelects(); // Preenche listas gerais (Presentes e Painel Manual)
    renderAll();
  } catch (err) {
    console.error("Falha ao conectar com banco de dados:", err);
  }
}

// 4. PREENCHER MENUS
function renderAllSelects() {
  const optionsHtmlAll = !state.allowed.length
    ? '<option value="">Nenhum nome cadastrado</option>'
    : '<option value="">-- Selecione o nome --</option>' +
      state.allowed.map(g => `<option value="${esc(g.name)}" data-max="${g.max_guests}">${esc(g.name)}</option>`).join("");

  const giftSelect = document.getElementById("giftName");
  if (giftSelect) giftSelect.innerHTML = optionsHtmlAll;

  const manualSelect = document.getElementById("manualName");
  if (manualSelect) manualSelect.innerHTML = optionsHtmlAll;
}

// FILTRA A LISTA DO RSVP (NOIVO / NOIVA)
window.selectSide = function(lado) {
  const listaFiltrada = state.allowed.filter(g => g.lado === lado);

  const optionsHtml = !listaFiltrada.length
    ? '<option value="">Nenhum nome encontrado para esta lista</option>'
    : '<option value="">-- Selecione o seu nome --</option>' +
      listaFiltrada.map(g => `<option value="${esc(g.name)}" data-max="${g.max_guests}">${esc(g.name)}</option>`).join("");

  const rsvpSelect = document.getElementById("rsvpName");
  if (rsvpSelect) rsvpSelect.innerHTML = optionsHtml;

  document.getElementById("sideSelection").classList.add("hidden");
  document.getElementById("rsvpFormContent").classList.remove("hidden");
};

// Limitar acompanhantes no RSVP
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

// 5. FLUXO DE CONFIRMAÇÃO DE PRESENÇA COM REVISÃO (RSVP)
const rsvpForm = document.getElementById("rsvpForm");
if (rsvpForm) {
  rsvpForm.onsubmit = e => {
    e.preventDefault();
    const name = document.getElementById("rsvpName").value;
    if (!name) return alert("Por favor, selecione seu nome na lista.");

    const answer = e.submitter ? e.submitter.dataset.answer : "sim";
    const people = Number(document.getElementById("rsvpGuests").value);
    
    // Salva temporariamente para revisão
    pendingRsvpData = { name, people, answer, source: "convidado" };

    // Esconde o formulário e mostra a tela de conferência
    document.getElementById("rsvpFormContent").classList.add("hidden");
    const confirmScreen = document.getElementById("rsvpConfirmScreen");
    confirmScreen.classList.remove("hidden");

    // Monta o texto de conferência
    let textoRevisao = "";
    if (answer === "sim") {
       textoRevisao = `Você está confirmando presença para <br><b style="font-size:22px; color:#2c5e3b;">${name}</b><br>`;
       if (people > 0) textoRevisao += `e mais <b>${people} acompanhante(s)</b>.`;
       else textoRevisao += `(Somente você).`;
    } else {
       textoRevisao = `Você está avisando que <br><b style="font-size:22px; color:#d9534f;">${name}</b><br>NÃO poderá comparecer.`;
    }

    document.getElementById("rsvpConfirmText").innerHTML = textoRevisao;
  };
}

window.cancelRSVP = function() {
  // Voltar para corrigir
  pendingRsvpData = null;
  document.getElementById("rsvpConfirmScreen").classList.add("hidden");
  document.getElementById("rsvpFormContent").classList.remove("hidden");
}

window.confirmRSVP = async function() {
  if (!pendingRsvpData) return;
  const { name, people, answer, source } = pendingRsvpData;
  
  const { error } = await supabaseClient.from('guests').insert([{
    name, people: Number(people) + 1, status: answer, source, phone: ""
  }]);

  if (error) {
    alert("Erro ao salvar confirmação. Tente novamente.");
    return;
  }
  
  await loadData();

  // SALVA O NOME NA MEMÓRIA PARA A LISTA DE PRESENTES!
  currentGuestName = name;

  // Mostra mensagem de sucesso
  document.getElementById("rsvpConfirmScreen").classList.add("hidden");
  const m = document.getElementById("rsvpMessage");
  m.classList.remove("hidden");
  
  m.innerHTML = answer === "sim" 
    ? `<b>Presença confirmada!</b><br>Obrigado, ${esc(name)}. Esperamos você lá!` 
    : `<b>Sentiremos sua falta!</b><br>Obrigado por avisar, ${esc(name)}.`;

  if (answer === "nao") document.getElementById("presentes").scrollIntoView({ behavior: "smooth" });
}

// 6. PRESENTES (USANDO A MEMÓRIA DE NOME)
function renderGifts() {
  const giftGrid = document.getElementById("giftGrid");
  if (!giftGrid) return;

  giftGrid.innerHTML = gifts.map(g => {
    const allClaims = claimsFor(g.id);
    return `<article class="gift" style="text-align: center;">
      <div class="gift-icon">${g.icon}</div>
      <h3>${g.title}</h3>
      ${g.description}
      <div class="price">${g.price}</div>
      <button class="btn primary" onclick="openGift(${g.id})" style="margin-top: 10px;">${allClaims.length ? "Presentear também" : "Escolher este presente"}</button>
    </article>`;
  }).join("");
}

window.openGift = function(id) {
  selectedGift = gifts.find(g => g.id === id);
  if (!selectedGift) return;

  document.getElementById("modalTitle").textContent = selectedGift.title;
  document.getElementById("modalPrice").innerHTML = selectedGift.description;

  // Lógica de Memória do Convidado
  const wrapper = document.getElementById("giftSelectWrapper");
  const nameAuto = document.getElementById("giftNameAuto");

  if (currentGuestName) {
    // Se ele já confirmou presença, esconde a lista e mostra o nome
    if(wrapper) wrapper.classList.add("hidden");
    if(nameAuto) {
      nameAuto.classList.remove("hidden");
      nameAuto.innerHTML = `Presenteando como: <br><b>${currentGuestName}</b>`;
    }
  } else {
    // Se foi direto pros presentes, exige a escolha
    if(wrapper) wrapper.classList.remove("hidden");
    if(nameAuto) nameAuto.classList.add("hidden");
    const giftSelect = document.getElementById("giftName");
    if (giftSelect) giftSelect.value = "";
  }
  
  const giftStepSelection = document.getElementById("giftStepSelection");
  const giftStepPix = document.getElementById("giftStepPix");
  if (giftStepSelection) giftStepSelection.classList.remove("hidden");
  if (giftStepPix) giftStepPix.classList.add("hidden");

  document.getElementById("giftModal").classList.remove("hidden");
};

window.closeGift = function() {
  document.getElementById("giftModal").classList.add("hidden");
  selectedGift = null;
};

// Pegar o nome do presenteador (da memória ou do select)
function getGifterName() {
  if (currentGuestName) return currentGuestName;
  const select = document.getElementById("giftName");
  return select ? select.value.trim() : "";
}

async function handleConfirmFullGift(e) {
  if (e) e.preventDefault();
  
  const name = getGifterName();
  if (!name) return alert("Por favor, selecione seu nome na lista.");

  try {
    const { error } = await supabaseClient.from("claims").insert({
      gift_id: selectedGift.id, name: name
    });
    if (error) throw error;

    alert(`Muito obrigado, ${name}! Seu presente foi registrado.`);
    closeGift();
    await loadData();
  } catch (err) {
    alert(`Erro do Banco de Dados: ${err.message}`);
  }
}

async function handleConfirmQuotaGift(e) {
  if (e) e.preventDefault();
  
  const name = getGifterName();
  if (!name) return alert("Por favor, selecione seu nome na lista.");

  const nameWithQuota = `${name} (Cota)`;

  try {
    const { error } = await supabaseClient.from("claims").insert({
      gift_id: selectedGift.id, name: nameWithQuota 
    });
    if (error) throw error;

    document.getElementById("giftStepSelection").classList.add("hidden");
    document.getElementById("giftStepPix").classList.remove("hidden");
    await loadData();
  } catch (err) {
    alert(`Erro do Banco de Dados: ${err.message}`);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const closeModalBtn = document.getElementById("closeModal");
  const cancelGiftBtn = document.getElementById("cancelGift");
  const confirmFullBtn = document.getElementById("confirmFullGift");
  const confirmQuotaBtn = document.getElementById("confirmQuotaGift");

  if (closeModalBtn) closeModalBtn.addEventListener("click", closeGift);
  if (cancelGiftBtn) cancelGiftBtn.addEventListener("click", closeGift);
  if (confirmFullBtn) confirmFullBtn.addEventListener("click", handleConfirmFullGift);
  if (confirmQuotaBtn) confirmQuotaBtn.addEventListener("click", handleConfirmQuotaGift);
});

// AREA ADMIN (Ocultada para brevidade da resposta - mantenha o código de ADMIN anterior igual se desejar, o loadData lida com isso)
// ... código admin ...

function renderAll() {
  renderGifts();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", loadData);
} else {
  loadData();
}