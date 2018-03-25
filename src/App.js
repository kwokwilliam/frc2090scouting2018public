import React, { Component } from 'react';
import { HashRouter as Router, Route } from 'react-router-dom';
import AddDataPage from './AppDataPage';
import TeamDataPage from './TeamDataPage';
import AllDataPage from './AllDataPage';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { fade } from 'material-ui/utils/colorManipulator';

// never really use this but i took it from a project app
const muiTheme = getMuiTheme({
    palette: {
        primary1Color: '#f75830',
        accent1Color: '#9E9E9E',
        borderColor: '#9E9E9E',
        disabledColor: fade('#000000', 0.5)
    },
    appBar: {
        height: 56
    }
});

// main app only sets up routes, using react-router-dom. This makes it seem like there's more than
// one page, but isn't connecting to a thing to grab a new webpage.
// MuiThemeProvider is just Material-UI's required wrapper.
class App extends Component {
    render() {
        return (
            <div>
                <MuiThemeProvider muiTheme={muiTheme}>
                    <Router>
                        <div>
                            <Route exact path="/" component={AddDataPage} />
                            <Route exact path="/teamdata" component={TeamDataPage} />
                            <Route exact path="/teamglobaldata" component={AllDataPage} />
                        </div>
                    </Router>
                </MuiThemeProvider>
            </div>
        );
    }
}

export default App;
