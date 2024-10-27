// Draws product list with updated currency
function drawProducts() {
    const productList = document.querySelector('.products');
    let productItems = '';
    products.forEach((element) => {
        const convertedPrice = (element.price * currencyRates[selectedCurrency]).toFixed(2);
        productItems += `
            <div data-productId='${element.productId}'>
                <img src='${element.image}' alt='${element.name}'>
                <h3>${element.name}</h3>
                <p>price: ${currencySymbol}${convertedPrice}</p>
                <button class="add-to-cart">Add to Cart</button>
            </div>
        `;
    });
    productList.innerHTML = productItems;
}

// Draws cart with updated currency
function drawCart() {
    const cartList = document.querySelector('.cart');
    let cartItems = '';
    cart.forEach((element) => {
        const convertedPrice = (element.price * currencyRates[selectedCurrency]).toFixed(2);
        const itemTotal = (element.price * element.quantity * currencyRates[selectedCurrency]).toFixed(2);
        
        cartItems += `
            <div data-productId='${element.productId}'>
                <h3>${element.name}</h3>
                <p>price: ${currencySymbol}${convertedPrice}</p>
                <p>quantity: ${element.quantity}</p>
                <p>total: ${currencySymbol}${itemTotal}</p>
                <button class="qup">+</button>
                <button class="qdown">-</button>
                <button class="remove">remove</button>
            </div>
        `;
    });
    cartList.innerHTML = cart.length ? cartItems : 'Cart Empty';
}

// Draws checkout with updated currency
function drawCheckout() {
    const checkout = document.querySelector('.cart-total');
    checkout.innerHTML = '';
    const cartSum = (cartTotal() * currencyRates[selectedCurrency]).toFixed(2);
    const div = document.createElement('div');
    div.innerHTML = `<p>Cart Total: ${currencySymbol}${cartSum}</p>`;
    checkout.append(div);
}

// Initialize store with products, cart, and checkout
drawProducts();
drawCart();
drawCheckout();

// Add event listeners

// Add to cart button
document.querySelector('.products').addEventListener('click', (e) => {
    if (e.target.classList.contains('add-to-cart')) {
        const productId = Number(e.target.parentNode.getAttribute('data-productId'));
        addProductToCart(productId);
        drawCart();
        drawCheckout();
    }
});

// Cart quantity and remove buttons
document.querySelector('.cart').addEventListener('click', (e) => {
    function runCartFunction(fn) {
        const productId = Number(e.target.parentNode.getAttribute('data-productId'));
        fn(productId);
        drawCart();
        drawCheckout();
    }

    if (e.target.classList.contains('remove')) {
        runCartFunction(removeProductFromCart);
    } else if (e.target.classList.contains('qup')) {
        runCartFunction(increaseQuantity);
    } else if (e.target.classList.contains('qdown')) {
        runCartFunction(decreaseQuantity);
    }
});

// Empty cart button
document.querySelector('.empty-btn')?.addEventListener('click', () => {
    emptyCart(); // Clear the cart
    drawCart(); // Update cart display
    drawCheckout(); // Update checkout display
});

// Pay button
document.querySelector('.pay').addEventListener('click', (e) => {
    e.preventDefault();
    const amount = Number(document.querySelector('.received').value);
    const cashReturn = pay(amount); // Call pay function from script.js
    const paymentSummary = document.querySelector('.pay-summary');
    const div = document.createElement('div');

    if (cashReturn >= 0) {
        div.innerHTML = `
            <p>Cash Received: ${currencySymbol}${amount}</p>
            <p>Cash Returned: ${currencySymbol}${cashReturn}</p>
            <p>Thank you!</p>
        `;
        // Update the cart and checkout displays to show the cleared cart after payment
        drawCart();
        drawCheckout();
    } else {
        document.querySelector('.received').value = '';
        div.innerHTML = `
            <p>Cash Received: ${currencySymbol}${amount}</p>
            <p>Remaining Balance: -${currencySymbol}${Math.abs(cashReturn).toFixed(2)}</p>
            <p>Please pay additional amount.</p>
            <hr/>
        `;
    }
    paymentSummary.append(div);
});

// Currency change event listener
document.querySelector('.currency-select')?.addEventListener('change', (e) => {
    setCurrency(e.target.value); // Update currency settings
    drawProducts(); // Redraw products with new currency
    drawCart();     // Redraw cart with new currency
    drawCheckout(); // Update checkout total with new currency
});
