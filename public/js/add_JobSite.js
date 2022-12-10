function showAddNew() {
    document.getElementById("JobSite-table").style.display = "block";
    document.getElementById("add-JobSite-form-ajax").style.display = "block";
    document.getElementById("update-JobSite-form-ajax").style.display = "none";
    document.getElementById("delete-JobSite-ajax").style.display = "none";
}

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

    // validate Completion date
    if (endDate != "" && (endDate < startDate)) {
        alert("If entered, the 'End Date' must be the the same day or after the 'Start date'.")
        return
    }

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
    let currentTableBody = document.getElementById("JobSite-table-body");

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 10 cells
    let row = document.createElement("TR");
    let editCell = document.createElement("TD");
    let idCell = document.createElement("TD");
    let addressCell = document.createElement("TD");
    let zipcodeCell = document.createElement("TD");
    let descriptionCell = document.createElement("TD");
    let startDateCell = document.createElement("TD");
    let endDateCell = document.createElement("TD");
    let jobCostCell = document.createElement("TD");
    let jobBudgetCell = document.createElement("TD");
    let deleteCell = document.createElement("TD");

    // Fill the cells with correct data
    editCell.innerHTML = `<a href="#" onClick="updateJob(${newRow.JobSiteID})">Edit</a>`
    idCell.innerText = newRow.JobSiteID;
    addressCell.innerText = newRow.JobAddress;
    zipcodeCell.innerText = newRow.JobZipcode;
    zipcodeCell.setAttribute('class', 'rightA');
    descriptionCell.innerText = newRow.JobDescription;
    startDateCell.innerText = newRow.JobStart;
    startDateCell.setAttribute('class', 'date');
    endDateCell.innerText = newRow.JobCompleted == "0000-00-00" ? "" : newRow.JobCompleted;
    endDateCell.setAttribute('class', 'date');
    jobCostCell.innerText = newRow.JobCost;
    jobCostCell.setAttribute('class', 'rightA');
    jobBudgetCell.innerText = newRow.JobBudget;
    jobBudgetCell.setAttribute('class', 'rightA');
    deleteCell.innerHTML = `<a href="#" onClick="deleteJob(${newRow.JobSiteID})">Delete</a>`

    // Add the cells to the row 
    row.appendChild(editCell);
    row.appendChild(idCell);
    row.appendChild(addressCell);
    row.appendChild(zipcodeCell);
    row.appendChild(descriptionCell);
    row.appendChild(startDateCell);
    row.appendChild(endDateCell);
    row.appendChild(jobCostCell);
    row.appendChild(jobBudgetCell);
    row.appendChild(deleteCell);

    // Add a row attribute so the deleteRow function can find a newly added row
    row.setAttribute('job-value', newRow.JobSiteID);

    // Add the row to the table
    currentTableBody.appendChild(row);
    showTable();
}