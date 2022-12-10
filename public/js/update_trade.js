function updateTrade(TradeID) {
    //set blocks visable on page
    document.getElementById("Trades-table").style.display = "block";
    document.getElementById("add-Trade-form-ajax").style.display = "none";
    document.getElementById("update-Trade-form-ajax").style.display = "block";
    document.getElementById("delete-Trade-ajax").style.display = "none";

    // Fill the Update fields with values from table
    let table = document.getElementById("Trades-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
        //iterate through rows until accessed row with matching siteID
        if (table.rows[i].getAttribute("trade-value") == TradeID) {
            // Get the location of the row where we found the matching TradeID
            let updateRowIndex = table.getElementsByTagName("tr")[i];
            // Update HTML in update table
            document.getElementById("pass-TradeID-update").innerText = TradeID;
            document.getElementById("update-Trade").value = updateRowIndex.getElementsByTagName("td")[2].innerHTML;
            document.getElementById("update-tradeDescription").value = updateRowIndex.getElementsByTagName("td")[3].innerHTML;
            break;
        }
    }
}

// Get the objects we need to modify
let updateTradeForm = document.getElementById('update-Trade-form-ajax');

// Modify the objects we need
updateTradeForm.addEventListener("submit", function (e) {

    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let formTradeID = document.getElementById("pass-TradeID-update");
    let input_trade = document.getElementById("update-Trade");
    let input_tradeDesc = document.getElementById("update-tradeDescription");

    // Get the values from the form fields
    let TradeID = formTradeID.innerText;
    let trade = input_trade.value;
    let tradeDesc = input_tradeDesc.value;

    // Put our data we want to send in a javascript object
    let data = {
        TradeID: TradeID,
        TradeName: trade,
        TradeDescription: tradeDesc,
    }

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-Trade-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            // Add the new data to the table
            updateRow(xhttp.response, TradeID);
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }
    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
})


function updateRow(data, TradeID) {
    let parsedData = JSON.parse(data);
    let table = document.getElementById("Trades-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
        //iterate through rows
        //rows would be accessed using the "row" variable assigned in the for loop
        if (table.rows[i].getAttribute("trade-value") == TradeID) {

            // Get the location of the row where we found the matching TradeID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Update HTML in table
            let trade = updateRowIndex.getElementsByTagName("td")[2];
            trade.innerHTML = parsedData[0].TradeName;
            let tradeDesc = updateRowIndex.getElementsByTagName("td")[3];
            tradeDesc.innerHTML = parsedData[0].TradeDescription;
            showTable();
            break
        }
    }
}