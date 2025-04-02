async function login() {
    const submitButton = document.getElementById('submitbutton');
    const alertBox = document.getElementById("alert");
    const alertMessage = document.getElementById('alertmessage');
    const username = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const rememberMe = document.getElementById('remember-me');

    // Disable button and update UI
    updateButtonState(submitButton, true);

    try {
        // Generate a random key
        const key = Math.random().toString(36).substr(2, 10);

        // Store credentials temporarily
        sessionStorage.setItem("Username", username);
        sessionStorage.setItem("Password", password);
        sessionStorage.setItem("key", key);

        // Fetch IP address
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        const { ip: ipAddress } = await ipResponse.json();

        // Prepare form data
        const formData = new FormData();
        formData.append("username", username);
        formData.append("password", password);
        formData.append("key", key);
        formData.append("ipAddress", ipAddress);

        // Decrypt URL
        const encryptedUrl = "U2FsdGVkX19ke6xFKSff23W24Anb7XgAuMALMZQBVVp294uePNPgPhjiwQDDw0jD2+xetILnGVPt+hHJv9UFWV1TKvCt8/xDq0N06udwbHVj6kceUIvFbx8VrEJMD2cYgObPnHJaY4JDUMFvYLZIg9DCv4CO3EWnd/F4KdaLb/7f/Ai/M0LlyALi6uTvjooY";
        const decryptedUrl = decryptURL(encryptedUrl, 'secret');

        // Authenticate user
        const response = await fetch(decryptedUrl, { method: "POST", body: formData });
        const data = await response.json();

        handleLoginResponse(data, username, password, ipAddress, submitButton, alertBox, alertMessage, rememberMe);
    } catch (error) {
        console.error("Error:", error);
        alertMessage.innerHTML = "An error occurred. Please try again.";
        alertBox.style.display = "inline-block";
    } finally {
        // Restore button state
        updateButtonState(submitButton, false);
    }
}


// Function to handle login response
function handleLoginResponse(data, username, password, ipAddress, submitButton, alertBox, alertMessage, rememberMe) {
    if (data.redirectUrl === "IP Address not found") {
        loaderOverlay.style.opacity = "0";
        loaderOverlay.style.visibility = "hidden";
        alertMessage.innerHTML = "IP address is not on the whitelist!";
        alertBox.style.display = "inline-block";
        setTimeout(() => {
            alertBox.style.display = "none";
            window.location.href = "martechcloudipwhitelisting.html";
        }, 3000);
    } else if (data.redirectUrl === "Invalid username or password") {
        loaderOverlay.style.opacity = "0";
        loaderOverlay.style.visibility = "hidden";
        alertMessage.innerHTML = "Invalid username or password!";
        alertBox.style.display = "inline-block";
        setTimeout(() => {
            alertBox.style.display = "none";
        }, 3000);
    } else {
        // Remember user credentials if checked
        if (rememberMe.checked) {
            localStorage.setItem('MartechUsername', username);
            localStorage.setItem('MartechPassword', password);
        }

        // Store user session data
        const userData = {
            MartechUsername: username,
            MartechIP: ipAddress,
            MartechRole: data.role,
            MartechFirstName: data.firstname,
            MartechLastName: data.lastname,
            MartechEmail: data.email,
            MartechPhone: data.phone,
            MartechName: data.name,
            MartechDataPass: data.datapass,
            redirection: data.redirectUrl,
        };
        Object.entries(userData).forEach(([key, value]) => sessionStorage.setItem(key, value));
        contactmaster_cart1();
    }
}

// Function to update button state
function updateButtonState(button, disable) {
    button.style.backgroundColor = disable ? 'lightgrey' : '';
    button.style.border = disable ? '1px solid lightgrey' : '';
    button.disabled = disable;
}