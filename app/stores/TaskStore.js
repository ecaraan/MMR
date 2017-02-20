import { EventEmitter } from 'events';
import Dispatcher from '../dispatcher';
import TaskActionTypes from '../constants/TaskActionTypes';

const taskLocalStorageName = 'mmr_tasklist';

class TaskStore extends EventEmitter {   

    constructor() {
        super();

        this._state = {
            tasks: typeof localStorage[taskLocalStorageName] == 'undefined' ? [] : 
                    JSON.parse(localStorage.getItem(taskLocalStorageName) || []),
            priorityEnum : [{Id: 1, Name: 'Low'}, 
                    {Id: 2, Name: 'Medium'}, 
                    {Id: 3, Name: 'High'}],
            statusEnum : [{Id: 1, Name: 'To Do'}, 
                    {Id: 2, Name: 'In Progress'}, 
                    {Id: 3, Name: 'Done'}]
        }
    }

    getTasks() {
        return this._state.tasks;
    }

    getPrioritiesEnum() {
        return this._state.priorityEnum;
    }

    getStatusEnum() {
        return this._state.statusEnum;
    }

    persistToStorage() {
        localStorage.setItem(taskLocalStorageName, JSON.stringify(this._state.tasks));
    }

    addTask(task) {
        
        let id = _.max(_.map(this._state.tasks, 'Id'));
        
        this._state.tasks.push({
            Id : (id || 0) + 1, 
            Name : task.name,
            Description : task.decription,
            Priority : task.priority,
            Status : task.status
        });

        this.persistToStorage();
    }

    deleteTask(id) {

        _.remove(this._state.tasks, ['Id', id]);

        this.persistToStorage();

    }

    updateTask(task){
               
        let itemToUpdate = _.find(this._state.tasks, ['Id', task.id]);

        itemToUpdate.Name = task.name,
        itemToUpdate.Description = task.decription,
        itemToUpdate.Priority = task.priority,
        itemToUpdate.Status = task.status

        this.persistToStorage();
    }

    handleAction(action) {
        switch(action.type)
        {
            case TaskActionTypes.ADD_TASK:

                this.addTask(action.task);
                this.emit('change');
                break;

            case TaskActionTypes.DELETE_TASK:

                this.deleteTask(action.id);
                this.emit('change');
                break;

            case TaskActionTypes.UPDATE_TASK:

                this.updateTask(action.task);
                this.emit('change');
                break;
        }
    }
}

const taskStore = new TaskStore();
Dispatcher.register(taskStore.handleAction.bind(taskStore));

export default taskStore;


