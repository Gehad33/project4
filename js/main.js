document.addEventListener("DOMContentLoaded", () => {
  const books = [
    {
      id: 1,
      title: "Journey of the Silent Star",
      price: 14,
      category: "Fantasy",
      img: "images/photo1.jpeg",
    },
    {
      id: 2,
      title: "Codecraft: Patterns & Magic",
      price: 28,
      category: "Programming",
      img: "images/images8.jpeg",
    },
    {
      id: 3,
      title: "Whispers in the Old Library",
      price: 18,
      category: "Mystery",
      img: "images/images3.jpeg",
    },
    {
      id: 4,
      title: "Pixels and Prophecies",
      price: 24,
      category: "Programming",
      img: "images/images5.jpeg",
    },
    {
      id: 5,
      title: "The Quiet Ocean of Thoughts",
      price: 16,
      category: "Philosophy",
      img: "images/images8.jpeg",
    },
    {
      id: 6,
      title: "Algorithms of Destiny",
      price: 32,
      category: "Programming",
      img: "images/images13.jpeg",
    },
    {
      id: 7,
      title: "Garden of Forgotten Maps",
      price: 20,
      category: "Adventure",
      img: "images/images14.jpeg",
    },
    {
      id: 8,
      title: "Mindforge: Building Better Habits",
      price: 19,
      category: "Self-Help",
      img: "images/image6.jpeg",
    },
    {
      id: 9,
      title: "Echoes of the Neon City",
      price: 22,
      category: "Sci-Fi",
      img: "images/photo1.jpeg",
    },
  ];

  localStorage.setItem("booksData", JSON.stringify(books));

  const listEl = document.getElementById("books-list");
  const userArea = document.getElementById("user-area");
  const searchInput = document.getElementById("searchInput");
  const noResults = document.getElementById("no-results");

  let user = JSON.parse(localStorage.getItem("user")) || null;
  if (user && !user.cart) user.cart = [];
  if (user && !user.favorites) user.favorites = [];

  function saveUser() {
    localStorage.setItem("user", JSON.stringify(user));
  }

  function renderUserArea() {
    if (!user) {
      userArea.innerHTML = `
        <a href="login.html" class="btn btn-outline-primary btn-sm me-2">Login</a>
        <a href="register.html" class="btn btn-primary btn-sm">Register</a>
      `;
    } else {
      const cartCount = (user.cart || []).reduce(
        (sum, item) => sum + item.quantity,
        0
      );
      userArea.innerHTML = `
        <span class="me-3">Hello, <strong>${user.firstName}</strong></span>
        <a href="#" id="cartIcon" class="position-relative me-3 text-dark fs-5">
          <i class="bi bi-cart-fill"></i>
          <span id="cartCount" class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">${cartCount}</span>
        </a>
        <button class="btn btn-danger btn-sm" id="logoutBtn">Logout</button>
      `;
      document.getElementById("logoutBtn").addEventListener("click", () => {
        localStorage.removeItem("user");
        user = null;
        renderUserArea();
        renderBooks(books);
      });
    }
  }
  renderUserArea();

  const isFav = (id) =>
    user && (user.favorites || []).some((fid) => fid === id);

  function renderBooks(items) {
    listEl.innerHTML = "";
    items.forEach((b) => {
      const inCart = user && user.cart.find((item) => item.id === b.id);
      const fav = isFav(b.id);
      const col = document.createElement("div");
      col.className = "col-md-4 mb-4";
      col.innerHTML = `
        <div class="book-card border rounded-3 shadow-sm p-3 bg-white">
          <img src="${b.img}" class="w-100 rounded mb-3" alt="${b.title}">
          <div class="info text-start">
            <p><strong>Name:</strong> ${b.title}</p>
            <p><strong>Category:</strong> ${b.category}</p>
            <p><strong>Price:</strong> $${b.price}</p>
          </div>
          <div class="d-flex justify-content-between align-items-center mt-2">
            <button class="btn btn-sm ${
              inCart ? "btn-danger" : "btn-primary"
            } add-to-cart" data-id="${b.id}">
              ${inCart ? "Remove from Cart" : "Add to Cart"}
            </button>
            <i class="fs-4 heart-icon ${
              fav
                ? "bi bi-heart-fill text-danger"
                : "bi bi-heart text-secondary"
            }" data-id="${b.id}"></i>
          </div>
        </div>`;
      listEl.appendChild(col);
    });
  }
  renderBooks(books);

  function updateCartCount() {
    const count = user
      ? (user.cart || []).reduce((sum, item) => sum + item.quantity, 0)
      : 0;
    const countEl = document.getElementById("cartCount");
    if (countEl) countEl.textContent = count;
  }

  const cartSidebar = document.getElementById("cart-sidebar");
  const closeCartBtn = document.getElementById("closeCart");

  function showCartSidebar() {
    const list = document.getElementById("cart-items");
    const totalDiv = document.getElementById("cart-total");
    if (!cartSidebar || !list) return;

    list.innerHTML = "";
    let total = 0;

    if (!user || !user.cart.length) {
      list.innerHTML = "<p class='text-muted'>Your cart is empty.</p>";
      totalDiv.textContent = "";
    } else {
      user.cart.forEach((cartItem) => {
        const book = books.find((b) => b.id === cartItem.id);
        if (book) {
          total += book.price * cartItem.quantity;
          const li = document.createElement("li");
          li.className =
            "cart-item d-flex justify-content-between align-items-center mb-2";
          li.innerHTML = `
            <div>
              <div class="fw-bold">${book.title}</div>
              <div class="text-muted">Price: $${book.price}</div>
            </div>
            <div class="d-flex align-items-center gap-2">
              <button class="btn btn-sm btn-outline-secondary qty-btn" data-id="${book.id}" data-action="minus">-</button>
              <span>${cartItem.quantity}</span>
              <button class="btn btn-sm btn-outline-secondary qty-btn" data-id="${book.id}" data-action="plus">+</button>
              <button class="btn btn-sm btn-outline-danger remove-item" data-id="${book.id}"><i class="bi bi-x"></i></button>
            </div>`;
          list.appendChild(li);
        }
      });
      totalDiv.textContent = `Total: $${total.toFixed(2)}`;
    }

    cartSidebar.style.display = "block";

    const viewBtn = document.getElementById("viewAllBtn");
    if (viewBtn) viewBtn.onclick = () => (window.location.href = "cart.html");
  }

  // غلق السلة عند الضغط على X
  if (closeCartBtn) {
    closeCartBtn.addEventListener("click", () => {
      cartSidebar.style.display = "none";
    });
  }

  // غلق عند الضغط خارج السلة
  document.addEventListener("click", (e) => {
    if (
      cartSidebar.style.display === "block" &&
      !cartSidebar.contains(e.target) &&
      e.target.id !== "cartIcon" &&
      !e.target.closest("#cartIcon")
    ) {
      cartSidebar.style.display = "none";
    }
  });

  document.addEventListener("click", (e) => {
    // Add/remove cart
    if (e.target.classList.contains("add-to-cart")) {
      if (!user) return (window.location.href = "login.html");
      const id = Number(e.target.dataset.id);
      const inCart = user.cart.find((item) => item.id === id);
      if (inCart) user.cart = user.cart.filter((item) => item.id !== id);
      else user.cart.push({ id, quantity: 1 });
      saveUser();
      renderBooks(books);
      updateCartCount();
      showCartSidebar();
    }

    // open cart
    if (e.target.id === "cartIcon" || e.target.closest?.("#cartIcon")) {
      e.preventDefault();
      showCartSidebar();
    }

    // qty buttons
    if (e.target.classList.contains("qty-btn")) {
      const id = Number(e.target.dataset.id);
      const action = e.target.dataset.action;
      const item = user.cart.find((i) => i.id === id);
      if (item) {
        if (action === "plus") item.quantity++;
        if (action === "minus") item.quantity--;
        if (item.quantity <= 0)
          user.cart = user.cart.filter((i) => i.id !== id);
        saveUser();
        showCartSidebar();
        updateCartCount();
      }
    }

    // remove from cart
    if (e.target.classList.contains("remove-item")) {
      const id = Number(e.target.dataset.id);
      user.cart = user.cart.filter((item) => item.id !== id);
      saveUser();
      showCartSidebar();
      updateCartCount();
      renderBooks(books);
    }

    // Toggle Favorite
    if (e.target.classList.contains("heart-icon")) {
      if (!user) return (window.location.href = "login.html");
      const id = Number(e.target.dataset.id);
      if (!user.favorites) user.favorites = [];
      const idx = user.favorites.indexOf(id);
      if (idx > -1) user.favorites.splice(idx, 1);
      else user.favorites.push(id);
      saveUser();
      renderBooks(books);
    }
  });

  // البحث
  const searchBtn = document.getElementById("searchBtn");
  if (searchBtn) searchBtn.addEventListener("click", performSearch);
  if (searchInput)
    searchInput.addEventListener("keyup", (e) => {
      if (e.key === "Enter") performSearch();
    });

  function performSearch() {
    const query = (searchInput?.value || "").trim().toLowerCase();
    if (!query) {
      renderBooks(books);
      if (noResults) noResults.style.display = "none";
      return;
    }
    const filtered = books.filter(
      (b) =>
        b.title.toLowerCase().includes(query) ||
        b.category.toLowerCase().includes(query)
    );
    renderBooks(filtered);
    if (noResults) noResults.style.display = filtered.length ? "none" : "block";
  }
});
