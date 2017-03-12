import React from 'react';
import TaskStore from '../stores/TaskStore';
import TimerConfigStore from '../stores/TimerConfigStore';
import * as TimerUtil from '../utils/TimerUtil';

class Timer extends React.Component {
    constructor(){
        super();

        this.state = {
            taskId: 0,
            timer: null,
            activeTimer: 'pomodoro',
            pomodoroStartTime: 0,
            pomodoroEndTime: 0,
            shortBreakStartTime: 0,
            shortBreakEndTime: 0,
            longBreakStartTime: 0,
            longBreakEndTime: 0,
            status: '' //notstarted, inprogress, completed
        }
    }

    handleClickTimerType(timerType) {
        this.setState ({ activeTimer: timerType })
    }

    handleChangeTask(e) {
        let selectedTaskId = parseInt(e.target.value);
        let selectedTask = TaskStore.getTask(selectedTaskId);
        let selectedTaskTimer = TimerConfigStore.getTimerConfig(selectedTask.Timer);

        this.setState({
            activeTimer: 'pomodoro',
            taskId: selectedTaskId,
            timer: selectedTaskTimer ? {
                    pomodoro: selectedTaskTimer.pomodoro,
                    shortBreak: selectedTaskTimer.shortBreak,
                    longBreak: selectedTaskTimer.longBreak
                }: null });
    }

    render() {
        
        let countDownTimerText = '00:00:00';

        if (this.state.timer){
            switch(this.state.activeTimer){
                case 'pomodoro':
                    countDownTimerText = TimerUtil.MinuteToTimer(this.state.timer.pomodoro);
                    break;
                
                case 'shortbreak':
                    countDownTimerText = TimerUtil.MinuteToTimer(this.state.timer.shortBreak);
                    break;
                
                case 'longbreak':
                    countDownTimerText = TimerUtil.MinuteToTimer(this.state.timer.longBreak);
            }
        }

        return (
            <div className="timerbox">
                <div>
                    <select className="form-control" 
                        value={this.state.taskId}
                        onChange={this.handleChangeTask.bind(this)}>
                        <option value="0" disabled hidden>Select a Task</option>
                        {
                            TaskStore.getUncompletedTasks().map((item) => {
                                return (
                                    <option value={item.Id}>{item.Name}</option>
                                )
                            })
                        }
                    </select>
                </div>
                <div className="btn-group" role="group">
                    <button className={"btn btn-sm btn-success " + (this.state.activeTimer == 'pomodoro' ? 'active' : '')} onClick={this.handleClickTimerType.bind(this, 'pomodoro')}>
                        Pomodoro
                    </button>
                    <button className="btn btn-sm btn-success" onClick={this.handleClickTimerType.bind(this, 'shortbreak')}>
                        Short Break
                    </button>
                    <button className="btn btn-sm btn-success" onClick={this.handleClickTimerType.bind(this, 'longbreak')}>
                        Long Break
                    </button>
                </div>
                <div className="timertext">
                    {countDownTimerText}
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
        )
    }
}

export default Timer;