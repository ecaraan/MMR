import { EventEmitter } from 'events';
import Dispatcher from '../dispatcher';
import TimerStatActionTypes from '../constants/TimerStatActionTypes';

const timerStatLocalStorageName = 'mmr_timerstat';

class TimerStatStore extends EventEmitter {   

    constructor() {
        super();

        this._state = {
            timerStat: typeof localStorage[timerStatLocalStorageName] == 'undefined' ? this.initializeTimerStat() : 
                    JSON.parse(localStorage.getItem(timerStatLocalStorageName) || this.initializeTimerStat())                   
        }
    }

    initializeTimerStat() {
        return {
            isRunning: false,
            taskId: 0,
            startTime: null, //date (ex. new Date())
            timerMode: 'pomodoro', //pomodoro, shortbreak, longbreak
            timerIntervalId: null
        }
    }

    isRunning() {
        return this._state.timerStat.isRunning;
    }

    activeTaskId() {
        return this._state.timerStat.taskId;
    }

    startTime() {
        return this._state.timerStat.startTime;
    }

    timerMode() {
        return this._state.timerStat.timerMode;
    }
    
    getStat() {
        return this._state.timerStat;
    }

    getElapsedTime() {
        return ((new Date()).getTime() - this._state.timerStat.startTime.getTime());
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

        this.persistToStorage();
    }

    intervalAction() {

        //check if elapsed time equals timer duration

        this.emit('change');
    }

    handleAction(action) {
        switch(action.type)
        {
            case TimerConfigActionTypes.START_TIMER:

                let intervalId = setInterval(() => {
                    this.intervalAction();
                }, 1000);

                this.updateTimerStat({ 
                            isRunning: true, 
                            taskId: action.taskId,
                            timerMode: action.timerMode, 
                            startTime: new Date(),
                            timerIntervalId: intervalId
                        });
                
                break;

            case TimerConfigActionTypes.STOP_TIMER:

                //stop interval
                if (this._state.timerStat.timerIntervalId != null)
                    clearInterval(this._state.timerStat.timerIntervalId);

                this.updateTimerStat(this.initializeTimerStat());
                this.emit('change');
                break;

            case TimerConfigActionTypes.RESET_TIMER:

                //stop interval
                if (this._state.timerStat.timerIntervalId != null)
                    clearInterval(this._state.timerStat.timerIntervalId);

                this.updateTimerStat(this.initializeTimerStat());
                this.emit('change');
                break;

            case TimerConfigActionTypes.COMPLETE_TIMER:

                //stop interval
                if (this._state.timerStat.timerIntervalId != null && 
                    this._state.timerStat.taskId == action.taskId)
                    clearInterval(this._state.timerStat.timerIntervalId);

                this.updateTimerStat(this.initializeTimerStat());
                this.emit('change');
                break;
        }
    }
}

const timerStatStore = new TimerStatStore();
Dispatcher.register(timerStatStore.handleAction.bind(timerStatStore));

export default timerStatStore;


