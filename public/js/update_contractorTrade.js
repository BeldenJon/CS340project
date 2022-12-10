function updateContractorTrade(ContractorTradeID) {
    //set blocks visable on page
    document.getElementById("ContractorTrade-table").style.display = "block";
    document.getElementById("add-ContractorTrade-form-ajax").style.display = "none";
    document.getElementById("update-ContractorTrade-form-ajax").style.display = "block";

    // Fill the Update fields with values from table
    let table = document.getElementById("ContractorTrade-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
        //iterate through rows until accessed row with matching siteID
        if (table.rows[i].getAttribute("contractorTrade-value") == ContractorTradeID) {
            // Get the location of the row where we found the matching JobSiteID
            let updateRowIndex = table.getElementsByTagName("tr")[i];
            // Update HTML in update table
            document.getElementById("pass-ContractorTradeID").innerText = ContractorTradeID;
            document.getElementById("pass-ContractorID").innerText = updateRowIndex.getElementsByTagName("td")[2].innerText;
            document.getElementById("pass-ContractorID").setAttribute("cID", updateRowIndex.getElementsByTagName("td")[2].getAttribute("contr"));
            document.getElementById("pass-TradeID").innerText = updateRowIndex.getElementsByTagName("td")[3].innerText;
            document.getElementById("pass-TradeID").setAttribute("tID", updateRowIndex.getElementsByTagName("td")[3].getAttribute("trade"));
            document.getElementById("update-notes").value = updateRowIndex.getElementsByTagName("td")[4].innerHTML;
            document.getElementById("update-activeTrade").checked = updateRowIndex.getElementsByTagName("td")[5].innerHTML == "YES" ? true : false;
            break;
        }
    }
}

// Get the objects we need to modify
let updateContractorTradeForm = document.getElementById('update-ContractorTrade-form-ajax');

// Modify the objects we need
updateContractorTradeForm.addEventListener("submit", function (e) {

    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let formContractorTradeID = document.getElementById("pass-ContractorTradeID");
    let inputNotes = document.getElementById("update-notes");
    let inputActiveTrade = document.getElementById("update-activeTrade");

    // Get the values from the form fields
    let contractorTradeID = formContractorTradeID.innerText;
    let notes = inputNotes.value;
    let active = inputActiveTrade.checked == true ? 1 : 0;

    // Put our data we want to send in a javascript object
    let data = {
        ContractorTradeID: contractorTradeID,
        ContractorTradesNotes: notes,
        ActiveTrade: active
    }
    //console.log(data);

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-ContractorTrade-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            // Add the new data to the table
            updateRow(xhttp.response, contractorTradeID);
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }
    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
})


function updateRow(data, ContractorTradeID) {
    let parsedData = JSON.parse(data);
    let table = document.getElementById("ContractorTrade-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
        //iterate through rows
        //rows would be accessed using the "row" variable assigned in the for loop
        if (table.rows[i].getAttribute("contractorTrade-value") == ContractorTradeID) {

            // Get the location of the row where we found the matching JobSiteID
            let updateRowIndex = table.getElementsByTagName("tr")[i];
            // Update HTML in table
            let notes = updateRowIndex.getElementsByTagName("td")[4];
            notes.innerHTML = parsedData[0].ContractorTradesNotes;
            let active = updateRowIndex.getElementsByTagName("td")[5];
            active.innerText = parsedData[0].ActiveTrade == 1 ? "YES" : "NO";
            showTable();
            break
        }
    }
}