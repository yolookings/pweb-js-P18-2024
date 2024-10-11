document.addEventListener("DOMContentLoaded", function () {
  const productGrid = document.querySelector(".display-card");
  const categoryFilter = document.getElementById("category-filter");
  const itemsPerPageSelect = document.getElementById("items-per-page");
  const paginationContainer = document.getElementById("pagination");
  const cartContainer = document.getElementById("cart");
  let allProducts = [];
  let currentPage = 1;
  let itemsPerPage = 6;
  let cart = [];
  let cartItemCount = 0;

  // Load cart from localStorage
  function loadCart() {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      cart = JSON.parse(storedCart);
    }
    displayCart();
  }

  // Save cart to localStorage
  function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  // Fetch products from API
  function fetchProducts() {
    fetch("https://dummyjson.com/products?limit=50")
      .then((res) => res.json())
      .then((data) => {
        allProducts = data.products; // Directly use products from the API
        setupCategoryFilter();
        displayProducts();
      })
      .catch((error) => console.error("Error fetching products:", error));
  }

  // Cart icon click scroll
    document.querySelector('.cart-icon i.bxs-cart').addEventListener("click", function() {
      document.getElementById("cart-section").scrollIntoView({
          behavior: 'smooth'
      });
  });
  
  function setupCategoryFilter() {
    // Extract categories from the API products
    const categories = ["All", ...new Set(allProducts.map((product) => product.category))];

    // Render categories into the filter
    categoryFilter.innerHTML = categories
      .map((category) => `<option value="${category}">${category}</option>`)
      .join("");
  }

  function displayProducts() {
    const filteredProducts =
      categoryFilter.value === "All"
        ? allProducts
        : allProducts.filter(
            (product) => product.category === categoryFilter.value
          );

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const productsToDisplay = filteredProducts.slice(startIndex, endIndex);

    productGrid.innerHTML = productsToDisplay
      .map(
        (product) => `
          <div class="card">
            <img class="img-card" src="${product.thumbnail}" alt="${
              product.title
            }">
            <div class="text-card">
              <p class="name-card">${product.title}</p>
              <p>${product.description}</p>
              <p class="price-card">Price: $${product.price.toFixed(
                2
              )}</p> <!-- Harga di bawah deskripsi -->
            </div>
            <div class="bg-button">
              <button class="button-card" onclick="addToCart(${
                product.id
              })">Add to Cart</button>
            </div>
          </div>
        `
      )
      .join("");

    updatePagination(filteredProducts.length);
  }

  function updatePagination(totalItems) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    let paginationHTML = "";

    if (currentPage > 1) {
      paginationHTML += `<button onclick="changePage(${
        currentPage - 1
      })">Previous</button>`;
    }

    for (let i = 1; i <= totalPages; i++) {
      paginationHTML += `<button onclick="changePage(${i})" ${
        i === currentPage ? "disabled" : ""
      }>${i}</button>`;
    }

    if (currentPage < totalPages) {
      paginationHTML += `<button onclick="changePage(${
        currentPage + 1
      })">Next</button>`;
    }

    paginationContainer.innerHTML = paginationHTML;
  }

  // Function to change page
  window.changePage = function (pageNumber) {
    currentPage = pageNumber;
    displayProducts();
  };

  // Function to add product to cart
  window.addToCart = function (productId) {
    const product = allProducts.find((product) => product.id === productId);
    const cartItem = cart.find((item) => item.id === productId);

    if (cartItem) {
      cartItem.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    saveCart(); // Save cart to localStorage
    displayCart();
    alert(`Produk "${product.title}" telah ditambahkan ke keranjang.`);
  };

  // Function to remove product from cart
  window.removeFromCart = function (productId) {
    cart = cart.filter((item) => item.id !== productId);
    saveCart(); // Save cart to localStorage
    displayCart();
  };

  // Function to update product quantity in cart
  window.updateCartQuantity = function (productId, amount) {
    const cartItem = cart.find((item) => item.id === productId);

    if (cartItem) {
      cartItem.quantity += amount;
      if (cartItem.quantity <= 0) {
        removeFromCart(productId);
      }
    }

    saveCart(); // Save cart to localStorage
    displayCart();
  };

  function updateCartSummary() {
    const totalProducts = cart.reduce(
      (total, item) => total + item.quantity,
      0
    );
    const totalPrice = cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    document.getElementById("total-products").innerText = totalProducts;
    document.getElementById("total-price").innerText = totalPrice.toFixed(2);
  }

  // Function to display the cart
  function displayCart() {
    if (cart.length === 0) {
      cartContainer.innerHTML = "<p>Your cart is empty.</p>";
      document.getElementById("cart-summary").style.display = "none"; // Hide summary when cart is empty
      return;
    }

    cartContainer.innerHTML = cart
      .map(
        (item) => `
        <div class="cart-item">
            <img class="cart-img" src="${item.thumbnail}" alt="${item.title}">
            <div class="cart-details">
                <p>${item.title}</p>
                <p>Quantity: ${item.quantity}</p>
                <p>Price: $${item.price}</p>
            </div>
            <div class="cart-controls">
                <button onclick="updateCartQuantity(${item.id}, 1)">+</button>
                <button onclick="updateCartQuantity(${item.id}, -1)">-</button>   
            </div>
            <div class="cart-controls-remove">
                <button onclick="removeFromCart(${item.id})">Remove</button>
            </div>
        </div>
      `
      )
      .join("");

    document.getElementById("cart-summary").style.display = "block"; // Show summary when cart has items
    updateCartSummary(); // Update the total products and price
  }

  // Category filter change event
  categoryFilter.addEventListener("change", () => {
    currentPage = 1;
    displayProducts();
  });

  // Items per page change event
  itemsPerPageSelect.addEventListener("change", (e) => {
    itemsPerPage = parseInt(e.target.value);
    currentPage = 1;
    displayProducts();
  });

  const checkoutButton = document.getElementById("checkout-btn");
  checkoutButton.addEventListener("click", function () {
    if (cart.length > 0) {
      alert("Terima kasih telah berbelanja di GreenOasis!");
      // Optionally, clear the cart after checkout
      cart = [];
      displayCart();
      updateCartSummary();
    } else {
      alert("Keranjang belanja Anda kosong.");
    }
  });

  fetchProducts();
  loadCart(); // Load cart from localStorage when the page loads
});
