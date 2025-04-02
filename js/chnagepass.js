// Function to disable the submit button
function disableButton(button) {
    button.style.backgroundColor = 'lightgrey';
    button.style.border = 'lightgrey';
    button.disabled = true;
}

// Function to enable the submit button
function enableButton(button) {
    button.style.backgroundColor = '';
    button.style.border = '';
    button.disabled = false;
}

// Function to show error message and re-enable the button
function showError(errorMessage, button) {
    errorMessage.style.display = "block";
    setTimeout(() => {
        errorMessage.style.display = "none";
    }, 3000);
    enableButton(button);
}


document.getElementById("chnage_password").addEventListener("click", async () => {
    const submitButton = document.getElementById('chnage_password');
    const errorMessage = document.getElementById('box2');
    const alertMessagered = document.getElementById('almessage');

    // Get input values

    const currentpassword = document.getElementById('current_password').value;
    const newpassword = document.getElementById('new_password').value;

    if (currentpassword === "" || newpassword === "") {
        alertMessagered.textContent = "Mandatory fields are required.";
        showError(errorMessage, submitButton);
        return;
    }

    var MartechPassword = sessionStorage.getItem("Password");

    if (currentpassword !== MartechPassword) {
        alertMessagered.textContent = "Please enter correct current password.";
        showError(errorMessage, submitButton);
        return;
    }

    if (!/^[a-z]+$/.test(newpassword)) {
        alertMessagered.textContent = "Please enter new password in all smallcase.";
        showError(errorMessage, submitButton);
        return;
    }

    // Disable the submit button while processing
    disableButton(submitButton);

    // Construct the URL
    const url = new URL("https://script.google.com/macros/s/AKfycbzkgR57couUXfhmao-0GP4khq5WVVDza3m3bnki9izyBV-vErRBkRg0fPfuDcBUA4ulUQ/exec");
    url.searchParams.append("usecase", "change_password");
    url.searchParams.append("currentpassword", currentpassword);
    url.searchParams.append("newpassword", newpassword);

    try {
        // Make the API call
        const response = await fetch(url);
        const data = await response.json();
        console.log(data)
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
        const newpassword = document.getElementById('new_password').value;
        sessionStorage.setItem('Password', newpassword);
        alertMessagegreen.textContent = "Password Changed!";
        document.getElementById('new_password').value = "";
        document.getElementById('current_password').value = "";
        successMessage.style.display = "block";
        setTimeout(() => {
            successMessage.style.display = "none";
        }, 3000);

    } else {
        alertMessagered.textContent = response.message || "Failed to submit request. Please try again.";
        showError(errorMessage, submitButton);
    }

    // Enable the submit button
    enableButton(submitButton);
}

