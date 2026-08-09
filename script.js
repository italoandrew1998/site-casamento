// 1. CONFIGURAÇÕES DO SUPABASE E ADMIN
const SUPABASE_URL = "https://uilegqmbxrtxgauccbpy.supabase.co";
const SUPABASE_KEY = "sb_publishable_P5IF22W7EqooeYWhrDKe7w_6J82t5mU";
const ADMIN_PASSWORD = "mfsq&iars26092026"; // Senha para acessar a Área dos Noivos

// Criando a conexão
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// 2. LISTA DE PRESENTES ATUALIZADA (COM ITENS CENTRALIZADOS, FOTOS E AVISO DE COTA)
const gifts = [
  // 🍳 COZINHA
  { 
    id: 1, 
    icon: '<div style="width: 100%; height: 110px; background: #ffffff; display: flex; align-items: center; justify-content: center; border-radius: 8px; overflow: hidden;"><img src="liquidificador.jpg" alt="Liquidificador" style="max-width: 100%; max-height: 100%; object-fit: contain;"></div>', 
    title: "Liquidificador", 
    description: 'Cozinha<br><a href="https://www.mercadolivre.com.br/liquidificador-l1200-bi-turbo-black-pretoinox-mondial-127v/up/MLBU1091019903" target="_blank" style="color: #2c5e3b; text-decoration: underline; font-weight: bold;">Ver produto no Mercado Livre</a><br><small style="color: #666;">*Aceitamos também cota para este item.</small>', 
    price: "Sugestão" 
  },
  { 
    id: 2, 
    icon: '<div style="width: 100%; height: 110px; background: #ffffff; display: flex; align-items: center; justify-content: center; border-radius: 8px; overflow: hidden;"><img src="batedeira.jpg" alt="Batedeira" style="max-width: 100%; max-height: 100%; object-fit: contain;"></div>', 
    title: "Batedeira", 
    description: 'Cozinha<br><a href="https://www.mercadolivre.com.br/batedeira-planetaria-philco-900w-5l-preta-12-velocidades-turbo-pbp90a/p/MLB49822923" target="_blank" style="color: #2c5e3b; text-decoration: underline; font-weight: bold;">Ver produto no Mercado Livre</a><br><small style="color: #666;">*Aceitamos também cota para este item.</small>', 
    price: "Sugestão" 
  },
  { 
    id: 3, 
    icon: '<div style="width: 100%; height: 110px; background: #ffffff; display: flex; align-items: center; justify-content: center; border-radius: 8px; overflow: hidden;"><img src="sanduicheira.jpg" alt="Sanduicheira" style="max-width: 100%; max-height: 100%; object-fit: contain;"></div>', 
    title: "Sanduicheira", 
    description: 'Cozinha<br><a href="https://www.mercadolivre.com.br/grill-e-sanduicheira-pgr21pi-maxx-clean-1000w-cinza-philco/p/MLB22852655" target="_blank" style="color: #2c5e3b; text-decoration: underline; font-weight: bold;">Ver produto no Mercado Livre</a><br><small style="color: #666;">*Aceitamos também cota para este item.</small>', 
    price: "Sugestão" 
  },
  { 
    id: 4, 
    icon: '<div style="width: 100%; height: 110px; background: #ffffff; display: flex; align-items: center; justify-content: center; border-radius: 8px; overflow: hidden;"><img src="cafeteira.jpg" alt="Cafeteira" style="max-width: 100%; max-height: 100%; object-fit: contain;"></div>', 
    title: "Cafeteira", 
    description: 'Cozinha<br><a href="https://www.mercadolivre.com.br/wap-wcd1500-cafeteira-digital-15l-timer-automatica/p/MLB42197196" target="_blank" style="color: #2c5e3b; text-decoration: underline; font-weight: bold;">Ver produto no Mercado Livre</a><br><small style="color: #666;">*Aceitamos também cota para este item.</small>', 
    price: "Sugestão" 
  },
  { 
    id: 5, 
    icon: "🍲", 
    title: "Panela de pressão elétrica", 
    description: 'Cozinha<br><small style="color: #666;">*Aceitamos cota para este item.</small>', 
    price: "Sugestão" 
  },
  { 
    id: 6, 
    icon: "🍽️", 
    title: "Jogo de travessas", 
    description: 'Cozinha<br><small style="color: #666;">*Aceitamos cota para este item.</small>', 
    price: "Sugestão" 
  },
  { 
    id: 7, 
    icon: "🍴", 
    title: "Faqueiro", 
    description: 'Cozinha<br><small style="color: #666;">*Aceitamos cota para este item.</small>', 
    price: "Sugestão" 
  },
  { 
    id: 8, 
    icon: "🍷", 
    title: "Jogo de taças", 
    description: 'Cozinha<br><small style="color: #666;">*Aceitamos cota para este item.</small>', 
    price: "Sugestão" 
  },
  { 
    id: 9, 
    icon: "🥧", 
    title: "Conjunto de assadeiras", 
    description: 'Cozinha<br><small style="color: #666;">*Aceitamos cota para este item.</small>', 
    price: "Sugestão" 
  },
  { 
    id: 10, 
    icon: '<div style="width: 100%; height: 110px; background: #ffffff; display: flex; align-items: center; justify-content: center; border-radius: 8px; overflow: hidden;"><img src="forno elétrico.jpg" alt="Forno elétrico" style="max-width: 100%; max-height: 100%; object-fit: contain;"></div>', 
    title: "Forno elétrico", 
    description: 'Cozinha<br><a href="https://www.mercadolivre.com.br/forno-eletrico-philco-pfe65-com-grelha-65-litros-110v-preto/p/MLB64872179" target="_blank" style="color: #2c5e3b; text-decoration: underline; font-weight: bold;">Ver produto no Mercado Livre</a><br><small style="color: #666;">*Aceitamos também cota para este item.</small>', 
    price: "Sugestão" 
  },

  // 🏠 CASA
  { 
    id: 11, 
    icon: '<div style="width: 100%; height: 110px; background: #ffffff; display: flex; align-items: center; justify-content: center; border-radius: 8px; overflow: hidden;"><img src="tábua de passar.jpg" alt="Tábua de passar" style="max-width: 100%; max-height: 100%; object-fit: contain;"></div>', 
    title: "Tábua de passar", 
    description: 'Casa<br><a href="https://produto.mercadolivre.com.br/MLB-3332613795-tabua-mesa-de-passar-roupa-suprema-extra-grande-tampo-de-aco-_JM" target="_blank" style="color: #2c5e3b; text-decoration: underline; font-weight: bold;">Ver produto no Mercado Livre</a><br><small style="color: #666;">*Aceitamos também cota para este item.</small>', 
    price: "Sugestão" 
  },
  { 
    id: 12, 
    icon: "🛏️", 
    title: "Jogo de cama", 
    description: 'Casa — Cama tamanho queen<br><small style="color: #666;">*Aceitamos cota para este item.</small>', 
    price: "Sugestão" 
  },
  { 
    id: 13, 
    icon: "🛌", 
    title: "Edredom", 
    description: 'Casa — Cama tamanho queen<br><small style="color: #666;">*Aceitamos cota para este item.</small>', 
    price: "Sugestão" 
  },
  { 
    id: 14, 
    icon: "🧶", 
    title: "Cobertor", 
    description: 'Casa — Cama tamanho queen<br><small style="color: #666;">*Aceitamos cota para este item.</small>', 
    price: "Sugestão" 
  },
  { 
    id: 15, 
    icon: "🛁", 
    title: "Jogo de toalhas", 
    description: 'Casa<br><small style="color: #666;">*Aceitamos cota para este item.</small>', 
    price: "Sugestão" 
  },
  { 
    id: 16, 
    icon: "🏠", 
    title: "Tapete para sala", 
    description: 'Casa<br><small style="color: #666;">*Aceitamos cota para este item.</small>', 
    price: "Sugestão" 
  },
  { 
    id: 17, 
    icon: "🏠", 
    title: "Tapete para quarto", 
    description: 'Casa<br><small style="color: #666;">*Aceitamos cota para este item.</small>', 
    price: "Sugestão" 
  },

  // 💎 PRESENTES ESPECIAIS
  { 
    id: 18, 
    icon: '<div style="width: 100%; height: 110px; background: #ffffff; display: flex; align-items: center; justify-content: center; border-radius: 8px; overflow: hidden;"><img src="cadeiras.jpg" alt="Jogo de Cadeiras" style="max-width: 100%; max-height: 100%; object-fit: contain;"></div>', 
    title: "Jogo de 8 Cadeiras", 
    description: 'Presentes Especiais<br><a href="https://br.shp.ee/2U1wV6Kx" target="_blank" style="color: #2c5e3b; text-decoration: underline; font-weight: bold;">Ver produto na Shopee</a><br><small style="color: #666;">*Aceitamos também cota parcial para este item.</small>', 
    price: "Sugestão" 
  },
  { 
    id: 19, 
    icon: '<div style="width: 100%; height: 110px; background: #ffffff; display: flex; align-items: center; justify-content: center; border-radius: 8px; overflow: hidden;"><img src="sofá.jpg" alt="Sofá" style="max-width: 100%; max-height: 100%; object-fit: contain;"></div>', 
    title: "Sofá", 
    description: 'Presentes Especiais<br><a href="https://www.mercadolivre.com.br/sofa-retratil-e-reclinavel-cama-inbox-compact-150m-tecido-suede-velusoft-cinza/p/MLB23999223" target="_blank" style="color: #2c5e3b; text-decoration: underline; font-weight: bold;">Ver produto no Mercado Livre</a><br><small style="color: #666;">*Aceitamos também cota parcial para este item.</small>', 
    price: "Sugestão" 
  },

  // 💰 COTAS / PRESENTES EM DINHEIRO
  { id: 20, icon: "✈️", title: "Cota para lua de mel", description: "Cotas / Presentes em dinheiro", price: "R$ 500,00" },
  { id: 21, icon: "🛋️", title: "Cota para móveis", description: "Cotas / Presentes em dinheiro", price: "R$ 300,00" },
  { id: 22, icon: "⚡", title: "Cota para eletrodomésticos", description: "Cotas / Presentes em dinheiro", price: "R$ 300,00" },
  { id: 23, icon: "🖼️", title: "Cota para decoração", description: "Cotas / Presentes em dinheiro", price: "R$ 200,00" },
  { id: 24, icon: "🎁", title: "Cota para algum item especial da casa", description: "Cotas / Presentes em dinheiro", price: "R$ 250,00" }
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
    console.error("Falha ao conectar com banco de dados:", err);
  }
}

// 4. PREENCHER OS MENUS <select> COM A LISTA DE CONVIDADOS
function renderAllowedGuestsSelect() {
  const optionsHtml = !state.allowed.length
    ? '<option value="">Nenhum nome cadastrado na lista</option>'
    : '<option value="">-- Selecione o nome do convidado --</option>' +
      state.allowed.map(g => `<option value="${esc(g.name)}" data-max="${g.max_guests}">${esc(g.name)}</option>`).join("");

  const rsvpSelect = document.getElementById("rsvpName");
  if (rsvpSelect) rsvpSelect.innerHTML = optionsHtml;

  const giftSelect = document.getElementById("giftName");
  if (giftSelect) giftSelect.innerHTML = optionsHtml;

  const manualSelect = document.getElementById("manualName");
  if (manualSelect) manualSelect.innerHTML = optionsHtml;
}

// Limitar acompanhantes no RSVP dos Convidados
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

// Limitar acompanhantes no Formulário Manual da Área dos Noivos
const manualNameEl = document.getElementById("manualName");
if (manualNameEl) {
  manualNameEl.addEventListener("change", (e) => {
    const selectedOption = e.target.options[e.target.selectedIndex];
    const maxGuests = Number(selectedOption ? selectedOption.dataset.max : 0) || 0;
    const manualGuestsSelect = document.getElementById("manualGuests");

    let options = '<option value="0">Somente o convidado</option>';
    for (let i = 1; i <= maxGuests; i++) {
      options += `<option value="${i}">+ ${i} acompanhante(s)</option>`;
    }
    if (manualGuestsSelect) manualGuestsSelect.innerHTML = options;
  });
}

// 5. PRESENTES E FLUXO DE ESCOLHA (ITEM COMPLETO OU COTA)
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
      ${count ? `<div class="already">✓ Este presente já foi escolhido ${count === 1 ? "uma vez" : count + " vezes"}.<br>Você também pode escolhê-lo.</div>` : ""}
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
  
  const giftNameSelect = document.getElementById("giftName");
  if (giftNameSelect) giftNameSelect.value = "";
  
  // Reseta a visualização do modal para a etapa inicial (seleção de nome e opção)
  const giftStepSelection = document.getElementById("giftStepSelection");
  const giftStepPix = document.getElementById("giftStepPix");
  if (giftStepSelection) giftStepSelection.classList.remove("hidden");
  if (giftStepPix) giftStepPix.classList.add("hidden");

  document.getElementById("giftModal").classList.remove("hidden");
};

function closeGift() {
  const modal = document.getElementById("giftModal");
  if (modal) modal.classList.add("hidden");
  selectedGift = null;
}

const closeModalEl = document.getElementById("closeModal");
if (closeModalEl) closeModalEl.onclick = closeGift;
const cancelGiftEl = document.getElementById("cancelGift");
if (cancelGiftEl) cancelGiftEl.onclick = closeGift;

// Botão para confirmar o Item Inteiro
const confirmFullGiftEl = document.getElementById("confirmFullGift");
if (confirmFullGiftEl) {
  confirmFullGiftEl.onclick = async () => {
    const name = document.getElementById("giftName").value;
    if (!name) return alert("Por favor, selecione seu nome na lista.");
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

// Botão para escolher Cota (Avança para a tela do Pix/QR Code)
const confirmQuotaGiftEl = document.getElementById("confirmQuotaGift");
if (confirmQuotaGiftEl) {
  confirmQuotaGiftEl.onclick = async () => {
    const name = document.getElementById("giftName").value;
    if (!name) return alert("Por favor, selecione seu nome na lista antes de prosseguir para a cota.");
    if (!selectedGift) return alert("Nenhum presente selecionado.");

    // Registra a intenção no banco também, se desejar
    await supabaseClient.from('claims').insert([{ gift_id: selectedGift.id, name: `${name} (Cota)` }]);
    await loadData();

    // Alterna para a etapa de exibição do QR Code / Chave Pix
    const giftStepSelection = document.getElementById("giftStepSelection");
    const giftStepPix = document.getElementById("giftStepPix");
    if (giftStepSelection) giftStepSelection.classList.add("hidden");
    if (giftStepPix) giftStepPix.classList.remove("hidden");
  };
}

// 6. ENVIAR RESPOSTA DA CONFIRMAÇÃO (RSVP)
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
        : `<b>Sentiremos sua falta!</b><br>Obrigado por avisar, ${esc(name)}.`;

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
        <td>${g.icon} ${g.title} <br><small>(${g.description})</small></td>
        <td>${c.length}</td>
        <td>${c.length ? c.map(x => esc(x.name)).join("<br>") : "—"}</td>
        <td>${c.length ? c.map(x => new Date(x.created_at).toLocaleDateString("pt-BR")).join("<br>") : "—"}</td>
        <td>${c.length ? `<button class="mini" onclick="releaseClaims(${g.id})">Liberar registros</button>` : "—"}</td>
      </tr>`;
    }).join("");
  }
}

// REGISTRO MANUAL (DENTRO DA ÁREA DOS NOIVOS)
const manualForm = document.getElementById("manualForm");
if (manualForm) {
  manualForm.onsubmit = async e => {
    e.preventDefault();
    const name = document.getElementById("manualName").value;
    const people = document.getElementById("manualGuests").value;
    const phone = document.getElementById("manualPhone").value.trim();

    if (!name) return alert("Selecione o nome do convidado.");

    await addGuest(name, people, "sim", "organizador", phone);
    showManual("Presença de " + name + " registrada.");
    
    e.target.reset();
    document.getElementById("manualGuests").innerHTML = '<option value="0">Somente o convidado</option>';
  };
}

const manualDeclineBtn = document.getElementById("manualDecline");
if (manualDeclineBtn) {
  manualDeclineBtn.onclick = async () => {
    const name = document.getElementById("manualName").value;
    const phone = document.getElementById("manualPhone").value.trim();
    if (!name) return alert("Selecione o nome do convidado.");

    await addGuest(name, 0, "nao", "organizador", phone);
    showManual("Ausência de " + name + " registrada.");
    
    document.getElementById("manualForm").reset();
    document.getElementById("manualGuests").innerHTML = '<option value="0">Somente o convidado</option>';
  };
}

function showManual(t) {
  const m = document.getElementById("manualMessage");
  if (m) {
    m.textContent = t;
    m.classList.remove("hidden");
    
    // Esconder a mensagem depois de 5 segundos
    setTimeout(() => {
      m.classList.add("hidden");
    }, 5000);
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