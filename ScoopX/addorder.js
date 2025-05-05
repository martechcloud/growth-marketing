function incomingmessage() {
    fetchAndDisplayMessages();
  }

document.getElementById('refreshMessages').addEventListener('click', function() {
    fetchAndDisplayMessages();
});

/////////////////////////////////////////////////////////////////////////////////////////////////

//Fetch data 
// Global variables
let items = {};  // Store items dynamically fetched from the API
let cart = {};   // Store items added to the cart

// Spinner display function
function showSpinner() {
    document.getElementById('spinner').style.display = 'block';
}

// Hide spinner
function hideSpinner() {
    document.getElementById('spinner').style.display = 'none';
}

const encryptedUrl = "U2FsdGVkX1/EGFo+Q58t14at332y0rcMh9aCLmoeWlHoblzPXB7sTR54keN+DdBK6+as69a5z4EY/5Uol6WaxekZ6VJWP4TPlZ26NsJXXg8xzfbgw7qYAoKoGdfkxRprFcY6V9UZIRtx5R2EClxnZww9M5ko3xE7Z+DGVFWfS2Z0PAkUSACUA4VHl41lMQ/VqPLaY5iwBMTPuUxLWINO3w==";
var MartechDataPass = sessionStorage.getItem('MartechDataPass');    
const decryptedUrl = decryptURL(encryptedUrl, MartechDataPass);
// Fetch data from the Apps Script URL only once
async function fetchData() {
    try {
        const response = await fetch(decryptedUrl);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching data: ", error);
    }
}

// Organize data into categories dynamically (called only once on page load)
async function organizeItems() {

    let data2 = JSON.parse(sessionStorage.getItem('data2')) || [];
    console.log(data2)

    if (data2.length === 0) {
      let data = await fetchData();
      sessionStorage.setItem('data2', JSON.stringify(data));
    }
    let data = data2;

    items = {};  // Reset items
    data.slice(1).forEach(row => { // Skip the header row
        const [productId, productName, productCategory, productPrice, productimage, productquantity] = row;
        // Check if the category exists, if not create it
        if (!items[productCategory.toLowerCase()]) {
            items[productCategory.toLowerCase()] = [];
        }
        // Push the item to its respective category
        items[productCategory.toLowerCase()].push({
            name: productName.trim(),
            price: parseFloat(productPrice),
            image: productimage.trim().startsWith('//') ? 'https:' + productimage.trim() : productimage.trim(),
            quantity: productquantity
        });
    });
}

async function showItems(category) {
  if (Object.keys(items).length === 0) {
      await organizeItems(); // Ensure items are loaded before displaying
  }

  const menuItemsDiv = document.getElementById('menu-items');
  menuItemsDiv.innerHTML = '';

  // If category is empty, show all items except "home"
  if (category === "") {
    Object.keys(items).forEach(cat => {
        if (cat !== "home") { // Exclude the "home" category
            items[cat].forEach((item, index) => {
                createMenuItem(item, cat, index, menuItemsDiv);
            });
        }
    });
  }
  // Display items in the selected category
  else if (items[category]) {
      items[category].forEach((item, index) => {
          createMenuItem(item, category, index, menuItemsDiv);
      });
  } else {
      menuItemsDiv.innerHTML = `<p>No items available for this category.</p>`;
  }
}

// Helper function to create a menu item div
function createMenuItem(item, category, index, container) {
  const itemDiv = document.createElement('div');
  itemDiv.className = 'menu-item1';
  itemDiv.onclick = () => addToCart(category, index);
  
  itemDiv.innerHTML = `
      <div style="
          position: relative;
          width: 100%;
          height: 100px;
          background-image: url(${item.image});
          background-size: cover;
          background-position: center;
          border-radius: 8px;
          overflow: hidden;
      ">
          <div style="
              position: absolute;
              bottom: 0;
              width: 100%;
              background: rgba(0, 0, 0, 0.6);
              color: #fff;
              text-align: center;
              padding: 10px 0;
              font-size: 16px;
              font-weight: bold;
          ">
              ${item.name}
          </div>
      </div>
  `;

  container.appendChild(itemDiv);
}


// Search only items in the "home" category
async function searchItems() {
  const query = (document.getElementById('search-bar2')?.value || document.getElementById('search-bar')?.value || "").toLowerCase().trim();
  const menuItemsDiv = document.getElementById('menu-items');
  menuItemsDiv.innerHTML = '';

  if (!query) {
      showItems(''); // Show all items in the "home" category when input is empty
      return;
  }

  if (Object.keys(items).length === 0) {
      await organizeItems(); // Ensure items are loaded before searching
  }

  let foundItems = false;

  // Search only within the "home" category
  if (items["home"]) {
      items["home"].forEach((item, index) => {
          if (item.name.toLowerCase().includes(query)) {
              const itemDiv = document.createElement('div');
              itemDiv.className = 'menu-item1';
              itemDiv.onclick = () => addToCart("home", index);
              itemDiv.innerHTML = `
                  <div style="
                      position: relative;
                      width: 100%;
                      height: 100px;
                      background-image: url(${item.image});
                      background-size: cover;
                      background-position: center;
                      border-radius: 8px;
                      overflow: hidden;
                  ">
                      <div style="
                          position: absolute;
                          bottom: 0;
                          width: 100%;
                          background: rgba(0, 0, 0, 0.6);
                          color: #fff;
                          text-align: center;
                          padding: 10px 0;
                          font-size: 16px;
                          font-weight: bold;
                      ">
                          ${item.name}
                      </div>
                  </div>
              `;
              menuItemsDiv.appendChild(itemDiv);
              foundItems = true;
          }
      });
  }

  if (!foundItems) {
      menuItemsDiv.innerHTML = '<p>No items found.</p>';
  }
}


// Add item to the cart
function addToCart(category, index) {
    const tableNumber = document.querySelector('.pagination .page-item.active .page-link');
    const errorMessage = document.getElementById('box2');
    const alertMessage = document.getElementById('almessage');

    if (tableNumber === null) {
      alertMessage.textContent = "Please select a table before proceeding!";
      errorMessage.style.display = "block"; // Show error message
      setTimeout(() => {
        errorMessage.style.display = "none";
      }, 3000);
    } else {
      const dropdown = document.getElementById(`discountdropdown1`);
      dropdown.selectedIndex = 0;
      const settlement = document.getElementById('currencyInput');
      settlement.value = "";

      const item = items[category][index];
      console.log(item)

      if (item.quantity < 0.01) {  // Correct syntax
        alertMessage.textContent = "The item is out of stock!";
        errorMessage.style.display = "block"; // Show error message
        setTimeout(() => {
          errorMessage.style.display = "none";
        }, 3000);
        return
      }
      
      // Check if the item is already in the cart
      if (!cart[item.name]) {
          cart[item.name] = { ...item, quantity: 1 }; // Add item with quantity 1
      } else {
          cart[item.name].quantity++; // Increase quantity if already in cart
      }
      console.log(cart)

      updateBilling(); // Call function to update the billing details
  }
}
    

// Update billing details
function updateBilling() {
    const billTable = document.querySelector('.billing table tbody');
    const subtotalSpan = document.getElementById('subtotal');
    let subtotal = 0;

    // Clear existing table rows
    billTable.innerHTML = '';

    // Populate table rows based on cart items
    Object.values(cart).forEach(item => { 
        subtotal += item.price * item.quantity;

        // Create a table rowss
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.name}</td>
            <td>
                <div class="quantity-control">
                    <button onclick="changeQuantity('${item.name}', -1)">-</button>
                    ${item.quantity}
                    <button onclick="changeQuantity('${item.name}', 1)">+</button>
                </div>
            </td>
            <td>₹${(item.price * item.quantity).toFixed(2)}</td>
            <td>
                <input type="checkbox" id="complimentary-${item.name}" name="complimentary-${item.name}" 
                      onchange="toggleComplimentary('${item.name}', ${(item.price * item.quantity).toFixed(2)})" 
                      style="width: 20px; height: 20px;">
            </td>
            <td>
                <select class="form-select" id="discountdropdown-${item.name}" 
                        data-price="${(item.price * item.quantity).toFixed(2)}"
                        style="width: 80px; max-width: 80px; overflow: hidden;" onchange= resetupdatebilling();>
                    <option selected></option>
                    <option value="10">10%</option>
                    <option value="20">20%</option>
                    <option value="30">30%</option>
                    <option value="40">40%</option>
                    <option value="50">50%</option>
                    <option value="60">60%</option>
                    <option value="70">70%</option>
                    <option value="80">80%</option>
                    <option value="90">90%</option>
                    <option value="100">100%</option>
                </select>
            </td>
        `;

        billTable.appendChild(row);
    });

    // Handle empty cart
    if (!subtotal) {
        const emptyRow = document.createElement('tr');
        emptyRow.innerHTML = `
            <td colspan="4" style="text-align: center;">No items selected</td>
        `;
        billTable.appendChild(emptyRow);
    }

    // Update subtotal
    subtotalSpan.textContent = subtotal.toFixed(2);
}

// Change item quantity in the cart
function changeQuantity(itemName, delta) {
    if (cart[itemName]) {
        cart[itemName].quantity += delta;
        if (cart[itemName].quantity <= 0) {
            delete cart[itemName];
        }
    }
    updateBilling();
}

// Fetch the items on page load to ensure they're available for use in selections
window.onload = async function() {
    showSpinner(); // Show spinner while data is loading
    await organizeItems(); // Fetch and organize items only once
    showItems('');
    hideSpinner(); // Hide the spinner once data is loaded
    checkSessionElements()
};


////////////////////////////////////////////////////////////////////////////////////////////
// Reset order onclick reset button

function resetBilling() {
    // Get the table body element for billing
    const billTable = document.querySelector('.billing table tbody');
    // Get the subtotal element
    const subtotalSpan = document.getElementById('subtotal');
    const additionalDiscount = document.getElementById('discountdropdown1');
    const roundBill = document.getElementById('currencyInput');

    // Check if the table body exists and if it has rows
    if (billTable) {
        // Loop through each row and remove its <td> elements
        const rows = billTable.querySelectorAll('tr');
        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            cells.forEach(cell => {
                row.removeChild(cell); // Remove each <td> element
            });
        });
    }

    cart = {};

    // Reset the subtotal text to '0.00'
    if (subtotalSpan) {
        subtotalSpan.textContent = '0.00'; // Set the subtotal text to '0.00'
    }

    additionalDiscount.value = "";
    roundBill.value = "";
}

// Reset order onclick reset button
document.getElementById('reset-btn').addEventListener('click', function() {
    resetBilling();
    const activePageLink = document.querySelector('.pagination .page-item.active .page-link');
    const activePage = activePageLink.textContent.trim();
    const pageLink = document.querySelector(`.pagination .page-item:nth-child(${activePage}) .page-link`);
    pageLink.style.backgroundColor = "";
    pageLink.style.color = "";
    sessionStorage.removeItem(activePage);
    sessionStorage.removeItem(activePage + "_complimentary");
    sessionStorage.removeItem(activePage + "_waveDiscounts");
    sessionStorage.removeItem(activePage + "_additionalDiscount");
    sessionStorage.removeItem(activePage + "_roundBill");
});
/////////////////////////////////////////////////////////////////////////////////////////////////////

function checkSessionElements() {
    // List of session elements you want to check
    const sessionKeys = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

    // Loop through each session key and check if it's available in sessionStorage
    sessionKeys.forEach(key => {
      const value = sessionStorage.getItem(key); // Get the value from sessionStorage

      // If the value exists in sessionStorage, apply styles to corresponding page link and select option
      if (value) {
        // Find the corresponding page link by its position in the pagination
        const pageLink = document.querySelector(`.pagination .page-item:nth-child(${key}) .page-link`);

        if (pageLink) {
          pageLink.style.backgroundColor = "green";
          pageLink.style.color = "white";
        }
      }
    });
  }


// To draft the order
document.getElementById('draft-btn').addEventListener('click', function() {

    // Get the select element
    const activePageLink = document.querySelector('.pagination .page-item.active .page-link');
    const errorMessage = document.getElementById('box2');
    const successMessage = document.getElementById('box');
    const alertMessage = document.getElementById('almessage');
    if (!activePageLink || !activePageLink.textContent) {
      alertMessage.textContent = "Please select a table before proceeding!";
      errorMessage.style.display = "block"; // Show error message
      setTimeout(() => {
        errorMessage.style.display = "none";
      }, 3000);
    } else {
    const activePage = activePageLink.textContent.trim();
    
    // Check if the selected value is the default
    if (activePage === "") {
      alertMessage.textContent = "Please select a table before proceeding!";
      errorMessage.style.display = "block"; // Show error message
      setTimeout(() => {
        errorMessage.style.display = "none";
      }, 3000);
    } else {
      errorMessage.style.display = "none"; // Hide error message
      // Proceed with your logic
      const billTable = document.querySelector('.billing table tbody');
      const subtotalSpan = document.getElementById('subtotal');
      let subtotal = 0;

      // Prepare the data for storage
      const billingData = {
          items: [],
          subtotal: subtotalSpan.textContent
      };

      // Loop through the cart items and gather data
      Object.values(cart).forEach(item => {
          subtotal += item.price * item.quantity;

          // Add each item to the billing data
          billingData.items.push({
              name: item.name,
              quantity: item.quantity,
              price: item.price,
              total: (item.price * item.quantity).toFixed(2)
          });
      });

      // Store the data in sessionStorage using the table number as the key
      sessionStorage.setItem(activePage, JSON.stringify(billingData));
      console.log(billingData)


      let complimentaryItems = [];
      let waveDiscounts = [];
      let additionalDiscount = document.getElementById('discountdropdown1').value;
      let roundBill = document.getElementById('currencyInput').value;

      document.querySelectorAll('[id^="complimentary-"]').forEach(checkbox => {
          if (checkbox.checked) {
              let itemName = checkbox.id.replace('complimentary-', '');
              complimentaryItems.push(itemName);
          }
      });

      document.querySelectorAll('[id^="discountdropdown-"]').forEach(select => {
          let itemName = select.id.replace('discountdropdown-', '');
          let discountValue = select.value;
          if (discountValue) {
              waveDiscounts.push({ item: itemName, discount: discountValue + '%' });
          }
      });

      sessionStorage.setItem(activePage + "_complimentary", JSON.stringify(complimentaryItems));
      sessionStorage.setItem(activePage + "_waveDiscounts", JSON.stringify(waveDiscounts));
      sessionStorage.setItem(activePage + "_additionalDiscount", additionalDiscount);
      sessionStorage.setItem(activePage + "_roundBill", roundBill);

      success.textContent = "Order Saved as Draft!";
      successMessage.style.display = "block";
      setTimeout(() => {
        successMessage.style.display = "none";
      }, 3000);
    }
    }
  });


//Show drafted orders
function setActive(element) {
    checkSessionElements();
    const pageItems = document.querySelectorAll('.pagination .page-item');
    pageItems.forEach((item) => item.classList.remove('active'));
    const clickedPage = element.parentElement;
    clickedPage.classList.add('active');

    const pageLink = document.querySelector(`.pagination .page-item:nth-child(${element.textContent.trim()}) .page-link`);
    pageLink.style.backgroundColor = "";
    pageLink.style.color = "";

    const tableNumber = element.textContent.trim();

    // Fetch the data from sessionStorage
    const tableData = sessionStorage.getItem(tableNumber);
    if (tableData) {
        resetBilling();
        showItems('home');
        const billingData = JSON.parse(tableData);

        billingData.items.forEach((item) => {

            // Search for the item in the #menu-items container
            const menuItemsContainer = document.getElementById('menu-items');
            const menuItemsList = Array.from(menuItemsContainer.querySelectorAll('.menu-item1')); // Dynamically created items
            const itemIndex = menuItemsList.findIndex(menuItem => {
              // Compare the text inside the <h5> tag to match the item name
              return menuItem.querySelector('div div').textContent.trim() === item.name;
            });

            if (itemIndex !== -1) {
              // If item is found, run addToCart with 'home' category for the quantity of the item
              for (let i = 0; i < item.quantity; i++) {
                  addToCart('home', itemIndex); // Add the item to the cart as many times as the quantity
              }

              const activePageLink = document.querySelector('.pagination .page-item.active .page-link');
              const activePage = activePageLink.textContent.trim();
              const storedComplimentary = JSON.parse(sessionStorage.getItem(activePage + "_complimentary")) || [];
              const storedWaveDiscounts = JSON.parse(sessionStorage.getItem(activePage + "_waveDiscounts")) || [];
              const storedAdditionalDiscount = sessionStorage.getItem(activePage + "_additionalDiscount") || "";
              const storedRoundBill = sessionStorage.getItem(activePage + "_roundBill") || "";

              storedComplimentary.forEach(item => {
                  let checkbox = document.getElementById(`complimentary-${item}`);
                  if (checkbox) checkbox.checked = true;
              });
              
              storedWaveDiscounts.forEach(entry => {
                  let select = document.getElementById(`discountdropdown-${entry.item}`);
                  if (select) select.value = entry.discount.replace('%', '');
              });

              document.getElementById('discountdropdown1').value = storedAdditionalDiscount;
              document.getElementById('currencyInput').value = storedRoundBill;

              resetupdatebilling();

            } else {
                console.warn(`Item "${item.name}" not found in menu-items.`);
            }
        });

    } else {
      resetBilling();
    }
}

//////////////////////////////////////////////////////////////////////////////////////////////////

//Refresh Menu

document.getElementById("refreshmenu-btn").addEventListener("click", async () => {
    sessionStorage.setItem('data2', JSON.stringify([]));
    const submitButton = document.getElementById('refreshmenu-btn')
    submitButton.style.backgroundColor = 'lightgrey';
    submitButton.style.border = 'lightgrey';
    submitButton.disabled = true;
    const errorMessage = document.getElementById('box2');
    const successMessage = document.getElementById('box');
    const alertMessagered = document.getElementById('almessage');
    const alertMessagegreen = document.getElementById('success');
    try {

      // Fetch and organize items only once
      await organizeItems(); 

      // Display the items on the page (assuming 'home' is a valid category or section)
      showItems('');

      // Check session elements (assuming the function checks session state or similar)
      checkSessionElements();
      alertMessagegreen.textContent = "Product Refreshed!";
        successMessage.style.display = "block";
        setTimeout(() => {
          successMessage.style.display = "none";
        }, 3000);
      submitButton.style.backgroundColor = '';
      submitButton.style.border = '';
      submitButton.disabled = false;
    } catch (error) {
      alertMessagered.textContent = "Failed!";
                errorMessage.style.display = "block"; // Show error message
                setTimeout(() => {
                  errorMessage.style.display = "none";
                }, 3000);
      submitButton.style.backgroundColor = '';
      submitButton.style.border = '';
      submitButton.disabled = false;
    }
  });

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  //Add Tip in corrected format

// Function to format input value as Indian currency
// Function to format input as Indian currency (on blur)
function formatCurrency(input) {
  let value = input.value.replace(/[^0-9.]/g, ""); // Remove non-numeric characters
  if (value) {
    const parts = parseFloat(value).toFixed(2).split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{2})+(?!\d))/g, ",").replace(/^,/, "");
    input.value = "₹" + parts.join(".");
    resetupdatebilling()
  } else {
    input.value = ""; // Clear input if no valid value
    resetupdatebilling()
  }
}

// Function to remove currency format (on focus)
function removeCurrencyFormat(input) {
  input.value = input.value.replace(/[^0-9.]/g, ""); // Strip all formatting and show raw value
  resetupdatebilling()
}

//////////////////////////////////////////////////////////////////////////////////////////////////////

function toggleComplimentary(itemName, itemPrice) {
}

document.getElementById('discountdropdown1').addEventListener('change', function () {
  resetupdatebilling();
});

///////////////////////////////////////////////////////////////////////////////////////////////////////

// Billing calculations
function resetupdatebilling() {
  let subtotal = 0;

  // Calculate the subtotal from the cart
  Object.values(cart).forEach(item => {
    subtotal += item.price * item.quantity;
  });

  // Calculate the total price of selected complimentary items
  const checkboxes = document.querySelectorAll("input[type='checkbox']");
  let totalComplimentaryPrice = 0;

  checkboxes.forEach(checkbox => {
    if (checkbox.checked) {
      const itemName = checkbox.id.replace('complimentary-', ''); // Extract item name
      const itemPriceMatch = checkbox.getAttribute('onchange').match(/,\s*([\d.]+)/); // Extract price from the onchange attribute

      if (itemPriceMatch) {
        const itemPrice = parseFloat(itemPriceMatch[1]);
        totalComplimentaryPrice += itemPrice;
      }
    }
  });

  subtotal -= totalComplimentaryPrice;

  // Calculate the total discount from dropdowns
  const dropdowns = document.querySelectorAll(".form-select");
  let totalDiscount = 0;

  dropdowns.forEach(dropdown => {
    const itemName = dropdown.id.replace('discountdropdown-', ''); // Extract item name
    const discountValue = parseFloat(dropdown.value); // Get selected discount value
    const itemPrice = parseFloat(dropdown.getAttribute('data-price')); // Get item price from data-price attribute

    if (!isNaN(discountValue) && !isNaN(itemPrice)) {
      const discountedAmount = (itemPrice * discountValue) / 100;
      totalDiscount += discountedAmount;
    }
  });

  subtotal -= totalDiscount;

  // Update the subtotal display
  const subtotalSpan = document.getElementById('subtotal');
  subtotalSpan.textContent = subtotal.toFixed(2);

  // Handle the global discount if applicable
  const globalDiscountDropdown = document.querySelector(".total .form-select");
  if (globalDiscountDropdown) {
    const globalDiscountValue = parseFloat(globalDiscountDropdown.value);

    if (!isNaN(globalDiscountValue)) {
      const globalDiscountAmount = (subtotal * globalDiscountValue) / 100;
      subtotal -= globalDiscountAmount;
      subtotalSpan.textContent = subtotal.toFixed(2);
    }
  }
  const settlement = document.getElementById('currencyInput');
  let settlementValue = settlement.value.replace(/[₹,]/g, ''); // Remove ₹ and commas

  // If the input is empty or invalid, consider the value as 0
  settlementValue = settlementValue === '' ? 0 : parseFloat(settlementValue);

  subtotal -= settlementValue;
  const subtotalSpan1 = document.getElementById('subtotal');
  subtotalSpan1.textContent = subtotal.toFixed(2);
}

/////////////////////////////////////////////////////////////////////////////////////////////////

// to disable wave% if complimentory is selected
document.addEventListener('change', function (event) {
  // Check if the event target is a checkbox
  if (event.target.matches("input[type='checkbox']") && event.target.id.startsWith('complimentary-')) {
    const checkbox = event.target;

    // Extract the item name from the checkbox ID
    const itemName = checkbox.id.replace('complimentary-', '');
    
    // Find the corresponding dropdown
    const dropdown = document.getElementById(`discountdropdown-${itemName}`);
    
    // Disable or enable the dropdown based on the checkbox state
    if (checkbox.checked) {
      dropdown.disabled = true; // Disable the dropdown
      dropdown.selectedIndex = 0;
      resetupdatebilling();
    } else {
      dropdown.disabled = false; // Enable the dropdown
      resetupdatebilling();
    }
  }
});

/////////////////////////////////////////////////////////////////////////////////////////////////////

function validatePhoneNumber(input) {
  let value = input.value.trim();

  // Validate phone number after +91
  const phoneRegex = /^\d{12}$/;
  const phoneError = document.getElementById('phoneError');

  if (!phoneRegex.test(value)) {
      phoneError.style.display = 'block';
      input.classList.remove("is-valid");
      input.classList.add("is-invalid");
  } else {
      phoneError.style.display = 'none';
      input.classList.remove("is-invalid");
      input.classList.add("is-valid");
  }

  input.value = value; // Update the input value with +91
}



function validateemail(input) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email validation regex
  const emailError = document.getElementById("emailError");

  if (emailPattern.test(input.value)) {
      emailError.style.display = "none";
      input.classList.remove("is-invalid");
      input.classList.add("is-valid");
  } else {
      emailError.style.display = "block";
      input.classList.remove("is-valid");
      input.classList.add("is-invalid");
  }
}


/////////////////////////////////////////////////////////////////////////////////////////////////////

// Complete Order Function
// Complete Order Function
function completeOrder() {
  const activePageLink = document.querySelector('.pagination .page-item.active .page-link');
    const errorMessage = document.getElementById('box2');
    const alertMessage = document.getElementById('almessage');
    if (!activePageLink || !activePageLink.textContent) {
      alertMessage.textContent = "Please select a table before proceeding!";
      errorMessage.style.display = "block"; // Show error message
      setTimeout(() => {
        errorMessage.style.display = "none";
      }, 3000);
      return
    } 
      
    // Collect items from the table
  const tableRows = document.querySelectorAll('#billing tbody tr');
  let items = [];

  tableRows.forEach(row => {
    const itemName = row.querySelector('td:nth-child(1)')?.innerText?.trim() || "";

    // Add to items array
    items.push({
      name: itemName,
    });
  });
  
  // Check if items are valid
  if (items.length === 0 || items.some(item => !item.name || item.quantity <= 0 || item.price <= 0)) {
    alertMessage.textContent = "Please select items before proceeding!!";
    errorMessage.style.display = "block"; // Show error message
    setTimeout(() => {
      errorMessage.style.display = "none";
    }, 3000);
    return;
  }

  // Open the modal
  const modalElement = document.getElementById('smallModal');
  const bootstrapModal = new bootstrap.Modal(modalElement);
  bootstrapModal.show();
}

/////////////////////////////////////////////////////////////////////////////////////////

// Add data

// Function to disable the submit button with feedback
function disableButton(button) {
  button.style.backgroundColor = "lightgrey";
  button.style.border = "lightgrey";
  button.disabled = true;
}

// Function to reset the submit button's state
function resetSubmitButton(button) {
  button.style.backgroundColor = "";
  button.style.border = "";
  button.disabled = false;
}

// Add an event listener to the button
document.getElementById('submitorder').addEventListener('click', async function () {
  const submitButton = document.getElementById("submitorder");
  disableButton(submitButton);
  const errorMessage = document.getElementById('box2');
  const successMessage = document.getElementById('box');
  const alertMessage = document.getElementById('almessage');
  const alertMessagegreen = document.getElementById('almessage');

  // Capture form data
  let customerName = document.getElementById('nameSmall').value;
  let phoneNumber = document.getElementById('phoneSmall').value;
  let paymentMethod = document.getElementById('paymentSmall').value;
  let customerEmail = document.getElementById('emailSmall').value;

  // Optional: Validation example
  //if (!customerName || !phoneNumber || !paymentMethod) {
  //  alertMessage.textContent = "All fields are required!";
  //  errorMessage.style.display = "block"; // Show error message
  //  resetSubmitButton(submitButton);
  //  setTimeout(() => {
  //    errorMessage.style.display = "none";
  //  }, 3000);
  //  return
  //}

  if (!customerName ) {
    customerName = "Customer"
  }

  if (!phoneNumber ) {
    phoneNumber = "000000000000"
  }

  if (!paymentMethod ) {
    paymentMethod = "Cash"
  }


  // Capture dynamically generated table data
  const tableRows = document.querySelectorAll('#billing tbody tr');
  let items = [];

  tableRows.forEach(row => {
      let itemName = row.querySelector('td:nth-child(1)').innerText;
      let quantity = row.querySelector('td:nth-child(2) .quantity-control').childNodes[2].textContent.trim();
      let total = row.querySelector('td:nth-child(3)').innerText.replace('₹', '').trim();
      let complimentaryChecked = row.querySelector(`input[type="checkbox"]:checked`) !== null;
      let discountDropdown = row.querySelector('select.form-select').value;

      items.push({
          itemName: itemName,
          quantity: quantity,
          total: total,
          complimentaryChecked: complimentaryChecked,
          discount: discountDropdown
      });
  });


  // Capture subtotal and discount from the bottom section
  const subtotal = document.getElementById('subtotal').innerText;
  const discount = document.getElementById('discountdropdown1').value;
  const roundedAmount = document.getElementById('currencyInput').value;

  // Print subtotal and discount data

  if (phoneNumber !== "") {
    var phonePattern = /^[0-9]{12}$/;
    if (!phonePattern.test(phoneNumber)) {
        document.getElementById('almessage').innerHTML = "Phone Number is not valid!";
        var box2 = document.getElementById("box2");
        box2.style.display = "inline-block";
        resetSubmitButton(submitButton);
        setTimeout(function () {
            box2.style.display = "none";
        }, 3000);
        return;
    }
  }

  if (customerEmail !== "") {
      var re = /\S+@\S+\.\S+/;
      if (!re.test(customerEmail)) {
          document.getElementById('almessage').innerHTML = "Email is not valid!"
          var box2 = document.getElementById("box2");
              box2.style.display = "inline-block";
              resetSubmitButton(submitButton);
              setTimeout(function () {
                  box2.style.display = "none";
              }, 3000);
          return;
      }
  }
  let randomkey = generateRandomKey();
  let randomkey2 = generateRandomKey();

  const encryptedUrl = "U2FsdGVkX19DNh1HZc6CSWDxzdUsnPtalFFkw+60E3oxpUPZjiiPHAmqvb9qq7976vqj/8rxk2ue+O6lbjbzzV9ICsEY9GQceRyS/Dl/1eFq90w0i+Dg9eveUH614+ll51Tt3DCy1inG5sQsh/uK+uKmSsA5dmMkbUMiRpPC50+ljuaenJYXi2dUKEzz2QFD";
  var MartechDataPass = sessionStorage.getItem('MartechDataPass');       
  const decryptedUrl = decryptURL(encryptedUrl, MartechDataPass);

  // Construct the URL for the Apps Script web app (replace with your actual web app URL)
  const url = new URL(decryptedUrl);

  // Append all the captured data as query parameters
  url.searchParams.append("usecase", "addorder");
  url.searchParams.append("randomkey", randomkey);
  url.searchParams.append("customerName", customerName);
  url.searchParams.append("phoneNumber", phoneNumber);
  url.searchParams.append("paymentMethod", paymentMethod);
  url.searchParams.append("items", JSON.stringify(items)); // Send the items as a JSON string
  url.searchParams.append("subtotal", subtotal);
  url.searchParams.append("discount", discount);
  url.searchParams.append("roundedAmount", roundedAmount);
  url.searchParams.append("customerEmail", customerEmail);

  try {
    // Make a GET request to the Google Apps Script web app
    const response = await fetch(url);
    const data = await response.json();

    let contactmaster_cart = JSON.parse(sessionStorage.getItem('contactmaster_cart')) || [];
    let custom_attribute_cart = JSON.parse(sessionStorage.getItem('custom_attribute_cart')) || [];
    let blacklist_cart = JSON.parse(sessionStorage.getItem('blacklist_cart')) || [];
    let orderCart = JSON.parse(sessionStorage.getItem('order_cart')) || [];
    let data2 = JSON.parse(sessionStorage.getItem('data2')) || [];
    let subtotal = document.getElementById('subtotal').innerText;
    let pn = document.getElementById('phoneSmall').value;
    let cn = document.getElementById('nameSmall').value;
    let ce = document.getElementById('emailSmall').value;
    const phoneExists = contactmaster_cart.find(row => String(row[3]) === String(pn));

    items.forEach(item => {
      let foundEntries = data2.filter(entry => entry[1] === item.itemName); // Find all matches
  
      if (foundEntries.length > 0) {
          console.log("Matches found:", foundEntries);
  
          foundEntries.forEach(entry => {
              if (entry[6] === "PIECES") {  // Check if unit is "PIECES"
                  entry[5] = Math.max(0, entry[5] - item.quantity); // Reduce quantity (ensure it doesn't go below 0)
              }
              else if (entry[6] === "LITERS") {  
                entry[5] = Math.max(0, entry[5] - (item.quantity*0.05)); // Reduce quantity (ensure it doesn't go below 0)
            }
          });
  
          console.log("Updated Entries:", foundEntries);
          sessionStorage.setItem('data2', JSON.stringify(data2));
      }
    });
  

    if (!phoneExists) {
      // Get new row values from the input fields
      const newRow = [
          randomkey,
          cn,
          ce,
          pn,
          new Date().toISOString(), // Adding timestamp
          ""
      ];

      const newRow2 = [
          randomkey,
          "",
          ce,
          pn,
          "",
          "",
          "",
          "",
          "ENABLED",
          new Date().toISOString(), // Adding timestamp
      ];

      const newRow3 = [
        randomkey2,
        randomkey,
        new Date().toISOString(),
        "",
        "",
        subtotal,
      ];

      contactmaster_cart.unshift(newRow);
      sessionStorage.setItem('contactmaster_cart', JSON.stringify(contactmaster_cart));

      custom_attribute_cart.unshift(newRow);
      sessionStorage.setItem('custom_attribute_cart', JSON.stringify(custom_attribute_cart));

      blacklist_cart.unshift(newRow2);
      sessionStorage.setItem('blacklist_cart', JSON.stringify(blacklist_cart));

      orderCart.unshift(newRow3);
      sessionStorage.setItem('order_cart', JSON.stringify(orderCart));

    } else {
      const randomkey = phoneExists ? phoneExists[0] : null;
      const newRow = [
        randomkey2,
        randomkey,
        new Date().toISOString(),
        "",
        "",
        subtotal,
    ];
    orderCart.unshift(newRow);
    sessionStorage.setItem('order_cart', JSON.stringify(orderCart));
    }

    success.textContent = "Order Completed!";
    successMessage.style.display = "block";
    setTimeout(() => {
      successMessage.style.display = "none";
    }, 3000);


    resetSubmitButton(submitButton);
    const resetButton = document.getElementById('reset-btn');
    // Simulate a button press
    resetButton.click();

    const customerName = document.getElementById('nameSmall')
    const phoneNumber = document.getElementById('phoneSmall')
    const paymentMethod = document.getElementById('paymentSmall')
    const customerEmail = document.getElementById('emailSmall')

    customerName.value = ''; 
    phoneNumber.value = ''; 
    paymentMethod.value = ''; 
    customerEmail.value = ''; 

    const closemodal = document.getElementById('closemodal');
    // Simulate a button press
    closemodal.click();

  } catch (error) {
      alertMessage.textContent = "Failed!";
      errorMessage.style.display = "block"; // Show error message
      setTimeout(() => {
        errorMessage.style.display = "none";
      }, 3000);
      console.error("Error occurred while sending data to Apps Script:", error);
      resetSubmitButton(submitButton);
  }

});

////////////////////////////////////////////////////////////////////////////////////////////////////


function generateRandomKey(length = 10) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({ length }, () => characters.charAt(Math.floor(Math.random() * characters.length))).join('');
}

function decryptURL(encryptedUrl, password) {
  return CryptoJS.AES.decrypt(decodeURIComponent(encryptedUrl), password).toString(CryptoJS.enc.Utf8);
}