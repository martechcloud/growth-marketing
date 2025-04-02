function decryptURL(encryptedUrl, password) {
    return CryptoJS.AES.decrypt(decodeURIComponent(encryptedUrl), password).toString(CryptoJS.enc.Utf8);
}

const contactmaster_cart_encryptedUrl1 = "U2FsdGVkX1/JjaWRcYVy/4CeOjNTKlCODRZCTCuMOug5D7wpBtytWoIUjZogaAC95R66MfXx5syOVPEa7ZE2TPTp4Mg3U9GbpnH6LoYQ4jp9oOubDV6cF6GLEMUtqcVR+FZkKrghMiSqS5ZrGjh6RosrsUbtE8i5GPucyOGP1bPFhSlYt4rfNL91BEU5VAwBgFjA4cOzdEXKu6dqLZMOyQ==";
const segments_cart_encryptedUrl1 = "U2FsdGVkX1/SNIGWtjW4ltoDjburF2qMq7UWDIWDap7jTqF+JG8f1twkG1l/OlIkKmyvPY0nIkLVTxhvjiTi+pW6Hiw6gIKkOOJUVE/Np8Z7nQgpa9xnPRmuhngyrd2efgpAnVgCAcfWizEwUlFiZpkaGYeO5DZW6ivEz2M/Op4gHMLy7F8yLtmYiZsswBtf";
const blacklist_cart_encryptedUrl1 = "U2FsdGVkX19J/Dw6/E4/02sk4TQ1ezGRuB1wdWnczWHTV2k+ZjthLQKGkuM9gV0DEWd8j58nbHTVycS4mS5LbpoJcXqAE4wnqF1V8IV7SNVuBEewzrG6jkI95GsZIRGlHh1PK/WjXhdIF2MSYYV64PXJVLt/tuIwhAxGUwaZz3Q7WSxDwEldhyXfzpLfqmnGhp2igBNNUBOHkPZSXOMdUw==";
const product_cart_encryptedUrl1 = "U2FsdGVkX1/EGFo+Q58t14at332y0rcMh9aCLmoeWlHoblzPXB7sTR54keN+DdBK6+as69a5z4EY/5Uol6WaxekZ6VJWP4TPlZ26NsJXXg8xzfbgw7qYAoKoGdfkxRprFcY6V9UZIRtx5R2EClxnZww9M5ko3xE7Z+DGVFWfS2Z0PAkUSACUA4VHl41lMQ/VqPLaY5iwBMTPuUxLWINO3w==";
const whatsappcontent_cart_encryptedUrl1 = "U2FsdGVkX1/jI3DihM4NBvZczFtVxwPvNwnma27AJ8mWUApINjf76e+qd1SupJciDyraO31x0Z7TubEWHwVBB8HGYWIl/z3LYrfqgCN4fAGyY69gcUriKT8jRIO3/WcrTXnNglcSjU4mz8yybDuwbhUSk4i8vF8cfe6JUukwlABUgb3vuFE/8aw19Ka5swFbocj3XauqMhs5yn17AtJLFA==";
const campaignsummary_cart_encryptedUrl1 = "U2FsdGVkX18gpeVWfs/b0fUrfGJ3eW+dc2WQn96OjYggoi8vHPcFkEjZVzkvYhJPINpiDLlmAw/vaipUQKH+wPwKFCfie5X0Zm+iaSKlHekQmrwfQrKBK1t6n0uVS7Fa7Gp9CnxmhqdkaAbA40uOXGzATIt7KuJWMzOdk89O+WmDTSr3AKK8ea0XrpNnRGieJ4Ky3iAJZKA9gFvTnhoXcw==";
const order_cart1_encryptedUrl1 = "U2FsdGVkX18t/9TtZ3VI2yqH93faawfva3Hflz7E7r1nLr8tmyRS2ZnjdhyREM9m6Gt30lH1m/KtSppFjZCnU4lG3lSey4Yi6KjoAgNKsFmf5wzlvQlz6tPiimE5ayyQucgBuQmHs/S/Um1LLxxw6ZLSRqasta6s+t89IiXhW9rqyAoy1gnH0u/iPj8U34f0m0YQ1UInTV/AIoK/RKKVdQ==";
const communication_logs_encryptedUrl1 = "U2FsdGVkX1/A5kQ/h54dMDHtIGhp/orrValXifgXVLRoGQ/KLq2NCszTBQzSv5M3PjHv91YDykS61yy878DNVDE1mmgwnPP9CAY9ufBRRKXSxovBUeLFp3UPgAxzcBrpPtyug40Sfzo2OgsRxLsbWRKTuvdwDnwXfcbVdjYIwOQ1PxRhbaz4TCUtZ6BNaGF48ZBse7ldFTiu7GACMBsHR5wPZtHKnZMTNmhxtisB7No=";

let contactmaster_cart = [];

function contactmaster_cart1() {
    var MartechDataPass = sessionStorage.getItem('MartechDataPass')|| "User";
    const contactmaster_cart_encryptedUrl = decryptURL(contactmaster_cart_encryptedUrl1, MartechDataPass);
    fetch(contactmaster_cart_encryptedUrl)
        .then(response => response.json())
        .then(data => {
            contactmaster_cart = data.slice(1); // Store data in cart, skipping header row
            sessionStorage.setItem('contactmaster_cart', JSON.stringify(contactmaster_cart));
            sessionStorage.setItem('custom_attribute_cart', JSON.stringify(contactmaster_cart));
        })
        .catch(error => console.error('Error fetching data:', error))
        .finally(() => {
            segments_cart1();
        });
}

let segments_cart = [];

function segments_cart1() {
    var MartechDataPass = sessionStorage.getItem('MartechDataPass')|| "User";
    const segments_cart_encryptedUrl = decryptURL(segments_cart_encryptedUrl1, MartechDataPass);
    fetch(segments_cart_encryptedUrl)
        .then(response => response.json())
        .then(data => {
            segments_cart = data.slice(1); // Store data in cart, skipping header row
            sessionStorage.setItem('segments_cart', JSON.stringify(segments_cart));
            sessionStorage.setItem('segments_cart2', JSON.stringify(segments_cart));
        })
        .catch(error => console.error('Error fetching data:', error))
        .finally(() => {
            blacklist_cart1();
        });
}

let blacklist_cart = [];

async function blacklist_cart1() {
    var MartechDataPass = sessionStorage.getItem('MartechDataPass')|| "User";
    const contactmaster_cart_encryptedUrl = decryptURL(contactmaster_cart_encryptedUrl1, MartechDataPass);
    const blacklist_cart_encryptedUrl = decryptURL(blacklist_cart_encryptedUrl1, MartechDataPass);

    const url1 = contactmaster_cart_encryptedUrl;
    const url2 = blacklist_cart_encryptedUrl;

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
    } catch (error) {
        console.error('Error fetching data:', error);
    } finally {
        product_cart1();
    }
}



// Fetch data from the Apps Script URL only once
async function fetchData() {
    var MartechDataPass = sessionStorage.getItem('MartechDataPass')|| "User";
    try {
        const product_cart_encryptedUrl = decryptURL(product_cart_encryptedUrl1, MartechDataPass);
        const response = await fetch(product_cart_encryptedUrl);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching data: ", error);
    }
}

async function product_cart1() {
    var MartechDataPass = sessionStorage.getItem('MartechDataPass')|| "User";
    let data = await fetchData();
    sessionStorage.setItem('data2', JSON.stringify(data));
    whatsappcontent_cart1();
}

let whatsappcontent_cart = [];

function whatsappcontent_cart1() {
    var MartechDataPass = sessionStorage.getItem('MartechDataPass')|| "User";
    const whatsappcontent_cart_encryptedUrl = decryptURL(whatsappcontent_cart_encryptedUrl1, MartechDataPass);
    fetch(whatsappcontent_cart_encryptedUrl) 
        .then(response => response.json())
        .then(data => {
            const whatsappcontent_cart = data.slice(1); // Store data in cart, skipping header row
            sessionStorage.setItem('whatsappcontent_cart', JSON.stringify(whatsappcontent_cart));
        })
        .catch(error => console.error('Error fetching data:', error))
        .finally(() => {
            campaignsummary_cart1();
        });
}


let campaignsummary_cart = [];

function campaignsummary_cart1() {
    var MartechDataPass = sessionStorage.getItem('MartechDataPass')|| "User";
    const campaignsummary_cart_encryptedUrl = decryptURL(campaignsummary_cart_encryptedUrl1, MartechDataPass);
    fetch(campaignsummary_cart_encryptedUrl)
        .then(response => response.json())
        .then(data => {
            campaignsummary_cart = data.slice(1); // Store data in cart, skipping header row
            sessionStorage.setItem('campaignsummary_cart', JSON.stringify(campaignsummary_cart));
        })
        .catch(error => console.error('Error fetching data:', error))
        .finally(() => {
            order_cart();
        });
}


let order_cart1 = [];

function order_cart() {
    var MartechDataPass = sessionStorage.getItem('MartechDataPass')|| "User";
    const order_cart1_encryptedUrl = decryptURL(order_cart1_encryptedUrl1, MartechDataPass);
    fetch(order_cart1_encryptedUrl)
        .then(response => response.json())
        .then(data => {
            order_cart1 = data.slice(1); // Store data in cart, skipping header row
            sessionStorage.setItem('order_cart', JSON.stringify(order_cart1));
        })
        .catch(error => console.error('Error fetching data:', error))
        .finally(() => {
            communication_logs1();
        });
}


let communication_logs = [];

function communication_logs1() {
    var MartechDataPass = sessionStorage.getItem('MartechDataPass')|| "User";
    const communication_logs_encryptedUrl = decryptURL(communication_logs_encryptedUrl1, MartechDataPass);
    fetch(communication_logs_encryptedUrl)
        .then(response => response.json())
        .then(data => {
            communication_logs = data.slice(1); // Store data in cart, skipping header row
            sessionStorage.setItem('communication_logs', JSON.stringify(communication_logs));
        })
        .catch(error => console.error('Error fetching data:', error))
        .finally(() => {
            const redirection = sessionStorage.getItem("redirection") || "User";
            const loaderOverlay = document.getElementById("loaderOverlay");

            loaderOverlay.style.opacity = "0";
            loaderOverlay.style.visibility = "hidden";
            window.location.href = redirection;
        });
}