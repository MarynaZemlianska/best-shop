document.addEventListener('DOMContentLoaded', () => {
  const selectedProductsGrid = document.querySelector('.selected-products-grid');
  const newArrivalsGrid = document.querySelector('.new-arrivals-grid');
  const cartCountEl = document.querySelector('.cart-count');

  // Функция обновления счётчика корзины
  function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    cartCountEl.textContent = totalItems;
  }

  // Функция создания карточки товара
  function createCard(product, type) {
    const card = document.createElement('article');
    card.className = 'card-item';

    const cardImg = document.createElement('div');
    cardImg.className = 'card-img';
    cardImg.style.backgroundImage = `url(${product.imageUrl})`;

    const cardContent = document.createElement('div');
    cardContent.className = 'card-content';

    const title = document.createElement('h4');
    title.textContent = product.name;

    const price = document.createElement('div');
    price.className = 'price';
    price.textContent = `$${product.price}`;

    const btn = document.createElement('button');
    btn.className = 'btn';

    if (type === 'cart') {
      btn.textContent = 'Add to Cart';
      btn.addEventListener('click', () => {
        let cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const existingItem = cart.find(item => item.id === product.id);
        if (existingItem) {
          existingItem.quantity = (existingItem.quantity || 1) + 1;
        } else {
          cart.push({ ...product, quantity: 1 });
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        alert(`${product.name} added to cart`);
      });
    } else if (type === 'view') {
      btn.textContent = 'View Product';
      btn.addEventListener('click', () => {
        localStorage.setItem('selectedProduct', JSON.stringify(product));
        window.location.href = '/src/html/product-card.html';
      });
    }

    cardContent.append(title, price, btn);
    card.append(cardImg, cardContent);
    return card;
  }

  // Загрузка товаров
  fetch('./assets/data/products.json')
    .then(res => res.json())
    .then(data => {
      const products = data.data;

      // Selected Products
      products.filter(p => p.blocks.includes('Selected Products'))
              .forEach(p => selectedProductsGrid.appendChild(createCard(p, 'cart')));

      // New Products Arrival
      products.filter(p => p.blocks.includes('New Products Arrival'))
              .forEach(p => newArrivalsGrid.appendChild(createCard(p, 'view')));

      updateCartCount();
    })
    .catch(err => console.error('Error loading products:', err));
});
