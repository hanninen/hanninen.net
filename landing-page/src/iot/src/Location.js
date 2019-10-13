import React from 'react';

class Location extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        this.props.onLocationChange(e.target.name)
    }
    render() {
        return (
            <div className="checkbox">
                <label>
                    <input
                        type="checkbox"
                        value={this.props.value}
                        className="device_id"
                        checked={this.props.checked}
                        onChange={this.handleChange}
                        name={this.props.stateId}
                    />
                    {this.props.name}
                </label>
            </div>
        )
    }
}

export default Location;
