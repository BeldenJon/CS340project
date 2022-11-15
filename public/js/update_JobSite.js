const months = { Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06', Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12' }

function updateJob(siteID, address, zip, description, start, end, cost, budget) {
    //set blocks visable on page
    document.getElementById("JobSite-table").style.display = "block";
    document.getElementById("add-JobSite-form-ajax").style.display = "none";
    document.getElementById("update-JobSite-form-ajax").style.display = "block";
    document.getElementById("delete-JobSite-ajax").style.diplay = "none";

    // Fill the Update fields with values from table
    let table = document.getElementById("JobSite-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
        //iterate through rows until accessed row with matching siteID
        if (table.rows[i].getAttribute("job-value") == siteID) {
            // Get the location of the row where we found the matching JobSiteID
            let updateRowIndex = table.getElementsByTagName("tr")[i];
            // Update HTML in update table
            document.getElementById("pass-JobSiteID").value = siteID;
            document.getElementById("update-address").value = updateRowIndex.getElementsByTagName("td")[2].innerHTML;
            document.getElementById("update-zipCode").value = updateRowIndex.getElementsByTagName("td")[3].innerHTML;
            document.getElementById("update-description").value = updateRowIndex.getElementsByTagName("td")[4].innerHTML;
            //let start = (updateRowIndex.getElementsByTagName("td")[5].innerHTML).split(' ');
            //let m = String(start[1]);
            //console.log(months.m);
            //console.log(start[3] + "-" + m + "-" + start[2]);
            //let startFormated = Date.prototype.getFullYear(start);
            //document.getElementById("update-startDate").value = start;
            //document.getElementById("update-endDate").value = updateRowIndex.getElementsByTagName("td")[6].innerHTML;
            document.getElementById("update-jobCost").value = updateRowIndex.getElementsByTagName("td")[7].innerHTML;
            document.getElementById("update-jobBudget").value = updateRowIndex.getElementsByTagName("td")[8].innerHTML;
            //console.log(startFormated);
            break;
        }
    }
}

// Get the objects we need to modify
let updateJobSiteForm = document.getElementById('update-JobSite-form-ajax');

// Modify the objects we need
updateJobSiteForm.addEventListener("submit", function (e) {

    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let formJobSiteID = document.getElementById("pass-JobSiteID");
    let inputAddress = document.getElementById("update-address");
    let inputzipCode = document.getElementById("update-zipCode");
    let inputDescription = document.getElementById("update-description");
    let inputstarDate = document.getElementById("update-startDate");
    let inputendDate = document.getElementById("update-endDate");
    let inputjobCost = document.getElementById("update-jobCost");
    let inputjobBudget = document.getElementById("update-jobBudget");

    // Get the values from the form fields
    let JobsiteID = formJobSiteID.value;
    let address = inputAddress.value;
    let zipCode = inputzipCode.value;
    let description = inputDescription.value;
    let startDate = inputstarDate.value;
    let endDate = inputendDate.value;
    let jobCost = inputjobCost.value;
    let jobBudget = inputjobBudget.value;


    // Put our data we want to send in a javascript object
    let data = {
        JobsiteID: JobsiteID,
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
    xhttp.open("PUT", "/put-JobSites-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            // Add the new data to the table
            updateRow(xhttp.response, JobsiteID);
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }
    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
})


function updateRow(data, JobSiteID) {
    let parsedData = JSON.parse(data);
    let table = document.getElementById("JobSite-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
        //iterate through rows
        //rows would be accessed using the "row" variable assigned in the for loop
        if (table.rows[i].getAttribute("job-value") == JobSiteID) {

            // Get the location of the row where we found the matching JobSiteID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Update HTML in table
            let address = updateRowIndex.getElementsByTagName("td")[2];
            address.innerHTML = parsedData[0].JobAddress;
            let zip = updateRowIndex.getElementsByTagName("td")[3];
            zip.innerHTML = parsedData[0].JobZipcode;
            let desc = updateRowIndex.getElementsByTagName("td")[4];
            desc.innerHTML = parsedData[0].JobDescription;
            let start = updateRowIndex.getElementsByTagName("td")[5];
            start.innerHTML = parsedData[0].JobStart;
            let end = updateRowIndex.getElementsByTagName("td")[6];
            end.innerHTML = parsedData[0].JobCompleted;
            let cost = updateRowIndex.getElementsByTagName("td")[7];
            cost.innerHTML = parsedData[0].JobCost;
            let budget = updateRowIndex.getElementsByTagName("td")[8];
            budget.innerHTML = parsedData[0].JobBudget;
            break
        }
    }
}