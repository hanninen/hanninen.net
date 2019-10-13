import React from 'react';

class TimeValue extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        this.props.onTimeValueChange(e.target.value);
    }

    render() {
        return (
            <input
                type="number"
                name="value"
                className="form-control"
                id="form-value"
                value={this.props.value}
                onChange={this.handleChange}
            />
        )
    }
}

export default TimeValue;
