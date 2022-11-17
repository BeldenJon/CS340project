function deleteTask() {
    document.getElementById("Task-table").style.display = "block";
    document.getElementById("add-Task-form-ajax").style.display = "none";
    document.getElementById("update-Task-form-ajax").style.display = "none";
    document.getElementById("delete-Task-ajax").style.display = "block";
}

//code for deleteJobSite function using jQuery
function deleteTaskAjax(TaskID) {
    let link = '/delete-Task-ajax/';
    let data = {
        TaskID: TaskID
    };
    $.ajax({
        url: link,
        type: 'DELETE',
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            deleteRow(TaskID);
        }
    });
}

function deleteRow(TaskID) {
    let table = document.getElementById("Task-table");
    //console.log(jobID);
    for (let i = 0, row; row = table.rows[i]; i++) {
        //iterate through rows
        //rows would be accessed using the "row" variable assigned in the for loop
        if (table.rows[i].getAttribute("task-value") == TaskID) {
            table.deleteRow(i);
            break;
        }
    }
    //showTable();
}