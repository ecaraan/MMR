import { EventEmitter } from 'events';
import Dispatcher from '../dispatcher';
import TimerStatActionTypes from '../constants/TimerStatActionTypes';
import _ from 'lodash';

const timerStatLocalStorageName = 'mmr_timerstat';

class TimerStatStore extends EventEmitter {   

    constructor() {
        super();

        this._state = {
            timerStat: typeof localStorage[timerStatLocalStorageName] == 'undefined' ? this.initializeTimerStat() : 
                    JSON.parse(localStorage.getItem(timerStatLocalStorageName) || this.initializeTimerStat()),
            previousTimerStat: null,
            isTimerExpired: false
        }
    }

    initializeTimerStat() {
        return {
            isRunning: false,
            taskId: 0,
            startTime: null, //date (ex. new Date())
            timerMode: 'pomodoro', //pomodoro, shortbreak, longbreak,
            timerETC: 0, //in milliseconds
            timerIntervalId: null
        }
    }

    isRunning() {
        return this._state.timerStat.isRunning;
    }

    isTimerExpired(){
        return this._state.isTimerExpired;
    }

    isElapsedEqualETC(){
        return (this._state.timerStat.isRunning &&
            this.getElapsedTime() >= this._state.timerStat.timerETC);
    }

    getPreviousTimerStat(){
        return this._state.previousTimerStat;
    }

    getActiveTaskId() {
        return this._state.timerStat.taskId;
    }

    getStartTime() {
        return this._state.timerStat.startTime;
    }

    getTimerMode() {
        return this._state.timerStat.timerMode;
    }
    
    getStat() {
        return this._state.timerStat;
    }

    getElapsedTime() {
        return ((new Date()).getTime() - (new Date(this._state.timerStat.startTime)).getTime());
    }

    resumeTimer(){
        if (this._state.timerStat.isRunning){
            let intervalId = setInterval(() => {
                    this.intervalAction();
                }, 1000);

            this._state.timerStat.timerIntervalId = intervalId;

            this.persistToStorage();
        }
    }

    endTimer(){
        if (this._state.timerStat.isRunning){
            
            clearInterval(this._state.timerStat.timerIntervalId);
            this.updateTimerStat(this.initializeTimerStat());
            
        }
    }

    persistToStorage() {
        localStorage.setItem(timerStatLocalStorageName, JSON.stringify(this._state.timerStat));
    }

    updateTimerStat(stat) {
        
        this._state.timerStat.isRunning = stat.isRunning;
        this._state.timerStat.taskId = stat.taskId;
        this._state.timerStat.timerMode = stat.timerMode;
        this._state.timerStat.startTime = stat.startTime;
        this._state.timerStat.timerIntervalId = stat.timerIntervalId;
        this._state.timerStat.timerETC = stat.timerETC;
        
        this.persistToStorage();
    }

    intervalAction() {
        //check if elapsedTime is less than or equal to ETC
        if (this.isElapsedEqualETC()){
            this._state.previousTimerStat = _.clone(this._state.timerStat);            
            this._state.isTimerExpired = true;
            this.endTimer();
        }

        this.emit('change');
    }

    handleAction(action) {
        switch(action.type)
        {
            case TimerStatActionTypes.START_TIMER:

                let intervalId = setInterval(() => {
                    this.intervalAction();
                }, 1000);

                this.updateTimerStat({ 
                            isRunning: true, 
                            taskId: action.taskId,
                            timerMode: action.timerMode,
                            timerETC: action.timerETC, 
                            startTime: new Date(),
                            timerIntervalId: intervalId
                        });

                this._state.isTimerExpired = false;
                
                break;

            case TimerStatActionTypes.STOP_TIMER:

                //stop interval
                if (this._state.timerStat.timerIntervalId != null)
                    clearInterval(this._state.timerStat.timerIntervalId);

                this.updateTimerStat(this.initializeTimerStat());

                this._state.isTimerExpired = false;

                this.emit('change');
                break;

            case TimerStatActionTypes.RESET_TIMER:

                //stop interval
                if (this._state.timerStat.timerIntervalId != null)
                    clearInterval(this._state.timerStat.timerIntervalId);

                this.updateTimerStat(this.initializeTimerStat());

                this._state.isTimerExpired = false;

                this.emit('change');
                break;

            case TimerStatActionTypes.COMPLETE_TIMER:

                //stop interval
                if (this._state.timerStat.timerIntervalId != null && 
                    this._state.timerStat.taskId == action.taskId)
                    clearInterval(this._state.timerStat.timerIntervalId);

                this.updateTimerStat(this.initializeTimerStat());

                this._state.isTimerExpired = false;

                this.emit('change');
                break;
        }
    }
}

const timerStatStore = new TimerStatStore();
Dispatcher.register(timerStatStore.handleAction.bind(timerStatStore));

export default timerStatStore;


