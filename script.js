// ============================================================
// SITE DE CASAMENTO MILENE E ITALO
// Script completo revisado para o HTML e o Supabase
// ============================================================

// 1. CONFIGURACOES
const SUPABASE_URL = "https://uilegqmbxrtxgauccbpy.supabase.co";
const SUPABASE_KEY = "sb_publishable_P5IF22W7EqooeYWhrDKe7w_6J82t5mU";

// Bloqueio visual. Defina uma nova senha antes de publicar.
// A seguranca real do banco depende das politicas RLS do Supabase.
const ADMIN_PASSWORD = "mfsq&iars26092026";

const PIX_KEY = "italoandrew1998l@gmail.com";
const PIX_CODE = "00020126550014br.gov.bcb.pix0126italoandrew1998l@gmail.com0203Pix5204000053039865802BR5925ITALO_ANDREW_RODRIGUES_SA6008JANUARIA62130509Presentes6304E23F";

if (typeof supabase === "undefined") {
  throw new Error("A biblioteca do Supabase nao foi carregada. Verifique a tag script no HTML.");
}

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const state = {
  guests: [],
  claims: [],
  allowed: [],
  adminUnlocked: false
};

let selectedGift = null;
let pendingRsvpData = null;
let pendingQuotaData = null;
let isSaving = false;

// 2. LISTA DE PRESENTES
// Numeracao reorganizada de 1 a 23, sem referencias aos itens removidos.
const gifts = [
  // COZINHA
  { id: 1, image: "liquidificador.jpg", title: "Liquidificador", category: "Cozinha", url: "https://www.mercadolivre.com.br/liquidificador-l1200-bi-turbo-black-pretoinox-mondial-127v/up/MLBU1091019903", store: "Mercado Livre", price: "Sugestao", acceptsQuota: true },
  { id: 2, image: "Batedeira.jpg", title: "Batedeira", category: "Cozinha", url: "https://www.mercadolivre.com.br/batedeira-planetaria-philco-900w-5l-preta-12-velocidades-turbo-pbp90a/p/MLB49822923", store: "Mercado Livre", price: "Sugestao", acceptsQuota: true },
  { id: 3, image: "sanduicheira.jpg", title: "Sanduicheira", category: "Cozinha", url: "https://www.mercadolivre.com.br/grill-e-sanduicheira-pgr21pi-maxx-clean-1000w-cinza-philco/p/MLB22852655", store: "Mercado Livre", price: "Sugestao", acceptsQuota: true },
  { id: 4, image: "cafeteira.jpg", title: "Cafeteira", category: "Cozinha", url: "https://www.mercadolivre.com.br/wap-wcd1500-cafeteira-digital-15l-timer-automatica/p/MLB42197196", store: "Mercado Livre", price: "Sugestao", acceptsQuota: true },
  { id: 5, image: "cafeteira2.jpg", title: "Cafeteira Nescafe Dolce Gusto", category: "Cozinha", url: "https://www.mercadolivre.com.br/cafeteira-nescafe-dolce-gusto-mini-me-vermelha-e-preta/p/MLB15154783", store: "Mercado Livre", price: "Sugestao", acceptsQuota: true },
  { id: 6, image: "panela de pressao eletrica.jpg", title: "Panela de pressao eletrica", category: "Cozinha", url: "https://www.mercadolivre.com.br/panela-de-pressao-eletrica-5-litros-aco-inox-preto-multifuncional-kian-ppe-101/p/MLB50190417", store: "Mercado Livre", price: "Sugestao", acceptsQuota: true },
  { id: 7, image: "jogo de travessas.jpg", title: "Jogo de travessas", category: "Cozinha", url: "https://br.shp.ee/C5JSCMhQ", store: "Shopee", price: "Sugestao", acceptsQuota: true },
  { id: 8, image: "faqueiro.jpg", title: "Faqueiro", category: "Cozinha", url: "https://shopee.com.br/product/291932836/10363619008", store: "Shopee", price: "Sugestao", acceptsQuota: true },
  { id: 9, image: "tacajogo.jpg", title: "Jogo de tacas", category: "Cozinha", url: "https://br.shp.ee/MJv2LsJ3", store: "Shopee", price: "Sugestao", acceptsQuota: true },
  { id: 10, image: "jogo de assadeiras.jpg", title: "Conjunto de assadeiras", category: "Cozinha", url: "https://br.shp.ee/SqNw1HgZ", store: "Shopee", price: "Sugestao", acceptsQuota: true },
  { id: 11, image: "forno elétrico.jpg", title: "Forno eletrico", category: "Cozinha", url: "https://www.mercadolivre.com.br/forno-eletrico-philco-pfe65-com-grelha-65-litros-110v-preto/p/MLB64872179", store: "Mercado Livre", price: "Sugestao", acceptsQuota: true },

  // CASA
  { id: 12, image: "tabua de passar.jpg", title: "Tabua de passar", category: "Casa", url: "https://produto.mercadolivre.com.br/MLB-3332613795-tabua-mesa-de-passar-roupa-suprema-extra-grande-tampo-de-aco-_JM", store: "Mercado Livre", price: "Sugestao", acceptsQuota: true },
  { id: 13, image: "jogo de cama.jpg", title: "Jogo de cama", category: "Casa, cama tamanho queen", url: "https://shopee.com.br/product/514474285/22397280584", store: "Shopee", price: "Sugestao", acceptsQuota: true },
  { id: 14, image: "ededrom.jpg", title: "Cobertor", category: "Casa, tamanho queen", url: "https://shopee.com.br/product/451914614/23494815662", store: "Shopee", price: "Sugestao", acceptsQuota: true },
  { id: 15, image: "jogo de toalhas.jpg", title: "Jogo de toalhas", category: "Casa", url: "https://shopee.com.br/product/398182135/17160354312", store: "Shopee", price: "Sugestao", acceptsQuota: true },

  // PRESENTES ESPECIAIS
  { id: 16, image: "cadeiras.jpg", title: "Jogo de 8 Cadeiras", category: "Presentes especiais", url: "https://br.shp.ee/2U1wV6Kx", store: "Shopee", price: "Sugestao", acceptsQuota: true },
  { id: 17, image: "sofa.jpg", title: "Sofa", category: "Presentes especiais", url: "https://www.mercadolivre.com.br/sofa-retratil-e-reclinavel-cama-inbox-compact-150m-tecido-suede-velusoft-cinza/p/MLB23999223", store: "Mercado Livre", price: "Sugestao", acceptsQuota: true },

  // COTAS E PRESENTES EM DINHEIRO
  { id: 18, icon: "✈️", title: "Cota para lua de mel", category: "Cotas / Presentes em dinheiro", price: "R$ 500,00", quotaOnly: true },
  { id: 19, image: "cota para eletrodomestico.jpg", title: "Cota para eletrodomesticos", category: "Cotas / Presentes em dinheiro", price: "R$ 300,00", quotaOnly: true },
  { id: 20, icon: "🖼️", title: "Cota para decoracao", category: "Cotas / Presentes em dinheiro", price: "R$ 200,00", quotaOnly: true },
  { id: 21, icon: "🎁", title: "Cota para algum item especial da casa", category: "Cotas / Presentes em dinheiro", price: "R$ 250,00", quotaOnly: true }
];

// 3. UTILITARIOS
const byId = id => document.getElementById(id);
const normalize = value => String(value || "").trim().toLocaleLowerCase("pt-BR");
const claimsFor = id => state.claims.filter(claim => Number(claim.gift_id) === Number(id));
const isQuotaClaim = claim => /\s\(Cota\)$/.test(String(claim.name || ""));
const cleanClaimName = name => String(name || "Convidado").replace(/\s\(Cota\)$/, "");

const esc = value => String(value ?? "").replace(/[&<>"']/g, char => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#039;"
})[char]);

// --- NOVO: FUNÇÃO PARA CAPTURAR IP E APARELHO ---
async function getDeviceInfo() {
  let ip = "Desconhecido";
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    ip = data.ip;
  } catch (e) {
    console.warn("Não foi possível obter o IP.");
  }
  // Retorna o IP e o nome resumido do navegador/aparelho
  return `IP: ${ip} | ${navigator.userAgent.substring(0, 70)}...`;
}

// --- NOVO: FILTRAR QUEM AINDA NÃO RESPONDEU ---
function getUnansweredGuests() {
  const answeredNames = state.guests.map(g => normalize(g.name));
  return state.allowed.filter(g => !answeredNames.includes(normalize(g.name)));
}

function getStoredGuestName() {
  return sessionStorage.getItem("wedding_guest_name") || "";
}

function setStoredGuestName(name) {
  const cleanName = String(name || "").trim();
  if (cleanName) sessionStorage.setItem("wedding_guest_name", cleanName);
  else sessionStorage.removeItem("wedding_guest_name");
}

function showMessage(elementId, html, type = "success") {
  const element = byId(elementId);
  if (!element) return;
  element.classList.remove("hidden");
  element.innerHTML = html;
  element.style.background = type === "error" ? "#f8d7da" : "#dff3e4";
  element.style.color = type === "error" ? "#721c24" : "#245c35";
}

function setButtonLoading(button, loading, loadingText = "Salvando...") {
  if (!button) return;
  if (loading) {
    button.dataset.originalText = button.textContent;
    button.textContent = loadingText;
    button.disabled = true;
  } else {
    button.textContent = button.dataset.originalText || button.textContent;
    button.disabled = false;
  }
}

function populateCompanionSelect(nameSelectId, companionSelectId) {
  const nameSelect = byId(nameSelectId);
  const companionSelect = byId(companionSelectId);
  if (!nameSelect || !companionSelect) return;

  const option = nameSelect.options[nameSelect.selectedIndex];
  const maxGuests = Number(option?.dataset.max || 0);
  let html = '<option value="0">Somente o convidado</option>';
  for (let i = 1; i <= maxGuests; i++) {
    html += `<option value="${i}">+ ${i} acompanhante(s)</option>`;
  }
  companionSelect.innerHTML = html;
}

function giftDescription(gift) {
  const productLink = gift.url
    ? `<br><a href="${esc(gift.url)}" target="_blank" rel="noopener noreferrer" style="color:#2c5e3b;text-decoration:underline;font-weight:bold;">Ver produto ${gift.store ? `na ${esc(gift.store)}` : "sugerido"}</a>`
    : "";
  const quotaText = gift.quotaOnly
    ? ""
    : '<br><small style="color:#666;">*Aceitamos tambem cota para este item.</small>';
  return `<div style="text-align:center;">${esc(gift.category)}${productLink}${quotaText}</div>`;
}

// 4. CARREGAMENTO DOS DADOS
async function loadData() {
  try {
    const [guestsResult, claimsResult, allowedResult] = await Promise.all([
      supabaseClient.from("guests").select("*").order("created_at", { ascending: false }),
      supabaseClient.from("claims").select("*").order("created_at", { ascending: false }),
      supabaseClient.from("allowed_guests").select("*").order("name", { ascending: true })
    ]);

    if (guestsResult.error) throw guestsResult.error;
    if (claimsResult.error) throw claimsResult.error;
    if (allowedResult.error) throw allowedResult.error;

    state.guests = guestsResult.data || [];
    state.claims = claimsResult.data || [];
    state.allowed = allowedResult.data || [];

    renderAllSelects();
    renderGifts();
    renderPublicConfirmed(); // Renderiza a lista do rodapé

    if (state.adminUnlocked) {
      renderGuestAdmin();
      renderPendingAdmin(); // Renderiza a aba de pendentes
      renderGiftAdmin();
    }
  } catch (error) {
    console.error("Falha ao carregar dados:", error);
    showMessage("rsvpMessage", "Nao foi possivel carregar os dados. Atualize a pagina e tente novamente.", "error");
  }
}

// 5. SELETORES E ACOMPANHANTES
function allowedOptions(list, placeholder) {
  if (!list.length) return `<option value="">${esc(placeholder)}</option><option value="" disabled>Todos já responderam!</option>`;
  return `<option value="">${esc(placeholder)}</option>` + list.map(guest =>
    `<option value="${esc(guest.name)}" data-max="${Number(guest.max_guests) || 0}">${esc(guest.name)}</option>`
  ).join("");
}

function renderAllSelects() {
  // Pega APENAS quem ainda não respondeu para o RSVP
  const unanswered = getUnansweredGuests();
  const unansweredOptions = allowedOptions(unanswered, "-- Selecione o nome --");
  
  // Para presentes, permitimos todos (pois o convidado pode dar presente mesmo sem ter respondido RSVP)
  const allOptions = allowedOptions(state.allowed, "-- Selecione o nome --");
  const storedName = getStoredGuestName();

  const giftSelect = byId("giftName");
  if (giftSelect) {
    const oldValue = giftSelect.value;
    giftSelect.innerHTML = allOptions;
    if ([...giftSelect.options].some(option => option.value === (oldValue || storedName))) {
      giftSelect.value = oldValue || storedName;
    }
  }

  const manualSelect = byId("manualName");
  if (manualSelect) {
    const oldValue = manualSelect.value;
    manualSelect.innerHTML = unansweredOptions;
    if ([...manualSelect.options].some(option => option.value === oldValue)) {
      manualSelect.value = oldValue;
    }
  }
}

window.selectSide = function selectSide(side) {
  const unanswered = getUnansweredGuests();
  const filtered = unanswered.filter(guest => normalize(guest.lado) === normalize(side));
  const select = byId("rsvpName");
  if (select) select.innerHTML = allowedOptions(filtered, "-- Selecione o seu nome --");
  byId("sideSelection")?.classList.add("hidden");
  byId("rsvpFormContent")?.classList.remove("hidden");
};

// 6. CONFIRMACAO DE PRESENCA
function prepareRsvp(event) {
  event.preventDefault();
  const name = byId("rsvpName")?.value.trim();
  if (!name) return alert("Por favor, selecione seu nome na lista.");

  const answer = event.submitter?.dataset.answer || "sim";
  const companions = answer === "sim" ? Number(byId("rsvpGuests")?.value || 0) : 0;
  const source = byId("rsvpSource")?.value || "convidado";

  pendingRsvpData = { name, companions, answer, source };
  setStoredGuestName(name);

  byId("rsvpFormContent")?.classList.add("hidden");
  byId("rsvpConfirmScreen")?.classList.remove("hidden");

  const text = answer === "sim"
    ? `Voce esta confirmando presenca para<br><b style="font-size:22px;color:#2c5e3b;">${esc(name)}</b><br>${companions ? `e mais <b>${companions} acompanhante(s)</b>.` : "Somente voce."}`
    : `Voce esta avisando que<br><b style="font-size:22px;color:#d9534f;">${esc(name)}</b><br>nao podera comparecer.`;

  if (byId("rsvpConfirmText")) byId("rsvpConfirmText").innerHTML = text;
}

window.cancelRSVP = function cancelRSVP() {
  pendingRsvpData = null;
  byId("rsvpConfirmScreen")?.classList.add("hidden");
  byId("rsvpFormContent")?.classList.remove("hidden");
};

async function saveGuestResponse(payload) {
  const existing = state.guests.find(guest => normalize(guest.name) === normalize(payload.name));
  if (existing) return supabaseClient.from("guests").update(payload).eq("id", existing.id);
  return supabaseClient.from("guests").insert([payload]);
}

window.confirmRSVP = async function confirmRSVP() {
  if (!pendingRsvpData || isSaving) return;
  isSaving = true;
  const button = byId("rsvpConfirmScreen")?.querySelector(".btn.primary");
  setButtonLoading(button, true);

  const { name, companions, answer, source } = pendingRsvpData;
  const payload = {
    name,
    people: answer === "sim" ? companions + 1 : 0,
    status: answer,
    source,
    phone: ""
  };

  try {
    const { error } = await saveGuestResponse(payload);
    if (error) throw error;

    pendingRsvpData = null;
    await loadData();
    byId("rsvpConfirmScreen")?.classList.add("hidden");
    showMessage(
      "rsvpMessage",
      answer === "sim"
        ? `<b>Presenca confirmada!</b><br>Obrigado, ${esc(name)}. Esperamos voce la!`
        : `<b>Sentiremos sua falta!</b><br>Obrigado por nos avisar, ${esc(name)}.`
    );
    setTimeout(() => byId("presentes")?.scrollIntoView({ behavior: "smooth" }), 1200);
  } catch (error) {
    console.error(error);
    alert("Erro ao salvar a confirmacao. Tente novamente.");
  } finally {
    isSaving = false;
    setButtonLoading(button, false);
  }
};

// 7. PRESENTES E INTERFACE
function resetGiftActionButtons() {
  const fullButton = byId("confirmFullGift");
  const quotaButton = byId("confirmQuotaGift");
  const pixButton = byId("confirmPixPayment");

  if (fullButton) {
    fullButton.disabled = false;
    fullButton.textContent = "Quero dar o Item Inteiro";
    delete fullButton.dataset.originalText;
  }

  if (quotaButton) {
    quotaButton.disabled = false;
    quotaButton.textContent = selectedGift?.quotaOnly
      ? "Escolher esta cota (Pix)"
      : "Quero dar uma Cota (Pix)";
    delete quotaButton.dataset.originalText;
  }

  if (pixButton) {
    pixButton.disabled = false;
    pixButton.textContent = "Ja realizei o Pix";
    delete pixButton.dataset.originalText;
  }
}

function showSavedState(button, text = "Salvo!") {
  if (!button) return;
  button.disabled = true;
  button.textContent = text;
}

function wait(milliseconds) {
  return new Promise(resolve => {
    setTimeout(resolve, milliseconds);
  });
}

function renderGifts() {
  const grid = byId("giftGrid");
  if (!grid) return;

  grid.innerHTML = gifts.map(gift => {
    const claims = claimsFor(gift.id);
    const quotas = claims.filter(isQuotaClaim).length;
    const fullItems = claims.length - quotas;

    const visual = gift.image
      ? `<div style="width:100%;height:110px;background:#fff;display:flex;align-items:center;justify-content:center;border-radius:8px;overflow:hidden;"><img src="${esc(gift.image)}" alt="${esc(gift.title)}" style="max-width:100%;max-height:100%;object-fit:contain;" loading="lazy"></div>`
      : `<div class="gift-icon" style="font-size:40px;text-align:center;margin-bottom:10px;">${gift.icon || "🎁"}</div>`;

    const status = claims.length
      ? `<div style="margin:10px 0;padding:8px;background:#f9f9f9;border-left:3px solid #2c5e3b;font-size:13px;text-align:left;border-radius:4px;"><strong style="color:#2c5e3b;">Status:</strong><br>${fullItems ? `<b>${fullItems}</b> item(ns) inteiro(s)<br>` : ""}${quotas ? `<b>${quotas}</b> cota(s) declarada(s)` : ""}</div>`
      : '<div style="margin:10px 0;font-size:13px;color:#888;font-style:italic;">Disponivel para escolha</div>';

    return `<article class="gift" style="text-align:center;background:#fff;padding:15px;border-radius:12px;box-shadow:0 2px 5px rgba(0,0,0,.05);margin-bottom:15px;">
      ${visual}
      <h3 style="margin:10px 0;font-size:18px;">${esc(gift.title)}</h3>
      ${giftDescription(gift)}
      ${gift.price !== "Sugestao" ? `<div class="price" style="font-weight:bold;color:#2c5e3b;margin:10px 0;">${esc(gift.price)}</div>` : ""}
      ${status}
      <button type="button" class="btn primary" onclick="openGift(${gift.id})" style="margin-top:5px;padding:8px 15px;">${claims.length ? "Presentear tambem" : "Escolher este presente"}</button>
    </article>`;
  }).join("");
}

function ensureGiftIdentityElements() {
  const select = byId("giftName");
  if (!select || byId("giftSelectWrapper")) return;

  const label = document.querySelector('label[for="giftName"]');
  const wrapper = document.createElement("div");
  wrapper.id = "giftSelectWrapper";
  label?.parentNode?.insertBefore(wrapper, label);
  if (label) wrapper.appendChild(label);
  wrapper.appendChild(select);

  const automaticName = document.createElement("div");
  automaticName.id = "giftNameAuto";
  automaticName.className = "hidden";
  automaticName.style.cssText = "text-align:center;margin:15px 0;";
  wrapper.insertAdjacentElement("afterend", automaticName);
}

function ensurePixControls() {
  const pixStep = byId("giftStepPix");
  if (!pixStep) return;

  const pixInput = pixStep.querySelector('input[type="text"]');
  if (pixInput) {
    pixInput.id = "pixCode";
    pixInput.value = PIX_CODE;
    pixInput.removeAttribute("onclick");
  }

  const oldFinish = [...pixStep.querySelectorAll("button")].find(button => button.textContent.trim() === "Concluir");
  if (oldFinish) oldFinish.remove();

  if (!byId("copyPixButton")) {
    pixStep.insertAdjacentHTML("beforeend", `
      <button type="button" id="copyPixButton" class="btn secondary full" style="margin-top:12px;">Copiar codigo Pix</button>
      <button type="button" id="confirmPixPayment" class="btn primary full" style="margin-top:10px;">Ja realizei o Pix</button>
      <button type="button" id="cancelPixPayment" class="btn light full" style="margin-top:10px;">Nao realizei o pagamento</button>
    `);
  }

  byId("copyPixButton")?.addEventListener("click", copyPixCode);
  byId("confirmPixPayment")?.addEventListener("click", confirmDeclaredPixPayment);
  byId("cancelPixPayment")?.addEventListener("click", cancelPixPayment);
}

window.openGift = function openGift(id) {
  selectedGift = gifts.find(gift => Number(gift.id) === Number(id));
  if (!selectedGift) return;

  pendingQuotaData = null;
  ensureGiftIdentityElements();
  ensurePixControls();

  byId("modalTitle").textContent = selectedGift.title;
  byId("modalPrice").innerHTML = `${giftDescription(selectedGift)}${selectedGift.price !== "Sugestao" ? `<br><b style="color:#2c5e3b;">Valor: ${esc(selectedGift.price)}</b>` : ""}`;

  const storedName = getStoredGuestName();
  const select = byId("giftName");
  const wrapper = byId("giftSelectWrapper");
  const automaticName = byId("giftNameAuto");

  if (storedName && select && [...select.options].some(option => option.value === storedName)) {
    select.value = storedName;
    wrapper?.classList.add("hidden");
    automaticName?.classList.remove("hidden");
    if (automaticName) automaticName.innerHTML = `Presenteando como:<br><b>${esc(storedName)}</b>`;
  } else {
    wrapper?.classList.remove("hidden");
    automaticName?.classList.add("hidden");
    if (select) select.value = "";
  }

  byId("confirmFullGift")?.classList.toggle("hidden", Boolean(selectedGift.quotaOnly));
  if (byId("confirmQuotaGift")) {
    byId("confirmQuotaGift").textContent = selectedGift.quotaOnly
      ? "Escolher esta cota (Pix)"
      : "Quero dar uma Cota (Pix)";
  }

  byId("giftStepSelection")?.classList.remove("hidden");
  byId("giftStepPix")?.classList.add("hidden");
  byId("giftModal")?.classList.remove("hidden");
};

function finishCloseGift() {
  byId("giftModal")?.classList.add("hidden");
  byId("giftStepSelection")?.classList.remove("hidden");
  byId("giftStepPix")?.classList.add("hidden");

  selectedGift = null;
  pendingQuotaData = null;
  isSaving = false;

  resetGiftActionButtons();
}

window.closeGift = async function closeGift() {
  const pixStep = byId("giftStepPix");
  const pixStepIsVisible = pixStep && !pixStep.classList.contains("hidden");

  if (pixStepIsVisible && pendingQuotaData) {
    const paid = confirm(
      "Voce realizou o Pix e deseja confirmar este item?\n\n" +
      "Clique em OK para registrar a cota.\n" +
      "Clique em Cancelar para sair sem registrar."
    );

    if (paid) {
      await confirmDeclaredPixPayment();
      return;
    }
  }

  finishCloseGift();
};

function getGifterName() {
  const stored = getStoredGuestName();
  if (stored) return stored;
  const selected = byId("giftName")?.value.trim() || "";
  if (selected) setStoredGuestName(selected);
  return selected;
}

async function handleConfirmFullGift(event) {
  event?.preventDefault();

  if (!selectedGift || isSaving) return;

  const button = event?.currentTarget || byId("confirmFullGift");
  const name = getGifterName();

  if (!name) {
    alert("Por favor, selecione seu nome na lista.");
    return;
  }

  isSaving = true;
  setButtonLoading(button, true, "Salvando...");

  try {
    const giftId = selectedGift.id;
    const deviceInfo = await getDeviceInfo(); // Captura IP e Aparelho

    const { error } = await supabaseClient
      .from("claims")
      .insert([
        {
          gift_id: giftId,
          name,
          device_info: deviceInfo // Envia pro Supabase
        }
      ]);

    if (error) throw error;

    showSavedState(button, "Salvo!");
    await loadData();
    await wait(700);
    finishCloseGift();

    byId("presentes")?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  } catch (error) {
    console.error("Erro ao registrar presente:", error);
    alert("Nao foi possivel registrar o presente. Tente novamente.");
    isSaving = false;

    if (button) {
      button.disabled = false;
      button.textContent = "Tentar salvar novamente";
    }
  }
}

function handleConfirmQuotaGift(event) {
  event?.preventDefault();

  if (!selectedGift || isSaving) return;

  const name = getGifterName();

  if (!name) {
    alert("Por favor, selecione seu nome na lista.");
    return;
  }

  pendingQuotaData = {
    giftId: selectedGift.id,
    name
  };

  byId("giftStepSelection")?.classList.add("hidden");
  byId("giftStepPix")?.classList.remove("hidden");

  const pixButton = byId("confirmPixPayment");
  if (pixButton) {
    pixButton.disabled = false;
    pixButton.textContent = "Ja realizei o Pix";
  }
}

async function confirmDeclaredPixPayment(event) {
  if (!pendingQuotaData || isSaving) return;

  const button = event?.currentTarget || byId("confirmPixPayment");
  const quotaData = { ...pendingQuotaData };

  isSaving = true;
  setButtonLoading(button, true, "Salvando...");

  try {
    const deviceInfo = await getDeviceInfo(); // Captura IP e Aparelho

    const { error } = await supabaseClient
      .from("claims")
      .insert([
        {
          gift_id: quotaData.giftId,
          name: `${quotaData.name} (Cota)`,
          device_info: deviceInfo // Envia pro Supabase
        }
      ]);

    if (error) throw error;

    pendingQuotaData = null;
    showSavedState(button, "Salvo!");
    await loadData();
    await wait(700);
    finishCloseGift();

    byId("presentes")?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  } catch (error) {
    console.error("Erro ao registrar cota:", error);
    alert("Nao foi possivel registrar a cota. Tente novamente.");
    isSaving = false;

    if (button) {
      button.disabled = false;
      button.textContent = "Tentar salvar novamente";
    }
  }
}

function cancelPixPayment() {
  const leaveWithoutRegistering = confirm("Deseja sair da etapa do Pix sem confirmar este item?");
  if (!leaveWithoutRegistering) return;

  pendingQuotaData = null;
  byId("giftStepPix")?.classList.add("hidden");
  byId("giftStepSelection")?.classList.remove("hidden");
}

window.addEventListener("beforeunload", event => {
  const pixStep = byId("giftStepPix");
  const pixStepIsVisible = pixStep && !pixStep.classList.contains("hidden");
  if (!pixStepIsVisible || !pendingQuotaData) return;
  event.preventDefault();
  event.returnValue = "";
});

async function copyPixCode() {
  const input = byId("pixCode");
  const code = input?.value || PIX_CODE;

  try {
    await navigator.clipboard.writeText(code);
    alert("Codigo Pix copiado com sucesso!");
  } catch {
    if (input) {
      input.select();
      document.execCommand("copy");
      alert("Codigo Pix copiado com sucesso!");
    }
  }
}

// 8. PAINEL DE ADMINISTRACAO
window.login = function login(event) {
  event?.preventDefault();
  const password = byId("adminPassword")?.value || "";

  if (password === ADMIN_PASSWORD) {
    state.adminUnlocked = true;
    byId("adminAuth")?.classList.add("hidden");
    byId("adminContent")?.classList.remove("hidden");
    byId("adminError")?.classList.add("hidden");
    renderGuestAdmin();
    renderPendingAdmin();
    renderGiftAdmin();
  } else {
    const errorEl = byId("adminError");
    if (errorEl) {
      errorEl.classList.remove("hidden");
      errorEl.textContent = "Senha incorreta!";
    } else {
      alert("Senha incorreta!");
    }
  }
};

function renderGuestAdmin() {
  const tbody = byId("guestTable");
  if (!tbody) return;

  let confirmed = 0;
  let declined = 0;
  let people = 0;

  tbody.innerHTML = state.guests.map(guest => {
    if (guest.status === "sim") {
      confirmed++;
      people += Number(guest.people) || 1;
    } else if (guest.status === "nao") {
      declined++;
    }

    return `<tr>
      <td>${esc(guest.name || "Convidado")}</td>
      <td>${guest.status === "sim" ? "Vai ao casamento" : guest.status === "nao" ? "Nao vai" : "Pendente"}</td>
      <td>${guest.people || 1}</td>
      <td>${esc(guest.source || "Convidado")}</td>
      <td><button type="button" class="btn secondary" onclick="deleteGuest('${guest.id}')">Excluir</button></td>
    </tr>`;
  }).join("") || '<tr><td colspan="5" style="text-align:center;">Nenhum convidado respondido ainda.</td></tr>';

  if (byId("confirmedCount")) byId("confirmedCount").textContent = confirmed;
  if (byId("declinedCount")) byId("declinedCount").textContent = declined;
  if (byId("peopleCount")) byId("peopleCount").textContent = people;
}

// --- NOVO: RENDERIZAR TABELA DE PENDENTES ---
function renderPendingAdmin() {
  const tbody = byId("pendingTable");
  if (!tbody) return;
  const unanswered = getUnansweredGuests();

  tbody.innerHTML = unanswered.map(guest => `
    <tr>
      <td>${esc(guest.name)}</td>
      <td>${esc(guest.lado || "-")}</td>
    </tr>
  `).join("") || '<tr><td colspan="2" style="text-align:center;">Todos já responderam!</td></tr>';
}

window.deleteGuest = async function deleteGuest(id) {
  if (!confirm("Deseja realmente remover este registro?")) return;
  const { error } = await supabaseClient.from("guests").delete().eq("id", id);
  if (error) alert("Erro ao excluir convidado.");
  else await loadData();
};

function renderGiftAdmin() {
  const tbody = byId("giftTable");
  if (!tbody) return;

  tbody.innerHTML = state.claims.map(claim => {
    const gift = gifts.find(item => Number(item.id) === Number(claim.gift_id));
    const title = gift ? gift.title : `Presente #${claim.gift_id}`;
    const date = claim.created_at ? new Date(claim.created_at).toLocaleString("pt-BR") : "-";
    const device = claim.device_info || "Não registrado";

    // Agora alinhado perfeitamente com os 5 headers do HTML
    return `<tr>
      <td>${esc(title)}</td>
      <td>${esc(claim.name || "Convidado")}</td>
      <td>${date}</td>
      <td><small style="font-size: 11px; color: #666; display: block; max-width: 150px; word-wrap: break-word;">${esc(device)}</small></td>
      <td><button type="button" class="btn secondary" style="padding: 5px 10px; font-size: 12px;" onclick="deleteClaim('${claim.id}')">Remover</button></td>
    </tr>`;
  }).join("") || '<tr><td colspan="5" style="text-align:center;">Nenhum presente escolhido ainda.</td></tr>';
}

window.deleteClaim = async function deleteClaim(id) {
  if (!confirm("Deseja remover este registro de presente?")) return;
  const { error } = await supabaseClient.from("claims").delete().eq("id", id);
  if (error) alert("Erro ao remover presente.");
  else await loadData();
};

async function handleManualForm(event, status) {
  event?.preventDefault();
  const name = byId("manualName")?.value;
  const phone = byId("manualPhone")?.value || "";
  const companions = Number(byId("manualGuests")?.value || 0);

  if (!name) return alert("Selecione um nome.");

  const payload = {
    name,
    phone,
    people: status === "sim" ? companions + 1 : 0,
    status,
    source: "organizador"
  };

  try {
    const { error } = await saveGuestResponse(payload);
    if (error) throw error;

    alert(status === "sim" ? "Presenca registrada com sucesso!" : "Ausencia registrada com sucesso!");
    byId("manualForm")?.reset();
    await loadData();
  } catch (error) {
    console.error(error);
    alert("Erro ao salvar manualmente.");
  }
}

// --- NOVO: RENDERIZAR LISTA PÚBLICA DE CONFIRMADOS ---
function renderPublicConfirmed() {
  const list = byId("publicConfirmedList");
  if (!list) return;

  // Filtra apenas quem disse "sim" e ordena em ordem alfabética
  const confirmed = state.guests
    .filter(g => g.status === "sim")
    .sort((a, b) => (a.name || "").localeCompare(b.name || ""));

  list.innerHTML = confirmed.map(g => `
    <li style="background: #fff; padding: 12px; border: 1px solid var(--line); border-radius: 8px; font-size: 0.95rem; color: var(--primary); font-weight: 600; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
      ✓ ${esc(g.name)}
    </li>
  `).join("") || '<li style="grid-column: 1 / -1; color: #888;">Nenhuma presença confirmada ainda.</li>';
}

// 9. EVENTOS INICIAIS
document.addEventListener("DOMContentLoaded", () => {
  byId("closeModal")?.addEventListener("click", closeGift);
  byId("cancelGift")?.addEventListener("click", closeGift);
  byId("confirmFullGift")?.addEventListener("click", handleConfirmFullGift);
  byId("confirmQuotaGift")?.addEventListener("click", handleConfirmQuotaGift);
  byId("rsvpForm")?.addEventListener("submit", prepareRsvp);
  byId("adminLoginBtn")?.addEventListener("click", login);
  byId("adminPassword")?.addEventListener("keydown", event => {
    if (event.key === "Enter") login(event);
  });

  byId("manualForm")?.addEventListener("submit", event => handleManualForm(event, "sim"));
  byId("manualDecline")?.addEventListener("click", event => handleManualForm(event, "nao"));

  const manualNameSelect = byId("manualName");
  if (manualNameSelect) {
    manualNameSelect.addEventListener("change", () => populateCompanionSelect("manualName", "manualGuests"));
  }

  const rsvpNameSelect = byId("rsvpName");
  if (rsvpNameSelect) {
    rsvpNameSelect.addEventListener("change", () => {
      const name = rsvpNameSelect.value.trim();
      if (name) setStoredGuestName(name);
      populateCompanionSelect("rsvpName", "rsvpGuests");
    });
  }

  document.querySelectorAll(".admin-tabs .tab").forEach(tabButton => {
    tabButton.addEventListener("click", () => {
      const targetId = tabButton.getAttribute("data-tab");
      if (!targetId) return;

      document.querySelectorAll(".admin-tabs .tab").forEach(btn => btn.classList.remove("active"));
      tabButton.classList.add("active");

      document.querySelectorAll(".tab-content").forEach(content => content.classList.add("hidden"));
      byId(targetId)?.classList.remove("hidden");
    });
  });

  loadData();
});

document.addEventListener("click", event => {
  if (event.target.closest("#adminAuth")) return;
  const trigger = event.target.closest("a, button, [role='button']");
  if (!trigger) return;

  const href = trigger.getAttribute("href")?.toLowerCase() || "";
  const text = trigger.textContent?.toLowerCase().trim() || "";

  if (text.includes("área dos noivos") || href.includes("noivos") || href.includes("admin")) {
    event.preventDefault();
    const adminSection = byId("admin");
    if (adminSection) {
      adminSection.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    }
  }
});