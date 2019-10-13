import moment from 'moment';
import React from 'react';
import {
    Resizable,
    Charts,
    ChartContainer,
    ChartRow,
    YAxis,
    styler,
    LineChart,
    Legend
} from "react-timeseries-charts";
import { TimeSeries, TimeRange } from "pondjs";

class Visualization extends React.Component {
    render(props) {
        var livingRoomTemperatureSeries = undefined;
        var livingRoomHumiditySeries = undefined;
        var downstairsTemperatureSeries = undefined;
        var downstairsHumiditySeries = undefined;
        var upstairsTemperatureSeries = undefined;
        var upstairsHumiditySeries = undefined;

        if (this.props.livingRoomTemperatureSet !== undefined) {
            livingRoomTemperatureSeries = new TimeSeries({
                name: "Living Room Temperature",
                columns: ["time", "temperature"],
                points: this.props.livingRoomTemperatureSet
            })
        };

        if (this.props.livingRoomHumiditySet !== undefined) {
            livingRoomHumiditySeries = new TimeSeries({
                name: "Living Room Humidity",
                columns: ["time", "humidity"],
                points: this.props.livingRoomHumiditySet
            })
        };

        if (this.props.downstairsTemperatureSet !== undefined) {
            downstairsTemperatureSeries = new TimeSeries({
                name: "Downstairs Temperature",
                columns: ["time", "temperature"],
                points: this.props.downstairsTemperatureSet
            })
        };

        if (this.props.downstairsHumiditySet !== undefined) {
            downstairsHumiditySeries = new TimeSeries({
                name: "Downstairs Humidity",
                columns: ["time", "humidity"],
                points: this.props.downstairsHumiditySet
            })
        };

        if (this.props.upstairsTemperatureSet !== undefined) {
            upstairsTemperatureSeries = new TimeSeries({
                name: "Upstairs Temperature",
                columns: ["time", "temperature"],
                points: this.props.upstairsTemperatureSet
            })
        };

        if (this.props.upstairsHumiditySet !== undefined) {
            upstairsHumiditySeries = new TimeSeries({
                name: "upstairs Humidity",
                columns: ["time", "humidity"],
                points: this.props.upstairsHumiditySet
            })
        };
        const styles = styler([
            { key: "temperature", color: "steelblue", width: 1 },
            { key: "humidity", color: "red", width: 1 }
        ]);

        var to = moment().utc();
        var from = moment().utc().subtract(this.props.timeValue, this.props.timeRange);
        var range = new TimeRange(from, to);

        if ((livingRoomTemperatureSeries === undefined ||
            livingRoomHumiditySeries === undefined) &&
            (downstairsTemperatureSeries === undefined ||
                downstairsHumiditySeries === undefined) &&
            (upstairsHumiditySeries === undefined ||
                upstairsHumiditySeries === undefined)) {
            return ("Loading")
        } else {
            return (
                <div className="col-lg-10 col-md-12">
                    <div id="visualization">
                        <Legend
                            type="swatch"
                            style={styles}
                            align="left"
                            categories={[
                                { key: "temperature", label: "Temperature" },
                                { key: "humidity", label: "Relative humidity" }
                            ]} />
                        <Resizable>
                            <ChartContainer timeRange={range.range()} utc={true}>
                                <ChartRow height="450" width="700">
                                    <YAxis
                                        id="temperature"
                                        min="0"
                                        max="30"
                                        width="0"
                                        type="linear"
                                        format=",.2f"
                                    />
                                    <Charts>
                                        {this.props.livingRoomChecked !== false &&
                                            livingRoomTemperatureSeries !== undefined && (
                                                <LineChart
                                                    visible={this.props.livingRoomTemperatureSeries ? true : false}
                                                    style={styles}
                                                    axis="temperature"
                                                    series={livingRoomTemperatureSeries}
                                                    columns={["temperature"]}
                                                    interpolation="curveNatural"
                                                />
                                            )}
                                        {this.props.livingRoomChecked !== false &&
                                            livingRoomHumiditySeries !== undefined && (
                                                <LineChart
                                                    visible={this.props.livingRoomHumiditySeries ? true : false}
                                                    style={styles}
                                                    axis="humidity"
                                                    series={livingRoomHumiditySeries}
                                                    columns={["humidity"]}
                                                    interpolation="curveNatural"
                                                />
                                            )}
                                        {this.props.downstairsChecked !== false && (
                                            <LineChart
                                                style={styles}
                                                axis="temperature"
                                                series={downstairsTemperatureSeries}
                                                columns={["temperature"]}
                                                interpolation="curveNatural"
                                            />
                                        )}
                                        {this.props.downstairsChecked !== false && (
                                            <LineChart
                                                style={styles}
                                                axis="humidity"
                                                series={downstairsHumiditySeries}
                                                columns={["humidity"]}
                                                interpolation="curveNatural"
                                            />
                                        )}
                                        {this.props.upstairsChecked !== false && (
                                            <LineChart
                                                style={styles}
                                                axis="temperature"
                                                series={upstairsTemperatureSeries}
                                                columns={["temperature"]}
                                                interpolation="curveNatural"
                                            />
                                        )}
                                        {this.props.upstairsChecked !== false && (
                                            <LineChart
                                                style={styles}
                                                axis="humidity"
                                                series={upstairsHumiditySeries}
                                                columns={["humidity"]}
                                                interpolation="curveNatural"
                                            />
                                        )}
                                    </Charts>
                                    <YAxis
                                        id="humidity"
                                        min="0"
                                        max="100"
                                        width="0"
                                        type="linear"
                                        format=",.2f"
                                    />
                                </ChartRow>
                            </ChartContainer>
                        </Resizable>
                    </div>
                </div >
            )
        };
    }
}
// class Visualization extends React.Component {
//     render(props) {
//         return (
//             <div className="col-lg-10 col-md-12">
//                 <div id="visualization">
//                     <VictoryChart maxDomain={{ y: 100 }} minDomain={{ y: 0 }} >
//                         <Graph
//                             temperatureSet={this.props.livingRoomTemperatureSet}
//                             humiditySet={this.props.livingRoomHumiditySet}
//                         />
//                         <Graph
//                             temperatureSet={this.props.upstairsTemperatureSet}
//                             humiditySet={this.props.upstairsHumiditySet}
//                         />
//                         <Graph
//                             temperatureSet={this.props.downstairsTemperatureSet}
//                             humiditySet={this.props.downstairsHumiditySet}
//                         />
//                     </VictoryChart>
//                 </div >
//             </div >
//         )
//     }
// }

export default Visualization;
