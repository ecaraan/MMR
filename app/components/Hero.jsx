var React = require('react');

var Hero =  React.createClass({
    render: function() {
        return (
            <div className="jumbotron">
                <div className="container">
                    <h1>Hero</h1> 
                    <p>Magenic Masters React JS</p> 
                </div>
            </div>
        );
    }
});

module.exports = Hero;