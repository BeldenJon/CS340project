// Get the objects we need to modify
let addJobSiteForm = document.getElementById('add-JobSite-form-ajax');

// Modify the objects we need
addJobSiteForm.addEventListener("submit", function (e) {

    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let input_address = document.getElementById("input-address");
    let input_zipCode = document.getElementById("input-zipCode");
    let input_description = document.getElementById("input-description");
    let input_startDate = document.getElementById("input-startDate");
    let input_endDate = document.getElementById("input-endDate");
    let input_jobCost = document.getElementById("input-jobCost");
    let input_jobBudget = document.getElementById("input-jobBudget");

    // Get the values from the form fields
    let address = input_address.value;
    let zipCode = input_zipCode.value;
    let description = input_description.value;
    let startDate = input_startDate.value;
    let endDate = input_endDate.value;
    let jobCost = input_jobCost.value;
    let jobBudget = input_jobBudget.value;

    // Put our data we want to send in a javascript object
    let data = {
        JobAddress: address,
        JobZipcode: zipCode,
        JobDescription: description,
        JobStart: startDate,
        JobCompleted: endDate,
        JobCost: jobCost,
        JobBudget: jobBudget
    }

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add_JobSite-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            input_address.value = '';
            input_zipCode.value = '';
            input_description.value = '';
            input_startDate.value = '';
            input_endDate.value = '';
            input_jobCost.value = '';
            input_jobBudget.value = '';
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
    let currentTable = document.getElementById("JobSite-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let addressCell = document.createElement("TD");
    let zipcodeCell = document.createElement("TD");
    let descriptionCell = document.createElement("TD");
    let startDateCell = document.createElement("TD");
    let endDateCell = document.createElement("TD");
    let jobCostCell = document.createElement("TD");
    let jobBudgetCell = document.createElement("TD");

    // Fill the cells with correct data
    idCell.innerText = newRow.JobSiteID;
    addressCell.innerText = newRow.JobAddress;
    zipcodeCell.innerText = newRow.JobZipcode;
    descriptionCell.innerText = newRow.JobDescription;
    startDateCell.innerText = newRow.JobStart;
    endDateCell.innerText = newRow.JobCompleted;
    jobCostCell.innerText = newRow.JobCost;
    jobBudgetCell.innerText = newRow.JobBudget;

    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(addressCell);
    row.appendChild(zipcodeCell);
    row.appendChild(descriptionCell);
    row.appendChild(startDateCell);
    row.appendChild(endDateCell);
    row.appendChild(jobCostCell);
    row.appendChild(jobBudgetCell);

    // Add the row to the table
    currentTable.appendChild(row);
}