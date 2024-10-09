// script.js
document.addEventListener("DOMContentLoaded", function () {
  const productGrid = document.querySelector(".display-card");
  const categoryFilter = document.getElementById("category-filter");
  const itemsPerPageSelect = document.getElementById("items-per-page");
  const paginationContainer = document.getElementById("pagination");
  let allProducts = [];
  let currentPage = 1;
  let itemsPerPage = 6;

  // Fetch products from API
  function fetchProducts() {
    fetch("https://dummyjson.com/products?limit=100")
      .then((res) => res.json())
      .then((data) => {
        allProducts = data.products.map((product) => ({
          ...product,
          title: generatePlantName(),
          category: generatePlantCategory(),
        }));
        setupCategoryFilter();
        displayProducts();
      })
      .catch((error) => console.error("Error fetching products:", error));
  }

  function generatePlantName() {
    const plantNames = [
      "Monstera Deliciosa",
      "Ficus Lyrata",
      "Sansevieria",
      "Philodendron",
      "Calathea Orbifolia",
      "Aloe Vera",
      "Pothos",
      "Spathiphyllum",
      "Chlorophytum Comosum",
      "Dracaena Marginata",
      "Zamioculcas Zamiifolia",
      "Ficus Elastica",
      "Epipremnum Aureum",
      "Chamaedorea Elegans",
    ];
    return plantNames[Math.floor(Math.random() * plantNames.length)];
  }

  function generatePlantCategory() {
    const categories = [
      "Tanaman Hias Dalam Ruangan",
      "Tanaman Hias Luar Ruangan",
      "Sukulen",
      "Tanaman Berbunga",
      "Tanaman Berdaun Indah",
      "Tanaman Herbal",
    ];
    return categories[Math.floor(Math.random() * categories.length)];
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
              <img class="img-card" src="../public/plants.png" alt="${product.title}">
              <div class="text-card">
                  <p class="name-card">${product.title}</p>
                  <p>${product.description}</p>
                  <p>Category: ${product.category}</p>
              </div>
              <div class="bg-button">
                  <a class="button-card" href="../ContactUs/contact.html">Beli Sekarang</a>
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

  // Expose changePage function globally
  window.changePage = function (page) {
    currentPage = page;
    displayProducts();
  };

  categoryFilter.addEventListener("change", () => {
    currentPage = 1;
    displayProducts();
  });

  itemsPerPageSelect.addEventListener("change", (e) => {
    itemsPerPage = parseInt(e.target.value);
    currentPage = 1;
    displayProducts();
  });

  fetchProducts();
});
