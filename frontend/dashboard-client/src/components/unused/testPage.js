import React from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import { authenticate } from "../../server/index";
import {authenticateAccount, isAuthenticated, logoutAccount, testPost} from "../../server/transport-layer";

export class TestPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {status: false};
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(event) {
        var self = this;
        testPost().then(function(response) {
            self.setState({status: response.data.success})
        })
    }

    handleLogout(event) {
        logoutAccount();
        console.log("logged out")
    }

    render() {
        return (
            <div>
                <p>ey whaddup</p>
                <RaisedButton
                    style={{margin: 15}}
                    primary
                    onClick={this.handleClick}
                    label="Number of times you've ever clicked this button "
                    type="button"
                />
                <p>the value is {this.state.status.toString()}</p>

                <RaisedButton
                    style={{margin: 15} }
                    primary
                    onClick={this.handleLogout}
                    label="LOGOUT"
                    type="button"
                />
            </div>
        )
    }
}

export default TestPage;