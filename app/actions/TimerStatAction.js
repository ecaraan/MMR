import Dispatcher from '../dispatcher';
import TimerStatActionTypes from '../constants/TimerStatActionTypes';

export function startTimer(taskId, timerMode, timerETC){
    Dispatcher.dispatch({
        type: TimerStatActionTypes.START_TIMER,
        taskId: taskId,
        timerMode: timerMode,
        timerETC: timerETC
    });
}

export function stopTimer(){
    Dispatcher.dispatch({
        type: TimerStatActionTypes.STOP_TIMER
    })
}

export function resetTimer(){
    Dispatcher.dispatch({
        type: TimerStatActionTypes.RESET_TIMER
    })
}

export function completeTimer(taskId){
    Dispatcher.dispatch({
        type: TimerStatActionTypes.COMPLETE_TIMER,
        taskId: taskId
    })
}
