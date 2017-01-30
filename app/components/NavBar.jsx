import { Link } from 'react-router'

var React = require('react');

var NavLink = React.createClass({
    contextTypes: {
        router: React.PropTypes.func
    },
    render: function () {        
        var isActive = this.context.router.isActive(this.props.to, true);
        var className = isActive ? 'active' : '';
        return <li className={className}><Link {...this.props} /></li>;
    }

});

module.exports = NavLink;

var NavBar =  React.createClass({
    render: function() {
        return (
            <nav className="navbar navbar-default">
                <div className="container-fluid">                    
                    <ul className="nav navbar-nav">
                        <NavLink to="/">Home</NavLink>
                        <NavLink to="/tasks">Tasks</NavLink>
                        <NavLink to="/about">About</NavLink>                  
                    </ul>
                </div>
            </nav>        
        );
    }
});

module.exports = NavBar;