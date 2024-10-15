document.addEventListener("DOMContentLoaded", function () {
  const cartInfoContainer = document.querySelector(".cart-info");
  const requiredFields = document.querySelectorAll(
    "#checkoutForm input[required], #checkoutForm select[required]"
  );

  requiredFields.forEach((field) => {
    field.addEventListener("input", () => {
      if (field.value.trim() !== "") {
        const feedback = field.nextElementSibling;
        if (feedback && feedback.classList.contains("invalid-feedback")) {
          feedback.style.display = "none";
        }
      } else {
        const feedback = field.nextElementSibling;
        if (feedback && feedback.classList.contains("invalid-feedback")) {
          feedback.style.display = "block";
        }
      }
    });
  });

  function loadCart() {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      const cart = JSON.parse(storedCart);
      displayCart(cart);
    } else {
      cartInfoContainer.innerHTML = "<p>Your cart is empty.</p>";
    }
  }

  function displayCart(cart) {
    if (cart.length === 0) {
      cartInfoContainer.innerHTML = "<p>Your cart is empty.</p>";
      return;
    }

    cartInfoContainer.innerHTML = cart
      .map(
        (item) => `
          <div class="cart-item">
              <img class="cart-img" src="${item.thumbnail}" alt="${item.title}">
              <div class="cart-details">
                <p class="cart-item-title">${item.title}</p>
                <p>Quantity: ${item.quantity}</p>
                <p>Price: $${item.price}</p>
              </div>
          </div>
        `
      )
      .join("");

    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    const totalPrice = cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    const cartSummaryHTML = `
        <hr>
        <div class="cart-summary">
            <p>Total Items: ${totalItems}</p>
            <p>Total Price: $${totalPrice.toFixed(2)}</p>
        </div>
      `;
    cartInfoContainer.insertAdjacentHTML("beforeend", cartSummaryHTML);
  }

  loadCart();
});
