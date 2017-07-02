import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Calculator from './Calculator.jsx';
import injectTapEventPlugin from 'react-tap-event-plugin';

injectTapEventPlugin();

const App = () => (
    <MuiThemeProvider>
        <Calculator/>
    </MuiThemeProvider>
);

ReactDOM.render(
    <App/>, document.getElementById('app'));