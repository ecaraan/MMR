import React from 'react';
import TaskStore from '../stores/TaskStore';
import TimerConfigStore from '../stores/TimerConfigStore';
import TimerStatStore from '../stores/TimerStatStore';
import * as TimerUtil from '../utils/TimerUtil';

class Timer extends React.Component {
    constructor(){
        super();

        let timerStat = TimerStatStore.getStat();

        this.state = {
            taskId: timerStat.taskId,
            timer: null,
            activeTimer: timerStat.timerMode,
            pomodoroStartTime: 0,
            pomodoroEndTime: 0,
            shortBreakStartTime: 0,
            shortBreakEndTime: 0,
            longBreakStartTime: 0,
            longBreakEndTime: 0,
            status: '' //notstarted, inprogress, completed
        }

        this.handleTimerStatChange = this.handleTimerStatChange.bind(this);
    }

    handleTimerStatChange() {

    }

    componentWillMount() {
        TimerStatStore.on('change', this.handleTimerStatChange);
    }

    componentWillUnmount() {
        TimerStatStore.removeListener('change', this.handleTimerStatChange);
    }

    handleClickTimerType(timerType) {
        this.setState ({ activeTimer: timerType })
    }

    handleClickStart() {
        alert('1');
    }

    handleClickStop() {
        alert('2');
    }

    handleClickReset() {
        alert('3');
    }

    handleClickComplete() {
        alert('4');
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
                    <button className={"btn btn-sm btn-success " + (this.state.activeTimer == 'pomodoro' ? 'active' : '')} 
                            onClick={this.handleClickTimerType.bind(this, 'pomodoro')}>
                        Pomodoro
                    </button>
                    <button className="btn btn-sm btn-success" 
                            onClick={this.handleClickTimerType.bind(this, 'shortbreak')}>
                        Short Break
                    </button>
                    <button className="btn btn-sm btn-success" 
                            onClick={this.handleClickTimerType.bind(this, 'longbreak')}>
                        Long Break
                    </button>
                </div>
                <div className="timertext">
                    {countDownTimerText}
                </div>
                <div>
                    <button className="btn btn-sm btn-success btn-space"
                        onClick={this.handleClickStart.bind(this)}>
                        Start
                    </button>
                    <button className="btn btn-sm btn-danger btn-space"
                        onClick={this.handleClickStop.bind(this)}>
                        Stop
                    </button>
                    <button className="btn btn-sm btn-warning btn-space"
                        onClick={this.handleClickReset.bind(this)}>
                        Reset
                    </button>
                    <button className="btn btn-sm btn-primary"
                        onClick={this.handleClickComplete.bind(this)}>
                        Complete
                    </button>
                </div>
            </div>
        )
    }
}

export default Timer;