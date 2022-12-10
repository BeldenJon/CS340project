function showAddNew() {
    document.getElementById("ContractorTrade-table").style.display = "block";
    document.getElementById("add-ContractorTrade-form-ajax").style.display = "block";
    document.getElementById("update-ContractorTrade-form-ajax").style.display = "none";
}

// Get the objects we need to modify
let addJobSiteForm = document.getElementById('add-ContractorTrade-form-ajax');

// Modify the objects we need
addJobSiteForm.addEventListener("submit", function (e) {

    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let input_contractor = document.getElementById("input-Contractor");
    let input_trade = document.getElementById("input-Trade");
    let input_activeTrade = document.getElementById("input-activeTrade");
    let input_notes = document.getElementById("input-notes");

    // Get the values from the form fields
    let contractor = input_contractor.value;
    let trade = input_trade.value;
    let activeTrade = input_activeTrade.checked == true ? 1 : 0;
    let notes = input_notes.value;

    // validate not a repeated Contractor-Trade Combo
    let table = document.getElementById("ContractorTrade-table");
    for (let i = 1; i < table.rows.length; i++) {
        if (table.rows[i].getElementsByTagName("td")[2].getAttribute("contr") == contractor && table.rows[i].getElementsByTagName("td")[3].getAttribute("trade") == trade) {
            alert("This Contractor Trade combination already exists. \n\nUpdate the existing ContractorTradeID " + table.rows[i].getElementsByTagName("td")[1].innerText + ".")
            return
        }
    }

    // Put our data we want to send in a javascript object
    let data = {
        ContractorID: contractor,
        TradeID: trade,
        ActiveTrade: activeTrade,
        ContractorTradesNotes: notes
    }

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add_ContractorTrade-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            input_contractor.value = "Select a Contractor:";
            input_trade.value = "Select a Trade:";
            input_activeTrade.checked = false;
            input_notes.value = "";
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
})


// Creates a single row from an Object representing a single record from JobSites
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTableBody = document.getElementById("ContractorTrade-table-body");

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 10 cells
    let row = document.createElement("TR");
    let editCell = document.createElement("TD");
    let idCell = document.createElement("TD");
    let businessNameCell = document.createElement("TD");
    let tradeNameCell = document.createElement("TD");
    let notesCell = document.createElement("TD");
    let activeTradeCell = document.createElement("TD");

    // Fill the cells with correct data
    editCell.innerHTML = `<a href="#" onClick="updateContractorTrade(${newRow.ContractorTradeID})">Edit</a>`;
    idCell.innerText = newRow.ContractorTradeID;
    idCell.setAttribute("class", "rightA");
    businessNameCell.innerText = newRow.BusinessName;
    businessNameCell.setAttribute("contr", newRow.ContractorID);
    tradeNameCell.innerText = newRow.TradeName;
    tradeNameCell.setAttribute("trade", newRow.TradeID);
    notesCell.innerText = newRow.ContractorTradesNotes;
    activeTradeCell.innerText = newRow.ActiveTrade == 1 ? "YES" : "NO";
    activeTradeCell.setAttribute("class", "alignC");

    // Add the cells to the row 
    row.appendChild(editCell);
    row.appendChild(idCell);
    row.appendChild(businessNameCell);
    row.appendChild(tradeNameCell);
    row.appendChild(notesCell);
    row.appendChild(activeTradeCell);

    // Add a row attribute so the deleteRow function can find a newly added row
    row.setAttribute('contractorTrade-value', newRow.ContractorTradeID);

    // Add the row to the table
    currentTableBody.appendChild(row);
    showTable();
}