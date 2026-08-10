// ==========================================
// 1. CONFIGURAÇÕES DO SUPABASE E ADMIN
// ==========================================
const SUPABASE_URL = "https://uilegqmbxrtxgauccbpy.supabase.co";
const SUPABASE_KEY = "sb_publishable_P5IF22W7EqooeYWhrDKe7w_6J82t5mU";
const ADMIN_PASSWORD = "mfsq&iars26092026"; 

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Variáveis de Estado
let state = { guests: [], claims: [], allowed: [] };
let selectedGift = null;
let pendingRsvpData = null; 
let quotaPendingConfirmation = false; 

// Gerenciamento seguro do nome do convidado via sessionStorage para não perder ao navegar
function getStoredGuestName() {
  return sessionStorage.getItem("wedding_guest_name") || "";
}

function setStoredGuestName(name) {
  if (name) {
    sessionStorage.setItem("wedding_guest_name", name);
  } else {
    sessionStorage.removeItem("wedding_guest_name");
  }
}

// LISTA DE PRESENTES ATUALIZADA
const gifts = [
  // 🍳 COZINHA
  { 
    id: 1, 
    icon: '<div style="width: 100%; height: 110px; background: #ffffff; display: flex; align-items: center; justify-content: center; border-radius: 8px; overflow: hidden;"><img src="liquidificador.jpg" alt="Liquidificador" style="max-width: 100%; max-height: 100%; object-fit: contain;"></div>', 
    title: "Liquidificador", 
    description: '<div style="text-align: center;">Cozinha<br><a href="https://www.mercadolivre.com.br/liquidificador-l1200-bi-turbo-black-pretoinox-mondial-127v/up/MLBU1091019903" target="_blank" style="color: #2c5e3b; text-decoration: underline; font-weight: bold;">Ver produto no Mercado Livre</a><br><small style="color: #666;">*Aceitamos também cota para este item.</small></div>', 
    price: "Sugestão" 
  },
  { 
    id: 2, 
    icon: '<div style="width: 100%; height: 110px; background: #ffffff; display: flex; align-items: center; justify-content: center; border-radius: 8px; overflow: hidden;"><img src="Batedeira.jpg" alt="Batedeira" style="max-width: 100%; max-height: 100%; object-fit: contain;"></div>', 
    title: "Batedeira", 
    description: '<div style="text-align: center;">Cozinha<br><a href="https://www.mercadolivre.com.br/batedeira-planetaria-philco-900w-5l-preta-12-velocidades-turbo-pbp90a/p/MLB49822923" target="_blank" style="color: #2c5e3b; text-decoration: underline; font-weight: bold;">Ver produto no Mercado Livre</a><br><small style="color: #666;">*Aceitamos também cota para este item.</small></div>', 
    price: "Sugestão" 
  },
  { 
    id: 3, 
    icon: '<div style="width: 100%; height: 110px; background: #ffffff; display: flex; align-items: center; justify-content: center; border-radius: 8px; overflow: hidden;"><img src="sanduicheira.jpg" alt="Sanduicheira" style="max-width: 100%; max-height: 100%; object-fit: contain;"></div>', 
    title: "Sanduicheira", 
    description: '<div style="text-align: center;">Cozinha<br><a href="https://www.mercadolivre.com.br/grill-e-sanduicheira-pgr21pi-maxx-clean-1000w-cinza-philco/p/MLB22852655" target="_blank" style="color: #2c5e3b; text-decoration: underline; font-weight: bold;">Ver produto no Mercado Livre</a><br><small style="color: #666;">*Aceitamos também cota para este item.</small></div>', 
    price: "Sugestão" 
  },
  { 
    id: 4, 
    icon: '<div style="width: 100%; height: 110px; background: #ffffff; display: flex; align-items: center; justify-content: center; border-radius: 8px; overflow: hidden;"><img src="cafeteira.jpg" alt="Cafeteira" style="max-width: 100%; max-height: 100%; object-fit: contain;"></div>', 
    title: "Cafeteira", 
    description: '<div style="text-align: center;">Cozinha<br><a href="https://www.mercadolivre.com.br/wap-wcd1500-cafeteira-digital-15l-timer-automatica/p/MLB42197196" target="_blank" style="color: #2c5e3b; text-decoration: underline; font-weight: bold;">Ver produto no Mercado Livre</a><br><small style="color: #666;">*Aceitamos também cota para este item.</small></div>', 
    price: "Sugestão" 
  },
  { 
    id: 5, 
    icon: '<div style="width: 100%; height: 110px; background: #ffffff; display: flex; align-items: center; justify-content: center; border-radius: 8px; overflow: hidden;"><img src="panela de pressao eletrica.jpg" alt="Panela de pressão elétrica" style="max-width: 100%; max-height: 100%; object-fit: contain;"></div>', 
    title: "Panela de pressão elétrica", 
    description: '<div style="text-align: center;">Cozinha<br><a href="https://www.mercadolivre.com.br/panela-de-pressao-eletrica-5-litros-aco-inox-preto-multifuncional-kian-ppe-101/p/MLB50190417?pdp_filters=item_id%3AMLB4327641775&matt_tool=38524122&ua=MyZ0I6KppWEtVmDZVSHhpJhwqhP686UPULkJ-FEyOKroQYLD#origin=whatsapp&sid=whatsapp&wid=MLB4327641775" target="_blank" style="color: #2c5e3b; text-decoration: underline; font-weight: bold;">Ver produto no Mercado Livre</a><br><small style="color: #666;">*Aceitamos também cota para este item.</small></div>', 
    price: "Sugestão" 
  },
  { 
    id: 6, 
    icon: "🍽️", 
    title: "Jogo de travessas", 
    description: '<div style="text-align: center;">Cozinha<br><small style="color: #666;">*Aceitamos cota para este item.</small></div>', 
    price: "Sugestão" 
  },
  { 
    id: 7, 
    icon: "🍴", 
    title: "Faqueiro", 
    description: '<div style="text-align: center;">Cozinha<br><small style="color: #666;">*Aceitamos cota para este item.</small></div>', 
    price: "Sugestão" 
  },
  { 
    id: 8, 
    icon: '<div style="width: 100%; height: 110px; background: #ffffff; display: flex; align-items: center; justify-content: center; border-radius: 8px; overflow: hidden;"><img src="tacajogo.jpg" alt="Jogo de taças" style="max-width: 100%; max-height: 100%; object-fit: contain;"></div>', 
    title: "Jogo de taças", 
    description: '<div style="text-align: center;">Cozinha<br><a href="https://br.shp.ee/MJv2LsJ3" target="_blank" style="color: #2c5e3b; text-decoration: underline; font-weight: bold;">Ver produto na Shopee</a><br><small style="color: #666;">*Aceitamos também cota para este item.</small></div>', 
    price: "Sugestão" 
  },
  { 
    id: 9, 
    icon: "🥧", 
    title: "Conjunto de assadeiras", 
    description: '<div style="text-align: center;">Cozinha<br><small style="color: #666;">*Aceitamos cota para este item.</small></div>', 
    price: "Sugestão" 
  },
  { 
    id: 10, 
    icon: '<div style="width: 100%; height: 110px; background: #ffffff; display: flex; align-items: center; justify-content: center; border-radius: 8px; overflow: hidden;"><img src="forno elétrico.jpg" alt="Forno elétrico" style="max-width: 100%; max-height: 100%; object-fit: contain;"></div>', 
    title: "Forno elétrico", 
    description: '<div style="text-align: center;">Cozinha<br><a href="https://www.mercadolivre.com.br/forno-eletrico-philco-pfe65-com-grelha-65-litros-110v-preto/p/MLB64872179" target="_blank" style="color: #2c5e3b; text-decoration: underline; font-weight: bold;">Ver produto no Mercado Livre</a><br><small style="color: #666;">*Aceitamos também cota para este item.</small></div>', 
    price: "Sugestão" 
  },

  // 🏠 CASA
  { 
    id: 11, 
    icon: '<div style="width: 100%; height: 110px; background: #ffffff; display: flex; align-items: center; justify-content: center; border-radius: 8px; overflow: hidden;"><img src="tábua de passar.jpg" alt="Tábua de passar" style="max-width: 100%; max-height: 100%; object-fit: contain;"></div>', 
    title: "Tábua de passar", 
    description: '<div style="text-align: center;">Casa<br><a href="https://produto.mercadolivre.com.br/MLB-3332613795-tabua-mesa-de-passar-roupa-suprema-extra-grande-tampo-de-aco-_JM" target="_blank" style="color: #2c5e3b; text-decoration: underline; font-weight: bold;">Ver produto no Mercado Livre</a><br><small style="color: #666;">*Aceitamos também cota para este item.</small></div>', 
    price: "Sugestão" 
  },
  { 
    id: 12, 
    icon: "🛏️", 
    title: "Jogo de cama", 
    description: '<div style="text-align: center;">Casa — Cama tamanho queen<br><small style="color: #666;">*Aceitamos cota para este item.</small></div>', 
    price: "Sugestão" 
  },
  { 
    id: 13, 
    icon: "🛌", 
    title: "Edredom", 
    description: '<div style="text-align: center;">Casa — Cama tamanho queen<br><small style="color: #666;">*Aceitamos cota para este item.</small></div>', 
    price: "Sugestão" 
  },
  { 
    id: 14, 
    icon: "🧶", 
    title: "Cobertor", 
    description: '<div style="text-align: center;">Casa — Cama tamanho queen<br><small style="color: #666;">*Aceitamos cota para este item.</small></div>', 
    price: "Sugestão" 
  },
  { 
    id: 15, 
    icon: "🛁", 
    title: "Jogo de toalhas", 
    description: '<div style="text-align: center;">Casa<br><small style="color: #666;">*Aceitamos cota para este item.</small></div>', 
    price: "Sugestão" 
  },
  { 
    id: 16, 
    icon: "🏠", 
    title: "Tapete para sala", 
    description: '<div style="text-align: center;">Casa<br><small style="color: #666;">*Aceitamos cota para este item.</small></div>', 
    price: "Sugestão" 
  },
  { 
    id: 17, 
    icon: "🏠", 
    title: "Tapete para quarto", 
    description: '<div style="text-align: center;">Casa<br><small style="color: #666;">*Aceitamos cota para este item.</small></div>', 
    price: "Sugestão" 
  },

  // 💎 PRESENTES ESPECIAIS
  { 
    id: 18, 
    icon: '<div style="width: 100%; height: 110px; background: #ffffff; display: flex; align-items: center; justify-content: center; border-radius: 8px; overflow: hidden;"><img src="cadeiras.jpg" alt="Jogo de Cadeiras" style="max-width: 100%; max-height: 100%; object-fit: contain;"></div>', 
    title: "Jogo de 8 Cadeiras", 
    description: '<div style="text-align: center;">Presentes Especiais<br><a href="https://br.shp.ee/2U1wV6Kx" target="_blank" style="color: #2c5e3b; text-decoration: underline; font-weight: bold;">Ver produto na Shopee</a><br><small style="color: #666;">*Aceitamos também cota parcial para este item.</small></div>', 
    price: "Sugestão" 
  },
  { 
    id: 19, 
    icon: '<div style="width: 100%; height: 110px; background: #ffffff; display: flex; align-items: center; justify-content: center; border-radius: 8px; overflow: hidden;"><img src="sofa.jpg" alt="Sofá" style="max-width: 100%; max-height: 100%; object-fit: contain;"></div>', 
    title: "Sofá", 
    description: '<div style="text-align: center;">Presentes Especiais<br><a href="https://www.mercadolivre.com.br/sofa-retratil-e-reclinavel-cama-inbox-compact-150m-tecido-suede-velusoft-cinza/p/MLB23999223" target="_blank" style="color: #2c5e3b; text-decoration: underline; font-weight: bold;">Ver produto no Mercado Livre</a><br><small style="color: #666;">*Aceitamos também cota parcial para este item.</small></div>', 
    price: "Sugestão" 
  },

  // 💰 COTAS / PRESENTES EM DINHEIRO
  { id: 20, icon: "✈️", title: "Cota para lua de mel", description: '<div style="text-align: center;">Cotas / Presentes em dinheiro</div>', price: "R$ 500,00" },
  { id: 21, icon: "🛋️", title: "Cota para móveis", description: '<div style="text-align: center;">Cotas / Presentes em dinheiro</div>', price: "R$ 300,00" },
  { id: 22, icon: "⚡", title: "Cota para eletrodomésticos", description: '<div style="text-align: center;">Cotas / Presentes em dinheiro</div>', price: "R$ 300,00" },
  { id: 23, icon: "🖼️", title: "Cota para decoração", description: '<div style="text-align: center;">Cotas / Presentes em dinheiro</div>', price: "R$ 200,00" },
  { id: 24, icon: "🎁", title: "Cota para algum item especial da casa", description: '<div style="text-align: center;">Cotas / Presentes em dinheiro</div>', price: "R$ 250,00" }
];

const esc = s => String(s ?? "").replace(/[&<>"']/g, m => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[m]));
const claimsFor = id => state.claims.filter(c => Number(c.gift_id) === Number(id));

// ==========================================
// 2. CARREGAR DADOS DO SUPABASE
// ==========================================
async function loadData() {
  try {
    const { data: guests, error: errGuests } = await supabaseClient.from('guests').select('*');
    const { data: claims, error: errClaims } = await supabaseClient.from('claims').select('*');
    const { data: allowed, error: errAllowed } = await supabaseClient.from('allowed_guests').select('*').order('name', { ascending: true });

    state.guests = guests || [];
    state.claims = claims || [];
    state.allowed = allowed || [];

    renderAllSelects(); 
    renderAll();
  } catch (err) {
    console.error("Falha ao conectar com banco de dados:", err);
  }
}

// ==========================================
// 3. PREENCHER MENUS E SELEÇÃO DE LADO
// ==========================================
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

// ==========================================
// 4. FLUXO DE CONFIRMAÇÃO DE PRESENÇA (RSVP)
// ==========================================
const rsvpForm = document.getElementById("rsvpForm");
if (rsvpForm) {
  rsvpForm.onsubmit = e => {
    e.preventDefault();
    const name = document.getElementById("rsvpName").value;
    if (!name) return alert("Por favor, selecione seu nome na lista.");

    const answer = e.submitter ? e.submitter.dataset.answer : "sim";
    const people = Number(document.getElementById("rsvpGuests").value);
    
    pendingRsvpData = { name, people, answer, source: "convidado" };

    document.getElementById("rsvpFormContent").classList.add("hidden");
    const confirmScreen = document.getElementById("rsvpConfirmScreen");
    confirmScreen.classList.remove("hidden");

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
  setStoredGuestName(name);

  document.getElementById("rsvpConfirmScreen").classList.add("hidden");
  const m = document.getElementById("rsvpMessage");
  m.classList.remove("hidden");
  
  m.innerHTML = answer === "sim" 
    ? `<b>Presença confirmada!</b><br>Obrigado, ${esc(name)}. Esperamos você lá!` 
    : `<b>Sentiremos sua falta!</b><br>Obrigado por nos avisar, ${esc(name)}.`;

  setTimeout(() => {
    const sectionPresentes = document.getElementById("presentes");
    if (sectionPresentes) {
      sectionPresentes.scrollIntoView({ behavior: "smooth" });
    }
  }, 1200); 
}

// ==========================================
// 5. GESTÃO DE PRESENTES E COTAS
// ==========================================
function renderGifts() {
  const giftGrid = document.getElementById("giftGrid");
  if (!giftGrid) return;

  giftGrid.innerHTML = gifts.map(g => {
    const allClaims = claimsFor(g.id);
    const iconElement = g.icon.startsWith('<div') ? g.icon : `<div class="gift-icon" style="font-size: 40px; text-align: center; margin-bottom: 10px;">${g.icon}</div>`;
    
    // CORREÇÃO: Renderiza o preço APENAS se não for "Sugestão" para evitar campo visual desnecessário
    const displayPrice = (g.price !== "Sugestão" && g.price) ? `<div class="price" style="font-weight: bold; color: #2c5e3b; margin-bottom: 10px;">${g.price}</div>` : '';

    let claimsInfoHtml = '';
    if (allClaims.length > 0) {
      const nomes = allClaims.map(c => esc(c.name)).join(", ");
      claimsInfoHtml = `<div style="margin: 10px 0; padding: 8px; background: #f9f9f9; border-left: 3px solid #2c5e3b; font-size: 13px; text-align: left; border-radius: 4px;">
        <strong style="color: #2c5e3b;">Já escolhido/contribuído por:</strong><br>${nomes}
      </div>`;
    } else {
      claimsInfoHtml = `<div style="margin: 10px 0; font-size: 13px; color: #888; font-style: italic;">Disponível para escolha</div>`;
    }

    return `<article class="gift" style="text-align: center; background: #fff; padding: 15px; border-radius: 12px; box-shadow: 0 2px 5px rgba(0,0,0,0.05); margin-bottom: 15px;">
      ${iconElement}
      <h3 style="margin: 10px 0; font-size: 18px;">${g.title}</h3>
      <div style="margin-bottom: 5px;">${g.description}</div>
      ${displayPrice}
      ${claimsInfoHtml}
      <button class="btn primary" onclick="openGift(${g.id})" style="margin-top: 5px; padding: 8px 15px; background: #2c5e3b; color: #fff; border: none; border-radius: 6px; cursor: pointer;">${allClaims.length ? "Presentear também" : "Escolher este presente"}</button>
    </article>`;
  }).join("");
}

window.openGift = function(id) {
  selectedGift = gifts.find(g => g.id === id);
  if (!selectedGift) return;
  
  quotaPendingConfirmation = false;

  document.getElementById("modalTitle").textContent = selectedGift.title;
  
  let modalContentHtml = selectedGift.description;
  if (selectedGift.price !== "Sugestão" && selectedGift.price) {
    modalContentHtml += `<br><b style="color: #2c5e3b;">Valor: ${selectedGift.price}</b>`;
  }
  document.getElementById("modalPrice").innerHTML = modalContentHtml;

  const wrapper = document.getElementById("giftSelectWrapper");
  const nameAuto = document.getElementById("giftNameAuto");
  const registeredName = getStoredGuestName();

  if (registeredName) {
    if(wrapper) wrapper.classList.add("hidden");
    if(nameAuto) {
      nameAuto.classList.remove("hidden");
      nameAuto.innerHTML = `Presenteando como: <br><b>${esc(registeredName)}</b>`;
    }
  } else {
    if(wrapper) wrapper.classList.remove("hidden");
    if(nameAuto) {
      nameAuto.classList.add("hidden");
      nameAuto.innerHTML = "";
    }
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
  const giftStepPix = document.getElementById("giftStepPix");
  const isPixVisible = giftStepPix && !giftStepPix.classList.contains("hidden");

  if (isPixVisible && quotaPendingConfirmation) {
    const confirmou = confirm("Você realizou o pagamento via PIX desta cota e deseja confirmar o registro na lista?");
    if (!confirmou) {
      reverterUltimaCota();
    }
    quotaPendingConfirmation = false;
  }

  document.getElementById("giftModal").classList.add("hidden");
  selectedGift = null;
  quotaPendingConfirmation = false;
};

async function reverterUltimaCota() {
  if (!selectedGift) return;
  const name = getGifterName();
  const nameWithQuota = `${name} (Cota)`;

  const claimParaRemover = state.claims.find(c => Number(c.gift_id) === Number(selectedGift.id) && c.name === nameWithQuota);
  if (claimParaRemover) {
    await supabaseClient.from("claims").delete().eq('id', claimParaRemover.id);
    await loadData();
  }
}

function getGifterName() {
  const stored = getStoredGuestName();
  if (stored) return stored;
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

    quotaPendingConfirmation = true;

    document.getElementById("giftStepSelection").classList.add("hidden");
    document.getElementById("giftStepPix").classList.remove("hidden");
    await loadData();
  } catch (err) {
    alert(`Erro do Banco de Dados: ${err.message}`);
  }
}

// ==========================================
// 6. INICIALIZAÇÃO DOS LISTENERS
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  const closeModalBtn = document.getElementById("closeModal");
  const cancelGiftBtn = document.getElementById("cancelGift");
  const confirmFullBtn = document.getElementById("confirmFullGift");
  const confirmQuotaBtn = document.getElementById("confirmQuotaGift");

  if (closeModalBtn) closeModalBtn.addEventListener("click", closeGift);
  if (cancelGiftBtn) cancelGiftBtn.addEventListener("click", closeGift);
  if (confirmFullBtn) confirmFullBtn.addEventListener("click", handleConfirmFullGift);
  if (confirmQuotaBtn) confirmQuotaBtn.addEventListener("click", handleConfirmQuotaGift);

  loadData();
});

function renderAll() {
  renderGifts();
}