var dataset;
var graph2d;
var globalTimeValue;
var globalTimeFormat;

function addToDataSet(err, data) {
  //console.log(data);
  ddb_items = [];
  if (err) console.log(err, err.stack); // an error occurred
  else
    data.Items.forEach(function(entry) {
      ddb_items.push({
        x: entry.msg_timestamp.S.replace(/\.\d{6}/, ''),
        y: parseFloat(entry.temperature.N),
        group: 0},
        { x: entry.msg_timestamp.S.replace(/\.\d{6}/, ''),
        y: parseFloat(entry.humidity.N),
        group: 1});
    });
    //console.log(ddb_items);
    dataset.add(ddb_items);
  };

function get_device_id(dev_id, timeValue, timeFormat) {
  data_timeFormat = {
    'days': '1hours',
    'weeks': '1hours',
    'months': '1days',
    'years': '1weeks'
  };
  if (timeFormat !== 'hours') {
    return dev_id + '-avg-' + data_timeFormat[timeFormat];
  }
  else {
    return dev_id;
  }
}
function getEntries(timeValue, timeFormat, start, end) {
  start = start || moment().utc().subtract(timeValue, timeFormat).format('YYYY-MM-DD HH:mm:ss.SSSSSS');
  end = end || moment().utc().format('YYYY-MM-DD HH:mm:ss.SSSSSS');
  // Initialize the Amazon Cognito credentials provider
  AWS.config.region = 'eu-west-1'; // Region
  AWS.config.credentials = new AWS.CognitoIdentityCredentials({
  IdentityPoolId: 'eu-west-1:a7e74d08-8957-443b-955b-2cef1e80be3f',
  });
  var dynamodb = new AWS.DynamoDB();
  var device_id = get_device_id('pi-1', timeValue, timeFormat);
  var params = {
    ExpressionAttributeValues: {
      ":t1": { S: start },
      ":t2": { S: end },
      ":id": { S: device_id }
    },
    KeyConditionExpression: "device_id = :id AND msg_timestamp BETWEEN :t1 AND :t2",
    ProjectionExpression: "msg_timestamp, temperature, humidity",
    TableName: "indoor",
    ScanIndexForward: false
  };
  dynamodb.query(params, addToDataSet);
}

function toggleActive(elem) {
    // get all 'a' elements
    var a = document.getElementsByClassName('measurement-type');
    // loop through all 'a' elements
    for (i = 0; i < a.length; i++) {
        // Remove the class 'active' if it exists
        a[i].classList.remove('active')
    }
    // add 'active' classs to the element that was clicked
    listelem = elem.parentNode;
    listelem.classList.add('active');
}

function onChangeGraph(range) {
  start = moment(range.start).format('YYYY-MM-DD HH:mm:ss')
  end = moment(range.end).format('YYYY-MM-DD HH:mm:ss')
  getEntries(globalTimeValue, globalTimeFormat, start, end);
}

function chart(timeValue, timeFormat, elem) {
  globalTimeValue = timeValue;
  globalTimeFormat = timeFormat;
  toggleActive(elem);
  if (graph2d !== undefined && typeof graph2d.destroy === "function") {
    graph2d.destroy();
    dataset.clear();
  }
  var groups = new vis.DataSet();
  var names = ['relative humidity', 'temperature']

  groups.add({
    id: 0,
    content: names[1],
    options: {
        drawPoints: false,
        interpolation: {
            enabled: true,
            parametrization: 'centripetal'
        },
        shaded: {
          enabled: true,
          orientation: "bottom"
        }
  }});

  groups.add({
    id: 1,
    content: names[0],
    options: {
        drawPoints: false,
        interpolation: {
            enabled: true,
            parametrization: 'centripetal'
        },
        shaded: {
          enabled: true,
          groupId: '0',
          orientation: "group"
        }
  }});
  var items = [];
  var container = document.getElementById('visualization');
  dataset = new vis.DataSet(items);
  var start = moment().utc().subtract(timeValue, timeFormat).format('YYYY-MM-DD HH:mm:ss');
  var end = moment().utc().format('YYYY-MM-DD HH:mm:ss');
  var options = {
    start: start,
    end: end,
    drawPoints: false,
    legend: true
  };
  graph2d = new vis.Graph2d(container, dataset, groups, options);
  getEntries(timeValue, timeFormat);
  dataset.on('add', function (event, properties, senderId) {
    //console.log(event, properties, senderId);
    graph2d.setData(dataset);
    graph2d.redraw();
  });
  graph2d.on('rangechanged', onChangeGraph);

}
