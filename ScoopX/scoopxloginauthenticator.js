'use strict';

document.addEventListener("DOMContentLoaded", function() {
    var username = sessionStorage.getItem("MartechUsername");
    console.log(username)
    
    if (username === "scoopx@martechcloud.in") {
        window.location.href = "scoopxpos.html";
    }
});