function setTerm(type, months, btn) {
  document.getElementById(type+'-toggle').querySelectorAll('button').forEach(b=>b.classList.remove('on'));
  btn.classList.add('on');
  const extra = type==='ads' ? ' · annonsbudget tillkommer' : '';
  const note = (months===12 ? 'Minst 12 mån avtal' : months+' mån avtal')+' · ex. moms'+extra;
  const keys = type==='ads' ? ['bas','tillvaxt'] : ['lite','lokal','regional','nationell'];
  keys.forEach(k=>{
    const n=document.getElementById(type+'-'+k+'-note');
    const f=document.getElementById(type+'-'+k+'-free');
    if(n) n.textContent=note;
    if(f) f.textContent='';
  });
}

let webTermMonths = 24;
const webPackageTotals = {
  start: 19999,
  tillvaxt: 29999,
};

function calcWebMonthly(total, months) {
  return Math.ceil(total / months);
}

function fmtWebKr(n) {
  return n.toLocaleString('sv-SE').replace(/\s/g, ' ') + ' kr';
}

function getWebPackageState(key) {
  const contractValue = webPackageTotals[key];
  return {
    monthly: calcWebMonthly(contractValue, webTermMonths),
    termMonths: webTermMonths,
    contractValue,
  };
}

function setWebTerm(months, btn) {
  webTermMonths = months;
  document.getElementById('web-toggle').querySelectorAll('button').forEach(b => b.classList.remove('on'));
  if (btn) btn.classList.add('on');

  Object.keys(webPackageTotals).forEach(key => {
    const state = getWebPackageState(key);
    const price = document.getElementById(`web-${key}-price`);
    const note = document.getElementById(`web-${key}-note`);
    const total = document.getElementById(`web-${key}-total`);
    if (price) price.textContent = `${fmtWebKr(state.monthly)}/mån`;
    if (note) note.textContent = `${state.termMonths} mån avbetalning · ex. moms`;
    if (total) total.textContent = `Totalt avtalsvärde: ${fmtWebKr(state.contractValue)}`;
  });

  if (typeof products !== 'undefined') {
    products.forEach(product => {
      if (!product.webKey) return;
      Object.assign(product, getWebPackageState(product.webKey));
    });
  }

  if (typeof cart !== 'undefined') {
    cart.forEach(item => {
      if (!item.webKey) return;
      Object.assign(item, getWebPackageState(item.webKey));
    });
    updateCartUI();
  }
}

function wirePricingTerms() {
  document.querySelectorAll('[data-term-type][data-term-months]').forEach((button) => {
    button.addEventListener('click', () => {
      setTerm(button.dataset.termType, Number(button.dataset.termMonths), button);
    });
  });

  document.querySelectorAll('[data-web-term]').forEach((button) => {
    button.addEventListener('click', () => {
      setWebTerm(Number(button.dataset.webTerm), button);
    });
  });
}

window.setTerm = setTerm;
window.setWebTerm = setWebTerm;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', wirePricingTerms, { once: true });
} else {
  wirePricingTerms();
}
