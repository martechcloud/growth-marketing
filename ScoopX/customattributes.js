/**
 * Contact Master
 */



'use strict';



let custom_attribute_cart = [];

function fetchDataAndStoreInCart() {
    const loaderContainer = document.getElementById("loader"); 
    loaderContainer.style.display = "flex"; // Show loading spinner

    const encryptedUrl = "U2FsdGVkX18c06sMzT40eYKs90acaOBPihyRaQ9DwTlTpf2cgqYXRS0dnHvya6H+bislOUz47Iu9yr8bGhWs65N8xTJOKShniWYRNSe7ImrRL3RdsfGMk5OgdaK8oteK/voxaeTuOHPvdT5P0TlwtrK33cWn4e5h72+Jij/S1pZxgzoQhCOL3DqN65apFax06uHJfH+ZvdEr4s2eeAV0Bg==";
 
    var MartechDataPass = sessionStorage.getItem('MartechDataPass');       
    const decryptedUrl = decryptURL(encryptedUrl, MartechDataPass);

    fetch(decryptedUrl)
        .then(response => response.json())
        .then(data => {
            custom_attribute_cart = data.slice(1); // Store data in cart, skipping header row
            sessionStorage.setItem('custom_attribute_cart', JSON.stringify(custom_attribute_cart));
            sessionStorage.setItem('contactmaster_cart', JSON.stringify(custom_attribute_cart));
        })
        .catch(error => console.error('Error fetching data:', error))
        .finally(() => {
            loaderContainer.style.display = "none"; // Hide spinner
        });
}


document.addEventListener("DOMContentLoaded", function () {

    // Add event listener to the button
    document.querySelector(".account-image-reset").addEventListener("click", function () {
        let custom_attribute_cart = JSON.parse(sessionStorage.getItem('custom_attribute_cart')) || [];

        // Get the input value
        const inputValue = document.getElementById("CUSTOMER_ID").value.trim();
        
        // Search first by Customer ID (row[0]), if not found, search by Customer Phone (row[3])
        let customer = custom_attribute_cart.find(row => row[0] === inputValue);
        
        if (!customer) {
            customer = custom_attribute_cart.find(row => row[3].toString() === inputValue); // Convert to string for matching
        }

        // If customer exists, update the corresponding fields
        if (customer) {
            document.getElementById("CUSTOMER_ID_FIELD").value = customer[0];
            document.getElementById("REGISTRATION_DATE").value = customer[4]; 
            document.getElementById("CUSTOMER_NAME").value = customer[1]; 
            document.getElementById("CUSTOMER_EMAIL").value = customer[2]; 
            document.getElementById("CUSTOMER_PHONE").value = customer[3]; 
            document.getElementById("AGE").value = customer[5]; 
        } else {
            const errorMessage = document.getElementById('box2');
            const alertMessagered = document.getElementById('almessage');
            const submitButton = document.getElementById("submitbutton");
            alertMessagered.textContent = "Customer ID or Phone Number not found!";
            showError(errorMessage, submitButton);
            document.getElementById("REGISTRATION_DATE").value = ""; // Clear field if not found
            document.getElementById("CUSTOMER_NAME").value = "";
            document.getElementById("CUSTOMER_EMAIL").value = "";
            document.getElementById("CUSTOMER_PHONE").value = "";
            document.getElementById("AGE").value = "";
        }
    });
});


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



document.getElementById('submitbutton').addEventListener('click', async function () {
    const submitButton = document.getElementById("submitbutton");
    disableButton(submitButton);
    const errorMessage = document.getElementById('box2');
    const successMessage = document.getElementById('box');
    const alertMessage = document.getElementById('almessage');
    const alertMessagered = document.getElementById('almessage');


    // Capture form data
    const CUSTOMER_ID = document.getElementById('CUSTOMER_ID_FIELD').value;    
    const CUSTOMER_NAME = document.getElementById('CUSTOMER_NAME').value; 
    const CUSTOMER_EMAIL = document.getElementById('CUSTOMER_EMAIL').value; 
    const CUSTOMER_PHONE = document.getElementById('CUSTOMER_PHONE').value; 
    const AGE = document.getElementById('AGE').value;
    const REGISTRATION_DATE = document.getElementById('REGISTRATION_DATE').value;


    if (CUSTOMER_PHONE !== "") {
        var phonePattern = /^[0-9]{12}$/;
        if (!phonePattern.test(CUSTOMER_PHONE)) {
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

    if (CUSTOMER_EMAIL !== "") {
        var re = /\S+@\S+\.\S+/;
        if (!re.test(CUSTOMER_EMAIL)) {
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
    url.searchParams.append("usecase", "customattribute");
    url.searchParams.append("CUSTOMER_ID", CUSTOMER_ID);
    url.searchParams.append("CUSTOMER_NAME", CUSTOMER_NAME);
    url.searchParams.append("CUSTOMER_EMAIL", CUSTOMER_EMAIL);
    url.searchParams.append("CUSTOMER_PHONE", CUSTOMER_PHONE);
    url.searchParams.append("AGE", AGE);
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
            let custom_attribute_cart = JSON.parse(sessionStorage.getItem('custom_attribute_cart')) || [];
            let contactmaster_cart = JSON.parse(sessionStorage.getItem('contactmaster_cart')) || [];
            const CUSTOMER_ID = document.getElementById('CUSTOMER_ID_FIELD').value;
            const CUSTOMER_NAME = document.getElementById('CUSTOMER_NAME').value; 
            const CUSTOMER_EMAIL = document.getElementById('CUSTOMER_EMAIL').value; 
            const CUSTOMER_PHONE = document.getElementById('CUSTOMER_PHONE').value; 
            const AGE = document.getElementById('AGE').value;
            const REGISTRATION_DATE = document.getElementById('REGISTRATION_DATE').value;
            let index = custom_attribute_cart.findIndex(item => item[0] === CUSTOMER_ID);
            let index2 = contactmaster_cart.findIndex(item => item[0] === CUSTOMER_ID);
            if (index !== -1) {
                // Update existing customer data
                custom_attribute_cart[index] = [CUSTOMER_ID, CUSTOMER_NAME, CUSTOMER_EMAIL, CUSTOMER_PHONE, REGISTRATION_DATE, AGE];
                contactmaster_cart[index2] = [CUSTOMER_ID, CUSTOMER_NAME, CUSTOMER_EMAIL, CUSTOMER_PHONE, REGISTRATION_DATE, AGE];
                sessionStorage.setItem('custom_attribute_cart', JSON.stringify(custom_attribute_cart));
                sessionStorage.setItem('contactmaster_cart', JSON.stringify(contactmaster_cart));
            }

            alertMessagegreen.textContent = "Contact Updated!";
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

