var React = require('react');
var Header = require('./Header.jsx');
var NavBar = require('./NavBar.jsx');
var Footer = require('./Footer.jsx');
var Home = require('./Home.jsx');
var Tasks = require('./Tasks.jsx');
var About = require('./About.jsx');

var MainLayout =  React.createClass({
    render: function() {       
        return ( 
            <div>
                <Header />
                <NavBar />              
                {this.props.children}
                <Footer />
            </div>
        );      
    }
});

module.exports = MainLayout;
