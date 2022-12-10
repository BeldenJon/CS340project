// Global variables for update form fields
let formTaskID = document.getElementById("pass-TaskID");
let inputJobSiteID = document.getElementById("update-JobSite");
let inputDescription = document.getElementById("update-description");
let inputSeq = document.getElementById("update-sequence");
let inputstartDate = document.getElementById("update-startDate");
let inputendDate = document.getElementById("update-endDate");
let inputContTrade = document.getElementById("update-contTrade");
let inputPercent = document.getElementById("update-percent");
let inputEstimate = document.getElementById("update-Estimate");
let inputBilled = document.getElementById("update-Billed");
let inputPaymentDate = document.getElementById("update-paymentDate");
let inputPaid = document.getElementById("update-paid");


function updateTask(taskID) {
    //set blocks visable on page
    document.getElementById("Task-table").style.display = "block";
    document.getElementById("add-Task-form-ajax").style.display = "none";
    document.getElementById("update-Task-form-ajax").style.display = "block";
    document.getElementById("delete-Task-ajax").style.diplay = "none";

    // Fill the Update fields with values from table
    let table = document.getElementById("Task-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
        //iterate through rows until accessed row with matching siteID
        if (table.rows[i].getAttribute("task-value") == taskID) {
            // Get the location of the row where we found the matching JobSiteID
            let updateRowIndex = table.getElementsByTagName("tr")[i];
            // Update HTML in update table
            formTaskID.innerHTML = taskID;
            inputJobSiteID.value = updateRowIndex.getElementsByTagName("td")[2].getAttribute("job-ID");
            inputDescription.value = updateRowIndex.getElementsByTagName("td")[3].innerHTML;
            inputSeq.value = updateRowIndex.getElementsByTagName("td")[4].innerHTML;
            inputstartDate.value = updateRowIndex.getElementsByTagName("td")[5].innerHTML;
            inputendDate.value = updateRowIndex.getElementsByTagName("td")[6].innerHTML;
            inputContTrade.value = updateRowIndex.getElementsByTagName("td")[7].innerHTML;
            inputPercent.value = updateRowIndex.getElementsByTagName("td")[9].innerHTML;
            inputEstimate.value = updateRowIndex.getElementsByTagName("td")[10].innerHTML;
            inputBilled.value = updateRowIndex.getElementsByTagName("td")[11].innerHTML;
            inputPaymentDate.value = updateRowIndex.getElementsByTagName("td")[12].innerHTML;
            inputPaid.checked = updateRowIndex.getElementsByTagName("td")[13].innerText == "YES" ? true : false;
            break;
        }
    }
}

// Get the objects we need to modify
let updateJobSiteForm = document.getElementById('update-Task-form-ajax');

// Modify the objects we need
updateJobSiteForm.addEventListener("submit", function (e) {

    // Prevent the form from submitting
    e.preventDefault();

    // Get the values from the form fields
    let TaskID = formTaskID.innerText;
    let jobID = inputJobSiteID.value;
    let description = inputDescription.value;
    let seq = inputSeq.value;
    let startDate = inputstartDate.value;
    let endDate = inputendDate.value;
    let contTrade = inputContTrade.value;
    let percent = inputPercent.value;
    let estimate = inputEstimate.value;
    let billed = inputBilled.value;
    let paymentDate = inputPaymentDate.value;
    let paid = inputPaid.checked == true ? 1 : 0;

    // Validate inputs
    console.log(startDate + " - " + endDate);
    if (startDate > endDate) {
        alert("The 'End Date' must be the the same day or after the 'Start date'.")
        return
    }


    // Put our data we want to send in a javascript object
    let data = {
        TaskID: TaskID,
        JobSiteID: jobID,
        TaskDescription: description,
        TaskSequence: seq,
        TaskStart: startDate,
        TaskEnd: endDate,
        ContractorTradeID: contTrade,
        TaskPercentComplete: percent,
        TaskCostEstimate: estimate,
        TaskCostBilled: billed,
        PaymentDueDate: paymentDate,
        TaskCostPaid: paid
    }

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-Task-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            // Add the new data to the table
            updateRow(xhttp.response, TaskID);
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }
    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
})


function updateRow(data, TaskID) {
    let parsedData = JSON.parse(data);
    let table = document.getElementById("Task-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
        //iterate through rows
        //rows would be accessed using the "row" variable assigned in the for loop
        if (table.rows[i].getAttribute("task-value") == TaskID) {

            // Get the location of the row where we found the matching JobSiteID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Update HTML in table
            let jobAddress = updateRowIndex.getElementsByTagName("td")[2];
            jobAddress.innerHTML = parsedData[0].JobAddress;
            jobAddress.setAttribute("job-ID", parsedData[0].JobSiteID);
            let desc = updateRowIndex.getElementsByTagName("td")[3];
            desc.innerHTML = parsedData[0].Description;
            let sequence = updateRowIndex.getElementsByTagName("td")[4];
            sequence.innerHTML = parsedData[0].TaskSeq;
            let start = updateRowIndex.getElementsByTagName("td")[5];
            start.innerHTML = parsedData[0].Start_Date;
            let end = updateRowIndex.getElementsByTagName("td")[6];
            end.innerHTML = parsedData[0].End_Date;
            let contTradeID = updateRowIndex.getElementsByTagName("td")[7];
            contTradeID.innerHTML = parsedData[0].ContractorTradeID;
            let contTrade = updateRowIndex.getElementsByTagName("td")[8];
            contTrade.innerHTML = parsedData[0].ContTrade;
            let percentC = updateRowIndex.getElementsByTagName("td")[9];
            percentC.innerHTML = parsedData[0].PercentComplete;
            let costE = updateRowIndex.getElementsByTagName("td")[10];
            costE.innerHTML = parsedData[0].CostEstimate;
            let costB = updateRowIndex.getElementsByTagName("td")[11];
            costB.innerHTML = parsedData[0].CostBilled;
            let payDate = updateRowIndex.getElementsByTagName("td")[12];
            payDate.innerHTML = parsedData[0].Due_Date == "0000-00-00" ? "" : parsedData[0].Due_Date;
            let paid = updateRowIndex.getElementsByTagName("td")[13];
            paid.innerHTML = parsedData[0].Paid == 1 ? "YES" : "NO";
            showTable();
            break
        }
    }
}

