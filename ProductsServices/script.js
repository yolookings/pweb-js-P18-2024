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
    fetch("https://dummyjson.com/products?limit=100")
      .then((res) => res.json())
      .then((data) => {
        allProducts = data.products;
        setupCategoryFilter();
        displayProducts();
      })
      .catch((error) => console.error("Error fetching products:", error));
  }

  function setupCategoryFilter() {
    const categories = [
      "All",
      ...new Set(allProducts.map((product) => product.category)),
    ];
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
              <img class="img-card" src="${product.thumbnail}" alt="${product.title}">
              <div class="text-card">
                  <p class="name-card">${product.title}</p>
                  <p>${product.description}</p>
                  <p>Category: ${product.category}</p>
              </div>
              <div class="bg-button">
                  <button class="button-card" onclick="addToCart(${product.id})">Add to Cart</button>
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
      paginationHTML += `<button onclick="changePage(${currentPage - 1})">Previous</button>`;
    }

    for (let i = 1; i <= totalPages; i++) {
      paginationHTML += `<button onclick="changePage(${i})" ${
        i === currentPage ? "disabled" : ""
      }>${i}</button>`;
    }

    if (currentPage < totalPages) {
      paginationHTML += `<button onclick="changePage(${currentPage + 1})">Next</button>`;
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

  // Function to display the cart
  function displayCart() {
    if (cart.length === 0) {
      cartContainer.innerHTML = "<p>Your cart is empty.</p>";
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
                  <button onclick="removeFromCart(${item.id})">Remove</button>
              </div>
          </div>
        `
      )
      .join("");
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

  fetchProducts();
  loadCart(); // Load cart from localStorage when the page loads
});
