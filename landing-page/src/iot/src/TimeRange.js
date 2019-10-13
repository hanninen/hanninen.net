import React from 'react';

class TimeRange extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        this.props.onTimeRangeChange(e.target.value);
    }

    render() {
        return (
            <select
                name="range"
                className="form-control"
                id="form-range"
                value={this.props.value}
                onChange={this.handleChange}
            >
                <option value="hours">hours</option>
                <option value="days">days</option>
                <option value="weeks">weeks</option>
                <option value="months">months</option>
                <option value="years">years</option>
            </select >

        )
    }
}
export default TimeRange;
