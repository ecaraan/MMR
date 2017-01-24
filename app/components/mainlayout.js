var React = require('react');
var Header = require('./header');
var Footer = require('./footer');
var Hero = require('./hero');
var Section = require('./section');
var Cards = require('./cards');

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
