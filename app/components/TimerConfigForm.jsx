import React from 'react';
import * as TimerConfigAction from '../actions/TimerConfigAction';

class TimerConfigForm extends React.Component{
    constructor(props) {
        super(props);
        this.state = this.getInitialState();
    }

    getInitialState() {
        return {
            name: '',
            pomodoro: 0,
            shortBreak: 0,
            longBreak: 0,
            isDefault: false
        }
    }
    
    handleChangeName(e) {
        this.setState({ name: e.target.value });
    }

    handleChangePomodoro(e) {
        this.setState({ pomodoro: e.target.value });
    }

    handleChangeShortBreak(e){
        this.setState({ shortBreak: e.target.value })
    }

    handleChangeLongBreak(e) {
        this.setState({ longBreak: e.target.value })
    }

    handleChangeIsDefault(e) {
        this.setState({ isDefault: e.target.value })
    }

    handleSetToDefault() {

    }

    handleAddTimerConfig(){
        TimerConfigAction.addTimerConfig({
            name : this.state.name,
            pomodoro: this.state.pomodoro,
            shortBreak: this.state.shortBreak,
            longBreak: this.state.longBreak,
            isDefault: this.state.isDefault
        });
        
        this.props.postAddAction();
    }

    render() {

        return (
            <div>
                <div className="form-group">
                    <input className="form-control" 
                        placeholder="Enter Timer Config Name"
                        value={this.state.name}
                        onChange={this.handleChangeName.bind(this)} />  
                </div>   
                <div className="form-group">                           
                    <input className="form-control" 
                        placeholder="Pomodoro (in minutes)" 
                        value={this.state.pomodoro}
                        onChange={this.handleChangePomodoro.bind(this)}/>                                    
                </div>
                <div className="form-group">                           
                    <input className="form-control" 
                        placeholder="Short Break (in minutes)" 
                        value={this.state.shortBreak}
                        onChange={this.handleChangeShortBreak.bind(this)}/>                                    
                </div>
                <div className="form-group">                           
                    <input className="form-control" 
                        placeholder="Long Break (in minutes)" 
                        value={this.state.longBreak}
                        onChange={this.handleChangeLongBreak.bind(this)}/>                                    
                </div>
                <div class="form-group checkbox">
                    <label>
                        <input type="checkbox" 
                            value={this.state.isDefault}
                            onChange={this.handleChangeIsDefault.bind(this)}/>
                        Set as Default
                    </label>
                </div>
                <button onClick={this.handleSetToDefault.bind(this)} className="btn btn-secondary">Use Default</button>
                <hr/>
                <div className="modal-action-buttons">
                    <button onClick={this.handleAddTimerConfig.bind(this)} className="btn btn-primary">Add</button>&nbsp;&nbsp;                    
                    <button onClick={this.props.closeForm} className="btn btn-secondary">Cancel</button>
                </div>                                
            </div>
        );

    }
};

TimerConfigForm.propTypes = {
    postAddAction: React.PropTypes.func.isRequired,
    closeForm: React.PropTypes.func.isRequired
}

export default TimerConfigForm;