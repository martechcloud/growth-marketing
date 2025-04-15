
/**
 * Contact Master
 */



'use strict';



let blacklist_cart = [];

async function fetchDataAndStoreInCart() {
    const loaderContainer = document.getElementById("loader"); 
    loaderContainer.style.display = "flex"; // Show loading spinner
    var MartechDataPass = sessionStorage.getItem('MartechDataPass'); 

    const encryptedUrl1 = "U2FsdGVkX18c06sMzT40eYKs90acaOBPihyRaQ9DwTlTpf2cgqYXRS0dnHvya6H+bislOUz47Iu9yr8bGhWs65N8xTJOKShniWYRNSe7ImrRL3RdsfGMk5OgdaK8oteK/voxaeTuOHPvdT5P0TlwtrK33cWn4e5h72+Jij/S1pZxgzoQhCOL3DqN65apFax06uHJfH+ZvdEr4s2eeAV0Bg=="; 
    const encryptedUrl2 = "U2FsdGVkX19FOVHWT32VnSGFdeQmzS2Og+Ul3ygruEjEEdfVv3oFK9colU0VBxLYU6A95bTN/8dJvuYBe2YcLbL4610sSpupNw1BR/jlD0dsErjYsm/fbfbImKrs80EcB8CRRY1RU7g/sJ5JExlZoHchiO7wedo0TqgaPeBC2Cy3tsrc7fcfGxCmbsTfldH5CMK7cRikNsziXaQO99IJ4g==";      
    const decryptedUrl1 = decryptURL(encryptedUrl1, MartechDataPass);
    const decryptedUrl2 = decryptURL(encryptedUrl2, MartechDataPass);

    const url1 = decryptedUrl1;
    const url2 = decryptedUrl2;

    try {
        const [response1, response2] = await Promise.all([
            fetch(url1).then(res => res.json()),
            fetch(url2).then(res => res.json())
        ]);

        const data1 = response1.slice(1); // Skipping header row
        const data2 = response2.slice(1);

        const mergedData = data1.map(row1 => {
            const matchingRow2 = data2.find(row2 => row2[1] === row1[0]); // Matching by CUSTOMER_ID
            return matchingRow2 ? [...row1, ...matchingRow2] : [...row1, ...Array(data2[0].length).fill(null)];
        });

        blacklist_cart = mergedData
        sessionStorage.setItem('blacklist_cart', JSON.stringify(blacklist_cart));
        loadTable(); // Call loadTable to update UI
    } catch (error) {
        console.error('Error fetching data:', error);
    } finally {
        loaderContainer.style.display = "none"; // Hide spinner
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

function loadTable() {
    let blacklist_cart = JSON.parse(sessionStorage.getItem('blacklist_cart')) || [];

    if (blacklist_cart.length === 0) {
        fetchDataAndStoreInCart();  // Ensure this function is defined
    } else {
        // Ensure it's properly converted to an array (if stored incorrectly)
        if (!Array.isArray(blacklist_cart)) {
            blacklist_cart = [blacklist_cart]; // Convert to an array if it's not already
        }
    }

    var dataTable = document.getElementById("dataTable");
    dataTable.getElementsByTagName('tbody')[0].innerHTML = '';

    const tableBody = document.querySelector('#dataTable tbody');

    blacklist_cart.forEach(rowData => {
        const newRow = document.createElement('tr');

        // Select only specific columns (e.g., second, third, and fourth column)
        let selectedIndexes = [0, 2, 3, 8, 9]; // Modify to select different columns 

        selectedIndexes.forEach((index, i) => {
            if (index < rowData.length) {
                const newCell = document.createElement('td');

                // If the third selected column (index 3 in selectedIndexes) contains "ENABLED", add the Active badge
                if (i === 3) { 
                    if (rowData[index] === "ENABLED") {
                        newCell.innerHTML = '<span class="badge bg-label-primary me-1">ACTIVE</span>';
                    } else {
                        newCell.innerHTML = '<span class="badge bg-label-warning me-1">BLACKLISTED</span>';
                    }
                } else if (i === 4) { // If the fifth column (index 4) contains a date, format it
                    const date = new Date(rowData[index]); // Convert string to Date object

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

                    const formattedTime = istTime.replace(',', '').replace(' AM', 'AM').replace(' PM', 'PM');
                    newCell.innerHTML = formattedTime; // Set formatted time
                } else {
                    newCell.textContent = rowData[index]; // Set other columns normally
                }

                newRow.appendChild(newCell);
            }
        });
        // Create Blacklist button
        const blacklistCell = document.createElement('td');
        const blacklistButton = document.createElement('button');
        blacklistButton.textContent = "Blacklist";
        blacklistButton.type = "button";
        blacklistButton.id = `blacklistbutton-${rowData[0]}`; // Use dynamic ID
        blacklistButton.className = "btn btn-danger btn-sm"; // Bootstrap danger button
        blacklistButton.onclick = async function() { // Make function async
            const submitButton = blacklistButton;
            disableButton(submitButton);
        
            let col1 = rowData[0]; // Second column value
            const encryptedUrl = "U2FsdGVkX19DNh1HZc6CSWDxzdUsnPtalFFkw+60E3oxpUPZjiiPHAmqvb9qq7976vqj/8rxk2ue+O6lbjbzzV9ICsEY9GQceRyS/Dl/1eFq90w0i+Dg9eveUH614+ll51Tt3DCy1inG5sQsh/uK+uKmSsA5dmMkbUMiRpPC50+ljuaenJYXi2dUKEzz2QFD";
 
            var MartechDataPass = sessionStorage.getItem('MartechDataPass');       
            const decryptedUrl = decryptURL(encryptedUrl, MartechDataPass);
        
            const url = new URL(decryptedUrl);
        
            // Append query parameters
            url.searchParams.append("usecase", "blacklistcontact");
            url.searchParams.append("CUSTOMER_ID", col1);
        
            try {
                // Make the API call
                const response = await fetch(url);
                const data = await response.json();
        
                if (typeof handleResponse1 === "function") {
                    handleResponse1(data, submitButton);
                    const index = blacklist_cart.findIndex(item => item[0] === col1);
                    if (index !== -1) {
                        blacklist_cart[index][8] = "BLACKLISTED"; // Assuming column 2 holds the status
                        let currentDate = new Date().toISOString(); // Formats the date as "2025-02-18T12:05:43.942Z"

                        // Set this date in cart[index][9]
                        blacklist_cart[index][9] = currentDate;
                        sessionStorage.setItem('blacklist_cart', JSON.stringify(blacklist_cart));
                        loadTable(); // Reload the table to reflect the changes
                    }
                } else {
                    console.error("handleResponse1 function is not defined.");
                }
            } catch (error) {
                console.error("Error during API call:", error);
                if (typeof showError === "function") {
                    showError("An unexpected error occurred. Please try again.", submitButton);
                }
            }
        };
        
        // Append button to the row
        blacklistCell.appendChild(blacklistButton);
        newRow.appendChild(blacklistCell);

        // Create Whitelist button
        const whitelistCell = document.createElement('td');
        const whitelistButton = document.createElement('button');
        whitelistButton.textContent = "Whitelist";
        whitelistButton.type = "button";
        whitelistButton.id = `whitelistbutton-${rowData[0]}`; // Use dynamic ID
        whitelistButton.className = "btn btn-success btn-sm"; // Bootstrap success button
        whitelistButton.onclick = async function() {
            const submitButton = whitelistButton;
            disableButton(submitButton);

            let col1 = rowData[0]; // Second column value
        
            const encryptedUrl = "U2FsdGVkX19DNh1HZc6CSWDxzdUsnPtalFFkw+60E3oxpUPZjiiPHAmqvb9qq7976vqj/8rxk2ue+O6lbjbzzV9ICsEY9GQceRyS/Dl/1eFq90w0i+Dg9eveUH614+ll51Tt3DCy1inG5sQsh/uK+uKmSsA5dmMkbUMiRpPC50+ljuaenJYXi2dUKEzz2QFD";
 
            var MartechDataPass = sessionStorage.getItem('MartechDataPass');       
            const decryptedUrl = decryptURL(encryptedUrl, MartechDataPass);
        
            const url = new URL(decryptedUrl);
        
            // Append query parameters
            url.searchParams.append("usecase", "whitelistcontact");
            url.searchParams.append("CUSTOMER_ID", col1);
        
            try {
                // Make the API call
                const response = await fetch(url);
                const data = await response.json();
        
                if (typeof handleResponse1 === "function") {
                    handleResponse1(data, submitButton);
                    const index = blacklist_cart.findIndex(item => item[0] === col1);
                    if (index !== -1) {
                        blacklist_cart[index][8] = "ENABLED"; // Assuming column 2 holds the status
                        let currentDate = new Date().toISOString(); // Formats the date as "2025-02-18T12:05:43.942Z"

                        // Set this date in cart[index][9]
                        blacklist_cart[index][9] = currentDate;
                        sessionStorage.setItem('blacklist_cart', JSON.stringify(blacklist_cart));
                        loadTable(); // Reload the table to reflect the changes
                    }
                } else {
                    console.error("handleResponse1 function is not defined.");
                }
            } catch (error) {
                console.error("Error during API call:", error);
                if (typeof showError === "function") {
                    showError("An unexpected error occurred. Please try again.", submitButton);
                }
            }
        };
        whitelistCell.appendChild(whitelistButton);
        newRow.appendChild(whitelistCell);

        tableBody.appendChild(newRow);

        function handleResponse1(response, submitButton) {
            const successMessage = document.getElementById('box');
            const alertMessagegreen = document.getElementById('success');
            const alertMessagered = document.getElementById('almessage');
            const errorMessage = document.getElementById('box2');

            if (response.status === "success") {
                alertMessagegreen.textContent = response.message;
                successMessage.style.display = "block";
                setTimeout(() => {
                    successMessage.style.display = "none";
                }, 3000);

            } else {
                alertMessagered.textContent = response.message || "Failed! Please try again.";
                showError(errorMessage, submitButton);
            }

            resetSubmitButton(submitButton);
        }
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

function decryptURL(encryptedUrl, password) {
    return CryptoJS.AES.decrypt(decodeURIComponent(encryptedUrl), password).toString(CryptoJS.enc.Utf8);
}


