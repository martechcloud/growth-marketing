'use strict';
document.addEventListener("DOMContentLoaded", function() {

    // For main profile
    var profilename = sessionStorage.getItem("MartechName");
    var profilerole = sessionStorage.getItem("MartechRole");
    
    document.getElementById('profileusername').textContent = profilename; 
    document.getElementById('profilerole').textContent = profilerole;
    
    // For setting page
    try {
    var profileusername = sessionStorage.getItem("MartechUsername");
    var MartechIP = sessionStorage.getItem("MartechIP");
    var MartechName = sessionStorage.getItem("MartechName");
    var MartechEmail = sessionStorage.getItem("MartechEmail");
    var MartechPhone = sessionStorage.getItem("MartechPhone");
    document.getElementById('primaryprofileusername').textContent = profileusername;
    document.getElementById('primaryprofilerole').textContent = profilerole;
    document.getElementById('MartechIP').textContent = `IP Address: ${MartechIP}`;
    document.getElementById('MartechName').innerHTML = `<i class="fas fa-user" style="margin-right: 8px;"></i> <span style="color: grey;">Profile Name:</span> <span style="font-size: 100%;">${MartechName}</span>`;
    document.getElementById('MartechEmail').innerHTML = `
        <i class="fas fa-envelope" style="margin-right: 8px;"></i> 
        <span style="color: grey;">Email:</span> 
        <span style="font-size: 100%;">${MartechEmail}</span> 
        <i class="fas fa-check-circle" style="color: green; margin-left: 8px;"></i> 
        <span style="color: green; font-size: 90%;">Verified</span>`;

    document.getElementById('MartechPhone').innerHTML = `
        <i class="fas fa-phone" style="margin-right: 8px;"></i> 
        <span style="color: grey;">Phone:</span> 
        <span style="font-size: 100%;">${MartechPhone}</span> 
        <i class="fas fa-check-circle" style="color: green; margin-left: 8px;"></i> 
        <span style="color: green; font-size: 90%;">Verified</span>`;
    document.getElementById('industry').innerHTML = `<i class="fas fa-earth" style="margin-right: 8px;"></i> <span style="color: grey;">Industry:</span> <span style="font-size: 100%;">Restaurant</span>`;
    document.getElementById('first_primary').innerHTML = `
        <i class="fas fa-user" style="margin-right: 8px;"></i> 
        <span style="color: grey;">First Primary:</span> 
        <span style="font-size: 100%;">CUSTOMER_PHONE</span> 
        <span style="color: red; margin-left: 4px;">*</span>`;

    document.getElementById('second_primary').innerHTML = `
        <i class="fas fa-user" style="margin-right: 8px;"></i> 
        <span style="color: grey;">Second Primary:</span> 
        <span style="font-size: 100%;">CUSTOMER_ID</span> 
        <span style="color: red; margin-left: 4px;">*</span>`;


    } catch (error) {
    }      
     
})