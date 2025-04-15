
/**
 * Contact Master
 */



'use strict';



let contactmaster_cart = [];

function fetchDataAndStoreInCart() {
    const loaderContainer = document.getElementById("loader"); 
    loaderContainer.style.display = "flex"; // Show loading spinner

    const encryptedUrl = "U2FsdGVkX18c06sMzT40eYKs90acaOBPihyRaQ9DwTlTpf2cgqYXRS0dnHvya6H+bislOUz47Iu9yr8bGhWs65N8xTJOKShniWYRNSe7ImrRL3RdsfGMk5OgdaK8oteK/voxaeTuOHPvdT5P0TlwtrK33cWn4e5h72+Jij/S1pZxgzoQhCOL3DqN65apFax06uHJfH+ZvdEr4s2eeAV0Bg==";
 
    var MartechDataPass = sessionStorage.getItem('MartechDataPass');       
    const decryptedUrl = decryptURL(encryptedUrl, MartechDataPass);

    fetch(decryptedUrl)
        .then(response => response.json())
        .then(data => {
            contactmaster_cart = data.slice(1); // Store data in cart, skipping header row
            sessionStorage.setItem('contactmaster_cart', JSON.stringify(contactmaster_cart));
            sessionStorage.setItem('custom_attribute_cart', JSON.stringify(contactmaster_cart));
            loadTable(); // Call loadTable to update UI
        })
        .catch(error => console.error('Error fetching data:', error))
        .finally(() => {
            loaderContainer.style.display = "none"; // Hide spinner
        });
}



function loadTable() {
    let contactmaster_cart = JSON.parse(sessionStorage.getItem('contactmaster_cart')) || [];

    if (contactmaster_cart.length === 0) {
        fetchDataAndStoreInCart();  // Ensure this function is defined
    } else {
        // Ensure it's properly converted to an array (if stored incorrectly)
        if (!Array.isArray(contactmaster_cart)) {
            contactmaster_cart = [contactmaster_cart]; // Convert to an array if it's not already
        }
    }


    var dataTable = document.getElementById("dataTable");
    dataTable.getElementsByTagName('tbody')[0].innerHTML = '';

    const tableBody = document.querySelector('#dataTable tbody');

    contactmaster_cart.forEach(rowData => {
        const newRow = document.createElement('tr');

        // Extract only the first 5 columns
        const firstFiveColumns = rowData.slice(0, 5);
        let [customerid, customername, customeremail, customerphone, registrationdate] = firstFiveColumns;

        // Convert UTC timestamp to IST (Indian Standard Time)
        const date = new Date(registrationdate); // Convert string to Date object
        const options = {
            weekday: 'short', // 'Mon'
            year: 'numeric',
            month: 'short', // 'Feb'
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true, // 12-hour format
        };

        const istTime = date.toLocaleString('en-IN', options); // Converts to IST in 12-hour format

        // Format the time to match the desired format: "Feb 10, 2025 05:30 PM"
        const formattedTime  = istTime.replace(',', '').replace(' AM', 'AM').replace(' PM', 'PM');

        let updatedColumns = [customerid, customername, customeremail, customerphone, formattedTime];

        updatedColumns.forEach(cellData => {
            const newCell = document.createElement('td');
            newCell.textContent = cellData;
            newRow.appendChild(newCell);
        });

        const actionsCell = document.createElement('td');
        actionsCell.innerHTML = `
            <div class="dropdown">
                <button type="button" class="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                    <i class="bx bx-dots-vertical-rounded"></i>
                </button>
                <div class="dropdown-menu">
                    <a class="dropdown-item" href="#" onclick="openModal('${customerid}','${customername}', '${customeremail}','${customerphone}', '${formattedTime}')">
                        <i class="bx bx-pencil me-1"></i> Edit
                    </a>
                </div>
            </div>
        `;

        newRow.appendChild(actionsCell);
        tableBody.appendChild(newRow);
    });
}



function searchTable() {
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("searchInput");
    filter = input.value.toUpperCase();
    table = document.getElementById("dataTable");
    tr = table.getElementsByTagName("tr");

    // Loop through all table rows
    for (i = 1; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td");
        var found = false;
        for (var j = 0; j < td.length; j++) {
            txtValue = td[j].textContent || td[j].innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                found = true;
                break;
            }
        }
        if (found) {
            tr[i].style.display = "";
        } else {
            tr[i].style.display = "none";
        }
    }
}


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

// Function to show error message and re-enable the button
function showError(errorMessage, button) {
    errorMessage.style.display = "block";
    setTimeout(() => {
    errorMessage.style.display = "none";
    }, 3000);
    resetSubmitButton(button);
}

document.getElementById('editButton').addEventListener('click', async function () {
    const submitButton = document.getElementById("editButton");
    disableButton(submitButton);
    const errorMessage = document.getElementById('box2');
    const successMessage = document.getElementById('box');
    const alertMessage = document.getElementById('almessage');
    const alertMessagered = document.getElementById('almessage');

    // Capture form data
    const CUSTOMER_ID = document.getElementById('CUSTOMER_ID').value;    
    const CUSTOMER_NAME = document.getElementById('CUSTOMER_NAME').value; 
    const EMAIL = document.getElementById('EMAIL').value; 
    const PHONE = document.getElementById('PHONE').value; 
    const REGISTRATION_DATE = document.getElementById('REGISTRATION_DATE').value;

    if (PHONE !== "") {
        var phonePattern = /^[0-9]{12}$/;
        if (!phonePattern.test(PHONE)) {
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

    if (EMAIL !== "") {
        var re = /\S+@\S+\.\S+/;
        if (!re.test(EMAIL)) {
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

    const encryptedUrl = "U2FsdGVkX19DNh1HZc6CSWDxzdUsnPtalFFkw+60E3oxpUPZjiiPHAmqvb9qq7976vqj/8rxk2ue+O6lbjbzzV9ICsEY9GQceRyS/Dl/1eFq90w0i+Dg9eveUH614+ll51Tt3DCy1inG5sQsh/uK+uKmSsA5dmMkbUMiRpPC50+ljuaenJYXi2dUKEzz2QFD";
 
    var MartechDataPass = sessionStorage.getItem('MartechDataPass');       
    const decryptedUrl = decryptURL(encryptedUrl, MartechDataPass);

    // Construct the URL for the Apps Script web app (replace with your actual web app URL)
    const url = new URL(decryptedUrl);

    // Append all the captured data as query parameters
    url.searchParams.append("usecase", "editcontact");
    url.searchParams.append("CUSTOMER_ID", CUSTOMER_ID);
    url.searchParams.append("CUSTOMER_NAME", CUSTOMER_NAME);
    url.searchParams.append("EMAIL", EMAIL);
    url.searchParams.append("PHONE", PHONE);
    url.searchParams.append("REGISTRATION_DATE", REGISTRATION_DATE);

    try {
        // Make the API call
        const response = await fetch(url);
        const data = await response.json();
        handleResponse1(data, submitButton);
      } catch (error) {
        alertMessagered.textContent = "An unexpected error occurred. Please try again.";
        showError(errorMessage, submitButton);
      }
    });

    // Function to handle the server response
    function handleResponse1(response, submitButton) {
        const successMessage = document.getElementById('box');
        const alertMessagegreen = document.getElementById('success');
        const alertMessagered = document.getElementById('almessage');
        const errorMessage = document.getElementById('box2');

        if (response.status === "success") {
            const CUSTOMER_ID = document.getElementById('CUSTOMER_ID').value;    
            const CUSTOMER_NAME = document.getElementById('CUSTOMER_NAME').value; 
            const EMAIL = document.getElementById('EMAIL').value; 
            const PHONE = document.getElementById('PHONE').value; 
            const REGISTRATION_DATE = document.getElementById('REGISTRATION_DATE').value;

        // Update cart with new values
            let contactmaster_cart = JSON.parse(sessionStorage.getItem('contactmaster_cart')) || [];
            let custom_attribute_cart = JSON.parse(sessionStorage.getItem('custom_attribute_cart')) || [];
            let blacklist_cart = JSON.parse(sessionStorage.getItem('blacklist_cart')) || [];
            const index = contactmaster_cart.findIndex(row => row[0] === CUSTOMER_ID);
            const index2 = custom_attribute_cart.findIndex(row => row[0] === CUSTOMER_ID);
            const index3 = blacklist_cart.findIndex(row => row[0] === CUSTOMER_ID);
            if (index !== -1) {
                contactmaster_cart[index] = [CUSTOMER_ID, CUSTOMER_NAME, EMAIL, PHONE, REGISTRATION_DATE];
                custom_attribute_cart[index2] = [CUSTOMER_ID, CUSTOMER_NAME, EMAIL, PHONE, REGISTRATION_DATE, custom_attribute_cart[index2][5]];
                blacklist_cart[index3] = [CUSTOMER_ID, "", EMAIL, PHONE, "", "", "", "", blacklist_cart[index3][8], blacklist_cart[index3][9]];
                sessionStorage.setItem('contactmaster_cart', JSON.stringify(contactmaster_cart));
                sessionStorage.setItem('custom_attribute_cart', JSON.stringify(custom_attribute_cart));
                sessionStorage.setItem('blacklist_cart', JSON.stringify(blacklist_cart));

                loadTable(); // Refresh table after update
            }

            alertMessagegreen.textContent = "Contact Updated!";
            $('#largeModal').modal('hide');
            successMessage.style.display = "block";
            setTimeout(() => {
                successMessage.style.display = "none";
            }, 3000);

        } else {
        alertMessagered.textContent = response.message || "Failed! Please try again.";
        showError(errorMessage, submitButton);
        }

        // Enable the submit button
        resetSubmitButton(submitButton);
    }


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


function decryptURL(encryptedUrl, password) {
    return CryptoJS.AES.decrypt(decodeURIComponent(encryptedUrl), password).toString(CryptoJS.enc.Utf8);
}

    