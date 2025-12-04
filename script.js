const productContainer = document.getElementById("product-container");
const cartCount = document.getElementById("cart-count");
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");

let cart = JSON.parse(localStorage.getItem("cart")) || [];


//LLAMAR API DE PRODUCTOS

async function loadProducts() {
    const res = await fetch("https://fakestoreapi.com/products");
    const data = await res.json();

    data.forEach(product => {
        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
            <img src="${product.image}" alt="${product.title}">
            <h3>${product.title}</h3>
            <p>$${product.price}</p>
            <button onclick="addToCart(${product.id}, '${product.title}', ${product.price}, '${product.image}')">Agregar al carrito</button>
        `;

        productContainer.appendChild(card);
    });
}

loadProducts();

//CARRITO
function addToCart(id, title, price, image) {
    const item = cart.find(p => p.id === id);

    if (item) {
        item.cantidad++;
    } else {
        cart.push({ id, title, price, image, cantidad: 1 });
    }

    saveCart();
    renderCart();
}

function renderCart() {
    cartItems.innerHTML = "";

    cart.forEach(item => {
        const div = document.createElement("div");
        div.className = "cart-item";

        div.innerHTML = `
            <img src="${item.image}" width="50">
            <p>${item.title}</p>
            <p>$${item.price}</p>
            <input
                type="number"
                value="${item.cantidad}"
                min="1"
                onchange="updateQuantity(${item.id}, this.value)"
            >
            <button onclick="removeItem(${item.id})">❌</button>
        `;

        cartItems.appendChild(div);
    });

    updateTotal();
}

function updateQuantity(id, qty) {
    const item = cart.find(p => p.id === id);
    item.cantidad = Number(qty);
    saveCart();
    updateTotal();
}

function removeItem(id) {
    cart = cart.filter(p => p.id !== id);
    saveCart();
    renderCart();
}

function updateTotal() {
    const total = cart.reduce((acc, p) => acc + p.price * p.cantidad, 0);
    cartTotal.textContent = total.toFixed(2);
    cartCount.textContent = cart.reduce((acc, p) => acc + p.cantidad, 0);
}

function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

renderCart();

//VALIDAR FORMULARIO
document.getElementById("contact-form").addEventListener("submit", (e) => {
    const email = e.target.email.value;

    if (!email.includes("@")) {
        e.preventDefault();
        document.getElementById("form-message").textContent =
            "Ingrese un email válido.";
    }
});

document.getElementById("btnPagar").addEventListener("click", function () {

    // Verificar si el carrito está vacío
    if (cart.length === 0) {
        alert("Tu carrito está vacío.");
        return;
    }

    // Vaciar carrito
    cart = [];
    localStorage.removeItem("cart");

    // Actualizar interfaz
    renderCart();

    // Mostrar mensaje final
    const mensaje = document.getElementById("mensajeCompra");
    mensaje.style.display = "block";

    // Ocultar mensaje luego de 3 segundos
    setTimeout(() => {
        mensaje.style.display = "none";
    }, 3000);
});


