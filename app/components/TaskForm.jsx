import React from 'react';
import * as TaskAction from '../actions/TaskAction';
import TimerConfigStore from '../stores/TimerConfigStore';

class TaskForm extends React.Component{
    constructor(props) {
        super(props);
        this.state = this.getInitialState();
    }

    getInitialState() {
        let defaultTimerConfig = TimerConfigStore.getDefaultTimerConfig();
        let dTimer = defaultTimerConfig ? defaultTimerConfig.id : '0';
    

        return {
            name: '',
            description: '',
            priority: '0',
            status: '0',
            timer: dTimer,
            showErrors: false
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

    handleChangeTimer(e) {
        this.setState({ timer: e.target.value })
    }

    handleAddTask(){

        if (this.state.name.trim().length > 0)
        {
            TaskAction.addTask({
                name : this.state.name,
                description : this.state.description,
                priority : parseInt(this.state.priority),
                status : parseInt(this.state.status),
                timer: parseInt(this.state.timer)
            });
            
            this.props.postAddAction();
        }
        else{
            this.setState({ showErrors: true });
        }
    }

    render() {

        return (
            <div>
                { 
                    this.state.showErrors ?
                    <div className="form-group">
                        <h4><span className="label label-danger">Name is required.</span></h4>                 
                    </div> : <div></div>      
                }        
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
                        <option value="0" disabled hidden>Priority</option>
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
                        <option value="0" disabled hidden>Status</option>
                        <option value="1">To Do</option>
                        <option value="2">In Progress</option>
                        <option value="3">Done</option>
                    </select> 
                </div>
                <div className="form-group"> 
                    <select placeholder="select" 
                        className="form-control"
                        value={this.state.timer}
                        onChange={this.handleChangeTimer.bind(this)}>
                        <option value="0" disabled hidden>Timer</option>
                        {
                            TimerConfigStore.getTimerConfigs().map((item) => {
                                return (
                                    <option value={item.id}>{item.name}</option>
                                )
                            })
                        }    
                    </select> 
                </div>
                <hr/>
                <div className="modal-action-buttons">
                    <button onClick={this.handleAddTask.bind(this)} className="btn btn-primary">Add</button>
                    <button onClick={this.props.closeForm} className="btn btn-secondary">Cancel</button>
                </div>                                
            </div>
        );

    }
};

TaskForm.propTypes = {
    postAddAction: React.PropTypes.func.isRequired,
    closeForm: React.PropTypes.func.isRequired
}

export default TaskForm;