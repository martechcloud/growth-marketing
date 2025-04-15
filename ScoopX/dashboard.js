// Retrieve stored user name or set default
const martechFirstName = sessionStorage.getItem("MartechFirstName") || "User";
const cardTitle = document.querySelector("h5.card-title.text-primary");
if (cardTitle) cardTitle.innerHTML = `Congratulations ${martechFirstName}! 🎉`;

// Retrieve and parse order data
const orderCart = JSON.parse(sessionStorage.getItem("order_cart") || "[]");
const todayDate = new Date().toISOString().split('T')[0];
const yesterdayDate = new Date(Date.now() - 86400000).toISOString().split('T')[0];

// Initialize sales & order variables
let totalSalesToday = 0, totalSalesYesterday = 0, overallSales = 0;
let dateCounts = {}, dateSales = {}, cumulativeSales = 0;

// Process orderCart data
orderCart.forEach(([ , , orderDateFull, , , orderAmount]) => {
    const orderDate = orderDateFull?.split('T')[0];
    const amount = Number(orderAmount) || 0;

    if (orderDate) {
        dateCounts[orderDate] = (dateCounts[orderDate] || 0) + 1;
        dateSales[orderDate] = (dateSales[orderDate] || 0) + amount;
        overallSales += amount;
    }

    if (orderDate === todayDate) totalSalesToday += amount;
    if (orderDate === yesterdayDate) totalSalesYesterday += amount;
});

// Compute last 7 days sales
const last7Days = Object.keys(dateSales).sort((a, b) => new Date(a) - new Date(b)).slice(-7);
const last7DaysSalesData = last7Days.map(date => ({
    x: date,
    y: dateSales[date] || 0,
    cumulative: (cumulativeSales += dateSales[date] || 0),
}));

// Cache DOM elements
const domElements = {
    salesToday: document.querySelector("p.mb-4 span.fw-bold"),
    overallSales: document.querySelector(".card-title.text-nowrap.mb-2"),
    cumulativeSales: document.querySelector(".card-title2.text-nowrap.mb-2"),
    totalOrders: document.querySelector(".card-title.text-nowrap.mb-1"),
    orderGrowth: document.querySelector(".order-growth-rate"),
    contactGrowth: document.querySelector(".contact-growth-rate"),
    salesGrowth: document.querySelector(".sales-growth-rate"),
};

// Update sales and orders in the DOM
if (domElements.salesToday) domElements.salesToday.textContent = `₹${totalSalesToday}`;
if (domElements.overallSales) domElements.overallSales.textContent = `₹${overallSales}`;
if (domElements.cumulativeSales) domElements.cumulativeSales.textContent = `₹${cumulativeSales}`;
if (domElements.totalOrders) domElements.totalOrders.textContent = orderCart.length;

// Function to calculate and update growth
const updateGrowth = (todayCount, yesterdayCount, element) => {
    let growthHtml;
    if (yesterdayCount === 0) {
        growthHtml = todayCount > 0
            ? '<small class="text-success fw-semibold"><i class="bx bx-up-arrow-alt"></i> +100%</small>'
            : '<small class="text-muted fw-semibold">0%</small>';
    } else {
        const growthRate = (((todayCount - yesterdayCount) / yesterdayCount) * 100).toFixed(2);
        growthHtml = `<small class="text-${growthRate >= 0 ? 'success' : 'danger'} fw-semibold">
                        <i class="bx bx-${growthRate >= 0 ? 'up' : 'down'}-arrow-alt"></i> ${growthRate}%
                      </small>`;
    }
    if (element) element.innerHTML = growthHtml;
};

// Update growth rates
updateGrowth(dateCounts[todayDate] || 0, dateCounts[yesterdayDate] || 0, domElements.orderGrowth);
updateGrowth(totalSalesToday, totalSalesYesterday, domElements.salesGrowth);

// Retrieve & parse contact data
const contactMaster = JSON.parse(sessionStorage.getItem("contactmaster_cart") || "[]");
const totalContacts = contactMaster.length;
const contactCountElement = document.querySelector(".card-title.mb-2");
if (contactCountElement) contactCountElement.textContent = totalContacts;

// Calculate and update contact growth
const contactCounts = contactMaster.reduce((acc, [ , , , , regDate]) => {
    const date = regDate?.split('T')[0];
    if (date) acc[date] = (acc[date] || 0) + 1;
    return acc;
}, {});

updateGrowth(contactCounts[todayDate] || 0, contactCounts[yesterdayDate] || 0, domElements.contactGrowth);

// Open modal on 'View More' click
document.getElementById("filtersales").addEventListener("click", () => {
    new bootstrap.Modal(document.getElementById("dateRangeModal")).show();
});

// Handle date range selection
document.getElementById("getDataBtn").addEventListener("click", () => {
    const fromDate = document.getElementById("fromDate").value;
    const toDate = document.getElementById("toDate").value;
    
    if (fromDate && toDate) {
        let filteredSales = orderCart.reduce((sum, [, , orderDate, , , amount]) => {
            return (orderDate?.split('T')[0] >= fromDate && orderDate?.split('T')[0] <= toDate) 
                ? sum + (Number(amount) || 0) 
                : sum;
        }, 0);

        domElements.overallSales.textContent = `₹${filteredSales}`;

        // Add or update filter badge
        let badge = document.getElementById("filterBadge");
        if (!badge) {
            badge = document.createElement("span");
            badge.id = "filterBadge";
            badge.className = "badge bg-primary ms-2";
            badge.innerHTML = '<i class="bx bx-filter"></i> Filter Applied';
            domElements.overallSales.parentElement.appendChild(badge);
        }
        badge.setAttribute("title", `Filtered: ${fromDate} to ${toDate}`);

        bootstrap.Modal.getInstance(document.getElementById("dateRangeModal")).hide();
    }
});

// Remove filters
document.getElementById("removefiltersales").addEventListener("click", () => {
    domElements.overallSales.textContent = `₹${overallSales}`;
    document.getElementById("filterBadge")?.remove();
});

// Update Profile Report Line Chart with last 7 days sales
const profileReportChartEl = document.querySelector('#profileReportChart');
if (profileReportChartEl) {
    const profileReportChartConfig = {
        chart: {
            height: 80,
            type: 'line',
            toolbar: { show: false },
            dropShadow: { enabled: true, top: 10, left: 5, blur: 3, color: config.colors.warning, opacity: 0.15 },
            sparkline: { enabled: true },
        },
        series: [{ name: "Sales", data: last7DaysSalesData.map(d => d.y) }],
        xaxis: { categories: last7Days },
    };
    new ApexCharts(profileReportChartEl, profileReportChartConfig).render();
}


// Reachable Contacts Calculation
const blacklistCart = JSON.parse(sessionStorage.getItem("blacklist_cart") || "[]");
document.querySelector(".reachable_contacts").textContent = blacklistCart.reduce((count, item) => count + (item[8] === "ENABLED" ? 1 : 0), 0);

// Extract Config Colors
const { white: cardColor, headingColor, axisColor, borderColor, primary: primaryColor } = config.colors;

// Function to Calculate Repeat Purchase Rate (RPR)
const calculateRPR = (orderCart) => {
    const customerCount = new Map();
    orderCart.forEach(order => customerCount.set(order[1], (customerCount.get(order[1]) || 0) + 1));
    const repeatCustomers = [...customerCount.values()].filter(count => count > 1).length;
    return customerCount.size > 0 ? ((repeatCustomers / customerCount.size) * 100).toFixed(2) : 0;
};

// Fetch Yesterday's RPR (Replace with actual data source)
const yesterdayRpr = 55; // Example Value
const rpr = calculateRPR(orderCart);
const rprDifference = yesterdayRpr > 0 ? ((rpr - yesterdayRpr) / yesterdayRpr) * 100 : 0;
const isRprGrowing = rprDifference >= 0;
const rprGrowthText = `${Math.abs(rprDifference).toFixed(2)}% RPR ${isRprGrowing ? "Growth" : "Decline"}`;

// Calculate Current Month's RPR
const currentMonthOrders = orderCart.filter(order => new Date(order[2]).getMonth() === new Date().getMonth());
const currentMonthRpr = calculateRPR(currentMonthOrders);

// Calculate Last 3 Months' RPR
const threeMonthsAgo = new Date();
threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
const lastThreeMonthsOrders = orderCart.filter(order => new Date(order[2]) >= threeMonthsAgo);
const lastThreeMonthsRpr = calculateRPR(lastThreeMonthsOrders);


const thsimrpr = document.querySelector("h6.thsimrpr");
if (thsimrpr) thsimrpr.innerHTML = `${currentMonthRpr}%`;

const mavgrpr = document.querySelector("h6.mavgrpr");
if (mavgrpr) mavgrpr.innerHTML = `${lastThreeMonthsRpr}%`;

// Update RPR Indicator
const rprElement = document.getElementById("rprIndicator");
if (rprElement) {
    rprElement.style.color = isRprGrowing ? "green" : "red";
    rprElement.textContent = rprGrowthText;
}

// Chart Options
const growthChartEl = document.querySelector("#growthChart");
if (growthChartEl) {
    new ApexCharts(growthChartEl, {
        series: [rpr],
        labels: ["RPR"],
        chart: { height: 240, type: "radialBar" },
        plotOptions: {
            radialBar: {
                size: 150,
                offsetY: 10,
                startAngle: -150,
                endAngle: 150,
                hollow: { size: "55%" },
                track: { background: cardColor, strokeWidth: "100%" },
                dataLabels: {
                    name: { offsetY: 15, color: headingColor, fontSize: "15px", fontWeight: "600", fontFamily: "Public Sans" },
                    value: { offsetY: -25, color: headingColor, fontSize: "22px", fontWeight: "500", fontFamily: "Public Sans" }
                }
            }
        },
        colors: [primaryColor],
        fill: { type: "gradient", gradient: { shade: "dark", shadeIntensity: 0.5, gradientToColors: [primaryColor], inverseColors: true, opacityFrom: 1, opacityTo: 0.6, stops: [30, 70, 100] } },
        stroke: { dashArray: 5 },
        grid: { padding: { top: -35, bottom: -10 } },
        states: { hover: { filter: { type: "none" } }, active: { filter: { type: "none" } } }
    }).render();
}

// Update RPR Growth Text
const rprGrowthEl = document.querySelector(".text-center.fw-semibold.pt-3.mb-2");
if (rprGrowthEl) rprGrowthEl.textContent = rprGrowthText;


// Function to process orderCart data and compute customer visits
function processCustomerVisits(orderCart) {
    const visitData = {};
    
    orderCart.forEach(order => {
        const date = new Date(order[2]).toISOString().split('T')[0]; // Extract date in 'YYYY-MM-DD' format
        const customerId = order[1]; // Customer ID from index 1
        
        if (!visitData[date]) {
            visitData[date] = { totalVisits: new Set(), repeatVisits: new Set() };
        }
        
        if (visitData[date].totalVisits.has(customerId)) {
            visitData[date].repeatVisits.add(customerId);
        } else {
            visitData[date].totalVisits.add(customerId);
        }
    });
    
    // Convert sets to counts and structure data for chart
    const sortedDates = Object.keys(visitData).sort();
    const totalVisits = sortedDates.map(date => visitData[date].totalVisits.size);
    const repeatedVisits = sortedDates.map(date => -visitData[date].repeatVisits.size);
    
    return { dates: sortedDates, totalVisits, repeatedVisits };
}

// Retrieve orderCart from sessionStorage

const totalRevenueChartOptions = {
    series: [],
    chart: {
        height: 300,
        stacked: true,
        type: 'bar',
        toolbar: { show: false }
    },
    plotOptions: {
        bar: {
            horizontal: false,
            columnWidth: '33%',
            borderRadius: 12,
            startingShape: 'rounded',
            endingShape: 'rounded'
        }
    },
    colors: [config.colors.primary, config.colors.info],
    dataLabels: { enabled: false },
    stroke: {
        curve: 'smooth',
        width: 6,
        lineCap: 'round',
        colors: [cardColor]
    },
    legend: {
        show: true,
        horizontalAlign: 'left',
        position: 'top',
        markers: {
            height: 8,
            width: 8,
            radius: 12,
            offsetX: -3
        },
        labels: { colors: axisColor },
        itemMargin: { horizontal: 10 }
    },
    grid: {
        borderColor: borderColor,
        padding: { top: 0, bottom: -8, left: 20, right: 20 }
    },
    xaxis: {
        categories: [],
        labels: { style: { fontSize: '13px', colors: axisColor } },
        axisTicks: { show: false },
        axisBorder: { show: false }
    },
    yaxis: {
        labels: { style: { fontSize: '13px', colors: axisColor } }
    }
};

// Now continue with processing orderCart and updating the chart


// Function to process orderCart data and compute customer visits
function processCustomerVisits(orderCart) {
    const visitData = {};
    const last7Days = new Set();
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(today.getDate() - i);
        last7Days.add(date.toISOString().split('T')[0]);
    }
    
    orderCart.forEach(order => {
        const date = new Date(order[2]).toISOString().split('T')[0]; // Extract date in 'YYYY-MM-DD' format
        if (!last7Days.has(date)) return; // Filter only last 7 days
        
        const customerId = order[1]; // Customer ID from index 1
        
        if (!visitData[date]) {
            visitData[date] = { totalVisits: new Set(), repeatVisits: new Set() };
        }
        
        if (visitData[date].totalVisits.has(customerId)) {
            visitData[date].repeatVisits.add(customerId);
        } else {
            visitData[date].totalVisits.add(customerId);
        }
    });
    
    // Convert sets to counts and structure data for chart
    const sortedDates = Array.from(last7Days).sort();
    const totalVisits = sortedDates.map(date => visitData[date]?.totalVisits.size || 0);
    const repeatedVisits = sortedDates.map(date => -(visitData[date]?.repeatVisits.size || 0));
    
    return { dates: sortedDates, totalVisits, repeatedVisits };
}

// Retrieve orderCart from sessionStorage

// Function to process orderCart data and compute customer visits
function processCustomerVisits(orderCart) {
    const visitData = {};
    const last7Days = new Set();
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(today.getDate() - i);
        last7Days.add(date.toISOString().split('T')[0]);
    }
    
    orderCart.forEach(order => {
        const date = new Date(order[2]).toISOString().split('T')[0]; // Extract date in 'YYYY-MM-DD' format
        if (!last7Days.has(date)) return; // Filter only last 7 days
        
        const customerId = order[1]; // Customer ID from index 1
        
        if (!visitData[date]) {
            visitData[date] = { totalVisits: new Set(), repeatVisits: new Set() };
        }
        
        if (visitData[date].totalVisits.has(customerId)) {
            visitData[date].repeatVisits.add(customerId);
        } else {
            visitData[date].totalVisits.add(customerId);
        }
    });
    
    // Convert sets to counts and structure data for chart
    const sortedDates = Array.from(last7Days).sort();
    const formattedDates = sortedDates.map(date => {
        const d = new Date(date);
        return `${d.getDate()} ${d.toLocaleString('en-US', { month: 'short' })}'${d.getFullYear().toString().slice(-2)}`;
    });
    
    const totalVisits = sortedDates.map(date => visitData[date]?.totalVisits.size || 0);
    const repeatedVisits = sortedDates.map(date => -(visitData[date]?.repeatVisits.size || 0));
    
    return { dates: formattedDates, totalVisits, repeatedVisits };
}

// Retrieve orderCart from sessionStorage

const { dates, totalVisits, repeatedVisits } = processCustomerVisits(orderCart);

// Update chart with processed data
totalRevenueChartOptions.series = [
    { name: 'Total Visits', data: totalVisits },
    { name: 'Repeated Visits', data: repeatedVisits }
];

totalRevenueChartOptions.xaxis.categories = dates;

const totalRevenueChartEl = document.querySelector('#totalRevenueChart');
if (totalRevenueChartEl) {
    const totalRevenueChart = new ApexCharts(totalRevenueChartEl, totalRevenueChartOptions);
    totalRevenueChart.render();
}


// Total Communication Sent
const communication_logs = JSON.parse(sessionStorage.getItem("communication_logs") || "[]");

const totalSent = communication_logs.length;
const totalSentElement = document.querySelector(".totalsent");
if (totalSentElement) totalSentElement.textContent = totalSent;

const whatsapp = communication_logs.filter(log => log[7] === "WHATSAPP");
const whatsappSent = whatsapp.length;

const whatsappSentElement = document.querySelector(".fw-semibold.whatsapp.sent");
if (whatsappSentElement) whatsappSentElement.textContent = whatsappSent;

const instagram = communication_logs.filter(log => log[7] === "INSTAGRAM");
const instagramSent = instagram.length;

const instagramSentElement = document.querySelector(".fw-semibold.instagram.sent");
if (instagramSentElement) instagramSentElement.textContent = instagramSent;

const email = communication_logs.filter(log => log[7] === "EMAIL");
const emailSent = email.length;

const emailSentElement = document.querySelector(".fw-semibold.email.sent");
if (emailSentElement) emailSentElement.textContent = emailSent;

const sms = communication_logs.filter(log => log[7] === "SMS");
const smsSent = sms.length;

const smsSentElement = document.querySelector(".fw-semibold.sms.sent");
if (smsSentElement) smsSentElement.textContent = smsSent;

const whatsappPercentage = (whatsappSent / totalSent) * 100;
const instagramPercentage = (instagramSent / totalSent) * 100;
const emailPercentage = (emailSent / totalSent) * 100;
const smsPercentage = (smsSent / totalSent) * 100;


// Order Statistics Chart
// --------------------------------------------------------------------
const chartOrderStatistics = document.querySelector('#orderStatisticsChart'),
orderChartConfig = {
    chart: {
    height: 165,
    width: 130,
    type: 'donut'
    },
    labels: ['EMAIL', 'SMS', 'WHATSAPP', 'INSTAGRAM'],
    series: [emailPercentage, smsPercentage, whatsappPercentage, instagramPercentage],
    colors: [config.colors.primary, config.colors.secondary, config.colors.info, config.colors.success],
    stroke: {
    width: 5,
    colors: cardColor
    },
    dataLabels: {
    enabled: false,
    formatter: function (val, opt) {
        return parseInt(val) + '%';
    }
    },
    legend: {
    show: false
    },
    grid: {
    padding: {
        top: 0,
        bottom: 0,
        right: 15
    }
    },
    plotOptions: {
    pie: {
        donut: {
        size: '75%',
        labels: {
            show: true,
            value: {
            fontSize: '1.5rem',
            fontFamily: 'Public Sans',
            color: headingColor,
            offsetY: -15,
            formatter: function (val) {
                return parseInt(val) + '%';
            }
            },
            name: {
            offsetY: 20,
            fontFamily: 'Public Sans'
            },
            total: {
            show: true,
            fontSize: '0.8125rem',
            color: axisColor,
            label: 'Channel',
            formatter: function (w) {
                return '100%';
            }
            }
        }
        }
    }
    }
};
if (typeof chartOrderStatistics !== undefined && chartOrderStatistics !== null) {
const statisticsChart = new ApexCharts(chartOrderStatistics, orderChartConfig);
statisticsChart.render();
}

