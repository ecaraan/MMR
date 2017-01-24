var React = require('react');

var Card =  React.createClass({
    render: function() {
        return (           
            <div className="card">
                <img className="card-img-top" src="http://placehold.it/320x150" alt="Card image cap" />                
                <div className="card-block">
                    <h4 className="card-title">{this.props.title}</h4>
                    <p className="card-text">{this.props.description}</p>
                    <a href="#" className="btn btn-primary">Go somewhere</a>
                </div>
            </div>            
        );
    }
});

module.exports = Card;