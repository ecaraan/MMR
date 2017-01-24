var React = require('react');
var Card = require('./card');

var Cards = React.createClass({
  renderItems: function() {
    return this.props.data.map(function(item) {
      return (
        <Card
          title={item.title}
          description={item.description} />
      );
    }, this);
  },
  render: function() {
    return (
      <div className="card-deck">     
        {this.renderItems()}
      </div>
    );
  }
});

module.exports = Cards;