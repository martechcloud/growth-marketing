'use strict';

document.addEventListener("DOMContentLoaded", function() {
    var key = sessionStorage.getItem("key");
    
    if (key === null || key === "logout" ) {
        // Redirect to another page
        window.location.href = "index.html";
    } else {
    }
});