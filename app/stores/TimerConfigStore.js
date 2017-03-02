import { EventEmitter } from 'events';
import Dispatcher from '../dispatcher';
import TimerConfigActionTypes from '../constants/TimerConfigActionTypes';

const timerConfigLocalStorageName = 'mmr_timerconfig';

class TimerConfigStore extends EventEmitter {   

    constructor() {
        super();

        this._state = {
            timerCongfigs: typeof localStorage[timerConfigLocalStorageName] == 'undefined' ? [] : 
                    JSON.parse(localStorage.getItem(timerConfigLocalStorageName) || [])
        }
    }

    getTimerConfigs() {
        return this._state.timerCongfigs;
    }

    persistToStorage() {
        localStorage.setItem(timerConfigLocalStorageName, JSON.stringify(this._state.timerCongfigs));
    }

    removePreviousDefault() {
        let itemToUpdate = _.find(this._state.timerConfigs, ['isDefault', true]);

        if (itemToUpdate)
            itemToUpdate.isDefault = false;
    }

    addTimerConfig(config) {
        
        let id = _.max(_.map(this._state.timerCongfigs, 'Id'));
                
        if (config.isDefault)
            this.removePreviousDefault();

        this._state.timerCongfigs.push({
            id : (id || 0) + 1, 
            name : config.name,
            pomodoro : config.pomodoro,
            shortBreak : config.shortBreak,
            longBreak : config.longBreak,
            isDefault: config.isDefault
        });

        this.persistToStorage();
    }

    deleteTimerConfig(id) {

        _.remove(this._state.timerCongfigs, ['Id', id]);

        this.persistToStorage();

    }

    updateTimerConfig(config){
               
        let itemToUpdate = _.find(this._state.timerConfigs, ['Id', config.id]);

        if (config.isDefault)
            this.removePreviousDefault();

        itemToUpdate.name = config.name,
        itemToUpdate.pomodoro = config.pomodoro,
        itemToUpdate.shortBreak = config.shortBreak,
        itemToUpdate.longBreak = config.longBreak,
        itemToUpdate.isDefault = config.isDefault,

        this.persistToStorage();
    }

    handleAction(action) {
        switch(action.type)
        {
            case TimerConfigActionTypes.ADD_TIMER:

                this.addTimerConfig(action.config);
                this.emit('change');
                break;

            case TimerConfigActionTypes.DELETE_TIMER:

                this.deleteTimerConfig(action.id);
                this.emit('change');
                break;

            case TimerConfigActionTypes.UPDATE_TIMER:

                this.updateTimerConfig(action.config);
                this.emit('change');
                break;
        }
    }
}

const timerConfigStore = new TimerConfigStore();
Dispatcher.register(timerConfigStore.handleAction.bind(timerConfigStore));

export default timerConfigStore;


