var React = require('react');

var Section =  React.createClass({
    render: function() {
        return (
            <div className="panel panel-default">
                <div className="panel-body">
                    <h2>Section</h2>
                    <p>The quick brown fox jumped over the lazy dog.</p>
                </div>
            </div>
        );
    }
});

module.exports = Section;