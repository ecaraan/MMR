import React from 'react';
import NavLink from './NavLink.jsx';
import PriorityPopOverMenu from './PriorityPopOverMenu.jsx';

class NavBar extends React.Component{
    render() {
        return (
            <nav className="navbar navbar-default">
                <div className="container-fluid">   
                    <div className="collapse navbar-collapse">                 
                        <ul className="nav navbar-nav">
                            <NavLink to="/">Home</NavLink>
                            <NavLink to="/tasks">Tasks</NavLink>
                            <NavLink to="/timer">Timer</NavLink>
                            <NavLink to="/dashboard">Dashboard</NavLink>
                            <NavLink to="/about">About</NavLink> 
                        </ul>                        
                        <ul className="nav navbar-nav navbar-right">                            
                            <PriorityPopOverMenu />
                        </ul>
                    </div>
                </div>
            </nav> 
        );
    }
}

export default NavBar;