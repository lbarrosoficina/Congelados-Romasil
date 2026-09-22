const money = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 });
const CART_STORAGE_KEY = 'romasil-session-cart';
let storedCart = [];
try {
  const parsedCart = JSON.parse(sessionStorage.getItem(CART_STORAGE_KEY) || '[]');
  if (Array.isArray(parsedCart)) storedCart = parsedCart;
} catch {
  storedCart = [];
}
const cart = new Map(storedCart.map(item => [item.id, item]));
const drawer = document.querySelector('#cartDrawer');
const backdrop = document.querySelector('#drawerBackdrop');
const cartItems = document.querySelector('#cartItems');
const cartSummary = document.querySelector('#cartSummary');
const cartCount = document.querySelector('#cartCount');
const cartTotal = document.querySelector('#cartTotal');
const toast = document.querySelector('#toast');
const checkoutDialog = document.querySelector('#checkoutDialog');

function persistCart() {
  try {
    sessionStorage.setItem(CART_STORAGE_KEY, JSON.stringify([...cart.values()]));
  } catch {
    // El carrito sigue funcionando en memoria si el navegador bloquea el almacenamiento.
  }
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove('show'), 2200);
}

function openCart() {
  drawer.classList.add('open');
  drawer.setAttribute('aria-hidden', 'false');
  backdrop.hidden = false;
  document.body.style.overflow = 'hidden';
  document.querySelector('#closeCart').focus();
}

function closeCart() {
  drawer.classList.remove('open');
  drawer.setAttribute('aria-hidden', 'true');
  backdrop.hidden = true;
  document.body.style.overflow = '';
}

function renderCart() {
  const items = [...cart.values()];
  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  cartCount.textContent = count;
  document.querySelector('#openCart').setAttribute('aria-label', `Abrir carrito, ${count} productos`);
  cartSummary.hidden = items.length === 0;
  cartTotal.textContent = money.format(total);
  if (!items.length) {
    cartItems.innerHTML = '<div class="empty-cart"><span>❄</span><h3>Tu pedido está vacío</h3><p>Agrega productos del catálogo para comenzar.</p></div>';
    return;
  }
  cartItems.innerHTML = items.map(item => `
    <div class="cart-line">
      <div><h3>${item.name}</h3><p>${money.format(item.price)} c/u</p><div class="quantity"><button type="button" data-action="decrease" data-id="${item.id}" aria-label="Quitar una unidad">−</button><strong>${item.quantity}</strong><button type="button" data-action="increase" data-id="${item.id}" aria-label="Agregar una unidad">+</button></div><button class="remove" type="button" data-action="remove" data-id="${item.id}">Eliminar</button></div>
      <strong>${money.format(item.price * item.quantity)}</strong>
    </div>`).join('');
}

document.querySelectorAll('.add-button').forEach(button => button.addEventListener('click', () => {
  const card = button.closest('.product-card');
  const id = card.dataset.id;
  const existing = cart.get(id);
  cart.set(id, { id, name: card.dataset.name, price: Number(card.dataset.price), quantity: existing ? existing.quantity + 1 : 1 });
  persistCart();
  renderCart();
  showToast(`${card.dataset.name} agregado`);
}));

cartItems.addEventListener('click', event => {
  const button = event.target.closest('button[data-action]');
  if (!button) return;
  const item = cart.get(button.dataset.id);
  if (!item) return;
  if (button.dataset.action === 'increase') item.quantity += 1;
  if (button.dataset.action === 'decrease') item.quantity -= 1;
  if (button.dataset.action === 'remove' || item.quantity <= 0) cart.delete(item.id);
  persistCart();
  renderCart();
});

document.querySelectorAll('.filter').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('.filter').forEach(item => { item.classList.remove('active'); item.setAttribute('aria-pressed', 'false'); });
  button.classList.add('active');
  button.setAttribute('aria-pressed', 'true');
  const filter = button.dataset.filter;
  let visibleProducts = 0;
  document.querySelectorAll('.product-card').forEach(card => {
    card.hidden = filter !== 'todos' && card.dataset.category !== filter;
    if (!card.hidden) visibleProducts += 1;
  });
  const emptyState = document.querySelector('#filterEmpty');
  if (emptyState) emptyState.hidden = visibleProducts > 0;
}));

document.querySelector('#openCart').addEventListener('click', openCart);
document.querySelector('#closeCart').addEventListener('click', closeCart);
backdrop.addEventListener('click', closeCart);
document.addEventListener('keydown', event => { if (event.key === 'Escape' && drawer.classList.contains('open')) closeCart(); });
document.querySelector('#checkoutButton').addEventListener('click', () => { closeCart(); checkoutDialog.showModal(); });
document.querySelector('#closeDialog').addEventListener('click', () => checkoutDialog.close());
document.querySelector('#checkoutForm').addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const items = [...cart.values()].map(item => `${item.quantity} × ${item.name}`).join('\n');
  const total = [...cart.values()].reduce((sum, item) => sum + item.price * item.quantity, 0);
  const summary = `Solicitud de pedido\nNombre: ${data.get('name')}\nTeléfono: ${data.get('phone')}\nComuna: ${data.get('commune')}\n\n${items}\n\nSubtotal referencial: ${money.format(total)}`;
  navigator.clipboard?.writeText(summary);
  checkoutDialog.close();
  showToast('Resumen copiado. Ya puedes enviarlo al vendedor.');
});
const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();
renderCart();
