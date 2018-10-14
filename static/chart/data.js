var dataset;
var graph2d;
var globalTimeValue;
var globalTimeFormat;

function addToDataSet(err, data) {
  group_ids = { 
    'pi-1': [0, 1],
    'vsure-2': [2, 3],
    'vsure-1': [4, 5]
  }
  console.log(data);
  ddb_items = [];
  if (err) console.log(err, err.stack); // an error occurred
  else
    data.Items.forEach(function(entry) {
      ddb_items.push({
        x: entry.msg_timestamp.S.replace(/\.\d{6}/, ''),
        y: parseFloat(entry.temperature.N),
        group: group_ids[entry.device_id.S][0],},
        { x: entry.msg_timestamp.S.replace(/\.\d{6}/, ''),
        y: parseFloat(entry.humidity.N),
        group: group_ids[entry.device_id.S][1],});
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

  devices = document.getElementsByClassName('device_id');
  selected = [];
  for (var i = 0; i < devices.length; i++) {
    if (devices[i].checked) {
      selected.push(devices[i].value);
    }
  }

  selected.forEach(function (device) {
    console.log(device);
    var device_id = get_device_id(device, timeValue, timeFormat);
    var params = {
      ExpressionAttributeValues: {
        ":t1": { S: start },
        ":t2": { S: end },
        ":id": { S: device_id }
      },
      KeyConditionExpression: "device_id = :id AND msg_timestamp BETWEEN :t1 AND :t2",
      ProjectionExpression: "device_id, msg_timestamp, temperature, humidity",
      TableName: "indoor",
      ScanIndexForward: false
    };
    dynamodb.query(params, addToDataSet);
  });
}


function onChangeGraph(range) {
  start = moment(range.start).format('YYYY-MM-DD HH:mm:ss')
  end = moment(range.end).format('YYYY-MM-DD HH:mm:ss')
  getEntries(globalTimeValue, globalTimeFormat, start, end);
}

function updateChart() {
  var value = document.getElementById("form-value").value;
  var range = document.getElementById("form-range").value;
  chart(value, range, );
}

function chart(timeValue, timeFormat) {
  globalTimeValue = timeValue;
  globalTimeFormat = timeFormat;
  if (graph2d !== undefined && typeof graph2d.destroy === "function") {
    graph2d.destroy();
    dataset.clear();
  }
  var groups = new vis.DataSet();
  var names = [
    'Living room - relative humidity', 
    'Living room - temperature',
    'Downstairs - temperature',
    'Downstairs - relative humidity',
    'Upstairs - temperature',
    'Upstairs - relative humidity'

  ]

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
          enabled: false,
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

  groups.add({
    id: 2,
    content: names[2],
    options: {
        drawPoints: false,
        interpolation: {
            enabled: true,
            parametrization: 'centripetal'
        },
        shaded: {
          enabled: true,
          groupId: '2',
          orientation: "group"
        }
  }});

  groups.add({
    id: 3,
    content: names[3],
    options: {
        drawPoints: false,
        interpolation: {
            enabled: true,
            parametrization: 'centripetal'
        },
        shaded: {
          enabled: true,
          groupId: '3',
          orientation: "group"
        }
  }});

  groups.add({
    id: 4,
    content: names[4],
    options: {
        drawPoints: false,
        interpolation: {
            enabled: true,
            parametrization: 'centripetal'
        },
        shaded: {
          enabled: true,
          groupId: '4',
          orientation: "group"
        }
  }});

  groups.add({
    id: 5,
    content: names[5],
    options: {
        drawPoints: false,
        interpolation: {
            enabled: true,
            parametrization: 'centripetal'
        },
        shaded: {
          enabled: true,
          groupId: '5',
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
