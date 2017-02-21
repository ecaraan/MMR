import { EventEmitter } from 'events';
import Dispatcher from '../dispatcher';
import PageActionTypes from '../constants/PageActionTypes';
import TaskStore from './TaskStore';

const initialCurrentPage = 1, initialRowsPerPage = 2;

class TaskPageStore extends EventEmitter {   

    constructor() {
        super();

        this._state = {
            currentPage: initialCurrentPage,
            rowsPerPage: initialRowsPerPage,
            totalTasks: TaskStore.getTasks().length,
            totalPages: Math.ceil(TaskStore.getTasks().length / initialRowsPerPage)    
        }
    }

    getCurrentPage() {
        return this._state.currentPage;
    }

    getRowsPerPage() {
        return this._state.rowsPerPage;
    }

    getTotalPages() {
        return Math.ceil(TaskStore.getTasks().length / this.getRowsPerPage());
    }

    setPage(page) {        
        this._state.currentPage = page;
    }

    setRowsPerPage(rowsPerPage){
        this._state.rowsPerPage = rowsPerPage;
        this._state.currentPage = 1;
    }  

    setCurrentPage(page){
        this._state.currentPage = page;
    } 

    handleAction(action) {
        switch(action.type)
        {
            case PageActionTypes.GOTO_FIRSTPAGE:

                this.setPage(1);
                this.emit('change');
                break;

            case PageActionTypes.GOTO_LASTPAGE:

                this.setPage(this.getTotalPages());
                this.emit('change');
                break;

            case PageActionTypes.GOTO_PAGE:

                this.setPage(action.page);
                this.emit('change');
                break;

            case PageActionTypes.SET_ROWSPERPAGE:

                this.setRowsPerPage(action.rowsPerPage);
                this.emit('change');
                break;

            case PageActionTypes.SET_CURRENTPAGE:

                this.setCurrentPage(action.page);
                this.emit('change');
                break;
        }
    }
}

const taskPageStore = new TaskPageStore();
Dispatcher.register(taskPageStore.handleAction.bind(taskPageStore));

export default taskPageStore;


