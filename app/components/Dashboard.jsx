import React from 'react';
import Tasks from './Tasks';

class Dashboard extends React.Component{
    render() {
        return (
            <div>
                <div className="row">
                    <div className="col-md-3">
                        <div className="timerbox">
                            <div>
                                <select className="form-control" value="0">
                                    <option value="0" disabled hidden>Select a Task</option>                                    
                                </select>
                            </div>
                            <div className="btn-group" role="group">
                                <button className="btn btn-sm btn-success">
                                    Pomodoro
                                </button>
                                <button className="btn btn-sm btn-success">
                                    Short Break
                                </button>
                                <button className="btn btn-sm btn-success">
                                    Long Break
                                </button>
                            </div>
                            <div className="timertext">
                                25:00
                            </div>
                            <div>
                                <button className="btn btn-sm btn-success btn-space">
                                    Start
                                </button>
                                <button className="btn btn-sm btn-danger btn-space">
                                    Stop
                                </button>
                                <button className="btn btn-sm btn-warning btn-space">
                                    Reset
                                </button>
                                <button className="btn btn-sm btn-primary">
                                    Complete
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-9">
                        <Tasks />
                    </div>
                </div>
            </div>
        );
    }
}

export default Dashboard;