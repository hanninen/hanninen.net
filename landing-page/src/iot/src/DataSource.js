import React from 'react';
import Location from './Location'
import TimeRange from './TimeRange'
import TimeValue from './TimeValue'

class DataSource extends React.Component {
    render() {
        return (
            <div className="col-lg-2 col-md-12">
                <div className="form-group">
                    <label htmlFor="form-value">Measurements for</label>
                    <Location
                        value={this.props.livingRoomId}
                        name={this.props.livingRoomName}
                        checked={this.props.livingRoomChecked}
                        onLocationChange={this.props.onLocationChange}
                        stateId={this.props.livingRoomStateId}
                    />
                    <Location
                        value={this.props.downstairsId}
                        name={this.props.downstairsName}
                        checked={this.props.downstairsChecked}
                        onLocationChange={this.props.onLocationChange}
                        stateId={this.props.downstairsStateId}
                    />
                    <Location
                        value={this.props.upstairsId}
                        name={this.props.upstairsName}
                        checked={this.props.upstairsChecked}
                        onLocationChange={this.props.onLocationChange}
                        stateId={this.props.upstairsStateId}
                    />
                    <TimeValue value={this.props.timeValue} onTimeValueChange={this.props.onTimeValueChange} />
                    <TimeRange value={this.props.timeRange} onTimeRangeChange={this.props.onTimeRangeChange} />
                </div>
            </div>
        )
    }
}

export default DataSource;
