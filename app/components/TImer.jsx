import React from 'react';
import TaskStore from '../stores/TaskStore';
import TimerConfigStore from '../stores/TimerConfigStore';
import TimerStatStore from '../stores/TimerStatStore';
import * as TimerStatAction from '../actions/TimerStatAction';
import * as TaskAction from '../actions/TaskAction';
import * as TimerUtil from '../utils/TimerUtil';

class Timer extends React.Component {
    constructor(){
        super();

        this.handleTimerStatChange = this.handleTimerStatChange.bind(this);
        this.getCountDownTimerText = this.getCountDownTimerText.bind(this);
        this.updateDuration = this.updateDuration.bind(this);
        this.mapData = this.mapData.bind(this);

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
            countDownTimerText: this.getCountDownTimerText(timerStat.taskId, timerStat.timerMode)
        }

        this.errorMessage = '';
        TimerStatStore.resumeTimer();
    }

    handleTimerStatChange() {
        this.setState ({ countDownTimerText: this.getCountDownTimerText(this.state.taskId, this.state.activeTimer) })
    }

    componentWillMount() {
        TimerStatStore.on('change', this.handleTimerStatChange);
    }

    componentWillUnmount() {
        TimerStatStore.removeListener('change', this.handleTimerStatChange);
    }

    handleClickTimerType(timerType) {
        this.setState ({ activeTimer: timerType, 
                        countDownTimerText: this.getCountDownTimerText(this.state.taskId, timerType) })
    }

    handleClickStart() {
        if (!this.startTimer(this.state.taskId, this.state.activeTimer))
        {
            alert(TimerManager.errorMessage);
        }
    }

    handleClickStop() {
        this.stopTimer(this.state.taskId, this.state.activeTimer);
    }

    handleClickReset() {
        this.resetTimer(this.state.taskId, this.state.activeTimer);
    }

    handleClickComplete() {
        this.completeTimer(this.state.taskId);
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
                }: null,
            countDownTimerText: this.getCountDownTimerText(selectedTaskId, 'pomodoro')
        });
    }

    getCountDownTimerText(taskId, timerMode){
        if (taskId > 0)
        {
            let selectedTask = TaskStore.getTask(taskId);
            let selectedTaskTimer = TimerConfigStore.getTimerConfig(selectedTask.Timer);
            let activeTimerValue = 0;

            if (selectedTaskTimer){
                switch(timerMode){
                    case 'pomodoro':
                        activeTimerValue = selectedTaskTimer.pomodoro;
                        break;
                    
                    case 'shortbreak':
                        activeTimerValue = selectedTaskTimer.shortBreak;
                        break;
                    
                    case 'longbreak':
                        activeTimerValue = selectedTaskTimer.longBreak;
                        break;
                }
            }

            if (TimerStatStore.isRunning() &&
                TimerStatStore.getActiveTaskId() == taskId &&
                TimerStatStore.getTimerMode() == timerMode)
            {
                return TimerUtil.CountDownTime(parseInt(activeTimerValue) || 0, TimerStatStore.getElapsedTime());
            }
            else{
                return TimerUtil.MinuteToTimer(parseInt(activeTimerValue) || 0);            
            }        
        }
        else
            return '00:00:00';
    }

    startTimer(taskId, timerMode){
        if (taskId > 0){
            if (!TimerStatStore.isRunning()){

                let status = _.find(TaskStore.getStatusEnum(), ['Name', 'In Progress']);                 
                let task = TaskStore.getTask(taskId);

                task.Status = status.Id;
                TaskAction.updateTask(this.mapData(task));

                TimerStatAction.startTimer(taskId, timerMode);

                return true;
            }
            else{
                let taskName = TaskStore.getTask(TimerStatStore.activeTask()).Name;
                this.errorMessage = `Timer is currently running for task,'${taskName}'.`;
                return false;
            } 
        }
    }

    stopTimer(taskId, timerMode){
        if(TimerStatStore.isRunning() &&
            TimerStatStore.getActiveTaskId() == taskId &&
            TimerStatStore.getTimerMode() == timerMode){
            
            this.updateDuration(taskId, timerMode);

            TimerStatAction.stopTimer();
        }
    }

    resetTimer(taskId, timerMode) {
        if(TimerStatStore.isRunning() &&
            TimerStatStore.getActiveTaskId() == taskId &&
            TimerStatStore.getTimerMode() == timerMode){            
            TimerStatAction.resetTimer();
        }
    }

    completeTimer(taskId) {
        
        //if there's an active timer and pertains to the task where Complete was triggered, 
        //stop it first and add elapsed time to duration
        if(TimerStatStore.isRunning() &&
            TimerStatStore.getActiveTaskId() == taskId)
        {
            this.updateDuration(taskId, TimerStatStore.getTimerMode());
        }
        
        //Set task's status to 'Done'
        let task = TaskStore.getTask(taskId);

        if (task != null)
        {
            let status = _.find(TaskStore.getStatusEnum(), ['Name', 'Done']);

            task.Status = status.Id;
            TaskAction.updateTask(this.mapData(task));

            TimerStatAction.completeTimer(taskId);
        }
    }

    updateDuration(taskId, timerMode){
        //update duration if mode is pomodoro or shortbreak
        if (timerMode == 'pomodoro' || timerMode == 'shortbreak'){
            let task = TaskStore.getTask(taskId);

            if (task != null)
            {
                task.Duration += ((new Date()).getTime()) - (new Date(TimerStatStore.getStartTime())).getTime();
                TaskAction.updateTask(this.mapData(task));
            }
        }
    }

    mapData(task) {
        return ({
                id: task.Id,
                name: task.Name,
                description : task.Description,
                priority : task.Priority,
                status : task.Status,
                timer : task.Timer,
                duration : task.Duration            
        });
    }

    render() {

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
                    <button className={"btn btn-sm btn-success " + (this.state.activeTimer == 'shortbreak' ? 'active' : '')}
                            onClick={this.handleClickTimerType.bind(this, 'shortbreak')}>
                        Short Break
                    </button>
                    <button className={"btn btn-sm btn-success " + (this.state.activeTimer == 'longbreak' ? 'active' : '')}
                            onClick={this.handleClickTimerType.bind(this, 'longbreak')}>
                        Long Break
                    </button>
                </div>
                <div className="timertext">
                    {this.state.countDownTimerText}
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