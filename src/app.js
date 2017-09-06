import './scss/main.scss';
import Ga from './ga.js'
import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Calculator from './Calculator.jsx';
import injectTapEventPlugin from 'react-tap-event-plugin';

injectTapEventPlugin();

ReactDOM.render(
    <MuiThemeProvider className="warpper">
    <Calculator/>
</MuiThemeProvider>, document.getElementById('app'));