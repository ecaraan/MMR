import React from 'react';
import Tasks from './Tasks';
import Timer from './Timer';

class Dashboard extends React.Component{
    render() {
        return (
            <div>
                <div className="row">
                    <div className="col-md-3">
                        <Timer taskId={this.props.location.query.tid} />
                    </div>
                    <div className="col-md-9">
                        <Tasks uncompletedOnly="true" />
                    </div>
                </div>
            </div>
        );
    }
}

export default Dashboard;