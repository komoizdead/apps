const products = [
  { id: 'q20i', name: 'Soundcore Q20i', detail: 'Hybrid noise cancelling headphones', price: 3490, tag: 'BESTSELLER', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=80' },
  { id: 'hub', name: 'Anker 7-in-1 Hub', detail: 'Desk-ready USB-C expansion', price: 2690, tag: 'WORK MODE', image: 'https://images.unsplash.com/photo-1625842268584-8f3296236761?auto=format&fit=crop&w=700&q=80' },
  { id: 'lamp', name: 'Glow Mini Lamp', detail: 'Warm light, tiny footprint', price: 1290, tag: 'NEW', image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=700&q=80' },
  { id: 'stand', name: 'Fold Phone Stand', detail: 'A better angle for every screen', price: 790, tag: 'EVERYDAY', image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&w=700&q=80' }
];
const productGrid = document.querySelector('#productGrid');
const bagCount = document.querySelector('#bagCount');
const citySelect = document.querySelector('#citySelect');
const shippingCost = document.querySelector('#shippingCost');
const orderTotal = document.querySelector('#orderTotal');
const orderForm = document.querySelector('#orderForm');
const formMessage = document.querySelector('#formMessage');
let bag = [];

const formatPrice = (price) => `৳${price.toLocaleString('en-BD')}`;

function renderProducts() {
  productGrid.innerHTML = products.map((product) => `<article class="product-card"><div class="product-image"><img src="${product.image}" alt="${product.name}" loading="lazy" /><span class="product-tag">${product.tag}</span></div><div class="product-info"><div><h3>${product.name}</h3><p>${product.detail}</p></div><span class="price">${formatPrice(product.price)}</span></div><button class="add-button" type="button" data-product="${product.id}">Add to bag +</button></article>`).join('');
}

function updateTotals() {
  const shipping = citySelect.value === 'dhaka' ? 80 : 140;
  const subtotal = bag.reduce((total, id) => total + products.find((product) => product.id === id).price, 0);
  shippingCost.textContent = formatPrice(shipping);
  orderTotal.textContent = formatPrice(subtotal ? subtotal + shipping : 0);
  bagCount.textContent = bag.length;
}

function track(eventName, data = {}) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: eventName, ...data });
  if (typeof window.fbq === 'function') window.fbq('track', eventName, data);
  // Production CAPI endpoint can consume this same event payload server-side.
}

document.addEventListener('click', (event) => {
  const addButton = event.target.closest('[data-product]');
  if (addButton) {
    const productId = addButton.dataset.product;
    bag.push(productId);
    addButton.textContent = 'Added to bag ✓';
    addButton.classList.add('added');
    updateTotals();
    track('AddToCart', { productId });
    document.querySelector('#order').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  const scrollButton = event.target.closest('[data-scroll]');
  if (scrollButton) document.querySelector(`#${scrollButton.dataset.scroll}`).scrollIntoView({ behavior: 'smooth' });

  const modalButton = event.target.closest('[data-modal]');
  if (modalButton) document.querySelector(`#${modalButton.dataset.modal}`).hidden = false;
  if (event.target.matches('[data-close]') || event.target.classList.contains('modal')) event.target.closest('.modal').hidden = true;
});

citySelect.addEventListener('change', () => {
  updateTotals();
  track('ShippingCitySelected', { city: citySelect.value });
});

orderForm.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!bag.length) {
    formMessage.textContent = 'Add a product to your bag first.';
    return;
  }
  const formData = new FormData(orderForm);
  track('Lead', { city: formData.get('city'), payment: formData.get('payment'), value: orderTotal.textContent });
  formMessage.textContent = 'Thanks! We will call to confirm your order shortly.';
  orderForm.reset();
  bag = [];
  document.querySelectorAll('.add-button').forEach((button) => { button.textContent = 'Add to bag +'; button.classList.remove('added'); });
  updateTotals();
});

renderProducts();
updateTotals();
track('PageView');
