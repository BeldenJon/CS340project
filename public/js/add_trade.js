function showAddNew() {
    document.getElementById("Trades-table").style.display = "block";
    document.getElementById("add-Trade-form-ajax").style.display = "block";
    document.getElementById("update-Trade-form-ajax").style.display = "none";
    document.getElementById("delete-Trade-ajax").style.display = "none";
}

// Get the objects we need to modify
let addTradeForm = document.getElementById('add-Trade-form-ajax');

// Modify the objects we need
addTradeForm.addEventListener("submit", function (e) {

    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let input_trade = document.getElementById("input-Trade");
    let input_tradeDesc = document.getElementById("input-tradeDescription");

    // Get the values from the form fields
    let trade = input_trade.value;
    let tradeDesc = input_tradeDesc.value;


    // Put our data we want to send in a javascript object
    let data = {
        TradeName: trade,
        TradeDescription: tradeDesc,
    }

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add_Trade-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            input_trade.value = '';
            input_tradeDesc.value = '';

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
})


// Creates a single row from an Object representing a single record from Trades
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    //let currentTable = document.getElementById("Trades-table");
    let currentTableBody = document.getElementById("Trades-table-body");

    // Get the location where we should insert the new row (end of table)
    //let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 10 cells
    let row = document.createElement("TR");
    let editCell = document.createElement("TD");
    let idCell = document.createElement("TD");
    let tradeCell = document.createElement("TD");
    let tradeDescCell = document.createElement("TD");
    let deleteCell = document.createElement("TD");

    // Fill the cells with correct data
    editCell.innerHTML = `<a href="#" onClick="updateTrade(${newRow.TradeID})">Edit</a>`
    idCell.innerText = newRow.TradeID;
    tradeCell.innerText = newRow.TradeName;
    tradeCell.setAttribute('class', 'rightA');
    tradeDescCell.innerText = newRow.TradeDescription;
    deleteCell.innerHTML = `<a href="#" onClick="deleteTrade(${newRow.TradeID})">Delete</a>`

    // Add the cells to the row 
    row.appendChild(editCell);
    row.appendChild(idCell);
    row.appendChild(tradeCell);
    row.appendChild(tradeDescCell);
    row.appendChild(deleteCell);

    // Add a row attribute so the deleteRow function can find a newly added row
    row.setAttribute('trade-value', newRow.TradeID);

    // Add the row to the table
    currentTableBody.appendChild(row);
    showTable();
}