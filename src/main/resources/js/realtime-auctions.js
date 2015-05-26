var auction_id = 1;

function init() {
    loadCurrentPrice();
    registerHandlerForUpdateCurrentPriceAndFeed();
};

function loadCurrentPrice() {
    var xmlhttp = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4) {
            if (xmlhttp.status == 200) {
                document.getElementById('current_price').innerHTML = JSON.parse(xmlhttp.responseText).price + ' EUR';
            } else {
                document.getElementById('current_price').innerHTML = '0.00 EUR';
            }
        }
    };
    xmlhttp.open("GET", "http://localhost:8080/auctions/" + auction_id);
    xmlhttp.send();
};

function registerHandlerForUpdateCurrentPriceAndFeed() {
    var eventBus = new vertx.EventBus('http://localhost:8080/ws');
    eventBus.onopen = function () {
        eventBus.registerHandler('auction.' + auction_id, function (message) {
            document.getElementById('current_price').innerHTML = JSON.parse(message).price + ' EUR';
            document.getElementById('feed').value += 'New offer: ' + JSON.parse(message).price + ' EUR \n';
        });
    }
};

function bid() {
    var newPrice = parseFloat(Math.round(document.getElementById('my_bid_value').value.replace(',','.') * 100) / 100).toFixed(2);

    var xmlhttp = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4) {
            if (xmlhttp.status == 200) {
                document.getElementById('error_message').innerHTML = '';
            } else {
                document.getElementById('error_message').innerHTML = 'Invalid price!';
            }
        }
    };
    xmlhttp.open("PATCH", "http://localhost:8080/auctions/" + auction_id);
    xmlhttp.setRequestHeader("Content-Type", "application/json");
    xmlhttp.send(JSON.stringify({price: newPrice}));
};
