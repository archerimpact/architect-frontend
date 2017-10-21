import React from 'react';
import TextField from 'material-ui/TextField';

class LoginPage extends React.Component {
    constructor(props) {
        super(props);
    }


    loggy() {
        console.log('hello');
    }

    render() {
        return (
            <div className='rows' style={{textAlign:"center", marginTop:40}}>
                <p>Hello! Please login below.</p>
                <form action={"/login"} method="post">
                    <div>
                        <label>Username:</label>
                        <input type="text" name="username"/>
                    </div>
                    <div>
                        <label>Password:</label>
                        <input type="password" name="password"/>
                    </div>
                    <div>
                        <input type="submit" value="Log In"/>
                    </div>
                </form>

                <TextField
                placeholder="hello2"
                // onChange={this.loggy}
d                />
            </div>
        );
    }
}

export default LoginPage;