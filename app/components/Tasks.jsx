var React = require('react');
var _ = require('lodash');

import { Modal } from 'react-bootstrap';

function TaskItem(id, name, description, priority, status){
    this.Id = id;
    this.Name = name;
    this.Description = description;
    this.Priority = priority;
    this.Status = status;    
}

function Priority(id, name){
    this.Id = id;
    this.Name = name;
}

function Status(id, name){
    this.Id = id;
    this.Name = name;
}

var taskList = [], priorityList = [], statusList = [];

//task list
taskList.push(new TaskItem(1, 'Name 1', 'Description 1', 1, 1));
taskList.push(new TaskItem(2, 'Name 2', 'Description 2', 2, 2));
taskList.push(new TaskItem(3, 'Name 3', 'Description 3', 3, 3));
taskList.push(new TaskItem(4, 'Name 4', 'Description 3', 3, 3));


//priorities
priorityList.push(new Priority(1, 'Low'));
priorityList.push(new Priority(2, 'Medium'));
priorityList.push(new Priority(3, 'High'));

//status
statusList.push(new Status(1, 'To Do'));
statusList.push(new Status(2, 'In Progress'));
statusList.push(new Status(3, 'Done'));

sessionStorage.setItem('tasklist', JSON.stringify(taskList));
sessionStorage.setItem('prioritylist', JSON.stringify(priorityList));
sessionStorage.setItem('statuslist', JSON.stringify(statusList));

var Tasks = React.createClass({
    // getDefaultProps(){
    //     return {
    //         pList : JSON.parse(sessionStorage.getItem('prioritylist') || []),
    //         sList : JSON.parse(sessionStorage.getItem('statuslist') || [])
    //     }
    // },
    getInitialState() {
        return { 
            showModal: false,
            pList : JSON.parse(sessionStorage.getItem('prioritylist') || []),
            sList : JSON.parse(sessionStorage.getItem('statuslist') || []),
            tList : JSON.parse(sessionStorage.getItem('tasklist') || [])           
        };
    },
    closeModal() {
        this.setState({ showModal: false });
    },
    openModal() {
        this.setState({ showModal: true });
    },
    addNewItem() {
        var id = _.max(_.map(this.state.tList, 'Id'));
      
        var taskList = this.state.tList.slice();
        taskList.push({
            Id : id + 1, 
            Name : document.getElementById('taskName').value,
            Description : document.getElementById('taskDescription').value,
            Priority : parseInt(document.getElementById('taskPriority').value),
            Status : parseInt(document.getElementById('taskStatus').value)
        });

        //persist to storage
        sessionStorage.setItem('tasklist', JSON.stringify(taskList));

        this.setState({ showModal: false, tList: taskList });

    },
    tablerows: function() {
       
       return this.state.tList.map((item) => { 

            var p = _.find(this.state.pList, ['Id', item.Priority]);
            var s = _.find(this.state.sList, ['Id', item.Status]);

            return  <tr key={item.Id}>
                        <td>
                            {item.Name}<br/>
                            <small>{item.Description}</small>
                        </td>
                        <td>{p ? p.Name : ''}</td>
                        <td>{s ? s.Name : ''}</td>
                        <td>
                            <div className="btn-toolbar" role="toolbar">
                                <div className="btn-group" role="group">
                                    <button className="btn btn-primary">
                                        <span className="glyphicon glyphicon-edit"></span>
                                    </button>
                                    <button className="btn btn-danger">
                                        <span className="glyphicon glyphicon-trash"></span>
                                    </button>
                                </div>
                            </div>                            
                        </td>
                    </tr>;
        });
    },
    render: function(){
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
                                <th>Task Detail</th>
                                <th>Priority</th>
                                <th>Status</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.tablerows()}
                        </tbody>
                    </table>
                    <button className="btn btn-primary" onClick={this.openModal}>Add New</button>
                    <Modal show={this.state.showModal} onHide={this.closeModal}>
                        <Modal.Header closeButton>
                            <Modal.Title>Add New Task</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <form>
                                <div className="form-group">
                                    <input id="taskName" className="form-control" placeholder="Enter Task Name" />  
                                </div>   
                                <div className="form-group">                           
                                    <textarea id="taskDescription" className="form-control" placeholder="Enter Task Description" />                                    
                                </div>
                                <div className="form-group"> 
                                    <select placeholder="select" id="taskPriority" className="form-control">
                                        <option value="0" disabled selected hidden>Priority</option>
                                        <option value="1">Low</option>
                                        <option value="2">Medium</option>
                                        <option value="3">High</option>
                                    </select> 
                                </div>
                                <div className="form-group"> 
                                    <select placeholder="select" id="taskStatus" className="form-control">
                                        <option value="" disabled selected hidden>Status</option>
                                        <option value="1">To Do</option>
                                        <option value="2">In Progress</option>
                                        <option value="3">Done</option>
                                    </select> 
                                </div>                                  
                            </form>
                        </Modal.Body>
                        <Modal.Footer>
                            <div className="modal-action-buttons">
                                <button onClick={this.addNewItem} className="btn btn-primary">Add</button>
                                <button onClick={this.closeModal} className="btn btn-secondary">Cancel</button>
                            </div>
                        </Modal.Footer>
                    </Modal>
                </div>
            </div>            
        );
    }
})

module.exports = Tasks;