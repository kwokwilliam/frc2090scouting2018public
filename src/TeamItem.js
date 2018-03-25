import React, { Component } from 'react';

// TeamItem is an individual list item used on the AllDataPage. When clicked on, it toggles a class that makes a strikethrough appear.
class TeamItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            toggled: false
        }
    }

    render() {
        return (
            <li className={this.state.toggled ? "strike" : ""} onClick={() => this.setState({ toggled: !this.state.toggled })}><span style={{ marginLeft: "20px" }}>{this.props.d.team} :  <span className="red">{this.props.d.number}</span></span></li>
        )
    }
}

export default TeamItem;