/* Create an array named products which you will use to add all of your product object literals that you create in the next step. */

const products = [
  { name: 'Cherry', price: 5, quantity: 0, productId: 100, image: './images/cherry.jpg' },
  { name: 'Orange', price: 3, quantity: 0, productId: 101, image: './images/orange.jpg' },
  { name: 'Strawberry', price: 7, quantity: 0, productId: 102, image: './images/strawberry.jpg' }
];

/* Declare an empty array named cart to hold the items in the cart */
const cart = [];

/* Currency settings */
let selectedCurrency = 'USD';
let currencySymbol = '$';
const currencyRates = {
  USD: 1,
  EUR: 0.85,
  YEN: 110
};

let totalPaid = 0;
let receipts = []; // Array to store multiple receipts

/* Helper function to find a product */
function findProduct(productId, productList) {
  return productList.find(product => product.productId === productId);
}

/* Create a function named addProductToCart that takes in the product productId as an argument
  - addProductToCart should get the correct product based on the productId
  - addProductToCart should then increase the product's quantity
  - if the product is not already in the cart, add it to the cart
*/
function addProductToCart(productId) {
  let product = findProduct(productId, products);
  
  if (product) {
    // If the product is not in the cart, add it
    if (!cart.includes(product)) {
      cart.push(product);
    }
    // Increase the quantity
    increaseQuantity(productId);
  }
}

/* Create a function named increaseQuantity that takes in the productId as an argument
  - increaseQuantity should get the correct product based on the productId
  - increaseQuantity should then increase the product's quantity
*/
function increaseQuantity(productId) {
  let product = findProduct(productId, products);
  if (product) {
    product.quantity += 1;
  }
}

/* Create a function named decreaseQuantity that takes in the productId as an argument
  - decreaseQuantity should get the correct product based on the productId
  - decreaseQuantity should decrease the quantity of the product
  - if the function decreases the quantity to 0, the product is removed from the cart
*/
function decreaseQuantity(productId) {
  let product = findProduct(productId, products);
  if (product && product.quantity > 0) {
    product.quantity -= 1;

    // If the product quantity becomes 0, remove it from the cart
    if (product.quantity === 0) {
      removeProductFromCart(productId);
    }
  }
}

/* Create a function named removeProductFromCart that takes in the productId as an argument
  - removeProductFromCart should get the correct product based on the productId
  - removeProductFromCart should update the product quantity to 0
  - removeProductFromCart should remove the product from the cart
*/
function removeProductFromCart(productId) {
  let product = findProduct(productId, cart);
  if (product) {
    product.quantity = 0; // Reset the quantity in the product list
    const index = cart.indexOf(product);
    if (index !== -1) {
      cart.splice(index, 1); // Remove the product from the cart
    }
  }
}

/* Create a function named cartTotal that has no parameters
  - cartTotal should iterate through the cart to get the total cost of all products
  - cartTotal should return the total cost of the products in the cart
  Hint: price and quantity can be used to determine total cost
*/
function cartTotal() {
  return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

/* Create a function called emptyCart that empties the products from the cart */
function emptyCart() {
  cart.forEach(product => product.quantity = 0);
  cart.splice(0, cart.length);
  drawCart();
  drawCheckout();
}

/* Create a function named pay that takes in an amount as an argument
  - amount is the money paid by customer
  - pay will return a negative number if there is a remaining balance
  - pay will return a positive number if money should be returned to customer
  Hint: cartTotal function gives us cost of all the products in the cart  
*/
function pay(amount) {
  const total = cartTotal() * currencyRates[selectedCurrency]; // Convert cart total to the selected currency rate
  const remainingBalance = amount - total;

  // Create a receipt for the transaction
  const receipt = {
    currency: selectedCurrency,
    currencySymbol: currencySymbol,
    cashReceived: amount,
    cartTotal: total,
    change: remainingBalance >= 0 ? remainingBalance : 0
  };
  receipts.push(receipt); // Add the receipt to the receipts array

  // Reset only if payment is sufficient
  if (remainingBalance >= 0) {
    emptyCart(); // Clear the cart after a successful transaction
  }

  return remainingBalance;
}

/* Set currency function */
function setCurrency(currency) {
  if (currencyRates.hasOwnProperty(currency)) {
    selectedCurrency = currency;
    switch (currency) {
      case 'EUR':
        currencySymbol = '€';
        break;
      case 'YEN':
        currencySymbol = '¥';
        break;
      default:
        currencySymbol = '$';
        break;
    }
    drawProducts();
    drawCart();
    drawCheckout();
  }
}

/* Draw product list */
function drawProducts() {
  let productList = document.querySelector('.products');
  if (!productList) {
    return; // Exit if the element does not exist
  }

  let productItems = '';
  products.forEach((element) => {
    productItems += `
      <div data-productId='${element.productId}'>
        <img src='${element.image}'>
        <h3>${element.name}</h3>
        <p>Price: ${currencySymbol}${(element.price * currencyRates[selectedCurrency]).toFixed(2)}</p>
        <button class="add-to-cart">Add to Cart</button>
      </div>
    `;
  });
  productList.innerHTML = productItems;
}

/* Draw cart */
function drawCart() {
  let cartList = document.querySelector('.cart');
  if (!cartList) {
    return; // Exit if the element does not exist
  }

  let cartItems = '';
  cart.forEach((element) => {
    let itemTotal = element.price * element.quantity * currencyRates[selectedCurrency];
    cartItems += `
      <div data-productId='${element.productId}'>
        <h3>${element.name}</h3>
        <p>Price: ${currencySymbol}${(element.price * currencyRates[selectedCurrency]).toFixed(2)}</p>
        <p>Quantity: ${element.quantity}</p>
        <p>Total: ${currencySymbol}${itemTotal.toFixed(2)}</p>
        <button class="qup">+</button>
        <button class="qdown">-</button>
        <button class="remove">Remove</button>
      </div>
    `;
  });
  cartList.innerHTML = cart.length ? cartItems : 'Cart Empty';
}

/* Draw checkout */
function drawCheckout() {
  let checkout = document.querySelector('.cart-total');
  if (!checkout) {
    return; // Exit if the element does not exist
  }

  checkout.innerHTML = '';
  let cartSum = cartTotal() * currencyRates[selectedCurrency];
  let div = document.createElement('div');
  div.innerHTML = `<p>Cart Total: ${currencySymbol}${cartSum.toFixed(2)}</p>`;
  checkout.append(div);
}

/* Draw receipts */
function drawReceipts() {
  let receiptContainer = document.querySelector('.pay-summary');
  if (!receiptContainer) {
    return;
  }
  receiptContainer.innerHTML = '';

  receipts.forEach((receipt, index) => {
    let div = document.createElement('div');
    div.innerHTML = `
      <h3>Receipt #${index + 1}</h3>
      <p>Currency: ${receipt.currency}</p>
      <p>Cash Received: ${receipt.currencySymbol}${receipt.cashReceived.toFixed(2)}</p>
      <p>Cart Total: ${receipt.currencySymbol}${receipt.cartTotal.toFixed(2)}</p>
      <p>Change: ${receipt.currencySymbol}${receipt.change.toFixed(2)}</p>
      <hr/>
    `;
    receiptContainer.append(div);
  });
}

/* Event Listeners */
document.addEventListener('DOMContentLoaded', () => {
  drawProducts();
  drawCart();
  drawCheckout();

  document.querySelector('.products')?.addEventListener('click', (e) => {
    if (e.target.classList.contains('add-to-cart')) {
      let productId = e.target.parentNode.getAttribute('data-productId');
      addProductToCart(Number(productId));
      drawCart();
      drawCheckout();
    }
  });

  document.querySelector('.cart')?.addEventListener('click', (e) => {
    if (e.target.classList.contains('qup')) {
      let productId = e.target.parentNode.getAttribute('data-productId');
      increaseQuantity(Number(productId));
      drawCart();
      drawCheckout();
    } else if (e.target.classList.contains('qdown')) {
      let productId = e.target.parentNode.getAttribute('data-productId');
      decreaseQuantity(Number(productId));
      drawCart();
      drawCheckout();
    } else if (e.target.classList.contains('remove')) {
      let productId = e.target.parentNode.getAttribute('data-productId');
      removeProductFromCart(Number(productId));
      drawCart();
      drawCheckout();
    }
  });

  document.querySelector('.currency-select')?.addEventListener('change', (e) => {
    setCurrency(e.target.value);
  });

  document.querySelector('.pay')?.addEventListener('click', (e) => {
    e.preventDefault();
    let amount = Number(document.querySelector('.received')?.value);
    let cashReturn = pay(amount);
    drawReceipts(); // Draw updated receipts list
    drawCart(); // Clear cart UI after transaction

    let paymentSummary = document.querySelector('.pay-summary');
    let div = document.createElement('div');

    if (cashReturn >= 0) {
      div.innerHTML = `
        <p>Thank you!</p>
      `;
    } else {
      document.querySelector('.received').value = '';
      div.innerHTML = `
        <p>Remaining Balance: ${currencySymbol}${Math.abs(cashReturn).toFixed(2)}</p>
        <p>Please pay additional amount.</p>
        <hr/>
      `;
    }

    paymentSummary.append(div);
  });

  document.querySelector('.empty-btn')?.addEventListener('click', () => {
    emptyCart();
  });
});

/* Exporting functions and variables for testing */
module.exports = {
  products,
  cart,
  addProductToCart,
  increaseQuantity,
  decreaseQuantity,
  removeProductFromCart,
  cartTotal,
  pay, 
  emptyCart,
};
