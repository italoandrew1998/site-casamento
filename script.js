// ============================================================
// SITE DE CASAMENTO MILENE E ITALO
// Script completo corrigido (Lista de Confirmados dentro do Painel Admin)
// ============================================================

// 1. CONFIGURACOES
const SUPABASE_URL = "https://uilegqmbxrtxgauccbpy.supabase.co";[cite: 1]
const SUPABASE_KEY = "sb_publishable_P5IF22W7EqooeYWhrDKe7w_6J82t5mU";[cite: 1]

// Bloqueio visual. Defina uma nova senha antes de publicar.
const ADMIN_PASSWORD = "mfsq&iars26092026";[cite: 1]

const PIX_KEY = "italoandrew1998l@gmail.com";[cite: 1]
const PIX_CODE = "00020126550014br.gov.bcb.pix0126italoandrew1998l@gmail.com0203Pix5204000053039865802BR5925ITALO_ANDREW_RODRIGUES_SA6008JANUARIA62130509Presentes6304E23F";[cite: 1]

if (typeof supabase === "undefined") {
  throw new Error("A biblioteca do Supabase nao foi carregada. Verifique a tag script no HTML.");[cite: 1]
}

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);[cite: 1]

const state = {
  guests: [],[cite: 1]
  claims: [],[cite: 1]
  allowed: [],[cite: 1]
  adminUnlocked: false[cite: 1]
};

let selectedGift = null;[cite: 1]
let pendingRsvpData = null;[cite: 1]
let pendingQuotaData = null;[cite: 1]
let isSaving = false;[cite: 1]

// 2. LISTA DE PRESENTES
const gifts = [
  // COZINHA
  { id: 1, image: "liquidificador.jpg", title: "Liquidificador", category: "Cozinha", url: "https://www.mercadolivre.com.br/liquidificador-philco-1200w-3l-12-velocidades-preto-ph900/p/MLB15578941?product_trigger_id=MLB15578941&attributes=COLOR%3APreto%2CVOLTAGE%3AMLB15578941&picker=true&quantity=1", store: "Mercado Livre", price: "Sugestao", acceptsQuota: true },[cite: 1]
  { id: 2, image: "Batedeira.jpg", title: "Batedeira", category: "Cozinha", url: "https://www.mercadolivre.com.br/batedeira-planetaria-philco-900w-5l-preta-12-velocidades-turbo-pbp90a/p/MLB49822923", store: "Mercado Livre", price: "Sugestao", acceptsQuota: true },[cite: 1]
  { id: 3, image: "sanduicheira.jpg", title: "Sanduicheira", category: "Cozinha", url: "https://www.mercadolivre.com.br/grill-e-sanduicheira-pgr21pi-maxx-clean-1000w-cinza-philco/p/MLB22852655", store: "Mercado Livre", price: "Sugestao", acceptsQuota: true },[cite: 1]
  { id: 4, image: "cafeteira.jpg", title: "Cafeteira", category: "Cozinha", url: "https://www.mercadolivre.com.br/wap-wcd1500-cafeteira-digital-15l-timer-automatica/p/MLB42197196", store: "Mercado Livre", price: "Sugestao", acceptsQuota: true },[cite: 1]
  { id: 5, image: "cafeteira2.jpg", title: "Cafeteira Nescafe Dolce Gusto", category: "Cozinha", url: "https://www.mercadolivre.com.br/cafeteira-nescafe-dolce-gusto-mini-me-vermelha-e-preta/p/MLB15154783", store: "Mercado Livre", price: "Sugestao", acceptsQuota: true },[cite: 1]
  { id: 6, image: "panela de pressao eletrica.jpg", title: "Panela de pressao eletrica", category: "Cozinha", url: "https://www.mercadolivre.com.br/panela-de-pressao-eletrica-5-litros-aco-inox-preto-multifuncional-kian-ppe-101/p/MLB50190417", store: "Mercado Livre", price: "Sugestao", acceptsQuota: true },[cite: 1]
  { id: 7, image: "jogo de travessas.jpg", title: "Jogo de travessas", category: "Cozinha", url: "https://br.shp.ee/C5JSCMhQ", store: "Shopee", price: "Sugestao", acceptsQuota: true },[cite: 1]
  { id: 8, image: "faqueiro.jpg", title: "Faqueiro", category: "Cozinha", url: "https://shopee.com.br/product/291932836/10363619008", store: "Shopee", price: "Sugestao", acceptsQuota: true },[cite: 1]
  { id: 9, image: "tacajogo.jpg", title: "Jogo de tacas", category: "Cozinha", url: "https://br.shp.ee/MJv2LsJ3", store: "Shopee", price: "Sugestao", acceptsQuota: true },[cite: 1]
  { id: 10, image: "jogo de assadeiras.jpg", title: "Conjunto de assadeiras", category: "Cozinha", url: "https://br.shp.ee/SqNw1HgZ", store: "Shopee", price: "Sugestao", acceptsQuota: true },[cite: 1]
  { id: 11, image: "forno elétrico.jpg", title: "Forno eletrico", category: "Cozinha", url: "https://www.mercadolivre.com.br/forno-eletrico-philco-pfe65-com-grelha-65-litros-110v-preto/p/MLB64872179", store: "Mercado Livre", price: "Sugestao", acceptsQuota: true },[cite: 1]

  // CASA
  { id: 12, image: "tabua de passar.jpg", title: "Tabua de passar", category: "Casa", url: "https://produto.mercadolivre.com.br/MLB-3332613795-tabua-mesa-de-passar-roupa-suprema-extra-grande-tampo-de-aco-_JM", store: "Mercado Livre", price: "Sugestao", acceptsQuota: true },[cite: 1]
  { id: 13, image: "tanquinho.jpg", title: "Tanquinho de lavar roupa", category: "Casa", url: "https://www.mercadolivre.com.br/tanquinho-colormaq-15kg-prateado/p/MLB63616108", store: "Mercado Livre", price: "Sugestao", acceptsQuota: true },[cite: 1]
  { id: 14, image: "jogo de cama.jpg", title: "Jogo de cama", category: "Casa, cama tamanho queen", url: "https://shopee.com.br/product/514474285/22397280584", store: "Shopee", price: "Sugestao", acceptsQuota: true },[cite: 1]
  { id: 15, image: "ededrom.jpg", title: "Cobertor", category: "Casa, tamanho queen", url: "https://shopee.com.br/product/451914614/23494815662", store: "Shopee", price: "Sugestao", acceptsQuota: true },[cite: 1]
  { id: 16, image: "jogo de toalhas.jpg", title: "Jogo de toalhas", category: "Casa", url: "https://shopee.com.br/product/398182135/17160354312", store: "Shopee", price: "Sugestao", acceptsQuota: true },[cite: 1]

  // PRESENTES ESPECIAIS
  { id: 17, image: "cadeiras.jpg", title: "Jogo de 8 Cadeiras", category: "Presentes especiais", url: "https://br.shp.ee/2U1wV6Kx", store: "Shopee", price: "Sugestao", acceptsQuota: true },[cite: 1]
  { id: 18, image: "sofa.jpg", title: "Sofa", category: "Presentes especiais", url: "https://www.mercadolivre.com.br/sofa-retratil-e-reclinavel-cama-inbox-compact-150m-tecido-suede-velusoft-cinza/p/MLB23999223", store: "Mercado Livre", price: "Sugestao", acceptsQuota: true },[cite: 1]

  // COTAS E PRESENTES EM DINHEIRO
  { id: 19, icon: "✈️", title: "Cota para lua de mel", category: "Cotas / Presentes em dinheiro", price: "R$ 500,00", quotaOnly: true },[cite: 1]
  { id: 20, image: "cota para eletrodomestico.jpg", title: "Cota para eletrodomesticos", category: "Cotas / Presentes em dinheiro", price: "R$ 300,00", quotaOnly: true },[cite: 1]
  { id: 21, image: "cota para enxoval.jpg", title: "Cota para enxoval", category: "Cotas / Presentes em dinheiro", price: "R$ 250,00", quotaOnly: true },[cite: 1]
  { id: 22, icon: "🖼️", title: "Cota para decoracao", category: "Cotas / Presentes em dinheiro", price: "R$ 200,00", quotaOnly: true },[cite: 1]
  { id: 23, icon: "🎁", title: "Cota para algum item especial da casa", category: "Cotas / Presentes em dinheiro", price: "R$ 250,00", quotaOnly: true }[cite: 1]
];

// 3. UTILITARIOS
const byId = id => document.getElementById(id);[cite: 1]
const normalize = value => String(value || "").trim().toLocaleLowerCase("pt-BR");[cite: 1]
const claimsFor = id => state.claims.filter(claim => Number(claim.gift_id) === Number(id));[cite: 1]
const isQuotaClaim = claim => /\s\(Cota\)$/.test(String(claim.name || ""));[cite: 1]
const cleanClaimName = name => String(name || "Convidado").replace(/\s\(Cota\)$/, "");[cite: 1]

const esc = value => String(value ?? "").replace(/[&<>"']/g, char => ({[cite: 1]
  "&": "&amp;",[cite: 1]
  "<": "&lt;",[cite: 1]
  ">": "&gt;",[cite: 1]
  '"': "&quot;",[cite: 1]
  "'": "&#039;"[cite: 1]
})[char]);[cite: 1]

async function getDeviceInfo() {
  let ip = "Desconhecido";[cite: 1]
  try {
    const response = await fetch('https://api.ipify.org?format=json');[cite: 1]
    const data = await response.json();[cite: 1]
    ip = data.ip;[cite: 1]
  } catch (e) {
    console.warn("Não foi possível obter o IP.");[cite: 1]
  }
  return ip;[cite: 1]
}

function getUnansweredGuests() {
  const answeredNames = state.guests.map(g => normalize(g.name));[cite: 1]
  return state.allowed.filter(g => !answeredNames.includes(normalize(g.name)));[cite: 1]
}

function getStoredGuestName() {
  return sessionStorage.getItem("wedding_guest_name") || "";[cite: 1]
}

function setStoredGuestName(name) {
  const cleanName = String(name || "").trim();[cite: 1]
  if (cleanName) sessionStorage.setItem("wedding_guest_name", cleanName);[cite: 1]
  else sessionStorage.removeItem("wedding_guest_name");[cite: 1]
}

function showMessage(elementId, html, type = "success") {
  const element = byId(elementId);[cite: 1]
  if (!element) return;[cite: 1]
  element.classList.remove("hidden");[cite: 1]
  element.innerHTML = html;[cite: 1]
  element.style.background = type === "error" ? "#f8d7da" : "#dff3e4";[cite: 1]
  element.style.color = type === "error" ? "#721c24" : "#245c35";[cite: 1]
}

function setButtonLoading(button, loading, loadingText = "Salvando...") {
  if (!button) return;[cite: 1]
  if (loading) {
    button.dataset.originalText = button.textContent;[cite: 1]
    button.textContent = loadingText;[cite: 1]
    button.disabled = true;[cite: 1]
  } else {
    button.textContent = button.dataset.originalText || button.textContent;[cite: 1]
    button.disabled = false;[cite: 1]
  }
}

function populateCompanionSelect(nameSelectId, companionSelectId) {
  const nameSelect = byId(nameSelectId);[cite: 1]
  const companionSelect = byId(companionSelectId);[cite: 1]
  if (!nameSelect || !companionSelect) return;[cite: 1]

  const option = nameSelect.options[nameSelect.selectedIndex];[cite: 1]
  const maxGuests = Number(option?.dataset.max || 0);[cite: 1]
  let html = '<option value="0">Somente o convidado</option>';[cite: 1]
  for (let i = 1; i <= maxGuests; i++) {
    html += `<option value="${i}">+ ${i} acompanhante(s)</option>`;[cite: 1]
  }
  companionSelect.innerHTML = html;[cite: 1]
}

function giftDescription(gift) {
  const productLink = gift.url
    ? `<br><a href="${esc(gift.url)}" target="_blank" rel="noopener noreferrer" style="color:#2c5e3b;text-decoration:underline;font-weight:bold;">Ver produto ${gift.store ? `na ${esc(gift.store)}` : "sugerido"}</a>`[cite: 1]
    : "";[cite: 1]
  const quotaText = gift.quotaOnly
    ? ""[cite: 1]
    : '<br><small style="color:#666;">*Aceitamos tambem cota para este item.</small>';[cite: 1]
  return `<div style="text-align:center;">${esc(gift.category)}${productLink}${quotaText}</div>`;[cite: 1]
}

// 4. CARREGAMENTO DOS DADOS
async function loadData() {
  try {
    const [guestsResult, claimsResult, allowedResult] = await Promise.all([
      supabaseClient.from("guests").select("*").order("created_at", { ascending: false }),[cite: 1]
      supabaseClient.from("claims").select("*").order("created_at", { ascending: false }),[cite: 1]
      supabaseClient.from("allowed_guests").select("*").order("name", { ascending: true })[cite: 1]
    ]);

    if (guestsResult.error) throw guestsResult.error;[cite: 1]
    if (claimsResult.error) throw claimsResult.error;[cite: 1]
    if (allowedResult.error) throw allowedResult.error;[cite: 1]

    state.guests = guestsResult.data || [];[cite: 1]
    state.claims = claimsResult.data || [];[cite: 1]
    state.allowed = allowedResult.data || [];[cite: 1]

    renderAllSelects();[cite: 1]
    renderGifts();[cite: 1]

    if (state.adminUnlocked) {
      renderGuestAdmin();[cite: 1]
      renderPendingAdmin();[cite: 1]
      renderGiftAdmin();[cite: 1]
      renderPublicConfirmed();[cite: 1]
    } else {
      const container = byId("publicConfirmedListContainer");[cite: 1]
      if (container) container.innerHTML = "";[cite: 1]
    }
  } catch (error) {
    console.error("Falha ao carregar dados:", error);[cite: 1]
    showMessage("rsvpMessage", "Nao foi possivel carregar os dados. Atualize a pagina e tente novamente.", "error");[cite: 1]
  }
}

// 5. SELETORES E ACOMPANHANTES
function allowedOptions(list, placeholder) {
  if (!list.length) return `<option value="">${esc(placeholder)}</option><option value="" disabled>Todos já responderam!</option>`;[cite: 1]
  return `<option value="">${esc(placeholder)}</option>` + list.map(guest =>
    `<option value="${esc(guest.name)}" data-max="${Number(guest.max_guests) || 0}">${esc(guest.name)}</option>`[cite: 1]
  ).join("");[cite: 1]
}

function renderAllSelects() {
  const unanswered = getUnansweredGuests();[cite: 1]
  const unansweredOptions = allowedOptions(unanswered, "-- Selecione o nome --");[cite: 1]
  const allOptions = allowedOptions(state.allowed, "-- Selecione o nome --");[cite: 1]
  const storedName = getStoredGuestName();[cite: 1]

  const giftSelect = byId("giftName");[cite: 1]
  if (giftSelect) {
    const oldValue = giftSelect.value;[cite: 1]
    giftSelect.innerHTML = allOptions;[cite: 1]
    if ([...giftSelect.options].some(option => option.value === (oldValue || storedName))) {
      giftSelect.value = oldValue || storedName;[cite: 1]
    }
  }

  const manualSelect = byId("manualName");[cite: 1]
  if (manualSelect) {
    const oldValue = manualSelect.value;[cite: 1]
    manualSelect.innerHTML = unansweredOptions;[cite: 1]
    if ([...manualSelect.options].some(option => option.value === oldValue)) {
      manualSelect.value = oldValue;[cite: 1]
    }
  }
}

window.selectSide = function selectSide(side) {
  const unanswered = getUnansweredGuests();[cite: 1]
  const filtered = unanswered.filter(guest => normalize(guest.lado) === normalize(side));[cite: 1]
  const select = byId("rsvpName");[cite: 1]
  if (select) select.innerHTML = allowedOptions(filtered, "-- Selecione o seu nome --");[cite: 1]
  byId("sideSelection")?.classList.add("hidden");[cite: 1]
  byId("rsvpFormContent")?.classList.remove("hidden");[cite: 1]
};

// 6. CONFIRMACAO DE PRESENÇA
function prepareRsvp(event) {
  event.preventDefault();[cite: 1]
  const name = byId("rsvpName")?.value.trim();[cite: 1]
  if (!name) return alert("Por favor, selecione seu nome na lista.");[cite: 1]

  const answer = event.submitter?.dataset.answer || "sim";[cite: 1]
  const companions = answer === "sim" ? Number(byId("rsvpGuests")?.value || 0) : 0;[cite: 1]
  const source = byId("rsvpSource")?.value || "convidado";[cite: 1]

  pendingRsvpData = { name, companions, answer, source };[cite: 1]
  setStoredGuestName(name);[cite: 1]

  byId("rsvpFormContent")?.classList.add("hidden");[cite: 1]
  byId("rsvpConfirmScreen")?.classList.remove("hidden");[cite: 1]

  const text = answer === "sim"
    ? `Voce esta confirmando presença para<br><b style="font-size:22px;color:#2c5e3b;">${esc(name)}</b><br>${companions ? `e mais <b>${companions} acompanhante(s)</b>.` : "Somente voce."}`[cite: 1]
    : `Voce esta avisando que<br><b style="font-size:22px;color:#d9534f;">${esc(name)}</b><br>nao podera comparecer.`;[cite: 1]

  if (byId("rsvpConfirmText")) byId("rsvpConfirmText").innerHTML = text;[cite: 1]
}

window.cancelRSVP = function cancelRSVP() {
  pendingRsvpData = null;[cite: 1]
  byId("rsvpConfirmScreen")?.classList.add("hidden");[cite: 1]
  byId("rsvpFormContent")?.classList.remove("hidden");[cite: 1]
};

async function saveGuestResponse(payload) {
  const existing = state.guests.find(guest => normalize(guest.name) === normalize(payload.name));[cite: 1]
  if (existing) return supabaseClient.from("guests").update(payload).eq("id", existing.id);[cite: 1]
  return supabaseClient.from("guests").insert([payload]);[cite: 1]
}

window.confirmRSVP = async function confirmRSVP() {
  if (!pendingRsvpData || isSaving) return;[cite: 1]
  isSaving = true;[cite: 1]
  const button = byId("rsvpConfirmScreen")?.querySelector(".btn.primary");[cite: 1]
  setButtonLoading(button, true);[cite: 1]

  const { name, companions, answer, source } = pendingRsvpData;[cite: 1]
  const payload = {
    name,
    people: answer === "sim" ? companions + 1 : 0,[cite: 1]
    status: answer,[cite: 1]
    source,[cite: 1]
    phone: ""[cite: 1]
  };

  try {
    const { error } = await saveGuestResponse(payload);[cite: 1]
    if (error) throw error;[cite: 1]

    pendingRsvpData = null;[cite: 1]
    await loadData();[cite: 1]
    byId("rsvpConfirmScreen")?.classList.add("hidden");[cite: 1]
    showMessage(
      "rsvpMessage",
      answer === "sim"
        ? `<b>Presenca confirmada!</b><br>Obrigado, ${esc(name)}. Esperamos voce la!`[cite: 1]
        : `<b>Sentiremos sua falta!</b><br>Obrigado por nos avisar, ${esc(name)}.`[cite: 1]
    );
    setTimeout(() => byId("presentes")?.scrollIntoView({ behavior: "smooth" }), 1200);[cite: 1]
  } catch (error) {
    console.error(error);[cite: 1]
    alert("Erro ao salvar a confirmacao. Tente novamente.");[cite: 1]
  } finally {
    isSaving = false;[cite: 1]
    setButtonLoading(button, false);[cite: 1]
  }
};

// 7. PRESENTES E INTERFACE
function resetGiftActionButtons() {
  const fullButton = byId("confirmFullGift");[cite: 1]
  const quotaButton = byId("confirmQuotaGift");[cite: 1]
  const pixButton = byId("confirmPixPayment");[cite: 1]

  if (fullButton) {
    fullButton.disabled = false;[cite: 1]
    fullButton.textContent = "Quero dar o Item Inteiro";[cite: 1]
    delete fullButton.dataset.originalText;[cite: 1]
  }

  if (quotaButton) {
    quotaButton.disabled = false;[cite: 1]
    quotaButton.textContent = selectedGift?.quotaOnly
      ? "Escolher esta cota (Pix)"[cite: 1]
      : "Quero dar uma Cota (Pix)";[cite: 1]
    delete quotaButton.dataset.originalText;[cite: 1]
  }

  if (pixButton) {
    pixButton.disabled = false;[cite: 1]
    pixButton.textContent = "Ja realizei o Pix";[cite: 1]
    delete pixButton.dataset.originalText;[cite: 1]
  }
}

function showSavedState(button, text = "Salvo!") {
  if (!button) return;[cite: 1]
  button.disabled = true;[cite: 1]
  button.textContent = text;[cite: 1]
}

function wait(milliseconds) {
  return new Promise(resolve => {
    setTimeout(resolve, milliseconds);[cite: 1]
  });
}

function renderGifts() {
  const grid = byId("giftGrid");[cite: 1]
  if (!grid) return;[cite: 1]

  grid.innerHTML = gifts.map(gift => {
    const claims = claimsFor(gift.id);[cite: 1]
    const quotas = claims.filter(isQuotaClaim).length;[cite: 1]
    const fullItems = claims.length - quotas;[cite: 1]

    const visual = gift.image
      ? `<div style="width:100%;height:110px;background:#fff;display:flex;align-items:center;justify-content:center;border-radius:8px;overflow:hidden;"><img src="${esc(gift.image)}" alt="${esc(gift.title)}" style="max-width:100%;max-height:100%;object-fit:contain;" loading="lazy"></div>`[cite: 1]
      : `<div class="gift-icon" style="font-size:40px;text-align:center;margin-bottom:10px;">${gift.icon || "🎁"}</div>`;[cite: 1]

    const status = claims.length
      ? `<div style="margin:10px 0;padding:8px;background:#f9f9f9;border-left:3px solid #2c5e3b;font-size:13px;text-align:left;border-radius:4px;"><strong style="color:#2c5e3b;">Status:</strong><br>${fullItems ? `<b>${fullItems}</b> item(ns) inteiro(s)<br>` : ""}${quotas ? `<b>${quotas}</b> cota(s) declarada(s)` : ""}</div>`[cite: 1]
      : '<div style="margin:10px 0;font-size:13px;color:#888;font-style:italic;">Disponivel para escolha</div>';[cite: 1]

    return `<article class="gift" style="text-align:center;background:#fff;padding:15px;border-radius:12px;box-shadow:0 2px 5px rgba(0,0,0,.05);margin-bottom:15px;">
      ${visual}
      <h3 style="margin:10px 0;font-size:18px;">${esc(gift.title)}</h3>
      ${giftDescription(gift)}
      ${gift.price !== "Sugestao" ? `<div class="price" style="font-weight:bold;color:#2c5e3b;margin:10px 0;">${esc(gift.price)}</div>` : ""}
      ${status}
      <button type="button" class="btn primary" onclick="openGift(${gift.id})" style="margin-top:5px;padding:8px 15px;">${claims.length ? "Presentear tambem" : "Escolher este presente"}</button>
    </article>`;[cite: 1]
  }).join("");[cite: 1]
}

function ensureGiftIdentityElements() {
  const select = byId("giftName");[cite: 1]
  if (!select || byId("giftSelectWrapper")) return;[cite: 1]

  const label = document.querySelector('label[for="giftName"]');[cite: 1]
  const wrapper = document.createElement("div");[cite: 1]
  wrapper.id = "giftSelectWrapper";[cite: 1]
  label?.parentNode?.insertBefore(wrapper, label);[cite: 1]
  if (label) wrapper.appendChild(label);[cite: 1]
  wrapper.appendChild(select);[cite: 1]

  const automaticName = document.createElement("div");[cite: 1]
  automaticName.id = "giftNameAuto";[cite: 1]
  automaticName.className = "hidden";[cite: 1]
  automaticName.style.cssText = "text-align:center;margin:15px 0;";[cite: 1]
  wrapper.insertAdjacentElement("afterend", automaticName);[cite: 1]
}

function ensurePixControls() {
  const pixStep = byId("giftStepPix");[cite: 1]
  if (!pixStep) return;[cite: 1]

  const pixInput = pixStep.querySelector('input[type="text"]');[cite: 1]
  if (pixInput) {
    pixInput.id = "pixCode";[cite: 1]
    pixInput.value = PIX_CODE;[cite: 1]
    pixInput.removeAttribute("onclick");[cite: 1]
  }

  const oldFinish = [...pixStep.querySelectorAll("button")].find(button => button.textContent.trim() === "Concluir");[cite: 1]
  if (oldFinish) oldFinish.remove();[cite: 1]

  if (!byId("copyPixButton")) {
    pixStep.insertAdjacentHTML("beforeend", `
      <button type="button" id="copyPixButton" class="btn secondary full" style="margin-top:12px;">Copiar codigo Pix</button>
      <button type="button" id="confirmPixPayment" class="btn primary full" style="margin-top:10px;">Ja realizei o Pix</button>
      <button type="button" id="cancelPixPayment" class="btn light full" style="margin-top:10px;">Nao realizei o pagamento</button>
    `);[cite: 1]
  }

  byId("copyPixButton")?.addEventListener("click", copyPixCode);[cite: 1]
  byId("confirmPixPayment")?.addEventListener("click", confirmDeclaredPixPayment);[cite: 1]
  byId("cancelPixPayment")?.addEventListener("click", cancelPixPayment);[cite: 1]
}

window.openGift = function openGift(id) {
  selectedGift = gifts.find(gift => Number(gift.id) === Number(id));[cite: 1]
  if (!selectedGift) return;[cite: 1]

  pendingQuotaData = null;[cite: 1]
  ensureGiftIdentityElements();[cite: 1]
  ensurePixControls();[cite: 1]

  byId("modalTitle").textContent = selectedGift.title;[cite: 1]
  byId("modalPrice").innerHTML = `${giftDescription(selectedGift)}${selectedGift.price !== "Sugestao" ? `<br><b style="color:#2c5e3b;">Valor: ${esc(selectedGift.price)}</b>` : ""}`;[cite: 1]

  const storedName = getStoredGuestName();[cite: 1]
  const select = byId("giftName");[cite: 1]
  const wrapper = byId("giftSelectWrapper");[cite: 1]
  const automaticName = byId("giftNameAuto");[cite: 1]

  if (storedName && select && [...select.options].some(option => option.value === storedName)) {
    select.value = storedName;[cite: 1]
    wrapper?.classList.add("hidden");[cite: 1]
    automaticName?.classList.remove("hidden");[cite: 1]
    if (automaticName) automaticName.innerHTML = `Presenteando como:<br><b>${esc(storedName)}</b>`;[cite: 1]
  } else {
    wrapper?.classList.remove("hidden");[cite: 1]
    automaticName?.classList.add("hidden");[cite: 1]
    if (select) select.value = "";[cite: 1]
  }

  byId("confirmFullGift")?.classList.toggle("hidden", Boolean(selectedGift.quotaOnly));[cite: 1]
  if (byId("confirmQuotaGift")) {
    byId("confirmQuotaGift").textContent = selectedGift.quotaOnly
      ? "Escolher esta cota (Pix)"[cite: 1]
      : "Quero dar uma Cota (Pix)";[cite: 1]
  }

  byId("giftStepSelection")?.classList.remove("hidden");[cite: 1]
  byId("giftStepPix")?.classList.add("hidden");[cite: 1]
  byId("giftModal")?.classList.remove("hidden");[cite: 1]
};

function finishCloseGift() {
  byId("giftModal")?.classList.add("hidden");[cite: 1]
  byId("giftStepSelection")?.classList.remove("hidden");[cite: 1]
  byId("giftStepPix")?.classList.add("hidden");[cite: 1]

  selectedGift = null;[cite: 1]
  pendingQuotaData = null;[cite: 1]
  isSaving = false;[cite: 1]

  resetGiftActionButtons();[cite: 1]
}

window.closeGift = async function closeGift() {
  const pixStep = byId("giftStepPix");[cite: 1]
  const pixStepIsVisible = pixStep && !pixStep.classList.contains("hidden");[cite: 1]

  if (pixStepIsVisible && pendingQuotaData) {
    const paid = confirm(
      "Voce realizou o Pix e deseja confirmar este item?\n\n" +
      "Clique em OK para registrar a cota.\n" +
      "Clique em Cancelar para sair sem registrar."
    );[cite: 1]

    if (paid) {
      await confirmDeclaredPixPayment();[cite: 1]
      return;
    }
  }

  finishCloseGift();[cite: 1]
};

function getGifterName() {
  const stored = getStoredGuestName();[cite: 1]
  if (stored) return stored;[cite: 1]
  const selected = byId("giftName")?.value.trim() || "";[cite: 1]
  if (selected) setStoredGuestName(selected);[cite: 1]
  return selected;[cite: 1]
}

async function handleConfirmFullGift(event) {
  event?.preventDefault();[cite: 1]

  if (!selectedGift || isSaving) return;[cite: 1]

  const button = event?.currentTarget || byId("confirmFullGift");[cite: 1]
  const name = getGifterName();[cite: 1]

  if (!name) {
    alert("Por favor, selecione seu nome na lista.");[cite: 1]
    return;
  }

  isSaving = true;[cite: 1]
  setButtonLoading(button, true, "Salvando...");[cite: 1]

  try {
    const giftId = selectedGift.id;[cite: 1]
    const ipAddress = await getDeviceInfo();[cite: 1]

    const { error } = await supabaseClient
      .from("claims")
      .insert([
        {
          gift_id: giftId,
          name,
          device_info: ipAddress
        }
      ]);[cite: 1]

    if (error) throw error;[cite: 1]

    showSavedState(button, "Salvo!");[cite: 1]
    await loadData();[cite: 1]
    await wait(700);[cite: 1]
    finishCloseGift();[cite: 1]

    byId("presentes")?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });[cite: 1]
  } catch (error) {
    console.error("Erro ao registrar presente:", error);[cite: 1]
    alert("Nao foi possivel registrar o presente. Tente novamente.");[cite: 1]
    isSaving = false;[cite: 1]

    if (button) {
      button.disabled = false;[cite: 1]
      button.textContent = "Tentar salvar novamente";[cite: 1]
    }
  }
}

function handleConfirmQuotaGift(event) {
  event?.preventDefault();[cite: 1]

  if (!selectedGift || isSaving) return;[cite: 1]

  const name = getGifterName();[cite: 1]

  if (!name) {
    alert("Por favor, selecione seu nome na lista.");[cite: 1]
    return;
  }

  pendingQuotaData = {
    giftId: selectedGift.id,[cite: 1]
    name
  };

  byId("giftStepSelection")?.classList.add("hidden");[cite: 1]
  byId("giftStepPix")?.classList.remove("hidden");[cite: 1]

  const pixButton = byId("confirmPixPayment");[cite: 1]
  if (pixButton) {
    pixButton.disabled = false;[cite: 1]
    pixButton.textContent = "Ja realizei o Pix";[cite: 1]
  }
}

async function confirmDeclaredPixPayment(event) {
  if (!pendingQuotaData || isSaving) return;[cite: 1]

  const button = event?.currentTarget || byId("confirmPixPayment");[cite: 1]
  const quotaData = { ...pendingQuotaData };[cite: 1]

  isSaving = true;[cite: 1]
  setButtonLoading(button, true, "Salvando...");[cite: 1]

  try {
    const ipAddress = await getDeviceInfo();[cite: 1]

    const { error } = await supabaseClient
      .from("claims")
      .insert([
        {
          gift_id: quotaData.giftId,
          name: `${quotaData.name} (Cota)`,
          device_info: ipAddress
        }
      ]);[cite: 1]

    if (error) throw error;[cite: 1]

    pendingQuotaData = null;[cite: 1]
    showSavedState(button, "Salvo!");[cite: 1]
    await loadData();[cite: 1]
    await wait(700);[cite: 1]
    finishCloseGift();[cite: 1]

    byId("presentes")?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });[cite: 1]
  } catch (error) {
    console.error("Erro ao registrar cota:", error);[cite: 1]
    alert("Nao foi possivel registrar a cota. Tente novamente.");[cite: 1]
    isSaving = false;[cite: 1]

    if (button) {
      button.disabled = false;[cite: 1]
      button.textContent = "Tentar salvar novamente";[cite: 1]
    }
  }
}

function cancelPixPayment() {
  const leaveWithoutRegistering = confirm("Deseja sair da etapa do Pix sem confirmar este item?");[cite: 1]
  if (!leaveWithoutRegistering) return;[cite: 1]

  pendingQuotaData = null;[cite: 1]
  byId("giftStepPix")?.classList.add("hidden");[cite: 1]
  byId("giftStepSelection")?.classList.remove("hidden");[cite: 1]
}

window.addEventListener("beforeunload", event => {
  const pixStep = byId("giftStepPix");[cite: 1]
  const pixStepIsVisible = pixStep && !pixStep.classList.contains("hidden");[cite: 1]
  if (!pixStepIsVisible || !pendingQuotaData) return;[cite: 1]
  event.preventDefault();[cite: 1]
  event.returnValue = "";[cite: 1]
});

async function copyPixCode() {
  const input = byId("pixCode");[cite: 1]
  const code = input?.value || PIX_CODE;[cite: 1]

  try {
    await navigator.clipboard.writeText(code);[cite: 1]
    alert("Codigo Pix copiado com sucesso!");[cite: 1]
  } catch {
    if (input) {
      input.select();[cite: 1]
      document.execCommand("copy");[cite: 1]
      alert("Codigo Pix copiado com sucesso!");[cite: 1]
    }
  }
}

// 8. PAINEL DE ADMINISTRACAO
window.login = function login(event) {
  event?.preventDefault();[cite: 1]
  const password = byId("adminPassword")?.value || "";[cite: 1]

  if (password === ADMIN_PASSWORD) {[cite: 1]
    state.adminUnlocked = true;[cite: 1]
    byId("adminAuth")?.classList.add("hidden");[cite: 1]
    byId("adminContent")?.classList.remove("hidden");[cite: 1]
    byId("adminError")?.classList.add("hidden");[cite: 1]
    renderGuestAdmin();[cite: 1]
    renderPendingAdmin();[cite: 1]
    renderGiftAdmin();[cite: 1]
    renderPublicConfirmed(); // Renderiza a lista de convidados "04 · ESTARÃO CONOSCO" após login correto[cite: 1]
  } else {
    const errorEl = byId("adminError");[cite: 1]
    if (errorEl) {
      errorEl.classList.remove("hidden");[cite: 1]
      errorEl.textContent = "Senha incorreta!";[cite: 1]
    } else {
      alert("Senha incorreta!");[cite: 1]
    }
  }
};

function renderGuestAdmin() {
  const tbody = byId("guestTable");[cite: 1]
  if (!tbody) return;[cite: 1]

  let confirmed = 0;[cite: 1]
  let declined = 0;[cite: 1]
  let totalPeople = 0;[cite: 1]

  tbody.innerHTML = state.guests.map(guest => {
    if (guest.status === "sim") {[cite: 1]
      confirmed++;[cite: 1]
      totalPeople += Number(guest.people) || 1;[cite: 1]
    } else if (guest.status === "nao") {[cite: 1]
      declined++;[cite: 1]
    }

    return `<tr>
      <td>${esc(guest.name || "Convidado")}</td>
      <td>${guest.status === "sim" ? "Vai ao casamento" : guest.status === "nao" ? "Nao vai" : "Pendente"}</td>
      <td>${guest.people || 1}</td>
      <td>${esc(guest.source || "Convidado")}</td>
      <td><button type="button" class="btn secondary" onclick="deleteGuest('${guest.id}')">Excluir</button></td>
    </tr>`;[cite: 1]
  }).join("") || '<tr><td colspan="5" style="text-align:center;">Nenhum convidado respondido ainda.</td></tr>';[cite: 1]

  if (byId("confirmedCount")) byId("confirmedCount").textContent = confirmed;[cite: 1]
  if (byId("declinedCount")) byId("declinedCount").textContent = declined;[cite: 1]
  if (byId("peopleCount")) byId("peopleCount").textContent = totalPeople;[cite: 1]
}

function renderPendingAdmin() {
  const container = byId("pendingTab");[cite: 1]
  if (!container) return;[cite: 1]
  
  const unanswered = getUnansweredGuests();[cite: 1]
  const groomPending = unanswered.filter(g => normalize(g.lado) === "noivo");[cite: 1]
  const bridePending = unanswered.filter(g => normalize(g.lado) === "noiva" || !g.lado);[cite: 1]

  container.innerHTML = `
    <div style="margin-bottom: 25px;">
      <h3 style="margin-bottom: 10px; color: var(--primary);">Pendentes do Noivo (${groomPending.length})</h3>
      <div class="table-wrap">
        <table>
          <thead>
            <tr><th>Convidado Pendente</th><th>Lado</th></tr>
          </thead>
          <tbody>
            ${groomPending.map(guest => `<tr><td>${esc(guest.name)}</td><td>Noivo</td></tr>`).join("") || '<tr><td colspan="2" style="text-align:center;">Nenhum pendente para o noivo.</td></tr>'}
          </tbody>
        </table>
      </div>
    </div>

    <div>
      <h3 style="margin-bottom: 10px; color: var(--primary);">Pendentes da Noiva (${bridePending.length})</h3>
      <div class="table-wrap">
        <table>
          <thead>
            <tr><th>Convidado Pendente</th><th>Lado</th></tr>
          </thead>
          <tbody>
            ${bridePending.map(guest => `<tr><td>${esc(guest.name)}</td><td>Noiva</td></tr>`).join("") || '<tr><td colspan="2" style="text-align:center;">Nenhum pendente para a noiva.</td></tr>'}
          </tbody>
        </table>
      </div>
    </div>
  `;[cite: 1]
}

window.deleteGuest = async function deleteGuest(id) {
  if (!confirm("Deseja realmente remover este registro?")) return;[cite: 1]
  const { error } = await supabaseClient.from("guests").delete().eq("id", id);[cite: 1]
  if (error) alert("Erro ao excluir convidado.");[cite: 1]
  else await loadData();[cite: 1]
};

function renderGiftAdmin() {
  const tbody = byId("giftTable");[cite: 1]
  if (!tbody) return;[cite: 1]

  tbody.innerHTML = state.claims.map(claim => {
    const gift = gifts.find(item => Number(item.id) === Number(claim.gift_id));[cite: 1]
    const title = gift ? gift.title : `Presente #${claim.gift_id}`;[cite: 1]
    const date = claim.created_at ? new Date(claim.created_at).toLocaleString("pt-BR") : "-";[cite: 1]
    const ipAddress = claim.device_info || "Não registrado";[cite: 1]

    return `<tr>
      <td>${esc(title)}</td>
      <td>${esc(claim.name || "Convidado")}</td>
      <td>${date}</td>
      <td><span style="font-size: 11px; color: #666; display: block; word-wrap: break-word;">${esc(ipAddress)}</span></td>
      <td><button type="button" class="btn secondary" style="padding: 5px 10px; font-size: 12px;" onclick="deleteClaim('${claim.id}')">Remover</button></td>
    </tr>`;[cite: 1]
  }).join("") || '<tr><td colspan="5" style="text-align:center;">Nenhum presente escolhido ainda.</td></tr>';[cite: 1]
}

window.deleteClaim = async function deleteClaim(id) {
  if (!confirm("Deseja remover este registro de presente?")) return;[cite: 1]
  const { error } = await supabaseClient.from("claims").delete().eq("id", id);[cite: 1]
  if (error) alert("Erro ao remover presente.");[cite: 1]
  else await loadData();[cite: 1]
};

async function handleManualForm(event, status) {
  event?.preventDefault();[cite: 1]
  const name = byId("manualName")?.value;[cite: 1]
  const phone = byId("manualPhone")?.value || "";[cite: 1]
  const companions = Number(byId("manualGuests")?.value || 0);[cite: 1]

  if (!name) return alert("Selecione um nome.");[cite: 1]

  const payload = {
    name,
    phone,
    people: status === "sim" ? companions + 1 : 0,[cite: 1]
    status,[cite: 1]
    source: "organizador"[cite: 1]
  };

  try {
    const { error } = await saveGuestResponse(payload);[cite: 1]
    if (error) throw error;[cite: 1]

    alert(status === "sim" ? "Presenca registrada com sucesso!" : "Ausencia registrada com sucesso!");[cite: 1]
    byId("manualForm")?.reset();[cite: 1]
    await loadData();[cite: 1]
  } catch (error) {
    console.error(error);[cite: 1]
    alert("Erro ao salvar manualmente.");[cite: 1]
  }
}

// 8.1 RENDERIZAÇÃO PRIVADA DA SEÇÃO "04 · ESTARÃO CONOSCO"
function renderPublicConfirmed() {
  const container = byId("publicConfirmedListContainer");[cite: 1]
  if (!container) return;[cite: 1]

  // Se o painel admin não foi desbloqueado por senha, esvazia o contêiner completamente.
  if (!state.adminUnlocked) {
    container.innerHTML = "";
    return;
  }

  const confirmed = state.guests.filter(g => g.status === "sim");[cite: 1]
  
  const getGuestSide = guestName => {
    const found = state.allowed.find(a => normalize(a.name) === normalize(guestName));[cite: 1]
    return found ? normalize(found.lado) : "noiva";[cite: 1]
  };

  const brideConfirmed = confirmed.filter(g => getGuestSide(g.name) === "noiva").sort((a, b) => (a.name || "").localeCompare(b.name || ""));[cite: 1]
  const groomConfirmed = confirmed.filter(g => getGuestSide(g.name) === "noivo").sort((a, b) => (a.name || "").localeCompare(b.name || ""));[cite: 1]

  const renderItems = list => list.map(g => `
    <li style="background: #fff; padding: 12px; border: 1px solid var(--line); border-radius: 8px; font-size: 0.95rem; color: var(--primary); font-weight: 600; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
      ✓ ${esc(g.name)}
    </li>
  `).join("") || '<li style="grid-column: 1 / -1; color: #888; text-align: center;">Nenhuma presença confirmada neste grupo.</li>';[cite: 1]

  // Injeta o cabeçalho "04 · ESTARÃO CONOSCO / Convidados Confirmados" exclusivamente dentro do painel protegido
  container.innerHTML = `
    <div style="margin-top: 20px; padding: 20px; background: rgba(255,255,255,0.6); border-radius: 12px; border: 1px solid var(--line);">
      <div style="text-align: center; margin-bottom: 20px;">
        <span style="font-size: 0.85rem; letter-spacing: 2px; text-transform: uppercase; color: #888; font-weight: bold;">04 · ESTARÃO CONOSCO</span>
        <h2 style="font-size: 1.6rem; color: var(--primary); margin-top: 5px;">Convidados Confirmados</h2>
      </div>

      <div style="margin-bottom: 25px;">
        <h3 style="margin-bottom: 12px; font-size: 1.1rem; color: var(--primary); text-align: center;">Convidados da Noiva (${brideConfirmed.length})</h3>
        <ul style="list-style: none; padding: 0; display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 10px;">
          ${renderItems(brideConfirmed)}
        </ul>
      </div>

      <div>
        <h3 style="margin-bottom: 12px; font-size: 1.1rem; color: var(--primary); text-align: center;">Convidados do Noivo (${groomConfirmed.length})</h3>
        <ul style="list-style: none; padding: 0; display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 10px;">
          ${renderItems(groomConfirmed)}
        </ul>
      </div>
    </div>
  `;
}

// 9. EVENTOS INICIAIS
document.addEventListener("DOMContentLoaded", () => {
  byId("closeModal")?.addEventListener("click", closeGift);[cite: 1]
  byId("cancelGift")?.addEventListener("click", closeGift);[cite: 1]
  byId("confirmFullGift")?.addEventListener("click", handleConfirmFullGift);[cite: 1]
  byId("confirmQuotaGift")?.addEventListener("click", handleConfirmQuotaGift);[cite: 1]
  byId("rsvpForm")?.addEventListener("submit", prepareRsvp);[cite: 1]
  byId("adminLoginBtn")?.addEventListener("click", login);[cite: 1]
  byId("adminPassword")?.addEventListener("keydown", event => {
    if (event.key === "Enter") login(event);[cite: 1]
  });

  byId("manualForm")?.addEventListener("submit", event => handleManualForm(event, "sim"));[cite: 1]
  byId("manualDecline")?.addEventListener("click", event => handleManualForm(event, "nao"));[cite: 1]

  const manualNameSelect = byId("manualName");[cite: 1]
  if (manualNameSelect) {
    manualNameSelect.addEventListener("change", () => populateCompanionSelect("manualName", "manualGuests"));[cite: 1]
  }

  const rsvpNameSelect = byId("rsvpName");[cite: 1]
  if (rsvpNameSelect) {
    rsvpNameSelect.addEventListener("change", () => {
      const name = rsvpNameSelect.value.trim();[cite: 1]
      if (name) setStoredGuestName(name);[cite: 1]
      populateCompanionSelect("rsvpName", "rsvpGuests");[cite: 1]
    });
  }

  document.querySelectorAll(".admin-tabs .tab").forEach(tabButton => {
    tabButton.addEventListener("click", () => {
      const targetId = tabButton.getAttribute("data-tab");[cite: 1]
      if (!targetId) return;[cite: 1]

      document.querySelectorAll(".admin-tabs .tab").forEach(btn => btn.classList.remove("active"));[cite: 1]
      tabButton.classList.add("active");[cite: 1]

      document.querySelectorAll(".tab-content").forEach(content => content.classList.add("hidden"));[cite: 1]
      byId(targetId)?.classList.remove("hidden");[cite: 1]
    });
  });

  loadData();[cite: 1]
});

document.addEventListener("click", event => {
  if (event.target.closest("#adminAuth")) return;[cite: 1]
  const trigger = event.target.closest("a, button, [role='button']");[cite: 1]
  if (!trigger) return;[cite: 1]

  const href = trigger.getAttribute("href")?.toLowerCase() || "";[cite: 1]
  const text = trigger.textContent?.toLowerCase().trim() || "";[cite: 1]

  if (text.includes("área dos noivos") || href.includes("noivos") || href.includes("admin")) {[cite: 1]
    event.preventDefault();[cite: 1]
    const adminSection = byId("admin");[cite: 1]
    if (adminSection) {
      adminSection.scrollIntoView({ behavior: "smooth" });[cite: 1]
    } else {
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });[cite: 1]
    }
  }
});