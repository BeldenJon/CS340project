function showAddNew() {
    document.getElementById("Contractor-table").style.display = "block";
    document.getElementById("add-Contractor-form-ajax").style.display = "block";
    document.getElementById("update-Contractor-form-ajax").style.display = "none";
    document.getElementById("delete-Contractor-ajax").style.display = "none";
}

// Get the objects we need to modify
let addJobSiteForm = document.getElementById('add-Contractor-form-ajax');

// Modify the objects we need
addJobSiteForm.addEventListener("submit", function (e) {

    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let input_license = document.getElementById("input-License");
    let input_firstName = document.getElementById("input-firstName");
    let input_lastName = document.getElementById("input-lastName");
    let input_busName = document.getElementById("input-businessName");
    let input_contactPhone = document.getElementById("input-contactPhone");
    let input_contactEmail = document.getElementById("input-contactEmail");

    // Get the values from the form fields
    let lic = input_license.value;
    let first = input_firstName.value;
    let last = input_lastName.value;
    let business = input_busName.value;
    let phone = input_contactPhone.value;
    let email = input_contactEmail.value;

    // Put our data we want to send in a javascript object
    let data = {
        LicenseNumber: lic,
        FirstName: first,
        LastName: last,
        BusinessName: business,
        ContactPhone: phone,
        ContactEmail: email
    }

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add_Contractor-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            input_license.value = "";
            input_firstName.value = "";
            input_lastName.value = "";
            input_busName.value = "";
            input_contactPhone.value = "";
            input_contactEmail.value = "";
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
    //let currentTable = document.getElementById("Contractor-table");
    let currentTableBody = document.getElementById("Contractor-table-body");

    // Get the location where we should insert the new row (end of table)
    //let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 10 cells
    let row = document.createElement("TR");
    let editCell = document.createElement("TD");
    let idCell = document.createElement("TD");
    let licenseCell = document.createElement("TD");
    let firstCell = document.createElement("TD");
    let lastCell = document.createElement("TD");
    let businessCell = document.createElement("TD");
    let phoneCell = document.createElement("TD");
    let emailCell = document.createElement("TD");
    let deleteCell = document.createElement("TD");

    // Fill the cells with correct data
    editCell.innerHTML = `<a href="#" onClick="updateContractor(${newRow.ContractorID})">Edit</a>`
    idCell.innerText = newRow.ContractorID;
    licenseCell.innerText = newRow.LicenseNumber;
    licenseCell.setAttribute('class', 'rightA');
    firstCell.innerText = newRow.FirstName;
    lastCell.innerText = newRow.LastName;
    businessCell.innerText = newRow.BusinessName;
    phoneCell.innerText = newRow.ContactPhone;
    emailCell.innerText = newRow.ContactEmail;
    deleteCell.innerHTML = `<a href="#" onClick="deleteContractor(${newRow.ContractorID})">Delete</a>`

    // Add the cells to the row 
    row.appendChild(editCell);
    row.appendChild(idCell);
    row.appendChild(licenseCell);
    row.appendChild(firstCell);
    row.appendChild(lastCell);
    row.appendChild(businessCell);
    row.appendChild(phoneCell);
    row.appendChild(emailCell);
    row.appendChild(deleteCell);

    // Add a row attribute so the deleteRow function can find a newly added row
    row.setAttribute('contractor-value', newRow.ContractorID);

    // Add the row to the table
    currentTableBody.appendChild(row);
    showTable();
}