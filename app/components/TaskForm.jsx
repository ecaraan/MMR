import React from 'react';
import * as TaskAction from '../actions/TaskAction';

class TaskForm extends React.Component{
    constructor(props) {
        super(props);
        this.state = this.getInitialState();
    }

    getInitialState() {
        return {
            name: '',
            description: '',
            priority: '0',
            status: '0'
        }
    }
    
    handleChangeName(e) {
        this.setState({ name: e.target.value });
    }

    handleChangeDescription(e) {
        this.setState({ description: e.target.value });
    }

    handleChangePriority(e){
        this.setState({ priority: e.target.value })
    }

    handleChangeStatus(e) {
        this.setState({ status: e.target.value })
    }

    handleAddTask(){
        TaskAction.addTask({
            name : this.state.name,
            description : this.state.description,
            priority : parseInt(this.state.priority),
            status : parseInt(this.state.status)
        });
        
        this.props.postAddAction();
    }

    render() {

        return (
            <div>
                <div className="form-group">
                    <input className="form-control" 
                        placeholder="Enter Task Name"
                        value={this.state.name}
                        onChange={this.handleChangeName.bind(this)} />  
                </div>   
                <div className="form-group">                           
                    <textarea className="form-control" 
                        placeholder="Enter Task Description" 
                        value={this.state.description}
                        onChange={this.handleChangeDescription.bind(this)}/>                                    
                </div>
                <div className="form-group"> 
                    <select placeholder="select" 
                        className="form-control"
                        value={this.state.priority}
                        onChange={this.handleChangePriority.bind(this)}>
                        <option value="0" disabled selected hidden>Priority</option>
                        <option value="1">Low</option>
                        <option value="2">Medium</option>
                        <option value="3">High</option>
                    </select> 
                </div>
                <div className="form-group"> 
                    <select placeholder="select" 
                        className="form-control"
                        value={this.state.status}
                        onChange={this.handleChangeStatus.bind(this)}>
                        <option value="0" disabled selected hidden>Status</option>
                        <option value="1">To Do</option>
                        <option value="2">In Progress</option>
                        <option value="3">Done</option>
                    </select> 
                </div>
                <hr/>
                <div className="modal-action-buttons">
                    <button onClick={this.handleAddTask.bind(this)} className="btn btn-primary">Add</button>&nbsp;&nbsp;
                    <button onClick={this.props.closeForm} className="btn btn-secondary">Cancel</button>
                </div>                                
            </div>
        );

    }
};

TaskForm.propTypes = {
    addTask: React.PropTypes.func.isRequired,
    closeForm: React.PropTypes.func.isRequired
}

export default TaskForm;