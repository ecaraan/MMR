import { EventEmitter } from 'events';
import Dispatcher from '../dispatcher';
import TimerConfigActionTypes from '../constants/TimerConfigActionTypes';

const timerConfigLocalStorageName = 'mmr_timerconfig';

class TimerConfigStore extends EventEmitter {   

    constructor() {
        super();

        this._state = {
            timerConfigs: typeof localStorage[timerConfigLocalStorageName] == 'undefined' ? [] : 
                    JSON.parse(localStorage.getItem(timerConfigLocalStorageName) || [])
        }
    }

    getTimerConfigs() {
        return  _.orderBy(this._state.timerConfigs, ['isDefault'], ['desc']);
    }

    getDefaultTimerConfig() {
        return _.find(this._state.timerConfigs, ['isDefault', true])
    }

    persistToStorage() {
        localStorage.setItem(timerConfigLocalStorageName, JSON.stringify(this._state.timerConfigs));
    }

    removePreviousDefault() {
        let itemsToUpdate = _.filter(this._state.timerConfigs, ['isDefault', true]);

        itemsToUpdate.map((item) => {
            item.isDefault = false;
        })            
    }

    addTimerConfig(config) {
        
        let id = _.max(_.map(this._state.timerConfigs, 'id'));
                
        if (config.isDefault)
            this.removePreviousDefault();

        this._state.timerConfigs.push({
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

        _.remove(this._state.timerConfigs, ['id', id]);

        this.persistToStorage();

    }

    updateTimerConfig(config){
               
        let itemToUpdate = _.find(this._state.timerConfigs, ['id', config.id]);

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


