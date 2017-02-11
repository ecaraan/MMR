import React from 'react';
import Card from './Card.jsx';

class Cards extends React.Component{

  constructor(props) {
    super(props);
  }
  
  renderItems() {
    return this.props.data.map(function(item) {
      return (
        <Card
          title={item.title}
          description={item.description} />
      );
    }, this);
  }

  render() {
    return (
      <div className="card-deck">     
        {this.renderItems()}
      </div>
    );
  }

}

export default Cards;