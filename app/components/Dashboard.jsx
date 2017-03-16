import React from 'react';
import Tasks from './Tasks';
import Timer from './Timer';

class Dashboard extends React.Component{
    constructor(props){
        super(props)

        this.state = {
            taskId : this.props.location.query.tid,
            timerMode : this.props.location.query.tmode
        }
    }
    componentWillReceiveProps(nextProps) {
        //if (typeof nextProps.location.query.tid != 'undefined')
            this.setState({ taskId: nextProps.location.query.tid });
        //else 
    }
    render() {
        return (
            <div>
                <div className="row">
                    <div className="col-md-3">
                        <Timer taskId={this.state.taskId} timerMode={this.state.timerMode} />
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