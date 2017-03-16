import React from 'react';
import TaskStore from '../stores/TaskStore';
import TimerConfigStore from '../stores/TimerConfigStore';
import TimerStatStore from '../stores/TimerStatStore';
import * as TimerStatAction from '../actions/TimerStatAction';
import * as TaskAction from '../actions/TaskAction';
import * as TimerUtil from '../utils/TimerUtil';
import { Modal } from 'react-bootstrap';

class Timer extends React.Component {
    constructor(props){
        super(props);

        this.handleTimerStatChange = this.handleTimerStatChange.bind(this);
        this.getCountDownTimerText = this.getCountDownTimerText.bind(this);
        this.updateDuration = this.updateDuration.bind(this);
        this.mapData = this.mapData.bind(this);
        this.closeMessage = this.closeMessage.bind(this);
        this.getTimer = this.getTimer.bind(this);
        this.getTimerETC = this.getTimerETC.bind(this);
        this.getElapsedTime = this.getElapsedTime.bind(this);
        this.changeTask = this.changeTask.bind(this);
        this.viewRunningTimer = this.viewRunningTimer.bind(this);

        let timerStat = TimerStatStore.getStat();
        let tId = props.taskId ? parseInt(props.taskId) : timerStat.taskId;
        let tMode = props.timerMode ? props.timerMode : timerStat.timerMode;
               
        this.state = {
            taskId: tId,
            timer: tId > 0 ? this.getTimer(tId) : null,
            activeTimer: tMode,         
            countDownTimerText: this.getCountDownTimerText(tId, tMode),
            message: '',
            isMessageVisible : false
        }

        this.errorMessage = '';
        TimerStatStore.resumeTimer();       
    }

    handleTimerStatChange() {        
        this.setState ({ countDownTimerText: this.getCountDownTimerText(this.state.taskId, this.state.activeTimer) });        
    }

    componentWillMount() {
        TimerStatStore.on('change', this.handleTimerStatChange);
    }

    componentWillUnmount() {
        TimerStatStore.removeListener('change', this.handleTimerStatChange);
    }

    componentWillReceiveProps(nextprops){
        if(nextprops.taskId){
            let tId = parseInt(nextprops.taskId);
            if (tId != this.state.taskId){
                this.changeTask(tId, nextprops.timerMode ? nextprops.timerMode : 'pomodoro');
            }
        }
        else{
            let timerStat = TimerStatStore.getStat();
            this.changeTask(timerStat.taskId, timerStat.timerMode);
        }
    }

    handleClickTimerType(timerType) {
        this.setState ({ activeTimer: timerType, 
                        countDownTimerText: this.getCountDownTimerText(this.state.taskId, timerType) })
    }

    handleClickStart() {
        if (this.state.taskId > 0){
            if (!TimerStatStore.isRunning()){

                let status = _.find(TaskStore.getStatusEnum(), ['Name', 'In Progress']);                 
                let task = TaskStore.getTask(this.state.taskId);
                let selectedTaskTimer = TimerConfigStore.getTimerConfig(task.Timer);

                task.Status = status.Id;
                TaskAction.updateTask(this.mapData(task));

                TimerStatAction.startTimer(this.state.taskId, 
                                            this.state.activeTimer, 
                                            TimerUtil.MinuteToMillisecond(this.getTimerETC()));

                return true;
            }
            else {
                let taskName = TaskStore.getTask(TimerStatStore.getActiveTaskId()).Name;
                
                this.setState({ message : `Timer is currently running for '${taskName}' in '${TimerStatStore.getTimerMode()}' mode.`,
                                isMessageVisible: true });                
            } 
        }
        else{
             this.setState({ message : 'Please select a task to start.',
                                isMessageVisible: true });
        }

        return false;
    }

    handleClickStop() {        
        if(TimerStatStore.isRunning() &&
            TimerStatStore.getActiveTaskId() == this.state.taskId &&
            TimerStatStore.getTimerMode() == this.state.activeTimer){
            
            this.updateDuration(this.state.taskId, this.state.activeTimer, this.getElapsedTime());

            TimerStatAction.stopTimer();
        }
    }

    handleClickReset() {        
        if(TimerStatStore.isRunning() &&
            TimerStatStore.getActiveTaskId() == this.state.taskId &&
            TimerStatStore.getTimerMode() ==  this.state.activeTimer){            
            TimerStatAction.resetTimer();
        }
    }

    handleClickComplete() {
       
        //if there's an active timer and pertains to the task where Complete was triggered, 
        //stop it first and add elapsed time to duration
        if(TimerStatStore.isRunning() &&
            TimerStatStore.getActiveTaskId() == this.state.taskId)
        {
            this.updateDuration(this.state.taskId, TimerStatStore.getTimerMode(), this.getElapsedTime());
        }
        
        //Set task's status to 'Done'
        let task = TaskStore.getTask(this.state.taskId);

        if (task != null)
        {
            let status = _.find(TaskStore.getStatusEnum(), ['Name', 'Done']);

            task.Status = status.Id;
            TaskAction.updateTask(this.mapData(task));

            TimerStatAction.completeTimer(this.state.taskId);
        }
    }

    handleChangeTask(e) {
        this.changeTask(parseInt(e.target.value), 'pomodoro');
    }

    changeTask(taskId, timerMode){
        
        let selectedTaskTimer = this.getTimer(taskId);

        this.setState({
            activeTimer: timerMode ? timerMode : 'pomodoro',
            taskId: taskId,
            timer: selectedTaskTimer ? {
                    pomodoro: selectedTaskTimer.pomodoro,
                    shortBreak: selectedTaskTimer.shortBreak,
                    longBreak: selectedTaskTimer.longBreak
                }: null,
            countDownTimerText: this.getCountDownTimerText(taskId, 'pomodoro')
        });
    }

    viewRunningTimer() {
        let timerStat = TimerStatStore.getStat();
        this.changeTask(timerStat.taskId, timerStat.timerMode);

        this.closeMessage();
    }

    getTimer(taskId){
        let selectedTask = TaskStore.getTask(taskId);

        if (selectedTask)
            return TimerConfigStore.getTimerConfig(selectedTask.Timer);

        return null;
    }

    closeMessage() {
        this.setState ({ isMessageVisible: false });
    }

    getCountDownTimerText(taskId, timerMode){
        if (taskId > 0)
        {
            let selectedTask = TaskStore.getTask(taskId);

            if (selectedTask){
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
        }
        
        return '00:00:00';
    }

    getTimerETC() {
        switch(this.state.activeTimer)
        {
            case 'pomodoro': return this.state.timer.pomodoro
            case 'shortbreak': return this.state.timer.shortBreak
            case 'longbreak': return this.state.timer.longBreak
        }
    }

    getElapsedTime() {
        return (new Date()).getTime() - (new Date(TimerStatStore.getStartTime())).getTime();
    }

    updateDuration(taskId, timerMode, elapsedTime){
        //update duration if mode is pomodoro or shortbreak
        if (timerMode == 'pomodoro' || timerMode == 'shortbreak'){
            let task = TaskStore.getTask(taskId);

            if (task != null)
            {
                task.Duration += elapsedTime;
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

        let modalButtons;

        if (TimerStatStore.isRunning()){
            modalButtons = (
                <div className="modal-action-buttons">
                    <button onClick={this.viewRunningTimer} className="btn btn-primary">View</button>
                    <button onClick={this.closeMessage} className="btn btn-secondary">Cancel</button>
                </div>
            )
        }
        else{
            modalButtons = (
                <div className="modal-action-buttons">
                    <button onClick={this.closeMessage} className="btn btn-primary">Ok</button>
                </div>
            )
        }

        return (
            <div>
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
                <Modal show={this.state.isMessageVisible} onHide={this.closeMessage}>
                    <Modal.Header closeButton>
                        <Modal.Title>Info</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p className="">{this.state.message}</p>
                    </Modal.Body>
                    <Modal.Footer>
                        {modalButtons}
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
}

export default Timer;