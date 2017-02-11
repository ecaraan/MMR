import { Link } from 'react-router';
import React from 'react';

class NavLink extends React.Component{
    constructor(props){
        super(props);
    }
    render() { 
        return <li><Link {...this.props} /></li>;
    }

}

export default NavLink;