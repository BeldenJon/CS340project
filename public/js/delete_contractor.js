function deleteContractor() {
    document.getElementById("Contractor-table").style.display = "block";
    document.getElementById("add-Contractor-form-ajax").style.display = "none";
    document.getElementById("update-Contractor-form-ajax").style.display = "none";
    document.getElementById("delete-Contractor-ajax").style.display = "block";
}

//code for deleteContractor function using jQuery
function deleteContractorAjax(ContractorID) {
    let link = '/delete-Contractor-ajax/';
    let data = {
        ContractorID: ContractorID
    };
    $.ajax({
        url: link,
        type: 'DELETE',
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            deleteRow(ContractorID);
        }
    });
}

function deleteRow(ContractorID) {
    let table = document.getElementById("Contractor-table");
    //console.log(ContractorID);
    for (let i = 0, row; row = table.rows[i]; i++) {
        //iterate through rows
        //rows would be accessed using the "row" variable assigned in the for loop
        if (table.rows[i].getAttribute("contractor-value") == ContractorID) {
            table.deleteRow(i);
            break;
        }
    }
    showTable();
}