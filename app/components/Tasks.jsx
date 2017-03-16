import React from 'react';
import _  from 'lodash';
import { Link } from 'react-router';
import { Modal } from 'react-bootstrap';
import Pagination from './Pagination.jsx';
import TaskForm from './TaskForm.jsx';
import TaskStore from '../stores/TaskStore';
import TimerConfigStore from '../stores/TimerConfigStore';
import * as TaskAction from '../actions/TaskAction';
import * as TimerUtil from '../utils/TimerUtil';

class Tasks extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            itemToEditId: null,
            taskToRemoveId: null,
            taskToRemoveName: null,
            sortColumn: null,
            sortOrder: null,
            showModal: false,
            showConfirmModal: false,
            currentPage: this.getTasks().length > 0? 1 : 0,
            rowsPerPage: 5,
            tList : this.getTasks()
        }

        this.sortTable = this.sortTable.bind(this);

        this.closeModal = this.closeModal.bind(this);
        this.closeConfirmModal = this.closeConfirmModal.bind(this);
        this.openModal = this.openModal.bind(this);

        this.handleUpdateTask = this.handleUpdateTask.bind(this);
        this.handleRemoveTask = this.handleRemoveTask.bind(this);
        this.handlePostAddAction = this.handlePostAddAction.bind(this);

        this.confirmRemove = this.confirmRemove.bind(this);
        
        this.toggleEditing = this.toggleEditing.bind(this);

        this.setTasksFromStore = this.setTasksFromStore.bind(this);
        this.getTasks = this.getTasks.bind(this);
        this.getValidPage = this.getValidPage.bind(this);

        this.onPageChanged = this.onPageChanged.bind(this);
        this.onRowsPerPageChanged = this.onRowsPerPageChanged.bind(this);
    }

    onPageChanged(page){
        this.setState({ currentPage: page });
    }

    onRowsPerPageChanged(rowsPerPage){
        this.setState({ rowsPerPage: rowsPerPage });   
    }

    getTasks(){
        if (this.props.uncompletedOnly)
            return TaskStore.getUncompletedTasks();
        else
            return TaskStore.getTasks();
    }
    
    setTasksFromStore() {
        this.setState({ tList: this.getTasks() });
    }

    componentWillMount() {
        TaskStore.on('change', this.setTasksFromStore);
    }

    componentWillUnmount() {
        TaskStore.removeListener('change', this.setTasksFromStore);
    }
    
    sortTable(column){
        let order, taskList = this.state.tList.slice();

        if (this.state.sortColumn != column || this.state.sortOrder == null)
            order = 'asc';
        else
            order = this.state.sortOrder == 'asc' ? 'desc' : 'asc';

        this.setState({
                sortColumn : column, 
                sortOrder : order, 
                tList : _.orderBy(taskList, [column], order)
            });

        PageAction.setCurrentPage(1);

    }

    closeModal() {        
        this.setState({ showModal: false });
    }

    closeConfirmModal() {
        this.setState({ showConfirmModal: false });
    }

    openModal() {
        this.setState({ showModal: true });
    }

    getLastPage() {
        return Math.ceil(this.getTasks().length / this.state.rowsPerPage);
    }

    getValidPage(currentPage) {        
        let lastPage = this.getLastPage()

        if (lastPage > 0)
        {
            let isCurrentPageValid = currentPage <= lastPage;

            if (isCurrentPageValid){
                return currentPage;
            }
            else {
                if (currentPage > 1)
                    this.getValidPage(currentPage - 1);
                else
                    return 1;
            
            }
        }
        else
            return 0;
    }

    handlePostAddAction(){
        this.closeModal();
        this.setState( { currentPage: this.getLastPage() });
    }    
    
    handleUpdateTask(){
        let id = this.state.itemToEditId;
        let task = _.find(this.getTasks(), ['Id', id]);

        TaskAction.updateTask({
            id: id,
            name: this.refs['editName_' + id].value,
            description : this.refs['editDescription_' + id].value,
            priority : parseInt(this.refs['editPriority_' + id].value),
            status : parseInt(this.refs['editStatus_' + id].value),
            timer : parseInt(this.refs['editTimer_' + id].value),
            duration : task.Duration
        })

        this.setState({ itemToEditId: null });        
    }

    handleRemoveTask(){
        TaskAction.deleteTask(this.state.taskToRemoveId);
      
        this.setState({ currentPage: this.getValidPage(this.state.currentPage), showConfirmModal: false});
    }

    confirmRemove(id){
        let itemToRemove = _.find(this.state.tList, ['Id', id]);
        this.setState({ showConfirmModal: true, taskToRemoveId: id, taskToRemoveName: itemToRemove.Name});
    }   

    toggleEditing(id) {
        this.setState( { itemToEditId: id } );
    }

    displayOrEdit(item){

        let p = _.find(TaskStore.getPrioritiesEnum(), ['Id', item.Priority]);
        let s = _.find(TaskStore.getStatusEnum(), ['Id', item.Status]);
        let t = _.find(TimerConfigStore.getTimerConfigs(), ['id', item.Timer]);

        if ( this.state.itemToEditId === item.Id ) {
             return  <tr key={item.Id}>
                        <td>
                            <input ref={`editName_${item.Id}`} className="form-control" defaultValue={item.Name} />
                            <textarea ref={`editDescription_${item.Id}`} className="form-control" defaultValue={item.Description} />  
                        </td>
                        <td>
                            <select ref={`editPriority_${item.Id}`} defaultValue={item.Priority || "0"} className="form-control">
                                <option value="0" disabled hidden>Priority</option>                                
                                <option value="1">Low</option>
                                <option value="2">Medium</option>
                                <option value="3">High</option>                          
                            </select>
                        </td>
                        <td>
                            <select ref={`editStatus_${item.Id}`} defaultValue={item.Status || "0"} className="form-control">
                                <option value="0" disabled hidden>Status</option>
                                <option value="1">To Do</option>
                                <option value="2">In Progress</option>
                                <option value="3">Done</option>                          
                            </select>
                        </td>
                        <td>{TimerUtil.MillisecodsToText2(item.Duration)}</td>
                        <td>
                            <select ref={`editTimer_${item.Id}`} defaultValue={item.Timer || "0"} className="form-control">
                                <option value="0" disabled hidden>Timer</option>
                                {
                                    TimerConfigStore.getTimerConfigs().map((item) => {
                                        return (
                                            <option value={item.id}>{item.name}</option>
                                        )
                                    })
                                }                          
                            </select>
                        </td>
                        <td>
                            <div className="btn-toolbar" role="toolbar">
                                <div className="btn-group" role="group">
                                    <button className="btn btn-success" onClick={this.handleUpdateTask}>
                                        <span className="glyphicon glyphicon-floppy-save"></span>
                                    </button>
                                    <button className="btn btn-danger" onClick={() => this.toggleEditing(0)}>
                                        <span className="glyphicon glyphicon-remove"></span>
                                    </button>                                    
                                </div>
                            </div>                            
                        </td>
                    </tr>;
        } 
        else {
            return  <tr key={item.Id}>
                        <td>
                            {item.Name}<br/>
                            <small>{item.Description}</small>
                        </td>
                        <td>{p ? p.Name : ''}</td>
                        <td>{s ? s.Name : ''}</td>
                        <td>{TimerUtil.MillisecodsToText2(item.Duration)}</td>
                        <td>{t ? t.name : ''}</td>
                        <td>
                            <div className="btn-toolbar" role="toolbar">
                                <div className="btn-group" role="group">
                                    <button className="btn btn-primary" onClick={() => this.toggleEditing(item.Id)}>
                                        <span className="glyphicon glyphicon-edit"></span>
                                    </button>
                                    <button className="btn btn-danger" onClick={() => this.confirmRemove(item.Id)}>
                                        <span className="glyphicon glyphicon-trash"></span>
                                    </button>
                                    <Link className="btn btn-warning" to={{pathname: '/dashboard', query: {'tid': item.Id}}}>                                                                            
                                        <span className="glyphicon glyphicon-time"></span>  
                                    </Link>
                                </div>
                            </div>                            
                        </td>
                    </tr>;
        }
    }
        
    tablerows() {                
        return  (_.take(_.slice(this.state.tList, (this.state.currentPage - 1) * this.state.rowsPerPage), this.state.rowsPerPage)).map((item) => {           
           return this.displayOrEdit(item);
        });
    }

    render() {
        return (
            <div className = "panel panel-primary" style={{margin:"20px"}}>
                <div className = "panel-heading">
                    <h3 className = "panel-title">
                        Task Master List
                    </h3>
                </div>                
                <div className = "panel-body">
                    <table className = "table table-striped">
                        <thead>
                            <tr>
                                <th>
                                    <a href="#" onClick={() => this.sortTable('Name')}>Task Detail </a>
                                    <i className={`fa ${this.state.sortColumn == 'Name' ? 'fa-sort-' + this.state.sortOrder : 'fa-sort'}`}></i>
                                </th>
                                <th>
                                    <a href="#" onClick={() => this.sortTable('Priority')}>Priority </a>
                                    <i className={`fa ${this.state.sortColumn == 'Priority' ? 'fa-sort-' + this.state.sortOrder : 'fa-sort'}`}></i>
                                </th>
                                <th>
                                    <a href="#" onClick={() => this.sortTable('Status')}>Status </a>
                                    <i className={`fa ${this.state.sortColumn == 'Status' ? 'fa-sort-' + this.state.sortOrder : 'fa-sort'}`}></i>
                                </th>
                                <th>Duration</th>
                                <th>Timer</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.tablerows()}
                        </tbody>
                    </table> 
                    <div className="row" style={{borderStyle: "solid 1px"}}>
                         <div className="col-md-9">
                            <button className="btn btn-primary" onClick={this.openModal}>Add New</button>
                         </div>
                         <div className="col-md-3">
                            <Pagination currentPage={this.state.currentPage}
                                    totalRows={this.getTasks().length}
                                    rowsPerPage={this.state.rowsPerPage}
                                    onPageChanged={this.onPageChanged}
                                    onRowsPerPageChanged={this.onRowsPerPageChanged}/>
                         </div>
                    </div>
                    <Modal show={this.state.showModal} onHide={this.closeModal}>
                        <Modal.Header closeButton>
                            <Modal.Title>Add New Task</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <TaskForm postAddAction={this.handlePostAddAction} closeForm={this.closeModal} />
                        </Modal.Body>
                    </Modal>
                    <Modal show={this.state.showConfirmModal} onHide={this.closeConfirmModal}>
                        <Modal.Header closeButton>
                            <Modal.Title>Are you sure?</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <p className="">Remove task, '{this.state.taskToRemoveName}' from the list?</p>
                        </Modal.Body>
                        <Modal.Footer>
                            <div className="modal-action-buttons">
                                <button onClick={this.handleRemoveTask} className="btn btn-primary">Yes</button>
                                <button onClick={this.closeConfirmModal} className="btn btn-secondary">No</button>
                            </div>
                        </Modal.Footer>
                    </Modal>
                </div>
            </div>            
        );
    }
}

Tasks.defaultProps = {
    uncompletedOnly: false
}

export default Tasks;
