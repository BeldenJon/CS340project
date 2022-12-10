function updateContractor(ContractorID) {
    //set blocks visable on page
    document.getElementById("Contractor-table").style.display = "block";
    document.getElementById("add-Contractor-form-ajax").style.display = "none";
    document.getElementById("update-Contractor-form-ajax").style.display = "block";
    document.getElementById("delete-Contractor-ajax").style.display = "none";

    // Fill the Update fields with values from table
    let table = document.getElementById("Contractor-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
        //iterate through rows until accessed row with matching siteID
        if (table.rows[i].getAttribute("contractor-value") == ContractorID) {
            // Get the location of the row where we found the matching JobSiteID
            let updateRowIndex = table.getElementsByTagName("tr")[i];
            // Update HTML in update table
            document.getElementById("pass-ContractorID").innerHTML = ContractorID;
            document.getElementById("update-License").value = updateRowIndex.getElementsByTagName("td")[2].innerHTML;
            document.getElementById("update-firstName").value = updateRowIndex.getElementsByTagName("td")[3].innerHTML;
            document.getElementById("update-lastName").value = updateRowIndex.getElementsByTagName("td")[4].innerHTML;
            document.getElementById("update-businessName").value = updateRowIndex.getElementsByTagName("td")[5].innerHTML;
            document.getElementById("update-contactPhone").value = updateRowIndex.getElementsByTagName("td")[6].innerHTML;
            document.getElementById("update-contactEmail").value = updateRowIndex.getElementsByTagName("td")[7].innerHTML;
            break;
        }
    }
}

// Get the objects we need to modify
let updateContractorForm = document.getElementById('update-Contractor-form-ajax');

// Modify the objects we need
updateContractorForm.addEventListener("submit", function (e) {

    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let formContractorID = document.getElementById("pass-ContractorID");
    let inputLicense = document.getElementById("update-License");
    let inputFirst = document.getElementById("update-firstName");
    let inputLast = document.getElementById("update-lastName");
    let inputBusiness = document.getElementById("update-businessName");
    let inputPhone = document.getElementById("update-contactPhone");
    let inputEmail = document.getElementById("update-contactEmail");

    // Get the values from the form fields
    let contractorID = formContractorID.innerText;
    let lic = inputLicense.value;
    let first = inputFirst.value;
    let last = inputLast.value;
    let business = inputBusiness.value;
    let phone = inputPhone.value;
    let email = inputEmail.value;
    //console.log(contractorID)

    // Put our data we want to send in a javascript object
    let data = {
        ContractorID: contractorID,
        LicenseNumber: lic,
        FirstName: first,
        LastName: last,
        BusinessName: business,
        ContactPhone: phone,
        ContactEmail: email
    }

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-Contractor-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            // Add the new data to the table
            updateRow(xhttp.response, contractorID);
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }
    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
})


function updateRow(data, ContractorID) {
    let parsedData = JSON.parse(data);
    let table = document.getElementById("Contractor-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
        //iterate through rows
        //rows would be accessed using the "row" variable assigned in the for loop
        if (table.rows[i].getAttribute("contractor-value") == ContractorID) {

            // Get the location of the row where we found the matching JobSiteID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Update HTML in table
            let lic = updateRowIndex.getElementsByTagName("td")[2];
            lic.innerHTML = parsedData[0].LicenseNumber;
            let first = updateRowIndex.getElementsByTagName("td")[3];
            first.innerHTML = parsedData[0].FirstName;
            let last = updateRowIndex.getElementsByTagName("td")[4];
            last.innerHTML = parsedData[0].LastName;
            let business = updateRowIndex.getElementsByTagName("td")[5];
            business.innerHTML = parsedData[0].BusinessName;
            let phone = updateRowIndex.getElementsByTagName("td")[6];
            phone.innerHTML = parsedData[0].ContactPhone;
            let email = updateRowIndex.getElementsByTagName("td")[7];
            email.innerHTML = parsedData[0].ContactEmail;
            showTable();
            break
        }
    }
}