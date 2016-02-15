$(document).ready(function () {
    var myTableDiv = document.getElementById("my_table")
    var table = document.createElement('TABLE')
    var tableBody = document.createElement('TBODY')
    table.className += "table table-responsive table-hover";
    table.appendChild(tableBody);

    // var heading = new Array();
    // heading[0] = "Request Type"

    var stock = new Array()
    stock[0] = new Array("Cars", "88.625", "85.50", "85.81", "987")
    stock[1] = new Array("Veggies", "88.62dfdf", "85.50", "85.81", "988")
    stock[2] = new Array("Colors", "88.62dcolors5", "85.50", "85.81", "989")
    stock[3] = new Array("Numbers", "88.6num25", "85.50", "85.81", "990")
    stock[4] = new Array("Requests", "88.6rew25", "85.50", "85.81", "991")

    //TABLE COLUMNS
    // var tr = document.createElement('TR');
    // tableBody.appendChild(tr);
    // for (i = 0; i < stock.length; i++) {
    //     var th = document.createElement('TH')
    //     th.width = '75';
    //     th.appendChild(document.createTextNode(stock[i][0]));
    //     tr.appendChild(th);
    // }

    //TABLE ROWS
    for (i = 0; i < stock.length; i++) {
        var tr = document.createElement('TR');
        tr.className += "clickable";
        var id = "row".concat(i);
        tr.id = id;
        var target = ".".concat(id);
        tr.setAttribute("data-toggle", "collapse")
        tr.setAttribute("data-target", target)

        // for (j = 0; j < stock[i].length; j++) {
            var td = document.createElement('TD');
            td.appendChild(document.createTextNode(stock[i][0]));

            tr.appendChild(td);
        // }

        tableBody.appendChild(tr);

        var tr2 = document.createElement('TR');
        tr2.className += "collapse ".concat(id);
        var td2 = document.createElement('TD');
            td2.appendChild(document.createTextNode(stock[i][1]));
            tr2.appendChild(td2);

        tableBody.appendChild(tr2);
    }

    myTableDiv.appendChild(table)
});