// Define products array with required properties
const products = [
  { name: 'Cherry', price: 5, quantity: 0, productId: 100, image: './images/cherry.jpg' },
  { name: 'Orange', price: 3, quantity: 0, productId: 101, image: './images/orange.jpg' },
  { name: 'Strawberry', price: 7, quantity: 0, productId: 102, image: './images/strawberry.jpg' }
];

const cart = []; // Array to store items with updated quantities

let selectedCurrency = 'USD';
let currencySymbol = '$';
const currencyRates = { USD: 1, EUR: 0.85, YEN: 110 };
let totalPaid = 0;

// Helper function to find a product by ID
function findProduct(productId, productList) {
  return productList.find(product => product.productId === productId);
}

// Add a product to the cart, or increase quantity if it already exists
function addProductToCart(productId) {
  const productInCart = cart.find(item => item.productId === productId);
  if (productInCart) {
    increaseQuantity(productId); // If already in cart, just increase quantity
  } else {
    const product = findProduct(productId, products);
    if (product) {
      product.quantity = 1;      // Update quantity in products
      cart.push(product);        // Add reference to products in cart
    }
  }
}

// Increase quantity of a product in the cart and update in products
function increaseQuantity(productId) {
  const product = findProduct(productId, products);
  if (product) {
    product.quantity += 1;
  }
}

// Decrease quantity of a product in the cart and update in products
function decreaseQuantity(productId) {
  const product = findProduct(productId, products);
  if (product && product.quantity > 0) {
    product.quantity -= 1;
    if (product.quantity === 0) {
      removeProductFromCart(productId);
    }
  }
}

// Remove product from cart and reset quantity in products
function removeProductFromCart(productId) {
  const product = findProduct(productId, products);
  if (product) {
    product.quantity = 0; // Reset quantity in products
    const index = cart.indexOf(product);
    if (index !== -1) {
      cart.splice(index, 1); // Remove from cart
    }
  }
}

// Calculate the total cost of items in the cart
function cartTotal() {
  return cart.reduce((total, item) => total + item.price * item.quantity, 0);
}

// Updated pay function to handle partial and full payments correctly
function pay(amount) {
  totalPaid += amount; // Add the received amount to the cumulative totalPaid
  const total = cartTotal() * currencyRates[selectedCurrency]; // Calculate the total in the selected currency
  const remainingBalance = totalPaid - total; // Calculate the remaining balance

  // If the payment covers or exceeds the total cost
  if (remainingBalance >= 0) {
    emptyCart(); // Clear the cart
    totalPaid = 0; // Reset totalPaid for future transactions
    return remainingBalance; // Return positive balance (change due)
  }

  // If payment does not cover the total, return the negative remaining balance
  return remainingBalance; // Return negative balance (remaining amount due)
}

// Clear the cart and reset all quantities in the products array
function emptyCart() {
  cart.forEach(item => {
    item.quantity = 0; // Reset quantity for each item in the cart
  });
  cart.length = 0; // Clear cart array
}

// Set currency and adjust currency symbol
function setCurrency(currency) {
  if (currencyRates[currency]) {
    selectedCurrency = currency;
    currencySymbol = currency === 'EUR' ? '€' : currency === 'YEN' ? '¥' : '$';
  }
}

// Export cart and functions for testing
module.exports = {
  products,
  cart,
  addProductToCart,
  increaseQuantity,
  decreaseQuantity,
  removeProductFromCart,
  cartTotal,
  emptyCart,
  pay,
  setCurrency,
  totalPaid
};
