import Dispatcher from '../dispatcher';
import TaskActionTypes from '../constants/TaskActionTypes';

export function addTask(task){
    Dispatcher.dispatch({
        type: TaskActionTypes.ADD_TASK,
        task: task
    });
}

export function deleteTask(id){
    Dispatcher.dispatch({
        type: TaskActionTypes.DELETE_TASK,
        id: id
    })
}

export function updateTask(task){
    Dispatcher.dispatch({
        type: TaskActionTypes.UPDATE_TASK,
        task: task
    })
}