import React from 'react';
import Hero from './Hero.jsx';
import Section from './Section.jsx';
import Cards from './Cards.jsx';

let CardListItems = [
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

class Home extends React.Component{
    render() {
        return (           
            <div>
                <Hero />
                <div className="col-md-10 col-md-offset-1"><Section /></div>
                <div className="col-md-10 col-md-offset-1"><Cards data={CardListItems} /></div>
            </div>            
        );
    }
};

export default Home;