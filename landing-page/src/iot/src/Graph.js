import React from 'react';
import { VictoryLine, VictoryGroup } from 'victory';
import { LineChart, ScatterChart, styler } from "react-timeseries-charts";

class Graph extends React.Component {
    render(props) {
        const styles = styler([
            { key: "temperature", color: "steelblue", width: 1 },
            { key: "humidity", color: "red", width: 1 }
        ]);

        const scatterStyle = {
            temperature: {
                normal: {
                    fill: "red",
                    opacity: 0.8
                }
            }
        }

        if (this.props.dataSet === undefined) {
            return "Loading";
        }
        else {
            return (
                <ScatterChart
                    style={scatterStyle}
                    axis={this.props.setType}
                    series={this.props.dataSet}
                    columns={this.props.columns}
                />
            )
        };
    }
}

export default Graph;
