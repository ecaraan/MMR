import 'bootstrap/dist/css/bootstrap.css';
import '../public/css/style.css';
import '../public/css/card.css';

import { Router, Route, IndexRoute, browserHistory } from 'react-router';

import ReactDOM from 'react-dom';
import React from 'react';
import MainLayout from './components/MainLayout.jsx';
import Home from './components/Home.jsx';
import Tasks from './components/Tasks.jsx';
import About from './components/About.jsx';

ReactDOM.render((
  <Router history={browserHistory}>
    <Route path="/" component={MainLayout}>
      <IndexRoute component={Home} />
      <Route path="/tasks" component={Tasks} />
      <Route path="/about" component={About} />
    </Route>
  </Router>
), document.getElementById('app'));



