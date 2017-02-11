import React from 'react';
import Header from './Header.jsx';
import NavBar from './NavBar.jsx';
import Footer from './Footer.jsx';
import Home from './Home.jsx';
import Tasks from './Tasks.jsx';
import About from './About.jsx';

class MainLayout extends React.Component{
    constructor(props) {
        super(props);
    }
    render() {       
        return ( 
            <div>
                <Header />
                <NavBar />              
                {this.props.children}
                <Footer />
            </div>
        ); 
    }
};

export default MainLayout;
