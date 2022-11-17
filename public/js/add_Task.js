function showAddNew() {
    document.getElementById("Task-table").style.display = "block";
    document.getElementById("add-Task-form-ajax").style.display = "block";
    document.getElementById("update-Task-form-ajax").style.display = "none";
    document.getElementById("delete-Task-ajax").style.display = "none";
}

// Get the objects we need to modify
let addTaskForm = document.getElementById('add-Task-form-ajax');

// Modify the objects we need
addTaskForm.addEventListener("submit", function (e) {

    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let input_job = document.getElementById("input-JobSite");
    let input_description = document.getElementById("input-description");
    let input_seq = document.getElementById("input-sequence");
    let input_start = document.getElementById("input-startDate");
    let input_end = document.getElementById("input-endDate");
    let input_contTrade = document.getElementById("input-contTrade");
    let input_percent = document.getElementById("input-percent");
    let input_estimate = document.getElementById("input-Estimate");
    let input_billed = document.getElementById("input-Billed");
    let input_dayPaid = document.getElementById("input-paymentDate");
    let input_paid = document.getElementById("input-paid");

    // Get the values from the form fields
    let job = input_job.value;
    let description = input_description.value;
    let seq = input_seq.value;
    let start = input_start.value;
    let end = input_end.value;
    let contTrade = input_contTrade.value;
    let percent = input_percent.value;
    let estimate = input_estimate.value;
    let billed = input_billed.value;
    let dayPaid = input_dayPaid.value;
    let paid = input_paid.value;

    // Put our data we want to send in a javascript object
    let data = {
        JobSiteID: job,
        TaskDescription: description,
        TaskSequence: seq,
        TaskStart: start,
        TaskEnd: end,
        ContractorTradeID: contTrade,
        TaskPercentComplete: percent,
        TaskCostEstimate: estimate,
        TaskCostBilled: billed,
        PaymentDueDate: dayPaid,
        TaskCostPaid: paid
    }

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add_Task-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            input_job.value = "Select a Job Site";
            input_description.value = "";
            input_seq.value = "";
            input_start.value = "";
            input_end.value = "";
            input_contTrade.value = "Select a Contractor and Trade:";
            input_percent.value = "0";
            input_estimate.value = "";
            input_billed.value = "";
            input_dayPaid.value = "";
            input_paid.value = "0";
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
    let currentTable = document.getElementById("Task-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 10 cells
    let row = document.createElement("TR");
    let editCell = document.createElement("TD");
    let taskIDCell = document.createElement("TD");
    let jobSiteIDCell = document.createElement("TD");
    let descriptionCell = document.createElement("TD");
    let seqCell = document.createElement("TD");
    let startCell = document.createElement("TD");
    let endCell = document.createElement("TD");
    let ContTradeIDCell = document.createElement("TD");
    let contTradeCell = document.createElement("TD");
    let percentCell = document.createElement("TD");
    let estimateCell = document.createElement("TD");
    let billedCell = document.createElement("TD");
    let dueDateCell = document.createElement("TD");
    let paidCell = document.createElement("TD");
    let deleteCell = document.createElement("TD");

    // Fill the cells with correct data
    editCell = document.createElement('a');
    editCell.setAttribute('href', "#");
    editCell.innerHTML = "Edit";
    /*
    editCell.onclick = function () {
        updateTask(newRow.TaskID);
    }
    */
    taskIDCell.innerText = newRow.TaskID;
    jobSiteIDCell.innerText = newRow.JobSiteID;
    descriptionCell.innerText = newRow.Description;
    seqCell.innerText = newRow.TaskSeq;
    startCell.innerText = newRow.Start_Date;
    endCell.innerText = newRow.End_Date;
    ContTradeIDCell.innerText = newRow.ContractorTradeID;
    contTradeCell.innerText = newRow.ContTrade;
    percentCell.innerText = newRow.PercentComplete;
    estimateCell.innerText = newRow.CostEstimate;
    billedCell.innerText = newRow.CostBilled;
    dueDateCell.innerText = newRow.Due_Date;
    paidCell.innerText = newRow.Paid
    deleteCell = document.createElement("a");
    deleteCell.setAttribute('href', "#");
    deleteCell.innerHTML = "Delete";
    /*
    deleteCell.onclick = function () {
        deleteTask(newRow.TaskID);
    };
    */

    // Add the cells to the row 
    row.appendChild(editCell);
    row.appendChild(taskIDCell);
    row.appendChild(jobSiteIDCell);
    row.appendChild(descriptionCell);
    row.appendChild(seqCell);
    row.appendChild(startCell);
    row.appendChild(endCell);
    row.appendChild(ContTradeIDCell);
    row.appendChild(contTradeCell);
    row.appendChild(percentCell);
    row.appendChild(estimateCell);
    row.appendChild(billedCell);
    row.appendChild(dueDateCell);
    row.appendChild(paidCell);    
    row.appendChild(deleteCell);

    // Add a row attribute so the delete and update row function work and append the row to the table
    row.setAttribute('task-value', newRow.TaskID);
    currentTable.appendChild(row);
}