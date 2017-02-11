import React from 'react';

class Card extends React.Component{
    
    constructor(props){
        super(props);
    }

    render() {
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

}

export default Card;