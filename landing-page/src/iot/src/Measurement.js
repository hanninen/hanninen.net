import DataSource from './DataSource'
import moment from 'moment';
import React from 'react';
import Visualization from './Visualization'

const API = 'https://7avnuw4g86.execute-api.eu-west-1.amazonaws.com/prod/'

class Measurement extends React.Component {
    constructor(props) {
        super(props);
        this.handleTimeValueChange = this.handleTimeValueChange.bind(this);
        this.handleTimeRangeChange = this.handleTimeRangeChange.bind(this);
        this.handleLocationChange = this.handleLocationChange.bind(this);

        const value = 2;
        const range = "weeks";

        const to = moment().utc().format('YYYY-MM-DD HH:mm:ss.SSSSSS');
        const from = moment().utc().subtract(value, range).format('YYYY-MM-DD HH:mm:ss.SSSSSS');


        this.state = {
            livingRoom: "pi-1",
            livingRoomName: "Living Room",
            livingRoomStateId: "livingRoom",
            livingRoomChecked: true,
            livingRoomData: { temperatureSet: [[Date.parse(to), 0]], humiditySet: [[Date.parse(to), 0]] },
            downstairs: "vsure-2",
            downstairsName: "Downstairs",
            downstairsStateId: "downstairs",
            downstairsChecked: false,
            downstairsData: { temperatureSet: undefined, humiditySet: undefined },
            upstairs: "vsure-1",
            upstairsName: "Upstairs",
            upstairsStateId: "upstairs",
            upstairsChecked: false,
            upstairsData: { temperatureSet: undefined, humiditySet: undefined },
            timeValue: "2",
            timeRange: "weeks"
        };
    }

    handleTimeValueChange(timeValue) {
        this.setState({ timeValue: timeValue });
        this.updateData("livingRoom", this.createRequestBody());
        var checkedDevices = this.getCheckedDevices();
        checkedDevices.forEach((deviceName) => {
            this.updateData(deviceName, this.createRequestBody(deviceName));
        });
    }

    getCheckedDevices() {
        var devices = ["livingRoom", "downstairs", "upstairs"];
        var checked = [];
        devices.forEach((deviceName) => {
            let deviceChecked = deviceName + "Checked";
            if (this.state[deviceChecked] === true) {
                checked.push(deviceName);
            }
        })

        return checked
    }

    handleTimeRangeChange(timeRange) {
        this.setState({ timeRange: timeRange });
        var checkedDevices = this.getCheckedDevices();
        checkedDevices.forEach((deviceName) => {
            this.updateData(deviceName, this.createRequestBody(deviceName));
        });
    }

    handleLocationChange(deviceName) {
        const deviceChecked = deviceName + "Checked";
        const toBeUnChecked = this.state[deviceChecked] === true ? false : true;
        this.setState({ [deviceChecked]: toBeUnChecked });
        if (toBeUnChecked === true) {
            this.updateData(deviceName, this.createRequestBody(deviceName));
        } else {
            this.removeData(deviceName);
        }
    }

    removeData(deviceName) {
        const deviceData = deviceName + "Data";
        this.setState({ [deviceData]: { temperatureSet: undefined, humiditySet: undefined } });
    }

    render() {
        return (
            <div className="container measurement">
                <div className="row">
                    <DataSource
                        timeValue={this.state.timeValue}
                        timeRange={this.state.timeRange}
                        livingRoomId={this.state.livingRoom}
                        livingRoomName={this.state.livingRoomName}
                        livingRoomChecked={this.state.livingRoomChecked}
                        livingRoomStateId={this.state.livingRoomStateId}
                        downstairsId={this.state.downstairs}
                        downstairsName={this.state.downstairsName}
                        downstairsChecked={this.state.downstairsChecked}
                        downstairsStateId={this.state.downstairsStateId}
                        upstairsId={this.state.upstairs}
                        upstairsName={this.state.upstairsName}
                        upstairsChecked={this.state.upstairsChecked}
                        upstairsStateId={this.state.upstairsStateId}
                        onTimeValueChange={this.handleTimeValueChange}
                        onTimeRangeChange={this.handleTimeRangeChange}
                        onLocationChange={this.handleLocationChange}
                    />
                    <Visualization
                        timeValue={this.state.timeValue}
                        timeRange={this.state.timeRange}
                        livingRoomTemperatureSet={this.state.livingRoomData.temperatureSet}
                        livingRoomHumiditySet={this.state.livingRoomData.humiditySet}
                        livingRoomChecked={this.state.livingRoomChecked}
                        downstairsTemperatureSet={this.state.downstairsData.temperatureSet}
                        downstairsHumiditySet={this.state.downstairsData.humiditySet}
                        downstairsChecked={this.state.downstairsChecked}
                        upstairsTemperatureSet={this.state.upstairsData.temperatureSet}
                        upstairsHumiditySet={this.state.upstairsData.humiditySet}
                        upstairsChecked={this.state.upstairsChecked}
                    />
                </div>
            </div>
        )
    }

    componentDidMount() {
        this.updateData("livingRoom", this.createRequestBody());
    }

    updateData(deviceName, body) {
        const deviceData = deviceName + "Data";

        try {
            fetch(API, {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            })
                .then(response => response.json())
                .then(data => this.setState({ [deviceData]: this.cleanUp(data["Items"]) }));
        } catch (error) {
            console.log(error);
        }
    }

    createRequestBody(deviceName) {
        if (deviceName === undefined) { deviceName = "livingRoom"; }

        const value = this.state.timeValue;
        const range = this.state.timeRange;

        const to = moment().utc().format('YYYY-MM-DD HH:mm:ss.SSSSSS');
        const from = moment().utc().subtract(value, range).format('YYYY-MM-DD HH:mm:ss.SSSSSS');

        return {
            "device_id": this.getDeviceId(this.state[deviceName], this.state.timeRange),
            "from": from,
            "to": to
        }
    }

    cleanUp(data) {
        // Sort data
        data.sort((a, b) => (a.msg_timestamp.S > b.msg_timestamp.S) ? 1 : ((b.msg_timestamp.S > a.msg_timestamp.S) ? -1 : 0));
        var temperatures = [];
        var humidities = [];

        data.forEach(function (entry) {
            temperatures.push([
                Date.parse(entry.msg_timestamp.S),
                parseFloat(entry.temperature.N)
            ]);
            humidities.push([
                Date.parse(entry.msg_timestamp.S),
                parseFloat(entry.humidity.N)
            ]);
        });

        return { temperatureSet: temperatures, humiditySet: humidities };
    }

    getDeviceId(deviceId, timeRange) {
        const timeRangeSuffix = {
            'days': '-avg-1hours',
            'weeks': '-avg-1hours',
            'months': '-avg-1days',
            'years': '-avg-1weeks'
        };
        if (timeRange !== 'hours') {
            deviceId = deviceId + timeRangeSuffix[timeRange];
        }
        return deviceId;
    }
}

export default Measurement;
