var React = require('react');
var Header = require('./Header.jsx');
var Footer = require('./Footer.jsx');
var Hero = require('./Hero.jsx');
var Section = require('./Section.jsx');
var Cards = require('./Cards.jsx');

var CardListItems = [
    {
        title: "Card 1",
        description: "The quick brown fox... 1"
    }, 
    {
        title: "Card 2",
        description: "The quick brown fox... 2"
    },
    {
        title: "Card 3",
        description: "The quick brown fox... 3"
    }
];

var MainLayout =  React.createClass({
    render: function() {       
        return ( 
            <div>
                <Header />
                <Hero />
                <div className="col-md-10 col-md-offset-1"><Section /></div>
                <div className="col-md-10 col-md-offset-1"><Cards data={CardListItems} /></div>        
                <Footer />
            </div>
        );      
    }
});

module.exports = MainLayout;
