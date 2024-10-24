/* Create an array named products which you will use to add all of your product object literals that you create in the next step. */

const products = [
  { name: 'Cherry', price: 5, quantity: 0, productId: 100, image: './images/cherry.jpg' },
  { name: 'Orange', price: 3, quantity: 0, productId: 101, image: './images/orange.jpg' },
  { name: 'Strawberry', price: 7, quantity: 0, productId: 102, image: './images/strawberry.jpg' }
];

/* Declare an empty array named cart to hold the items in the cart */
const cart = [];

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
  let product = findProduct(productId, cart);
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
  let product = findProduct(productId, cart);
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
}

/* Create a function named pay that takes in an amount as an argument
  - amount is the money paid by customer
  - pay will return a negative number if there is a remaining balance
  - pay will return a positive number if money should be returned to customer
  Hint: cartTotal function gives us cost of all the products in the cart  
*/
let totalPaid = 0;

function pay(amount) {
  // Add the amount paid to totalPaid
  totalPaid += amount;
  
  // Calculate the remaining balance after subtracting cart total
  const remainingBalance = totalPaid - cartTotal();

  // If the cart is fully paid, reset the totalPaid to zero
  if (remainingBalance >= 0) {
    totalPaid = 0; // Reset the total for future payments once paid in full
    emptyCart(); // Empty the cart after payment is complete
  }

  return remainingBalance;
}

/* Place stand out suggestions here (stand out suggestions can be found at the bottom of the project rubric.)*/

/* The following is for running unit tests. 
   To fully complete this project, it is expected that all tests pass.
   Run the following command in terminal to run tests
   npm run test
*/

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
  /* Uncomment the following line if completing the currency converter bonus */
  // currency
}
