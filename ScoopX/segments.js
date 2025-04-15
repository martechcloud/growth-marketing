
/**
 * Contact Master
 */



'use strict';



let segments_cart = [];

function fetchDataAndStoreInCart() {
    const loaderContainer = document.getElementById("loader"); 
    loaderContainer.style.display = "flex"; // Show loading spinner

    const encryptedUrl = "U2FsdGVkX18aXwmqEQNCWFTixJICQpElP32bC9jmPlV9qymbnaPsYhYpFRgq4QsPLe++DGHQh9OYrrO/XHUWrpsS9RarN4hbGk3+EdNYo7zXv4kEtbYeeOcfatkTmb1OxnzRL3DApadLRivWjk8uf5yCt56x+LMrfldMO5o6VAEBKSQqvM3kMbY2weMSBj/Ay7PbNxpk7FkYKPk33ZQI8A==";
 
    var MartechDataPass = sessionStorage.getItem('MartechDataPass');       
    const decryptedUrl = decryptURL(encryptedUrl, MartechDataPass);


    fetch(decryptedUrl)
        .then(response => response.json())
        .then(data => {
            segments_cart = data.slice(1); // Store data in cart, skipping header row
            sessionStorage.setItem('segments_cart', JSON.stringify(segments_cart));
            sessionStorage.setItem('segments_cart2', JSON.stringify(segments_cart));
            loadTable(); // Call loadTable to update UI
        })
        .catch(error => console.error('Error fetching data:', error))
        .finally(() => {
            loaderContainer.style.display = "none"; // Hide spinner
        });
}



function loadTable() {
    let segments_cart = JSON.parse(sessionStorage.getItem('segments_cart')) || [];

    if (segments_cart.length === 0) {
        fetchDataAndStoreInCart();  // Ensure this function is defined
    } else {
        // Ensure it's properly converted to an array (if stored incorrectly)
        if (!Array.isArray(segments_cart)) {
            segments_cart = [segments_cart]; // Convert to an array if it's not already
        }
    }

    var dataTable = document.getElementById("dataTable");
    dataTable.getElementsByTagName('thead')[0].innerHTML = `
        <tr>
            <th>Segment Name</th>
            <th>Refreshed On</th>
            <th class="text-center">User count</th>
            <th class="text-center">Email</th>
            <th class="text-center">SMS</th>
            <th>Actions</th>
        </tr>
    `;

    const tableBody = document.querySelector('#dataTable tbody');
    tableBody.innerHTML = ''; // Clear previous data

    segments_cart.forEach(rowData => {
        const newRow = document.createElement('tr');

        // Extract only the first 6 columns
        const [segmentname, segmentinfo, refreshedon, usercount, email, sms] = rowData.slice(0, 6);

        // Convert UTC timestamp to IST (Indian Standard Time)
        const date = new Date(refreshedon); // Convert string to Date object
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
        const formattedTime = istTime.replace(',', '').replace(' AM', 'AM').replace(' PM', 'PM');

        // Create Segment Name cell with Info icon
        const segmentCell = document.createElement('td');
        segmentCell.innerHTML = `
            ${segmentname} 
            <i class="bx bx-info-circle text-info info-icon" style="cursor: pointer; margin-left: 5px;" 
                data-bs-toggle="tooltip" data-bs-placement="top" title="${segmentinfo}"></i>
        `;
        newRow.appendChild(segmentCell);

        // Create refreshed date cell
        const refreshedCell = document.createElement('td');
        refreshedCell.textContent = formattedTime;
        newRow.appendChild(refreshedCell);

        // Apply Bootstrap primary color and center alignment to usercount, email, and sms
        [usercount, email, sms].forEach(cellData => {
            const newCell = document.createElement('td');
            newCell.innerHTML = `<span class="text-primary fw-bold">${cellData}</span>`;
            newCell.classList.add("text-center"); // Center align the text
            newRow.appendChild(newCell);
        });

        // Actions Dropdown
        const actionsCell = document.createElement('td');
        actionsCell.innerHTML = `
            <div class="dropdown">
                <button type="button" class="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                    <i class="bx bx-dots-vertical-rounded"></i>
                </button>
                <div class="dropdown-menu">
                    <a class="dropdown-item" href="martechcloudcampaign.html" onclick="">
                        <i class="bx bxl-whatsapp me-1"></i> WhatsApp Campaign
                    </a>
                </div>
            </div>
        `;
        newRow.appendChild(actionsCell);
        tableBody.appendChild(newRow);
    });

    // Initialize Bootstrap tooltips
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}


document.getElementById('refreshButton').addEventListener('click', function() {
    fetchDataAndStoreInCart(); // Call your loadtable function when the button is clicked
  });





// Search function
document.getElementById('searchInput').addEventListener('input', function(e) {
    const searchTerm = e.target.value.toLowerCase();
    const rows = document.querySelectorAll('#dataTable tbody tr');

    rows.forEach(row => {
        const segmentName = row.querySelector('td').textContent.toLowerCase();
        if (segmentName.includes(searchTerm)) {
            row.style.display = ''; // Show row if it matches search term
        } else {
            row.style.display = 'none'; // Hide row if it does not match search term
        }
    });
});

function decryptURL(encryptedUrl, password) {
    return CryptoJS.AES.decrypt(decodeURIComponent(encryptedUrl), password).toString(CryptoJS.enc.Utf8);
}