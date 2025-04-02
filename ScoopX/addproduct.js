function convertDriveUrl(url) {
  const match = url.match(/\/d\/([a-zA-Z0-9_-]+)\//);
  if (match && match[1]) {
      return `https://drive.google.com/thumbnail?id=${match[1]}`;
  }
  return "Invalid URL";
}



//Add product

document.getElementById("addmenu-btn").addEventListener("click", function () {
    const modal = new bootstrap.Modal(document.getElementById("modalCenter"));
    modal.show();
  });

document.getElementById("modal-addproduct").addEventListener("click", async () => {
    const submitButton = document.getElementById('modal-addproduct');
    const errorMessage = document.getElementById('box2');
    const successMessage = document.getElementById('box');
    const alertMessagered = document.getElementById('almessage');
    const alertMessagegreen = document.getElementById('success');

    // Get input values
    const productName = document.getElementById("nameWithTitle").value.trim();
    const productCategory = document.getElementById("emailWithTitle").value.trim();
    const productPrice = document.getElementById("dobWithTitle").value.trim();
    let productimage = document.getElementById("imageurl").value.trim();
    const productquantity = document.getElementById("productquantity").value.trim();
    const quantityunit = document.getElementById("quantityunit").value.trim();

    // Validate inputs
    if (!productName || !productCategory || !productPrice || !productquantity || !quantityunit) {
      alertMessagered.textContent = "Please fill all fields before adding the product!";
      showError(errorMessage, submitButton);
      return;
    }

    let data2 = JSON.parse(sessionStorage.getItem('data2')) || [];
    console.log(data2[1][1])
    if (Array.isArray(data2[1]) && data2[1][1] === productName) {
      alertMessagered.textContent = "Product Already Exist!";
      showError(errorMessage, submitButton);
      return;
    }
    

    if (!productimage) {
      productimage = "https://drive.google.com/thumbnail?id=10_lbNhWVNNAdXYt6OLCxqK8rJeHzAzCS";
    }

    if (isNaN(productPrice) || Number(productPrice) <= 0) {
      alertMessagered.textContent = "Please enter a valid price!";
      showError(errorMessage, submitButton);
      return;
    }

    // Disable the submit button while processing
    disableButton(submitButton);

    const encryptedUrl = "U2FsdGVkX19DNh1HZc6CSWDxzdUsnPtalFFkw+60E3oxpUPZjiiPHAmqvb9qq7976vqj/8rxk2ue+O6lbjbzzV9ICsEY9GQceRyS/Dl/1eFq90w0i+Dg9eveUH614+ll51Tt3DCy1inG5sQsh/uK+uKmSsA5dmMkbUMiRpPC50+ljuaenJYXi2dUKEzz2QFD";
 
    var MartechDataPass = sessionStorage.getItem('MartechDataPass');   
    const decryptedUrl = decryptURL(encryptedUrl, MartechDataPass);

    // Construct the URL
    const url = new URL(decryptedUrl);
    url.searchParams.append("usecase", "addnewproduct");
    url.searchParams.append("productName", productName);
    url.searchParams.append("productCategory", productCategory);
    url.searchParams.append("productPrice", productPrice);
    url.searchParams.append("productimage", productimage);
    url.searchParams.append("productquantity", productquantity);
    url.searchParams.append("quantityunit", quantityunit);

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
      alertMessagegreen.textContent = "Product added to menu successfully!";
      successMessage.style.display = "block";
      setTimeout(() => {
        successMessage.style.display = "none";
      }, 3000);

      // Clear input fields
      document.getElementById("nameWithTitle").value = "";
      document.getElementById("emailWithTitle").value = "";
      document.getElementById("dobWithTitle").value = "";
      document.getElementById("imageurl").value = "";
      document.getElementById("productquantity").value = "";
      document.getElementById("quantityunit").value = "";
    } else {
      alertMessagered.textContent = response.message || "Failed to add product. Please try again.";
      showError(errorMessage, submitButton);
    }

    // Enable the submit button
    enableButton(submitButton);
  }

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

  //////////////////////////////////////////////////////////////////////////////////////////////////

//Delete Product


document.getElementById("deletemenu-btn").addEventListener("click", function () {
    const modal = new bootstrap.Modal(document.getElementById("modalCenterdeletemenu"));
    modal.show();
});

document.getElementById("modal-deleteproduct").addEventListener("click", async () => {
    const submitButton = document.getElementById("modal-deleteproduct");
    const errorMessage = document.getElementById("box2");
    const successMessage = document.getElementById("box");
    const alertMessagered = document.getElementById("almessage");
    const alertMessagegreen = document.getElementById("success");

    const productName = document.getElementById("nameWithTitleproductname").value.trim();

    // Disable the submit button and provide visual feedback
    disableButton(submitButton);

    // Validate product name
    if (!productName) {
      alertMessagered.textContent = "Please add a product name!";
      showError(errorMessage, submitButton);
      return;
    }

    const encryptedUrl = "U2FsdGVkX19DNh1HZc6CSWDxzdUsnPtalFFkw+60E3oxpUPZjiiPHAmqvb9qq7976vqj/8rxk2ue+O6lbjbzzV9ICsEY9GQceRyS/Dl/1eFq90w0i+Dg9eveUH614+ll51Tt3DCy1inG5sQsh/uK+uKmSsA5dmMkbUMiRpPC50+ljuaenJYXi2dUKEzz2QFD";
 
    var MartechDataPass = sessionStorage.getItem('MartechDataPass');         
    const decryptedUrl = decryptURL(encryptedUrl, MartechDataPass);

    // Construct the URL for the Apps Script web app (replace with your actual web app URL)
    const url = new URL(decryptedUrl);
    url.searchParams.append("productName", productName);
    url.searchParams.append("usecase", "deleteproduct");

    try {
      // Make a GET request to the Google Apps Script web app
      const response = await fetch(url);
      const data = await response.json();

      // Handle the response
      handleResponse2(data, submitButton);
    } catch (error) {
      alertMessagered.textContent = "An error occurred while deleting the product.";
      showError(errorMessage, submitButton);
    }
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

  // Function to show error message and reset the button
  function showError(errorMessage, button) {
    errorMessage.style.display = "block";
    setTimeout(() => {
      errorMessage.style.display = "none";
    }, 3000);
    resetSubmitButton(button);
  }

  // Callback function to handle the response from the Apps Script
  function handleResponse2(response, submitButton) {
    const errorMessage = document.getElementById("box2");
    const successMessage = document.getElementById("box");
    const alertMessagered = document.getElementById("almessage");
    const alertMessagegreen = document.getElementById("success");

    if (response.status === "success") {
      alertMessagegreen.textContent = "Product Deleted!";
      successMessage.style.display = "block";
      setTimeout(() => {
        successMessage.style.display = "none";
      }, 3000);
      resetSubmitButton(submitButton);

      // Optionally, clear input fields or perform other UI updates
      document.getElementById("nameWithTitleproductname").value = "";
    } else {
      alertMessagered.textContent = `Error: ${response.message || "Unable to delete the product."}`;
      showError(errorMessage, submitButton);
    }
  }



document.getElementById("productimage").addEventListener("change", async function () {
  const submitButton = document.getElementById('modal-addproduct');
  const errorMessage = document.getElementById('box2');
  const successMessage = document.getElementById('box');
  const alertMessagered = document.getElementById('almessage');
  const alertMessagegreen = document.getElementById('success');
  disableButton(submitButton);
  const file = this.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.readAsDataURL(file);

  // Function to enable the submit button
  function enableButton(button) {
    button.style.backgroundColor = '';
    button.style.border = '';
    button.disabled = false;
  }
  
  reader.onload = async function () {
    const base64Data = reader.result.split(",")[1]; // Extract only the base64 part
    const formData = new URLSearchParams();
    formData.append("file", base64Data);
    formData.append("fileName", file.name);
    formData.append("mimeType", file.type);

    alertMessagegreen.textContent = "Processing Image!";
    successMessage.style.display = "block";
    setTimeout(() => {
      successMessage.style.display = "none";
    }, 6000);

    const encryptedUrl = "U2FsdGVkX1+n4CxXU+KfYuexrF6XGwrQcV6vdSmBfcrqrctvMG942GXXrVEI/w7UBCe1w5la6q8C6czPdBflA9ki8Edn8R0qDCmhoFfxplG3+jFXbHXtMEwpG5DuzYB+h3ax4lbFzbx6nk/dKSGnH+OFB/V03vUmR9P55rdkPDg+yyCiD9ytrYKNJq2aCbz5";
 
    var MartechDataPass = sessionStorage.getItem('MartechDataPass');       
    const decryptedUrl = decryptURL(encryptedUrl, MartechDataPass);

    try {
      const response = await fetch(decryptedUrl, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData.toString(),
      });

      const result = await response.json();
      if (result.status === "success") {
        alertMessagegreen.textContent = "Image hosted successfully!";
        successMessage.style.display = "block";
        setTimeout(() => {
          successMessage.style.display = "none";
        }, 3000);
        enableButton(submitButton);
        const thumbnailUrl = convertDriveUrl(result.url);
        document.getElementById("imageurl").value = thumbnailUrl;
      } else {
        alertMessagered.textContent = `Error: ${result.message || ""}`;
        showError(errorMessage, submitButton);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };
});


function decryptURL(encryptedUrl, password) {
  return CryptoJS.AES.decrypt(decodeURIComponent(encryptedUrl), password).toString(CryptoJS.enc.Utf8);
}