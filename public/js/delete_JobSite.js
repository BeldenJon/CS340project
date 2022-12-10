function deleteJob(JobID) {
    document.getElementById("JobSite-table").style.display = "block";
    document.getElementById("add-JobSite-form-ajax").style.display = "none";
    document.getElementById("update-JobSite-form-ajax").style.display = "none";
    document.getElementById("delete-JobSite-ajax").style.display = "block";

    document.getElementById("pass-JobID").innerHTML = JobID;
}

//code for deleteJobSite function using jQuery
function deleteJobSite() {
    let JobID = document.getElementById("pass-JobID").innerHTML;
    let link = '/delete-JobSite-ajax/';
    let data = {
        JobSiteID: JobID
    };
    $.ajax({
        url: link,
        type: 'DELETE',
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            deleteRow(JobID);
        }
    });
}

function deleteRow(jobID) {
    let table = document.getElementById("JobSite-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
        //iterate through rows
        //rows would be accessed using the "row" variable assigned in the for loop
        if (table.rows[i].getAttribute("job-value") == jobID) {
            table.deleteRow(i);
            break;
        }
    }
    showTable();
}