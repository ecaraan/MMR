import { Link } from 'react-router'
import { Router, Route, IndexRoute, browserHistory } from 'react-router'

var React = require('react');

var NavBar =  React.createClass({
    render: function() {
        return (
            <nav className="navbar navbar-default">
                <div className="container-fluid">                    
                    <ul className="nav navbar-nav">
                        <li className="active"><Link to="/">Home</Link></li>
                        <li><Link to="/tasks">Tasks</Link></li>
                        <li><Link to="/about">About</Link></li>                        
                    </ul>
                </div>
            </nav>        
        );
    }
});

module.exports = NavBar;