let cartData = JSON.parse(localStorage.getItem('cartData')) || [];

function calculateCartIcon() {
  let cartIcon = document.getElementById('cart-icon');
  cartIcon.innerText = cartData
    .map(x => x.quantity)
    .reduce((x, y) => x + y, 0);
}

calculateCartIcon();

async function loadCartData() {
  const products = await fetch('./cart.json').then(res => res.json());

  const cartContainer = document.querySelector('.cart-items');
  cartContainer.innerHTML = ''; // Clear existing items

  cartData.forEach(cartItem => {
    const product = products.find(p => p.id === cartItem.id);

    if (product) {
      const itemHTML = `
        <div class="cart-item" data-id="${cartItem.id}" data-base-price="${parseFloat(product.price.replace(',', ''))}">
          <img src="${product.img}" alt="${product.name}" class="product-image" />
          <div class="product-details">
            <h3>${product.name}</h3>
            <div class="priceincart">₹${product.price}</div>
            <div class="quantity-controls">
              <button class="quantity-btn">-</button>
              <span>${cartItem.quantity}</span>
              <button class="quantity-btn">+</button>
            </div>
            <div class="button-group">
              <button class="remove-btn">Remove</button>
            </div>
          </div>
        </div>
      `;

      cartContainer.insertAdjacentHTML('afterbegin', itemHTML);
    }
  });

  setupEventListeners();
  updateTotalPrice();
}

function updateTotalPrice() {
  let totalBasePrice = 0;

  document.querySelectorAll('.cart-item').forEach(item => {
    const quantity = parseInt(item.querySelector('.quantity-controls span').textContent);
    const basePrice = parseFloat(item.dataset.basePrice);
    totalBasePrice += basePrice * quantity;
  });

  document.querySelector('.total-price').textContent = `₹${totalBasePrice}`;
}

function setupEventListeners() {
  document.querySelectorAll('.quantity-btn').forEach(button => {
    button.addEventListener('click', function () {
      const item = this.closest('.cart-item');
      const quantitySpan = item.querySelector('.quantity-controls span');
      let quantity = parseInt(quantitySpan.textContent);
      const itemId = cartData.find(cartItem => cartItem.id === item.dataset.id);

      if (this.textContent === '+' && quantity < 10) {
        quantity++;
        
      } else if (this.textContent === '-' && quantity > 1) {
        quantity--;
      }

      // Update the quantity in the cartData
      if (itemId) {
        itemId.quantity = quantity;  // Update the quantity in cartData
        localStorage.setItem('cartData', JSON.stringify(cartData));  // Update local storage
      }

      quantitySpan.textContent = quantity;
      updateTotalPrice();
      calculateCartIcon();
    });
  });

  document.querySelectorAll('.remove-btn').forEach(button => {
    button.addEventListener('click', function () {
      const item = this.closest('.cart-item');
      const itemId = item.dataset.id;

      // Remove from cartData and update local storage
      cartData = cartData.filter(cartItem => cartItem.id !== itemId);
      localStorage.setItem('cartData', JSON.stringify(cartData));

      item.remove();
      updateTotalPrice();
      calculateCartIcon();
    });
  });
}

window.onload = loadCartData;
