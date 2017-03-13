import * as TimerStatAction from './actions/TimerStatAction';
import * as TaskAction from './actions/TaskAction';
import TimerStatStore from './stores/TimerStatStore';
import TaskStore from './stores/TaskStore';
import _ from 'lodash';

class TimerManager {
    constructor()
    {
        this.errorMessage = '',
        this.activeTask = 0
    }
    
    startTimer(taskId, timerMode){
        if (!TimerStatStore.isRunning()){
            TimerStatAction.startTimer(taskId, timerMode);
            return true;
        }
        else{
            let taskName = TaskStore.getTask(this.getActiveTask()).Name;
            this.errorMessage = `Timer is currently running for task,'${taskName}'.`;
            return false;
        }        
    }

    stopTimer(taskId, timerMode){
        if(TimerStatStore.isRunning() &&
            TimerStatStore.activeTaskId == taskId &&
            TimerStatStore.timerMode == timerMode){
            
            this.updateDuration(taskId, timerMode);

            TimerStatAction.stopTimer();
        }
    }

    resetTimer(taskId, timerMode) {
        if(TimerStatStore.isRunning() &&
            TimerStatStore.activeTaskId == taskId &&
            TimerStatStore.timerMode == timerMode){
            
            TimerStatAction.resetTimer();
        }
    }

    completeTimer(taskId) {
        
        //if there's an active timer and pertains to the task where Complete was triggered, 
        //stop it first and add elapsed time to duration
        if(TimerStatStore.isRunning() &&
            TimerStatStore.activeTaskId == taskId)
        {
            this.updateDuration(taskId, timerMode);
        }
        
        //Set task's status to 'Done'
        let task = TaskStore.getTask(taskId);

        if (task != null)
        {
            let statusId = _.find(TaskStore.getStatusEnum, ['Name', 'Done']);

            task.Status = statusId;
            TaskAction.updateTask(task);

            TimerStatAction.completeTimer(taskId);
        }
    }

    updateDuration(taskId, timerMode){
        //update duration if mode is pomodoro or shortbreak
        if (timerMode == 'pomodoro' || timerMode == 'shortbreak'){
            let task = TaskStore.getTask(taskId);

            if (task != null)
            {
                task.Duration += ((new Date()).getTime()) - TimerStatStore.startTime.getTime();
                TaskAction.updateTask(task);
            }
        }
    }

    getErrorMessage(){
        return this.errorMessage;
    }

    getActiveTask(){
        return TimerStatStore.activeTask();
    }

}

export default TimerManager;
