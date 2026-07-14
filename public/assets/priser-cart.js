(function() {
  // ---- State ----
  const cart = []; // { id, name, category, price, monthly, qty }

  // ---- Product catalogue (parsed from DOM buttons) ----
  const products = [
    // Hemsidor
    { id:'web-start',     category:'Hemsida',    name:'Start',         price:0, monthly:834,  termMonths:24, contractValue:19999, webKey:'start' },
    { id:'web-tillvaxt',  category:'Hemsida',    name:'Tillväxt',      price:0, monthly:1250, termMonths:24, contractValue:29999, webKey:'tillvaxt' },
    { id:'web-premium',   category:'Hemsida',    name:'Premium',       price:0, monthly:1667, termMonths:24, contractValue:39999, webKey:'premium' },
    { id:'web-offert',    category:'Hemsida',    name:'Hemsida Offert', price:0, monthly:0, offert:true, description:'Skräddarsytt hemsideprojekt efter behovsanalys och kravspecifikation.' },
    // Google Ads
    { id:'ads-bas',       category:'Google Ads', name:'Ads Bas',       price:0,     monthly:2995 },
    { id:'ads-tillvaxt',  category:'Google Ads', name:'Ads Tillväxt',  price:0,     monthly:5995 },
    { id:'ads-dominant',  category:'Google Ads', name:'Ads Dominant',  price:0,     monthly:0,  offert:true },
    // SEO
    { id:'seo-lite',      category:'SEO',        name:'Grundläggande SEO', price:0, monthly:999 },
    { id:'seo-lokal',     category:'SEO',        name:'SEO Lokal',     price:0,     monthly:1799 },
    { id:'seo-regional',  category:'SEO',        name:'SEO Regional',  price:0,     monthly:2999 },
    { id:'seo-nationell', category:'SEO',        name:'SEO Nationell', price:0,     monthly:6999 },
    { id:'seo-offert',    category:'SEO',        name:'SEO Offert',    price:0,     monthly:0, offert:true, description:'Skräddarsytt SEO-upplägg efter webbplatsens mål och omfattning.' },
  ];

  // ---- Wire up buttons ----
  function wireButtons() {
    // Cards – match by text content of .c-btn
    const btnMap = {
      'Välj Start':'web-start', 'Välj Tillväxt':'web-tillvaxt', 'Välj Premium':'web-premium',
      'Välj Bas':'ads-bas', 'Begär offert':'ads-dominant',
      'Välj Grundläggande':'seo-lite', 'Välj Lokal':'seo-lokal',
      'Välj Regional':'seo-regional', 'Välj Nationell':'seo-nationell',
    };
    // Special: multiple "Välj Tillväxt" buttons – distinguish by section
    document.querySelectorAll('.c-btn').forEach(btn => {
      const txt = btn.textContent.trim();
      let prodId = btn.dataset.prodId || null;

      if (!prodId && txt === 'Välj Tillväxt') {
        // Find parent card, then section
        const section = btn.closest('.cards-grid');
        const prevLabel = section ? section.previousElementSibling : null;
        // Walk back to find sec-label
        let el = section ? section.previousElementSibling : null;
        while (el) {
          if (el.classList && el.classList.contains('sec-label')) break;
          el = el.previousElementSibling;
        }
        if (el) {
          const labelText = el.textContent;
          if (labelText.includes('Google Ads')) prodId = 'ads-tillvaxt';
          else prodId = 'web-tillvaxt';
        } else prodId = 'web-tillvaxt';
      } else {
        prodId = prodId || btnMap[txt] || null;
      }

      if (prodId) {
        btn.dataset.prodId = prodId;
        btn.addEventListener('click', function(e) {
          const p = products.find(x => x.id === this.dataset.prodId);
          if (p) addToCart(p, this);
        });
      }
    });

  }

  // ---- Cart logic ----
  function addToCart(prod, btn) {
    if (prod.offert) { showToast('📋 Kontakta oss för skräddarsytt prisförslag'); return; }
    const existing = cart.find(i => i.id === prod.id);
    if (existing) {
      existing.qty++;
    } else {
      cart.push({ ...prod, qty: 1 });
    }
    updateCartUI();
    // Button feedback
    if (btn) {
      btn.classList.add('added');
      const orig = btn.textContent;
      btn.textContent = '✓ Tillagd';
      setTimeout(() => { btn.textContent = orig; btn.classList.remove('added'); }, 1500);
    }
    // Badge pop
    const badge = document.getElementById('cartBadge');
    badge.classList.remove('pop');
    void badge.offsetWidth;
    badge.classList.add('pop');
    showToast('🛒 ' + prod.name + ' lades till i korgen');
  }

  function removeFromCart(id) {
    const idx = cart.findIndex(i => i.id === id);
    if (idx !== -1) cart.splice(idx, 1);
    updateCartUI();
  }

  function changeQty(id, delta) {
    const item = cart.find(i => i.id === id);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) removeFromCart(id);
    else updateCartUI();
  }

  function clearCart() {
    cart.length = 0;
    updateCartUI();
  }

  // ---- Render ----
  function updateCartUI() {
    const total = cart.reduce((s, i) => s + i.qty, 0);
    document.getElementById('cartBadge').textContent = total;
    document.getElementById('cartCountLabel').textContent = total > 0 ? '(' + total + ' varor)' : '';

    const container = document.getElementById('cartItems');
    const footer = document.getElementById('cartFooter');

    if (cart.length === 0) {
      container.innerHTML = `
        <div class="cart-empty">
          <div class="empty-icon">🛒</div>
          <p>Din korg är tom.<br>Klicka på ett paket för att lägga till det.</p>
        </div>`;
      footer.style.display = 'none';
      return;
    }

    footer.style.display = 'block';
    container.innerHTML = '';

    // Group by category
    const cats = [...new Set(cart.map(i => i.category))];
    cats.forEach(cat => {
      const catItems = cart.filter(i => i.category === cat);
      catItems.forEach(item => {
        const div = document.createElement('div');
        div.className = 'cart-item';
        const priceStr = item.monthly > 0
          ? (item.price > 0 ? fmtKr(item.price) + ' + ' : '') + fmtKr(item.monthly) + '/mån'
          : fmtKr(item.price);
        const termText = item.termMonths
          ? `${item.termMonths} mån avbetalning${item.contractValue ? ' · totalt ' + fmtKr(item.contractValue) : ''}`
          : 'Löpande abonnemang – avtal krävs';
        div.innerHTML = `
          <div class="ci-info">
            <div class="ci-category">${item.category}</div>
            <div class="ci-name">${item.name}</div>
            <div class="ci-price">${priceStr}</div>
            ${item.monthly > 0 ? `<div class="cart-note" style="font-size:10px;padding:5px 9px;">${termText}</div>` : ''}
            <div class="ci-qty">
              <button onclick="window._cartChangeQty('${item.id}',-1)">−</button>
              <span>${item.qty}</span>
              <button onclick="window._cartChangeQty('${item.id}',1)">+</button>
            </div>
          </div>
          <button class="ci-remove" title="Ta bort" onclick="window._cartRemove('${item.id}')">✕</button>
        `;
        container.appendChild(div);
      });
    });

    // Summary
    const sumOnce = cart.reduce((s, i) => s + i.price * i.qty, 0);
    const sumMon = cart.reduce((s, i) => s + i.monthly * i.qty, 0);
    const sumContract = cart.reduce((s, i) => s + (i.contractValue || (i.price + i.monthly * (i.termMonths || 1))) * i.qty, 0);
    document.getElementById('sumOnce').textContent = fmtKr(sumOnce);
    document.getElementById('sumMonthly').textContent = fmtKr(sumMon) + '/mån';
    document.getElementById('sumTotal').textContent = fmtKr(sumOnce + sumMon);
    document.getElementById('sumContract').textContent = fmtKr(sumContract);
  }

  function fmtKr(n) {
    return n.toLocaleString('sv-SE').replace(/\s/g, ' ') + ' kr';
  }

  // ---- Open/close ----
  function openCart() {
    document.getElementById('cartDrawer').classList.add('open');
    document.getElementById('cartOverlay').classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeCart() {
    document.getElementById('cartDrawer').classList.remove('open');
    document.getElementById('cartOverlay').classList.remove('open');
    document.body.style.overflow = '';
  }

  // ---- Toast ----
  function showToast(msg) {
    const t = document.getElementById('cartToast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(t._timer);
    t._timer = setTimeout(() => t.classList.remove('show'), 2500);
  }

  function wireCartControls() {
    document.getElementById('cartTrigger')?.addEventListener('click', openCart);
    document.getElementById('cartOverlay')?.addEventListener('click', closeCart);
    document.getElementById('cartClose')?.addEventListener('click', closeCart);
    document.getElementById('cartCheckout')?.addEventListener('click', goCheckout);
    document.getElementById('cartClear')?.addEventListener('click', clearCart);
  }

  // ---- Checkout ----
  /*
  function goCheckout() {
    const lines = cart.map(i => `• ${i.name} (×${i.qty})`).join('%0A');
    const subject = encodeURIComponent('Intresseanmälan – Plasma MEDIA AB');
    const body = encodeURIComponent('Hej!\n\nJag är intresserad av följande paket:\n\n' + cart.map(i => `• ${i.name} ×${i.qty}`).join('\n') + '\n\nKontakta mig gärna.\n\nMed vänliga hälsningar,');
    window.location.href = '/kontakt/#contact-form';
  }
  */

  function goCheckout() {
    if (!cart.length) {
      openCart();
      showToast('Lägg först till ett paket i kundkorgen.');
      return;
    }

    const sumOnce = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const sumMonthly = cart.reduce((sum, item) => sum + item.monthly * item.qty, 0);
    const sumContract = cart.reduce((sum, item) => sum + (item.contractValue || (item.price + item.monthly * (item.termMonths || 1))) * item.qty, 0);
    const service = cart.some((item) => item.category === 'SEO')
      ? 'seo'
      : cart.some((item) => item.category === 'Hemsida')
        ? 'hemsida'
        : cart.some((item) => item.category === 'Google Ads')
          ? 'google-ads'
          : 'paket';

    const itemLines = cart.map((item) => {
      const priceParts = [];
      if (item.price > 0) priceParts.push(fmtKr(item.price));
      if (item.monthly > 0) priceParts.push(`${fmtKr(item.monthly)}/mån`);
      if (item.termMonths) priceParts.push(`${item.termMonths} mån`);
      if (item.contractValue) priceParts.push(`totalt ${fmtKr(item.contractValue)}`);
      const priceText = priceParts.length ? ` – ${priceParts.join(' + ')}` : '';
      return `• ${item.category}: ${item.name} ×${item.qty}${priceText}`;
    }).join('\n');

    const message = [
      'Förfrågan från prissidan:',
      '',
      itemLines,
      '',
      `Startkostnad: ${fmtKr(sumOnce)}`,
      `Löpande per månad: ${fmtKr(sumMonthly)}/mån`,
      `Totalt månad 1: ${fmtKr(sumOnce + sumMonthly)} ex. moms`,
      `Totalt avtalsvärde: ${fmtKr(sumContract)} ex. moms`,
      '',
      'Jag vill gärna bli kontaktad med nästa steg och en tydlig rekommendation.'
    ].join('\n');

    try {
      sessionStorage.setItem('plasma_cart_request', JSON.stringify({
        source: 'priser',
        service,
        message,
        items: cart,
        createdAt: new Date().toISOString()
      }));
    } catch (error) {
      console.warn('Kunde inte spara kundkorg inför kontaktformulär.', error);
    }

    const params = new URLSearchParams({ cart: '1', service });
    window.location.href = `/kontakt/?${params.toString()}#contact-form`;
  }

  // Expose globally
  window.openCart = openCart;
  window.closeCart = closeCart;
  window.clearCart = clearCart;
  window.goCheckout = goCheckout;
  window.setWebTerm = setWebTerm;
  window._cartRemove = removeFromCart;
  window._cartChangeQty = changeQty;

  // Init after DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setWebTerm(webTermMonths, document.querySelector('#web-toggle button.on'));
      wireCartControls();
      wireButtons();
      updateCartUI();
    });
  } else {
    setWebTerm(webTermMonths, document.querySelector('#web-toggle button.on'));
    wireCartControls();
    wireButtons();
    updateCartUI();
  }
})();
