import { Router, Route, IndexRoute, browserHistory } from 'react-router'
import 'bootstrap/dist/css/bootstrap.css';

require('../public/css/style.css');
require('../public/css/card.css');

var ReactDOM = require('react-dom');
var React = require('react');
var MainLayout = require('./components/MainLayout.jsx');
var Home = require('./components/Home.jsx');
var Tasks = require('./components/Tasks.jsx');
var About = require('./components/About.jsx');

ReactDOM.render((
  <Router history={browserHistory}>
    <Route path="/" component={MainLayout}>
      <IndexRoute component={Home} />
      <Route path="tasks" component={Tasks} />
      <Route path="about" component={About} />
    </Route>
  </Router>
), document.getElementById('app'));



