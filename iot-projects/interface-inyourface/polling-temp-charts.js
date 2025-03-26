///////////////////////////////////////////////////////////
////////////////// JAVASCRIPT BEGINS HERE /////////////////
///////////////////////////////////////////////////////////
$(document).ready(function () {
  // Chart initialization code
  var maxDataPoints = 10;

  // Setup to use charts
  google.charts.load("current", { packages: ["corechart"] });
  google.setOnLoadCallback(drawVisualization);
  function drawVisualization() {
    /////////////////////////////////////////////////
    // CHART PREP SECTION: DO NOT TOUCH /////////////
    /////////////////////////////////////////////////
    var jsonChart = new google.visualization.LineChart($("#json-chart")[0]);
    var ajaxChart = new google.visualization.LineChart($("#ajax-chart")[0]);
    var wsChart = new google.visualization.LineChart($("#ws-chart")[0]);
    var jsonData = google.visualization.arrayToDataTable([
      ["Time", "JSON Polling Temperature"],
      [getTime(), 0],
    ]);
    var ajaxData = google.visualization.arrayToDataTable([
      ["Time", "AJAX Polling Temperature"],
      [getTime(), 0],
    ]);
    var wsData = google.visualization.arrayToDataTable([
      ["Time", "WebSocket Polling Temperature"],
      [getTime(), 0],
    ]);

    var options = {
      title: "Temperature",
      curveType: "function",
      animation: {
        duration: 1000,
        easing: "in",
      },
      legend: { position: "bottom" },
    };
    /////////////////////////////////////////////////
    // END CHART PREP SECTION: //////////////////////
    /////////////////////////////////////////////////

    // Code to add a data point
    function addDataPoint(dataPoint, dataSet, chart) {
      if (dataSet.getNumberOfRows() > maxDataPoints) {
        dataSet.removeRow(0);
      }
      dataSet.addRow([getTime(), dataPoint.value]);
      chart.draw(dataSet, options);
    }

    // TODO 3: Initialize high and low records

    const json = {
      highest: 0,
      lowest: 100,
      highID: "json-highest",
      lowID: "json-lowest",
    };

    const ajax = {
      highest: 0,
      lowest: 100,
      highID: "ajax-highest",
      lowID: "ajax-lowest",
    }

    const ws = {
      highest: 0,
      lowest: 100,
      highID: "ws-highest",
      lowID: "ws-lowest",
    }

    $("#json-chart-container").append(
      `<p id=${json.highID}>Highest recorded JSON value is ${json.highest}</p>`
    );

    $("#json-chart-container").append(
      `<p id=${json.lowID}>Highest recorded JSON value is ${json.lowest}</p>`
    );

    $("#ajax-chart-container").append(
      `<p id=${ajax.highID}>Highest recorded Ajax value is ${ajax.highest}</p>`
    );

    $("#ajax-chart-container").append(
      `<p id=${ajax.lowID}>Highest recorded Ajax value is ${ajax.lowest}</p>`
    );

    $("#ws-chart-container").append(
      `<p id=${ws.highID}>Highest recorded ws value is ${ws.highest}</p>`
    );

    $("#ws-chart-container").append(
      `<p id=${ws.lowID}>Highest recorded ws value is ${ws.lowest}</p>`
    );

    // TODO 4: Update high and low records

    function updateJSONRecords(value) {
      if (value > json.highest) {
        json.highest = value;
        $("#json-highest").text(`Highest recorded value is ${json.highest}`);
      }
      if (value < json.lowest) {
        json.lowest = value;
        $("#json-lowest").text(`Lowest recorded value is ${json.lowest}`);
      }
    }

    function updateAjaxRecords(value) {
      if (value > ajax.highest) {
        ajax.highest = value;
        $("#ajax-highest").text(`Highest recorded value is ${ajax.highest}`);
      }
      if (value < ajax.lowest) {
        ajax.lowest = value;
        $("#ajax-lowest").text(`Lowest recorded value is ${json.lowest}`);
      }
    }

    function updateWsRecords(value) {
      if (value > ws.highest) {
        ws.highest = value;
        $("#ws-highest").text(`Highest recorded value is ${ws.highest}`);
      }
      if (value < ajax.lowest) {
        ws.lowest = value;
        $("#ws-lowest").text(`Lowest recorded value is ${ws.lowest}`);
      }
    }

    // TODO 5: Regular JSON Polling

    const doJSONPull = () => {
      $.getJSON("http://localhost:8080/api", function (result) {
      addDataPoint(result, jsonData, jsonChart);
      updateJSONRecords(result.value);
  // Callback code will go here in the next steps
});
    }

    setInterval(() => {
      doJSONPull();
    }, 5000);

    // TODO 6: AJAX 
    
    const doAjaxPull = () => {
      $.ajax({
        url: "http://localhost:8080/api",
        method: "GET",
        dataType: "json",
        success: function (result) {
          // Fill in the body of the success 
          addDataPoint(result, ajaxData, ajaxChart);
          updateAjaxRecords(result.value);
        },
      });
    }

    setInterval(() => {
      doAjaxPull()
    }, 10000);

    const socket = new WebSocket(`ws://localhost:5070`);

    socket.onmessage = (event) => {
      const result = JSON.parse(event.data);
      addDataPoint(result, wsData, wsChart);
      updateWsRecords(result.value);
    } 

    // TODO 7: WebSocket Polling

    // Do not work below this line
    function getTime() {
      var d = new Date();
      return d.toLocaleTimeString();
    }
  }
});
