import 'bootstrap/dist/css/bootstrap.css';
require('../public/css/style.css');

var ReactDOM = require('react-dom');
var React = require('react');
var MainLayout = require('./components/MainLayout.jsx');

ReactDOM.render(<MainLayout />, document.getElementById('app'));


