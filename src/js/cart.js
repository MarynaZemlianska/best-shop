document.addEventListener("DOMContentLoaded", () => {
  const cartItemsContainer = document.querySelector(".cart-items-container");
  const cartCountElem = document.querySelector(".cart-count");
  const subtotalElem = document.querySelector(".subtotal");
  const totalElem = document.querySelector(".total-amount");
  const clearCartBtn = document.querySelector(".clear-cart");

  function loadCart() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cartItemsContainer.innerHTML = `
      <div class="cart-grid-header">
        <div>Image</div>
        <div>Product Name</div>
        <div>Price</div>
        <div>Quantity</div>
        <div>Total</div>
        <div>Delete</div>
      </div>
    `;

    let subTotal = 0;

    cart.forEach((item, index) => {
      const total = item.price * item.quantity;
      subTotal += total;

      const cartItem = document.createElement("div");
      cartItem.classList.add("cart-item");
      cartItem.innerHTML = `
        <img src="${item.img}" alt="${item.name}" class="cart-img">
        <div class="product-info">
          <h3>${item.name}</h3>
        </div>
        <div class="price">$${item.price}</div>
        <div class="quantity">
          <button class="minus">−</button>
          <span>${item.quantity}</span>
          <button class="plus">+</button>
        </div>
        <div class="total">$${total}</div>
        <div class="delete-btn">🗑️</div>
      `;
      cartItemsContainer.appendChild(cartItem);

  
      cartItem.querySelector(".plus").addEventListener("click", () => {
        item.quantity++;
        localStorage.setItem("cart", JSON.stringify(cart));
        loadCart();
      });

      cartItem.querySelector(".minus").addEventListener("click", () => {
        if (item.quantity > 1) item.quantity--;
        localStorage.setItem("cart", JSON.stringify(cart));
        loadCart();
      });

      cartItem.querySelector(".delete-btn").addEventListener("click", () => {
        cart.splice(index, 1);
        localStorage.setItem("cart", JSON.stringify(cart));
        loadCart();
      });
    });

    cartCountElem.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    subtotalElem.textContent = `$${subTotal}`;
    totalElem.textContent = `$${subTotal}`;
  }

  clearCartBtn.addEventListener("click", () => {
    localStorage.removeItem("cart");
    loadCart();
  });

  loadCart();
});
