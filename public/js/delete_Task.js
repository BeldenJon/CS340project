function deleteTask(TaskID) {
    document.getElementById("Task-table").style.display = "block";
    document.getElementById("add-Task-form-ajax").style.display = "none";
    document.getElementById("update-Task-form-ajax").style.display = "none";
    document.getElementById("delete-Task-ajax").style.display = "block";

    document.getElementById("pass-TaskID-delete").innerText = TaskID;
}

//code for deleteJobSite function using jQuery
function deleteTaskAjax() {
    let TaskID = document.getElementById("pass-TaskID-delete").innerText;
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
    for (let i = 0, row; row = table.rows[i]; i++) {
        //iterate through rows
        //rows would be accessed using the "row" variable assigned in the for loop
        //console.log(table.rows[i].getAttribute("task-value"));
        if (table.rows[i].getAttribute("task-value") == TaskID) {
            table.deleteRow(i);
            break;
        }
    }
    showTable();
}