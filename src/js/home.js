/**
 * Home page: renders Selected Products / New Products Arrival from JSON,
 * assigns a random tagline to each Travel Suitcases tile, and handles the
 * (demo, no backend) newsletter signup.
 */
(function () {
  var TRAVEL_TAGLINES = [
    { title: 'Weekend Carry-ons', text: 'Light enough for the overhead bin, tough enough for the gate agent.' },
    { title: 'Everyday Suitcases', text: 'Our best-selling shells, built for years of frequent travel.' },
    { title: 'Family Luggage Sets', text: 'Matching sets that make packing for the whole family effortless.' },
    { title: "Kids' Luggage", text: 'Playful, durable rolling luggage sized just right for small travelers.' },
    { title: 'Business Ready', text: 'Slim profiles and quiet wheels for the frequent business flyer.' },
    { title: 'Adventure Proof', text: 'Impact-resistant shells that shrug off rough handling.' },
  ];

  function shuffleTravelTaglines() {
    var grid = document.getElementById('travelCardsGrid');
    if (!grid) return;
    var pool = TRAVEL_TAGLINES.slice().sort(function () { return Math.random() - 0.5; });
    grid.querySelectorAll('.card-content h4').forEach(function (heading, index) {
      var pick = pool[index % pool.length];
      var paragraph = heading.nextElementSibling;
      heading.textContent = pick.title;
      if (paragraph) paragraph.textContent = pick.text;
    });
  }

  function renderGrid(gridEl, statusEl, products, emptyMessage) {
    if (!gridEl) return;
    gridEl.innerHTML = '';
    if (!products.length) {
      if (statusEl) statusEl.textContent = emptyMessage;
      return;
    }
    if (statusEl) statusEl.remove();
    products.forEach(function (product) {
      gridEl.appendChild(window.BestShop.renderCard.createProductCard(product));
    });
  }

  function setupNewsletter() {
    var form = document.getElementById('newsletterForm');
    var status = document.getElementById('newsletterStatus');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var input = document.getElementById('newsletterEmail');
      var emailPattern = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
      if (!emailPattern.test(input.value.trim())) {
        status.textContent = 'Please enter a valid email address.';
        status.classList.add('is-error');
        return;
      }
      status.classList.remove('is-error');
      status.textContent = 'Thanks for subscribing! (demo — no email is actually sent)';
      form.reset();
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    shuffleTravelTaglines();
    setupNewsletter();

    var selectedGrid = document.getElementById('selectedProductsGrid');
    var selectedStatus = document.getElementById('selectedProductsStatus');
    var arrivalsGrid = document.getElementById('newArrivalsGrid');
    var arrivalsStatus = document.getElementById('newArrivalsStatus');

    window.BestShop.products.loadProducts()
      .then(function (products) {
        renderGrid(
          selectedGrid,
          selectedStatus,
          products.filter(function (p) { return p.blocks.includes('Selected Products'); }),
          'No selected products yet.'
        );
        renderGrid(
          arrivalsGrid,
          arrivalsStatus,
          products.filter(function (p) { return p.blocks.includes('New Products Arrival'); }),
          'No new arrivals yet.'
        );
      })
      .catch(function () {
        if (selectedStatus) selectedStatus.textContent = 'Could not load products. Please try again later.';
        if (arrivalsStatus) arrivalsStatus.textContent = 'Could not load products. Please try again later.';
      });
  });
})();
