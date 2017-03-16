import React from 'react';
import * as TimerConfigAction from '../actions/TimerConfigAction';
import * as InputFilter from '../utils/InputValidation';
import TimerConfigStore from '../stores/TimerConfigStore';

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
            isDefault: false,
            showErrors: false
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
        this.setState({ isDefault: e.target.checked })
    }

    handleSetToDefault() {
        let defaultTimerConfig = TimerConfigStore.getDefaultTimerConfig();

        if (defaultTimerConfig){
            this.setState ({
                pomodoro: defaultTimerConfig.pomodoro,
                shortBreak: defaultTimerConfig.shortBreak,
                longBreak: defaultTimerConfig.longBreak,
            });
        }

    }

    handleAddTimerConfig(){
        if (this.state.name.trim().length > 0)
        {
            TimerConfigAction.addTimerConfig({
                name : this.state.name,
                pomodoro: this.state.pomodoro,
                shortBreak: this.state.shortBreak,
                longBreak: this.state.longBreak,
                isDefault: this.state.isDefault
            });
            
            this.props.postAddAction();
        }
        else{
            this.setState({ showErrors: true });
        }
    }

    handleFocus(e) {
       e.target.select();
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
                        placeholder="Enter Timer Config Name"
                        value={this.state.name}
                        onChange={this.handleChangeName.bind(this)} />  
                </div>   
                <div className="form-group">      
                    <label>Pomodoro<small>  (In Minutes)</small></label>                     
                    <input className="form-control"
                        value={this.state.pomodoro}
                        onChange={this.handleChangePomodoro.bind(this)}
                        onKeyPress={(e) => InputFilter.numeric(e)}
                        onFocus={(e) =>this.handleFocus(e)}/>                     
                </div>
                <div className="form-group">        
                    <label>Short Break<small>  (In Minutes)</small></label>                   
                    <input className="form-control"
                        value={this.state.shortBreak}
                        onChange={this.handleChangeShortBreak.bind(this)}
                        onKeyPress={(e) => InputFilter.numeric(e)}
                        onFocus={(e) =>this.handleFocus(e)}/>                                    
                </div>
                <div className="form-group">                           
                    <label>Long Break<small>  (In Minutes)</small></label>
                    <input className="form-control"
                        value={this.state.longBreak}
                        onChange={this.handleChangeLongBreak.bind(this)}
                        onKeyPress={(e) => InputFilter.numeric(e)}
                        onFocus={(e) =>this.handleFocus(e)}/>                                    
                </div>
                <div className="form-group checkbox">
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
                    <button onClick={this.handleAddTimerConfig.bind(this)} className="btn btn-primary">Add</button>
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