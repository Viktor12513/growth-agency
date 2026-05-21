let isYearly = false;

const productCatalog = {
  'website-start': { name: 'Hemsida Start', description: 'Upp till 5 sidor med mobilanpassning, SEO-grund och kontaktformul\u00e4r.', priceType: 'one-time', price: 14999 },
  'website-growth': { name: 'Hemsida Tillv\u00e4xt', description: 'Komplett hemsida upp till 10 sidor med CMS, blogg och SEO-grund.', priceType: 'one-time', price: 24999 },
  'website-premium': { name: 'Hemsida Premium', description: 'Skr\u00e4ddarsydd l\u00f6sning f\u00f6r st\u00f6rre sajt, webshop eller varum\u00e4rkesplattform.', priceType: 'one-time', price: 39999, prefix: 'Fr\u00e5n ' },
  'addon-webshop': { name: 'Webshop (WooCommerce)', description: 'Upp till 50 produkter, betalning via Klarna/kort och orderhantering.', priceType: 'one-time', price: 9999 },
  'addon-booking': { name: 'Bokningssystem', description: 'Integrerat bokningsfl\u00f6de med kalender och bekr\u00e4ftelsemejl.', priceType: 'one-time', price: 4999 },
  'addon-language': { name: 'Flerspr\u00e5kig sajt', description: 'L\u00e4gg till engelska eller ytterligare ett spr\u00e5k p\u00e5 hela sajten.', priceType: 'one-time', price: 999 },
  'addon-extra-page': { name: 'Extra sidor', description: 'Fler sidor ut\u00f6ver vad hemsidepaketet inkluderar.', priceType: 'one-time', price: 1500, quantity: true },
  'addon-maintenance': { name: 'L\u00f6pande underh\u00e5ll', description: 'Uppdateringar, s\u00e4kerhet och backup. Ing\u00e5r automatiskt i alla SEO-abonnemang.', priceType: 'monthly', monthly: 149 },
  'seo-local': { name: 'SEO Lokal', description: 'Lokal SEO f\u00f6r f\u00f6retag som vill synas i sin stad eller region.', priceType: 'monthly', monthly: 2995, yearlyMonthly: 2746 },
  'seo-growth': { name: 'SEO Tillv\u00e4xt', description: 'Nationell SEO f\u00f6r f\u00f6retag som vill synas i hela Sverige.', priceType: 'monthly', monthly: 5995, yearlyMonthly: 5496 },
  'seo-dominant': { name: 'SEO Dominant', description: 'Avancerad SEO f\u00f6r f\u00f6retag som vill dominera s\u00f6kresultaten i sin bransch.', priceType: 'monthly', monthly: 9995, yearlyMonthly: 9162 },
};

const storageKey = 'nordvaxt-request-cart';
let cart = loadCart();

const formatCurrency = (value) => new Intl.NumberFormat('sv-SE').format(value) + ' kr';

function getProductPrice(product) {
  if (product.priceType === 'monthly') return isYearly && product.yearlyMonthly ? product.yearlyMonthly : product.monthly;
  return product.price;
}

function getPriceLabel(product, quantity = 1) {
  const price = getProductPrice(product) * quantity;
  const prefix = product.prefix || '';
  return product.priceType === 'monthly' ? prefix + formatCurrency(price) + '/m\u00e5n' : prefix + formatCurrency(price);
}

function loadCart() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || '[]');
    return saved.filter((item) => productCatalog[item.id]).map((item) => ({ id: item.id, quantity: Math.max(1, item.quantity || 1) }));
  } catch {
    return [];
  }
}

function saveCart() {
  localStorage.setItem(storageKey, JSON.stringify(cart));
}

function updateBillingPrices() {
  document.querySelectorAll('.price-main[data-monthly]').forEach((price) => {
    price.textContent = (isYearly ? price.dataset.yearly : price.dataset.monthly) + ' kr';
  });

  document.querySelectorAll('.yearly-note').forEach((note) => {
    note.classList.toggle('is-hidden', !isYearly);
  });

  renderCart();
}

function toggleBilling() {
  isYearly = !isYearly;
  document.getElementById('billingToggle')?.classList.toggle('yearly', isYearly);
  document.getElementById('label-monthly')?.classList.toggle('active', !isYearly);
  document.getElementById('label-yearly')?.classList.toggle('active', isYearly);
  updateBillingPrices();
}

function toggleFaq(button) {
  const item = button.closest('.faq-item');
  const isOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item').forEach((faqItem) => faqItem.classList.remove('open'));
  if (!isOpen) item.classList.add('open');
}

function openCart() {
  document.getElementById('cartPanel')?.classList.add('is-open');
  document.getElementById('cartFab')?.setAttribute('aria-expanded', 'true');
}

function closeCart() {
  document.getElementById('cartPanel')?.classList.remove('is-open');
  document.getElementById('cartFab')?.setAttribute('aria-expanded', 'false');
}

function addToCart(productId) {
  const product = productCatalog[productId];
  if (!product) return;
  const existing = cart.find((item) => item.id === productId);
  if (existing) {
    if (product.quantity) existing.quantity += 1;
  } else {
    cart.push({ id: productId, quantity: 1 });
  }
  saveCart();
  renderCart();
  openCart();
}

function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId);
  saveCart();
  renderCart();
}

function changeQuantity(productId, delta) {
  const item = cart.find((cartItem) => cartItem.id === productId);
  if (!item) return;
  item.quantity = Math.max(1, item.quantity + delta);
  saveCart();
  renderCart();
}

function renderCartItem(item) {
  const product = productCatalog[item.id];
  const quantityControls = product.quantity
    ? '<div class="cart-qty" aria-label="Antal ' + product.name + '">' +
      '<button type="button" data-cart-qty="' + item.id + '" data-delta="-1">-</button>' +
      '<span>Antal: ' + item.quantity + '</span>' +
      '<button type="button" data-cart-qty="' + item.id + '" data-delta="1">+</button>' +
      '</div>'
    : '<span class="cart-qty">Antal: ' + item.quantity + '</span>';

  return '<article class="cart-item">' +
    '<div class="cart-item-top">' +
      '<div><h3>' + product.name + '</h3><p>' + product.description + '</p></div>' +
      '<div class="cart-item-price">' + getPriceLabel(product, item.quantity) + '</div>' +
    '</div>' +
    '<div class="cart-item-actions">' + quantityControls +
      '<button class="cart-remove" type="button" data-cart-remove="' + item.id + '">Ta bort</button>' +
    '</div>' +
  '</article>';
}

function renderCart() {
  const cartItems = document.getElementById('cartItems');
  const cartEmpty = document.getElementById('cartEmpty');
  const cartTotals = document.getElementById('cartTotals');
  const submitButton = document.getElementById('cartSubmit');
  const fabCount = document.getElementById('cartFabCount');
  const success = document.getElementById('cartSuccess');
  if (!cartItems || !cartEmpty || !cartTotals || !submitButton || !fabCount) return;

  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  fabCount.textContent = String(itemCount);
  cartEmpty.hidden = cart.length > 0;
  cartTotals.hidden = cart.length === 0;
  submitButton.disabled = cart.length === 0;
  submitButton.textContent = 'Skicka f\u00f6rfr\u00e5gan';
  if (success) success.hidden = true;

  cartItems.innerHTML = cart.map(renderCartItem).join('');

  const oneTimeTotal = cart.reduce((sum, item) => {
    const product = productCatalog[item.id];
    return product.priceType === 'one-time' ? sum + product.price * item.quantity : sum;
  }, 0);
  const monthlyTotal = cart.reduce((sum, item) => {
    const product = productCatalog[item.id];
    return product.priceType === 'monthly' ? sum + getProductPrice(product) * item.quantity : sum;
  }, 0);

  document.getElementById('cartOneTimeTotal').textContent = formatCurrency(oneTimeTotal);
  document.getElementById('cartMonthlyTotal').textContent = formatCurrency(monthlyTotal) + '/m\u00e5n';
  document.getElementById('cartBillingNote').textContent = isYearly
    ? 'SEO visas som ungef\u00e4rlig m\u00e5nadskostnad vid 12 m\u00e5n avtal med 1 m\u00e5nad gratis. Vid 24 m\u00e5n avtal f\u00e5r du 3 m\u00e5nader gratis.'
    : 'Eng\u00e5ngspris och m\u00e5nadskostnad visas separat s\u00e5 du ser vad som startas direkt och vad som \u00e4r l\u00f6pande.';

  updateSelectedButtons();
}

function updateSelectedButtons() {
  document.querySelectorAll('.product-select').forEach((button) => {
    const productId = button.dataset.productId;
    const product = productCatalog[productId];
    const selected = cart.some((item) => item.id === productId);
    button.classList.toggle('is-selected', selected);
    if (!product?.quantity) button.textContent = selected ? 'Valt' : button.dataset.defaultLabel;
  });
}

function submitRequest() {
  if (cart.length === 0) return;
  // TODO: Connect this simulated request to email, CRM or backend storage when backend is available.
  document.getElementById('cartSuccess').hidden = false;
  document.getElementById('cartSubmit').textContent = 'F\u00f6rfr\u00e5gan skickad';
  document.getElementById('cartSubmit').disabled = true;
}

document.getElementById('billingToggle')?.addEventListener('click', toggleBilling);
document.querySelectorAll('.faq-q').forEach((button) => button.addEventListener('click', () => toggleFaq(button)));
document.querySelectorAll('.product-select').forEach((button) => {
  button.dataset.defaultLabel = button.textContent.trim();
  button.addEventListener('click', () => addToCart(button.dataset.productId));
});
document.getElementById('cartFab')?.addEventListener('click', openCart);
document.getElementById('cartClose')?.addEventListener('click', closeCart);
document.getElementById('cartSubmit')?.addEventListener('click', submitRequest);
document.getElementById('cartItems')?.addEventListener('click', (event) => {
  const removeButton = event.target.closest('[data-cart-remove]');
  if (removeButton) removeFromCart(removeButton.dataset.cartRemove);
  const quantityButton = event.target.closest('[data-cart-qty]');
  if (quantityButton) changeQuantity(quantityButton.dataset.cartQty, Number(quantityButton.dataset.delta));
});

renderCart();
