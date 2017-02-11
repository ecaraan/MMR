import React from 'react';
import NavLink from './NavLink.jsx';

class NavBar extends React.Component{
    render() {
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
}

export default NavBar;