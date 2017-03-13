import Dispatcher from '../dispatcher';
import TimerStatActionTypes from '../constants/TimerStatActionTypes';

export function startTimer(taskId, timerMode){
    Dispatcher.dispatch({
        type: TimerConfigActionTypes.START_TIMER,
        taskId: taskId,
        timerMode: timerMode
    });
}

export function stopTimer(){
    Dispatcher.dispatch({
        type: TimerConfigActionTypes.STOP_TIMER
    })
}

export function resetTimer(){
    Dispatcher.dispatch({
        type: TimerConfigActionTypes.RESET_TIMER
    })
}

export function completeTimer(taskId){
    Dispatcher.dispatch({
        type: TimerConfigActionTypes.COMPLETE_TIMER,
        taskId: taskId
    })
}
