function deleteTrade(TradeID) {
    document.getElementById("Trades-table").style.display = "block";
    document.getElementById("add-Trade-form-ajax").style.display = "none";
    document.getElementById("update-Trade-form-ajax").style.display = "none";
    document.getElementById("delete-Trade-ajax").style.display = "block";

    document.getElementById("pass-TradeID-delete").innerHTML = TradeID;
}

//code for deleteTrade function using jQuery
function deleteTradeAjax() {
    let TradeID = document.getElementById("pass-TradeID-delete").innerHTML;
    let link = '/delete-Trade-ajax/';
    let data = {
        TradeID: TradeID
    };
    $.ajax({
        url: link,
        type: 'DELETE',
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            deleteRow(TradeID);
        }
    });
}

function deleteRow(TradeID) {
    let table = document.getElementById("Trades-table");
    //console.log(jobID);
    for (let i = 0, row; row = table.rows[i]; i++) {
        //iterate through rows
        //rows would be accessed using the "row" variable assigned in the for loop
        if (table.rows[i].getAttribute("trade-value") == TradeID) {
            table.deleteRow(i);
            break;
        }
    }
    showTable();
}