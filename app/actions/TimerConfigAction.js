import Dispatcher from '../dispatcher';
import TimerConfigActionTypes from '../constants/TimerConfigActionTypes';

export function addTimerConfig(config){
    Dispatcher.dispatch({
        type: TimerConfigActionTypes.ADD_TIMER,
        config: config
    });
}

export function deleteTimerConfig(id){
    Dispatcher.dispatch({
        type: TimerConfigActionTypes.DELETE_TIMER,
        id: id
    })
}

export function updateTimerConfig(config){
    Dispatcher.dispatch({
        type: TimerConfigActionTypes.UPDATE_TIMER,
        config: config
    })
}