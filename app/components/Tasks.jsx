var React = require('react');
var _ = require('lodash');

import { Modal } from 'react-bootstrap';

var Tasks = React.createClass({
    getInitialState() {
        return { 
            itemToEditId: null,
            showModal: false,
            pList : [{Id: 1, Name: 'Low'}, 
                    {Id: 2, Name: 'Medium'}, 
                    {Id: 3, Name: 'High'}],
            sList : [{Id: 1, Name: 'To Do'}, 
                    {Id: 2, Name: 'In Progress'}, 
                    {Id: 3, Name: 'Done'}],
            tList : typeof localStorage['mmr_tasklist'] == 'undefined' ? [] : 
                    JSON.parse(localStorage.getItem('mmr_tasklist') || [])
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
            Id : (id || 0) + 1, 
            Name : this.refs['modal_taskName'].value,
            Description : this.refs['modal_taskDescription'].value,
            Priority : parseInt(this.refs['modal_taskPriority'].value),
            Status : parseInt(this.refs['modal_taskStatus'].value)
        });

        //persist to storage
        localStorage.setItem('mmr_tasklist', JSON.stringify(taskList));

        this.setState({ showModal: false, tList: taskList });
    },
    removeItem(id){
        var itemToRemove = _.find(this.state.tList, ['Id', id]);        
        //var r = confirm("Remove the task, '" + itemToRemove.Name + "' from the list?");

        // if (r == true) {
            var taskList = this.state.tList.slice();

            _.remove(taskList, ['Id', id]);

            //persist to storage
            localStorage.setItem('mmr_tasklist', JSON.stringify(taskList));

            this.setState({ tList: taskList }); 
        // } 
    },
    updateItem(){
        var id = this.state.itemToEditId; 
        var taskList = this.state.tList.slice();
        
        var itemToUpdate = _.find(taskList, ['Id', id]);

        itemToUpdate.Name = this.refs['editName_' + id].value;
        itemToUpdate.Description = this.refs['editDescription_' + id].value;
        itemToUpdate.Priority = parseInt(this.refs['editPriority_' + id].value);
        itemToUpdate.Status = parseInt(this.refs['editStatus_' + id].value);

        //persist to storage
        localStorage.setItem('mmr_tasklist', JSON.stringify(taskList));

        this.setState({ tList: taskList, itemToEditId: null });        
    },
    toggleEditing(id) {
        this.setState( { itemToEditId: id } );
    },
    displayOrEdit(item){

        var p = _.find(this.state.pList, ['Id', item.Priority]);
        var s = _.find(this.state.sList, ['Id', item.Status]);

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
                        <td>
                            <div className="btn-toolbar" role="toolbar">
                                <div className="btn-group" role="group">
                                    <button className="btn btn-success" onClick={this.updateItem}>
                                        <span className="glyphicon glyphicon-floppy-save"></span>
                                    </button>
                                    <button className="btn btn-danger" onClick={this.toggleEditing.bind(null, 0)}>
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
                        <td>
                            <div className="btn-toolbar" role="toolbar">
                                <div className="btn-group" role="group">
                                    <button className="btn btn-primary" onClick={this.toggleEditing.bind(null, item.Id)}>
                                        <span className="glyphicon glyphicon-edit"></span>
                                    </button>
                                    <button className="btn btn-danger" onClick={this.removeItem.bind(null, item.Id)}>
                                        <span className="glyphicon glyphicon-trash"></span>
                                    </button>
                                </div>
                            </div>                            
                        </td>
                    </tr>;
        }
    },   
    tablerows() {       
       return this.state.tList.map((item) => { 
           return this.displayOrEdit(item);
        });
    },
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
                                    <input ref="modal_taskName" className="form-control" placeholder="Enter Task Name" />  
                                </div>   
                                <div className="form-group">                           
                                    <textarea ref="modal_taskDescription" className="form-control" placeholder="Enter Task Description" />                                    
                                </div>
                                <div className="form-group"> 
                                    <select placeholder="select" ref="modal_taskPriority" className="form-control">
                                        <option value="0" disabled selected hidden>Priority</option>
                                        <option value="1">Low</option>
                                        <option value="2">Medium</option>
                                        <option value="3">High</option>
                                    </select> 
                                </div>
                                <div className="form-group"> 
                                    <select placeholder="select" ref="modal_taskStatus" className="form-control">
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