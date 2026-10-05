/* CART - Mini Cart + Local Storage */

let cartItems = JSON.parse(localStorage.getItem("roseBeautyCart")) || [];
let cartCount = 0;

/* PRODUCT DEFAULT PRICES */

const productPrices = {
    "Tinted Lip Balm": 299,
    "Velvet Lipstick": 379,
    "Rose Lip Gloss": 329,
    "Natural Glow Foundation": 599,
    "Daily Concealer": 399,
    "Setting Powder": 449,
    "Everyday Mascara": 399,
    "Eyeshadow Palette": 499,
    "Soft Brown Eyeliner": 279,
    "Soft Pink Blush": 349,
    "Bronzer": 379,
    "Soft Glow Highlighter": 429
};

/* ADD TO CART */

function addToCart(productName, price) {
    if (!price) {
        price = productPrices[productName] || 0;
    }

    const existingProduct = cartItems.find(function(item) {
        return item.name === productName;
    });

    if (existingProduct) {
        existingProduct.quantity++;
    } else {
        cartItems.push({
            name: productName,
            price: Number(price),
            quantity: 1
        });
    }

    saveCart();
    updateCartUI();

    alert(productName + " has been added to your cart! 💗");
}

/* SAVE CART */

function saveCart() {
    localStorage.setItem("roseBeautyCart", JSON.stringify(cartItems));
}

/* UPDATE CART */

function updateCartUI() {
    cartCount = 0;

    cartItems.forEach(function(item) {
        cartCount += item.quantity;
    });

    const cartCountElement = document.getElementById("cartCount");

    if (cartCountElement) {
        cartCountElement.textContent = cartCount;
    }

    renderCart();
}

/* RENDER CART */

function renderCart() {
    const cartItemsContainer = document.getElementById("cartItems");
    const cartTotalElement = document.getElementById("cartTotal");

    if (!cartItemsContainer) {
        return;
    }

    /* EMPTY CART */

    if (cartItems.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <div class="empty-cart-icon">♡</div>
                <h3>Your bag is empty</h3>
                <p>Add something beautiful to your cart.</p>
            </div>
        `;

        if (cartTotalElement) {
            cartTotalElement.textContent = "₱0.00";
        }

        return;
    }

    /* CART PRODUCTS */

    let total = 0;
    cartItemsContainer.innerHTML = "";

    cartItems.forEach(function(item, index) {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const cartItem = document.createElement("div");
        cartItem.className = "cart-item";

        cartItem.innerHTML = `
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>₱${Number(item.price).toFixed(2)} × ${item.quantity}</p>
            </div>

            <div class="cart-item-right">
                <strong>₱${itemTotal.toFixed(2)}</strong>
                <button type="button" onclick="removeFromCart(${index})" class="remove-cart-item">×</button>
            </div>
        `;

        cartItemsContainer.appendChild(cartItem);
    });

    if (cartTotalElement) {
        cartTotalElement.textContent = "₱" + total.toFixed(2);
    }
}

/* REMOVE FROM CART */

function removeFromCart(index) {
    if (index < 0 || index >= cartItems.length) {
        return;
    }

    const removedProduct = cartItems[index].name;

    cartItems.splice(index, 1);

    saveCart();
    updateCartUI();

    alert(removedProduct + " has been removed from your cart.");
}

/* OPEN CART */

function openCart() {
    const drawer = document.getElementById("cartDrawer");
    const overlay = document.getElementById("cartOverlay");

    if (drawer) {
        drawer.classList.add("active");
    }

    if (overlay) {
        overlay.classList.add("active");
    }

    document.body.classList.add("cart-open");

    updateCartUI();
}

/* CLOSE CART */

function closeCart() {
    const drawer = document.getElementById("cartDrawer");
    const overlay = document.getElementById("cartOverlay");

    if (drawer) {
        drawer.classList.remove("active");
    }

    if (overlay) {
        overlay.classList.remove("active");
    }

    document.body.classList.remove("cart-open");
}

/* CHECKOUT */

function checkoutCart() {
    if (cartItems.length === 0) {
        alert("Your cart is empty. Please add a product first. 💗");
        return;
    }

    alert(
        "Thank you for shopping with Rosé Beauty! 💗\n\n" +
        "Checkout is currently available for demonstration only."
    );
}

/* WISHLIST */

let wishlist = JSON.parse(localStorage.getItem("roseBeautyWishlist")) || [];

/* TOGGLE WISHLIST */

function toggleWishlist(button) {
    if (!button) {
        return;
    }

    const productCard = button.closest(".product-card");

    if (!productCard) {
        return;
    }

    const productNameElement = productCard.querySelector(".product-name");

    if (!productNameElement) {
        return;
    }

    const productName = productNameElement.textContent.trim();
    const wishlistIndex = wishlist.indexOf(productName);

    if (wishlistIndex === -1) {
        wishlist.push(productName);

        button.textContent = "♥";
        button.classList.add("active");

        alert(productName + " has been added to your wishlist! 💗");
    } else {
        wishlist.splice(wishlistIndex, 1);

        button.textContent = "♡";
        button.classList.remove("active");

        alert(productName + " has been removed from your wishlist.");
    }

    localStorage.setItem(
        "roseBeautyWishlist",
        JSON.stringify(wishlist)
    );
}

/* LOAD WISHLIST BUTTONS */

function loadWishlist() {
    const buttons = document.querySelectorAll(".wishlist-btn");

    buttons.forEach(function(button) {
        const productCard = button.closest(".product-card");

        if (!productCard) {
            return;
        }

        const productNameElement = productCard.querySelector(".product-name");

        if (!productNameElement) {
            return;
        }

        const productName = productNameElement.textContent.trim();

        if (wishlist.includes(productName)) {
            button.textContent = "♥";
            button.classList.add("active");
        } else {
            button.textContent = "♡";
            button.classList.remove("active");
        }
    });
}

/* QUICK VIEW */

let currentQuickViewProduct = null;

/* QUICK VIEW PRODUCT */

function quickView(button) {
    if (!button) {
        return;
    }

    const productCard = button.closest(".product-card");

    if (!productCard) {
        return;
    }

    const image = productCard.querySelector("img");
    const name = productCard.querySelector(".product-name");
    const category = productCard.querySelector(".product-category");
    const price = productCard.querySelector(".product-price");

    if (!name) {
        return;
    }

    const productName = name.textContent.trim();
    let productPrice = 0;

    if (price) {
        const priceMatches = price.textContent.match(/₱\s*[\d,]+(?:\.\d{2})?/g);

        if (priceMatches && priceMatches.length > 0) {
            const lastPrice = priceMatches[priceMatches.length - 1];

            productPrice = parseFloat(
                lastPrice.replace("₱", "").replace(/,/g, "")
            );
        }
    }

    /* QUICK VIEW ELEMENTS */

    const imageElement = document.getElementById("quickViewImage");
    const nameElement = document.getElementById("quickViewName");
    const categoryElement = document.getElementById("quickViewCategory");
    const priceElement = document.getElementById("quickViewPrice");
    const descriptionElement = document.getElementById("quickViewDescription");
    const modal = document.getElementById("quickViewOverlay");

    /* SET IMAGE */

    if (imageElement && image) {
        imageElement.src = image.src;
        imageElement.alt = productName;
    }

    /* SET NAME */

    if (nameElement) {
        nameElement.textContent = productName;
    }

    /* SET CATEGORY */

    if (categoryElement) {
        categoryElement.textContent = category
            ? category.textContent.trim()
            : "BEAUTY";
    }

    /* SET PRICE */

    if (priceElement) {
        priceElement.textContent = "₱" + productPrice.toFixed(2);
    }

    /* DESCRIPTION */

    if (descriptionElement) {
        descriptionElement.textContent = getProductDescription(productName);
    }

    /* CURRENT PRODUCT */

    currentQuickViewProduct = {
        name: productName,
        price: productPrice
    };

    /* QUICK VIEW CART BUTTON */

    const quickViewCartButton = document.getElementById("quickViewCartButton");

    if (quickViewCartButton) {
        quickViewCartButton.onclick = function() {
            if (currentQuickViewProduct) {
                addToCart(
                    currentQuickViewProduct.name,
                    currentQuickViewProduct.price
                );

                closeQuickView();
            }
        };
    }

    /* SHOW MODAL */

    if (modal) {
        modal.classList.add("active");
    }

    document.body.classList.add("quick-view-open");
}

/* PRODUCT DESCRIPTIONS */

function getProductDescription(productName) {
    const descriptions = {
        "Tinted Lip Balm":
            "A soft and moisturizing lip balm with a natural tint for an effortless everyday look.",

        "Velvet Lipstick":
            "A smooth velvet lipstick that gives your lips rich color with a comfortable finish.",

        "Rose Lip Gloss":
            "A lightweight lip gloss that adds a beautiful shine and a soft rosy finish.",

        "Natural Glow Foundation":
            "A lightweight foundation designed to create a smooth, natural-looking complexion.",

        "Daily Concealer":
            "An everyday concealer that helps create a fresh and even-looking complexion.",

        "Setting Powder":
            "A soft setting powder that helps keep your makeup looking fresh and polished.",

        "Everyday Mascara":
            "A defining mascara that enhances the appearance of your lashes for an effortless eye look.",

        "Eyeshadow Palette":
            "A versatile palette featuring wearable shades perfect for everyday and soft glam looks.",

        "Soft Brown Eyeliner":
            "A soft brown eyeliner that creates a natural and beautifully defined eye look.",

        "Soft Pink Blush":
            "A soft pink blush that gives your cheeks a fresh and naturally rosy appearance.",

        "Bronzer":
            "A powder bronzer that will elevate your look.",

        "Soft Glow Highlighter":
            "A delicate highlighter that adds a subtle glow to the high points of your face."
    };

    return (
        descriptions[productName] ||
        "A beautiful Rosé Beauty essential made for your everyday makeup routine."
    );
}

/* CLOSE QUICK VIEW */

function closeQuickView(event) {
    if (
        event &&
        event.target &&
        event.target.id !== "quickViewOverlay"
    ) {
        return;
    }

    const modal = document.getElementById("quickViewOverlay");

    if (modal) {
        modal.classList.remove("active");
    }

    document.body.classList.remove("quick-view-open");
}

/* PRODUCT SEARCH */

function searchProducts() {
    const searchInput = document.getElementById("productSearch");

    if (!searchInput) {
        return;
    }

    const searchValue = searchInput.value.toLowerCase().trim();

    const products = document.querySelectorAll(".product-card");
    const productArea = document.getElementById("productArea");
    const categoryTitle = document.getElementById("categoryProductTitle");
    const selectedCategory = document.getElementById("selectedCategory");

    let found = false;

    /* EMPTY SEARCH */

    if (searchValue === "") {
        products.forEach(function(product) {
            product.style.display = "block";
        });

        if (productArea) {
            productArea.style.display = "none";
        }

        if (categoryTitle) {
            categoryTitle.textContent = "ALL PRODUCTS";
        }

        if (selectedCategory) {
            selectedCategory.textContent = "ALL";
        }

        return;
    }

    /* SEARCH */

    products.forEach(function(product) {
        const productNameElement = product.querySelector(".product-name");
        const productCategoryElement = product.querySelector(".product-category");

        const productName = productNameElement
            ? productNameElement.textContent.toLowerCase()
            : "";

        const productCategory = productCategoryElement
            ? productCategoryElement.textContent.toLowerCase()
            : "";

        if (
            productName.includes(searchValue) ||
            productCategory.includes(searchValue)
        ) {
            product.style.display = "block";
            found = true;
        } else {
            product.style.display = "none";
        }
    });

    /* SHOW RESULTS */

    if (productArea) {
        productArea.style.display = "block";
    }

    if (categoryTitle) {
        categoryTitle.textContent = "SEARCH RESULTS";
    }

    if (selectedCategory) {
        selectedCategory.textContent = "SEARCH: " + searchInput.value;
    }

    /* NO RESULTS */

    if (!found) {
        alert('No products found for "' + searchInput.value + '".');
    }

    /* SCROLL */

    if (productArea) {
        productArea.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }
}

/* ENTER KEY FOR SEARCH */

document.addEventListener("DOMContentLoaded", function() {
    const searchInput = document.getElementById("productSearch");

    if (searchInput) {
        searchInput.addEventListener("keydown", function(event) {
            if (event.key === "Enter") {
                event.preventDefault();
                searchProducts();
            }
        });
    }
});

/* SHOW PRODUCT CATEGORY */

function showCategory(category) {
    const productArea = document.getElementById("productArea");
    const selectedCategory = document.getElementById("selectedCategory");
    const categoryTitle = document.getElementById("categoryProductTitle");
    const searchInput = document.getElementById("productSearch");
    const products = document.querySelectorAll(".product-card");

    /* CLEAR SEARCH */

    if (searchInput) {
        searchInput.value = "";
    }

    /* SHOW PRODUCT AREA */

    if (productArea) {
        productArea.style.display = "block";
    }

    /* UPDATE TEXT */

    if (selectedCategory) {
        selectedCategory.textContent = category;
    }

    if (categoryTitle) {
        if (category === "ALL") {
            categoryTitle.textContent = "ALL PRODUCTS";
        } else {
            categoryTitle.textContent = category + " COLLECTION";
        }
    }

    /* FILTER PRODUCTS */

    products.forEach(function(product) {
        const productCategory = product.getAttribute("data-category");

        if (
            category === "ALL" ||
            productCategory === category
        ) {
            product.style.display = "block";
        } else {
            product.style.display = "none";
        }
    });

    /* SCROLL TO PRODUCTS */

    if (productArea) {
        productArea.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }
}

/* BACK TO CATEGORIES */

function backToCategories() {
    const productArea = document.getElementById("productArea");
    const searchInput = document.getElementById("productSearch");

    /* HIDE PRODUCTS */

    if (productArea) {
        productArea.style.display = "none";
    }

    /* CLEAR SEARCH */

    if (searchInput) {
        searchInput.value = "";
    }

    /* SHOW PRODUCTS AGAIN */

    const products = document.querySelectorAll(".product-card");

    products.forEach(function(product) {
        product.style.display = "block";
    });

    /* RETURN TO SHOP */

    const shopSection = document.getElementById("shop");

    if (shopSection) {
        shopSection.scrollIntoView({
            behavior: "smooth"
        });
    }
}

/* SIGN IN VALIDATION */

function validateSignIn() {
    const email = document.getElementById("loginEmail");
    const password = document.getElementById("loginPassword");

    if (!email || !password) {
        return false;
    }

    const emailValue = email.value.trim();
    const passwordValue = password.value.trim();

    /* EMPTY FIELDS */

    if (emailValue === "" || passwordValue === "") {
        alert("Please fill in all required fields.");
        return false;
    }

    /* EMAIL */

    if (!isValidEmail(emailValue)) {
        alert("Please enter a valid email address.");
        return false;
    }

    /* PASSWORD */

    if (passwordValue.length < 6) {
        alert("Password must be at least 6 characters long.");
        return false;
    }

    /* SUCCESS */

    alert(
        "Sign in successful! " +
        "Welcome back to Rosé Beauty. 💗"
    );

    return false;
}

/* SIGN UP VALIDATION */

function validateSignUp() {
    const name = document.getElementById("fullName");
    const email = document.getElementById("signupEmail");
    const password = document.getElementById("signupPassword");
    const confirmPassword = document.getElementById("confirmPassword");

    if (!name || !email || !password || !confirmPassword) {
        return false;
    }

    const nameValue = name.value.trim();
    const emailValue = email.value.trim();
    const passwordValue = password.value.trim();
    const confirmPasswordValue = confirmPassword.value.trim();

    /* EMPTY FIELDS */

    if (
        nameValue === "" ||
        emailValue === "" ||
        passwordValue === "" ||
        confirmPasswordValue === ""
    ) {
        alert("Please fill in all required fields.");
        return false;
    }

    /* EMAIL */

    if (!isValidEmail(emailValue)) {
        alert("Please enter a valid email address.");
        return false;
    }

    /* PASSWORD LENGTH */

    if (passwordValue.length < 6) {
        alert("Password must be at least 6 characters long.");
        return false;
    }

    /* PASSWORD MATCH */

    if (passwordValue !== confirmPasswordValue) {
        alert("Passwords do not match.");
        return false;
    }

    /* SUCCESS */

    alert(
        "Account created successfully! " +
        "Welcome to Rosé Beauty, " +
        nameValue +
        "! 💗"
    );

    return false;
}

/* EMAIL VALIDATION */

function isValidEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}

/* INQUIRY / CONTACT FORM */

function validateInquiry() {
    const name = document.getElementById("inquiryName");
    const email = document.getElementById("inquiryEmail");
    const message = document.getElementById("inquiryMessage");

    if (!name || !email || !message) {
        return false;
    }

    const nameValue = name.value.trim();
    const emailValue = email.value.trim();
    const messageValue = message.value.trim();

    /* EMPTY FIELDS */

    if (
        nameValue === "" ||
        emailValue === "" ||
        messageValue === ""
    ) {
        alert(
            "Please complete all fields before " +
            "sending your inquiry."
        );

        return false;
    }

    /* EMAIL */

    if (!isValidEmail(emailValue)) {
        alert("Please enter a valid email address.");
        return false;
    }

    /* SUCCESS */

    alert(
        "Thank you, " +
        nameValue +
        "! Your inquiry has been submitted successfully. 💗"
    );

    return false;
}

/* NEWSLETTER */

function subscribeNewsletter() {
    const emailInput = document.getElementById("newsletterEmail");

    if (!emailInput) {
        return;
    }

    const emailValue = emailInput.value.trim();

    /* EMPTY EMAIL */

    if (emailValue === "") {
        alert("Please enter your email address.");
        return;
    }

    /* VALIDATE EMAIL */

    if (!isValidEmail(emailValue)) {
        alert("Please enter a valid email address.");
        return;
    }

    /* SUCCESS */

    alert(
        "Thank you for subscribing to " +
        "Rosé Beauty! 💗"
    );

    emailInput.value = "";
}

/* NAVIGATION */

function goToSection(sectionId) {
    const section = document.getElementById(sectionId);

    if (section) {
        section.scrollIntoView({
            behavior: "smooth"
        });

        return;
    }

    /* SHOP PAGE */

    if (sectionId === "shop") {
        window.location.href = "2026-0082MarquezRoseBeauty2.html#shop";
        return;
    }

    /* HOME PAGE */

    window.location.href = "2026-0082MarquezRoseBeauty.html#" + sectionId;
}

/* HOME BUTTON */

function goHome() {
    if (
        window.location.pathname.endsWith("2026-0082MarquezRoseBeauty.html") ||
        window.location.pathname.endsWith("/")
    ) {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    } else {
        window.location.href = "2026-0082MarquezRoseBeauty.html";
    }
}

/* CLEAR SEARCH */

function clearSearch() {
    const searchInput = document.getElementById("productSearch");

    if (searchInput) {
        searchInput.value = "";
    }

    const products = document.querySelectorAll(".product-card");

    products.forEach(function(product) {
        product.style.display = "block";
    });

    const productArea = document.getElementById("productArea");
    const categoryTitle = document.getElementById("categoryProductTitle");
    const selectedCategory = document.getElementById("selectedCategory");

    if (productArea) {
        productArea.style.display = "none";
    }

    if (categoryTitle) {
        categoryTitle.textContent = "ALL PRODUCTS";
    }

    if (selectedCategory) {
        selectedCategory.textContent = "ALL";
    }
}

/* PAGE LOAD */

document.addEventListener("DOMContentLoaded", function() {
    /* PRODUCT AREA */

    const productArea = document.getElementById("productArea");

    if (productArea) {
        productArea.style.display = "none";
    }

    /* CART */

    updateCartUI();

    /* WISHLIST */

    loadWishlist();

    /* SEARCH */

    const searchInput = document.getElementById("productSearch");

    if (searchInput) {
        searchInput.value = "";
    }
});

/* ESC KEY - Close Cart / Quick View */

document.addEventListener("keydown", function(event) {
    if (event.key === "Escape") {
        closeCart();
        closeQuickView();
    }
});