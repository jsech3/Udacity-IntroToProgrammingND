let currencySymbol = '$';
let exchangeRate = 1; // Default exchange rate for USD

// Draws product list
function drawProducts() {
    let productList = document.querySelector('.products');
    let productItems = '';
    products.forEach((element) => {
        let convertedPrice = (element.price * exchangeRate).toFixed(2);
        productItems += `
            <div data-productId='${element.productId}'>
                <img src='${element.image}'>
                <h3>${element.name}</h3>
                <p>Price: ${currencySymbol}${convertedPrice}</p>
                <button class="add-to-cart">Add to Cart</button>
            </div>
        `;
    });
    // use innerHTML so that products only drawn once
    productList.innerHTML = productItems;
}

// Draws cart
function drawCart() {
    let cartList = document.querySelector('.cart');
    // clear cart before drawing
    let cartItems = '';
    cart.forEach((element) => {
        let itemTotal = (element.price * element.quantity * exchangeRate).toFixed(2);

        cartItems += `
            <div data-productId='${element.productId}'>
                <h3>${element.name}</h3>
                <p>Price: ${currencySymbol}${(element.price * exchangeRate).toFixed(2)}</p>
                <p>Quantity: ${element.quantity}</p>
                <p>Total: ${currencySymbol}${itemTotal}</p>
                <button class="qup">+</button>
                <button class="qdown">-</button>
                <button class="remove">Remove</button>
            </div>
        `;
    });
    // use innerHTML so that cart products only drawn once
    cart.length
        ? (cartList.innerHTML = cartItems)
        : (cartList.innerHTML = 'Cart Empty');
}

// Draws checkout
function drawCheckout() {
    let checkout = document.querySelector('.cart-total');
    checkout.innerHTML = '';

    // run cartTotal() from script.js
    let cartSum = (cartTotal() * exchangeRate).toFixed(2);

    let div = document.createElement('div');
    div.innerHTML = `<p>Cart Total: ${currencySymbol}${cartSum}`;
    checkout.append(div);
}

// Initialize store with products, cart, and checkout
drawProducts();
drawCart();
drawCheckout();

// Event Listeners

// Add product to cart
document.querySelector('.products').addEventListener('click', (e) => {
    if (e.target.classList.contains('add-to-cart')) {
        let productId = parseInt(e.target.parentNode.getAttribute('data-productId'));
        addProductToCart(productId);
        drawCart();
        drawCheckout();
    }
});

// Event delegation for cart items
document.querySelector('.cart').addEventListener('click', (e) => {
    function runCartFunction(fn) {
        let productId = parseInt(e.target.parentNode.getAttribute('data-productId'));
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

// Handle payment
document.querySelector('.pay').addEventListener('click', (e) => {
    e.preventDefault();

    // Get input cash received field value, set to number
    let amount = parseFloat(document.querySelector('.received').value) / exchangeRate;

    // Set cashReturn to return value of pay()
    let cashReturn = pay(amount);

    let paymentSummary = document.querySelector('.pay-summary');
    let div = document.createElement('div');

    // If total cash received is greater than cart total, thank customer
    if (cashReturn >= 0) {
        div.innerHTML = `
            <p>Cash Received: ${currencySymbol}${(amount * exchangeRate).toFixed(2)}</p>
            <p>Cash Returned: ${currencySymbol}${(cashReturn * exchangeRate).toFixed(2)}</p>
            <p>Thank you!</p>
        `;
    } else {
        // Reset cash field for next entry
        document.querySelector('.received').value = '';
        div.innerHTML = `
            <p>Cash Received: ${currencySymbol}${(amount * exchangeRate).toFixed(2)}</p>
            <p>Remaining Balance: ${currencySymbol}${Math.abs(cashReturn * exchangeRate).toFixed(2)}</p>
            <p>Please pay additional amount.</p>
            <hr/>
        `;
    }

    paymentSummary.append(div);
});

// Add button to empty cart
function addEmptyCartButton() {
    let shoppingCart = document.querySelector('.empty-btn');
    let button = document.createElement("button");
    button.classList.add("empty");
    button.innerHTML = `Empty Cart`;
    shoppingCart.append(button);
}
addEmptyCartButton();

// Empty cart button event listener
document.querySelector('.empty-btn').addEventListener('click', (e) => {
    if (e.target.classList.contains('empty')) {
        emptyCart();
        drawCart();
        drawCheckout();
    }
});

// Currency switcher
function addCurrencySwitcher() {
    let currencyPicker = document.querySelector('.currency-selector');
    let select = document.createElement("select");
    select.classList.add("currency-select");
    select.innerHTML = `
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
        <option value="YEN">YEN</option>
    `;
    currencyPicker.append(select);
}
addCurrencySwitcher();

// Currency selector event listener
document.querySelector('.currency-select').addEventListener('change', function handleChange(event) {
    switch (event.target.value) {
        case 'EUR':
            currencySymbol = '€';
            exchangeRate = 0.9; // Example rate for EUR
            break;
        case 'YEN':
            currencySymbol = '¥';
            exchangeRate = 110; // Example rate for YEN
            break;
        default:
            currencySymbol = '$';
            exchangeRate = 1; // USD is the base rate
            break;
    }

    drawProducts();
    drawCart();
    drawCheckout();
});
