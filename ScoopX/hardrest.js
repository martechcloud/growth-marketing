function decryptURL(encryptedUrl, password) {
    return CryptoJS.AES.decrypt(decodeURIComponent(encryptedUrl), password).toString(CryptoJS.enc.Utf8);
}

const contactmaster_cart_encryptedUrl1 = "U2FsdGVkX18c06sMzT40eYKs90acaOBPihyRaQ9DwTlTpf2cgqYXRS0dnHvya6H+bislOUz47Iu9yr8bGhWs65N8xTJOKShniWYRNSe7ImrRL3RdsfGMk5OgdaK8oteK/voxaeTuOHPvdT5P0TlwtrK33cWn4e5h72+Jij/S1pZxgzoQhCOL3DqN65apFax06uHJfH+ZvdEr4s2eeAV0Bg==";
const segments_cart_encryptedUrl1 = "U2FsdGVkX18aXwmqEQNCWFTixJICQpElP32bC9jmPlV9qymbnaPsYhYpFRgq4QsPLe++DGHQh9OYrrO/XHUWrpsS9RarN4hbGk3+EdNYo7zXv4kEtbYeeOcfatkTmb1OxnzRL3DApadLRivWjk8uf5yCt56x+LMrfldMO5o6VAEBKSQqvM3kMbY2weMSBj/Ay7PbNxpk7FkYKPk33ZQI8A==";
const blacklist_cart_encryptedUrl1 = "U2FsdGVkX19FOVHWT32VnSGFdeQmzS2Og+Ul3ygruEjEEdfVv3oFK9colU0VBxLYU6A95bTN/8dJvuYBe2YcLbL4610sSpupNw1BR/jlD0dsErjYsm/fbfbImKrs80EcB8CRRY1RU7g/sJ5JExlZoHchiO7wedo0TqgaPeBC2Cy3tsrc7fcfGxCmbsTfldH5CMK7cRikNsziXaQO99IJ4g==";
const product_cart_encryptedUrl1 = "U2FsdGVkX1/EGFo+Q58t14at332y0rcMh9aCLmoeWlHoblzPXB7sTR54keN+DdBK6+as69a5z4EY/5Uol6WaxekZ6VJWP4TPlZ26NsJXXg8xzfbgw7qYAoKoGdfkxRprFcY6V9UZIRtx5R2EClxnZww9M5ko3xE7Z+DGVFWfS2Z0PAkUSACUA4VHl41lMQ/VqPLaY5iwBMTPuUxLWINO3w==";
const whatsappcontent_cart_encryptedUrl1 = "U2FsdGVkX1/su5wLmLL4EnjNQoqUeZDHAkuG2YPvG0rv7L23zZsYmZZu37Fctpu80d9BQe5QgAHnovECVofm4mnCG0tLBVMO6I6X1P5Ids8x/d5BjKeuY6NqDNfLrNwNQhCQ/4YuL86lI/fT3LYJ6H90Yc0QmShDBdN1CK6DoSolhGYVjhtU4q66mN2Je3I5lj4I1R4MpNKxtOirAsGvLg==";
const campaignsummary_cart_encryptedUrl1 = "U2FsdGVkX19OkzZYLm4zM1Aw1siYxfhIUAzGiALIewz9oXVVU40lA8xAjUn06asK5ncjA8250wMTkxCdVm6EQSxg7XlUqzP76C3BjypSKWuRgPX5XiB39RPUY/fdU3g9Z/8d24PFhCozuBku3AYTLmCGb9R/TOHeQruVd+C501PUccgBRz0HXOK9nAfCiaNKYGaI9XkQ2SB5S1i946FxbA==";
const order_cart1_encryptedUrl1 = "U2FsdGVkX18FvdDK4s9o8Md+vfxcoEl4yxDpfXwWMP7khHQILD/tNaJlV/A7VhP9JhW9pmMHPeuo2obO8J/dvZcsJuvf5dy1ZYzBieST3cnMo6suiTF7NInkVXog34OxxK/Ho775lAIegni4Wd8tnL+Uj7kP4Na/sNsGI/ugK0m4CiqWbHiJ19BLdahNC5A4BeW6CbJh4Y51iYVfcd2xwA==";
const communication_logs_encryptedUrl1 = "U2FsdGVkX1+JORwCBodCfS8XcAKY/VMaAQwVZsh1F+QYL/7yjJ7N5yHRhACqYt2VzGNq2bTyP8VDlPg1m77GpPQTvtk+jVD0EFopOiUOWkCDHLSONwdjXjaxM5fRMIOth4herNc//BfOOC7tJf09EVvTwwOgKvSoZ6bn/ZSsLh44Bx77KpMADARxdvLnxRctbTpPFZkXVTxkirpq+cC9FdujZ5Z3oye5UbR47G+6iRQ=";

function contactmaster_cart1() {
    showLoader();
    var MartechDataPass = sessionStorage.getItem('MartechDataPass')|| "User";
    const contactmaster_cart_encryptedUrl = decryptURL(contactmaster_cart_encryptedUrl1, MartechDataPass);
    fetch(contactmaster_cart_encryptedUrl)
        .then(response => response.json())
        .then(data => {
            sessionStorage.setItem('contactmaster_cart', JSON.stringify(data.slice(1)));
            sessionStorage.setItem('custom_attribute_cart', JSON.stringify(data.slice(1)));
        })
        .catch(error => console.error('Error fetching data:', error))
        .finally(() => {
            segments_cart1();
        });
}


function segments_cart1() {
    var MartechDataPass = sessionStorage.getItem('MartechDataPass')|| "User";
    const segments_cart_encryptedUrl = decryptURL(segments_cart_encryptedUrl1, MartechDataPass);
    fetch(segments_cart_encryptedUrl)
        .then(response => response.json())
        .then(data => {
            sessionStorage.setItem('segments_cart', JSON.stringify(data.slice(1)));
            sessionStorage.setItem('segments_cart2', JSON.stringify(data.slice(1)));
        })
        .catch(error => console.error('Error fetching data:', error))
        .finally(() => {
            blacklist_cart1();
        });
}

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

        sessionStorage.setItem('blacklist_cart', JSON.stringify(mergedData));
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


function whatsappcontent_cart1() {
    var MartechDataPass = sessionStorage.getItem('MartechDataPass')|| "User";
    const whatsappcontent_cart_encryptedUrl = decryptURL(whatsappcontent_cart_encryptedUrl1, MartechDataPass);
    fetch(whatsappcontent_cart_encryptedUrl) 
        .then(response => response.json())
        .then(data => {
            sessionStorage.setItem('whatsappcontent_cart', JSON.stringify(data.slice(1)));
        })
        .catch(error => console.error('Error fetching data:', error))
        .finally(() => {
            campaignsummary_cart1();
        });
}


function campaignsummary_cart1() {
    var MartechDataPass = sessionStorage.getItem('MartechDataPass')|| "User";
    const campaignsummary_cart_encryptedUrl = decryptURL(campaignsummary_cart_encryptedUrl1, MartechDataPass);
    fetch(campaignsummary_cart_encryptedUrl)
        .then(response => response.json())
        .then(data => {
            sessionStorage.setItem('campaignsummary_cart', JSON.stringify(data.slice(1)));
        })
        .catch(error => console.error('Error fetching data:', error))
        .finally(() => {
            order_cart();
        });
}


function order_cart() {
    var MartechDataPass = sessionStorage.getItem('MartechDataPass')|| "User";
    const order_cart1_encryptedUrl = decryptURL(order_cart1_encryptedUrl1, MartechDataPass);
    fetch(order_cart1_encryptedUrl)
        .then(response => response.json())
        .then(data => {
            sessionStorage.setItem('order_cart', JSON.stringify(data.slice(1)));
        })
        .catch(error => console.error('Error fetching data:', error))
        .finally(() => {
            communication_logs1();
        });
}



function communication_logs1() {
    var MartechDataPass = sessionStorage.getItem('MartechDataPass')|| "User";
    const communication_logs_encryptedUrl = decryptURL(communication_logs_encryptedUrl1, MartechDataPass);
    fetch(communication_logs_encryptedUrl)
        .then(response => response.json())
        .then(data => {
            sessionStorage.setItem('communication_logs', JSON.stringify(data.slice(1)));
        })
        .catch(error => console.error('Error fetching data:', error))
        .finally(() => {
            hideLoader();
            window.location.href = "scoopxdashboard.html";
        });
}