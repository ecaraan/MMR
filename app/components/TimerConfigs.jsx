import React from 'react';
import _  from 'lodash';
import { Modal } from 'react-bootstrap';
import TimerConfigForm from './TimerConfigForm.jsx';
import TimerConfigStore from '../stores/TimerConfigStore';
import * as TimerConfigAction from '../actions/TimerConfigAction';

class TimerConfigs extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            itemToEditId: null,
            itemToEditName: '',
            itemToEditPomodoro: 0,
            itemToEditShortBreak: 0,
            itemToEditLongBreak: 0,
            itemToEditIsDefault: false,
            itemToRemoveId: null,
            itemToRemoveName: '',           
            showModal: false,
            showConfirmModal: false,
            tList : TimerConfigStore.getTimerConfigs()
        }

        this.closeModal = this.closeModal.bind(this);
        this.closeConfirmModal = this.closeConfirmModal.bind(this);
        this.openModal = this.openModal.bind(this);

        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleRemove = this.handleRemove.bind(this);
        this.handlePostAddAction = this.handlePostAddAction.bind(this);

        this.confirmRemove = this.confirmRemove.bind(this);
        
        this.toggleEditing = this.toggleEditing.bind(this);

        this.setItemsFromStore = this.setItemsFromStore.bind(this);
    }

    handleChangeName(e) {
        this.setState({ itemToEditName: e.target.value })
    }

    handleChangePomodoro(e) {
        this.setState({ itemToEditPomodoro: e.target.value })
    }

    handleChangeShortBreak(e) {
        this.setState({ itemToEditShortBreak: e.target.value })
    }

    handleChangeLongBreak(e) {
        this.setState({ itemToEditLongBreak: e.target.value })
    }

    handleChangeIsDefault(e) {
        this.setState({ itemToEditIsDefault: e.target.value })
    }
    
    setItemsFromStore() {
        this.setState({ tList: TimerConfigStore.getTimerConfigs() });
    }

    componentWillMount() {
        TimerConfigStore.on('change', this.setItemsFromStore);
    }

    componentWillUnmount() {
        TimerConfigStore.removeListener('change', this.setItemsFromStore);
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

    handlePostAddAction(){
        this.closeModal();  
    }    
    
    handleUpdate(){
        let id = this.state.itemToEditId;

        TimerConfigAction.updateTimerConfig({
            id: id,
            name: this.state.itemToEditName,
            pomodoro: this.state.itemToEditPomodoro,
            shortBreak: this.state.itemToEditShortBreak,
            longBreak: this.state.itemToEditLongBreak,
            isDefault: this.state.itemToEditIsDefault
        })

        this.setState({ itemToEditId: null });        
    }

    handleRemove(){
        TimerConfigAction.deleteTimerConfig(this.state.itemToRemoveId);
        this.setState({ showConfirmModal: false});
    }

    confirmRemove(id){
        let itemToRemove = _.find(this.state.tList, ['id', id]);
        this.setState({ showConfirmModal: true, itemToRemoveId: id, itemToRemoveName: itemToRemove.name});
    }   

    toggleEditing(id) {
        let itemToEdit = _.find(this.state.tList, ['id', id]);

        if (itemToEdit)
        {
            this.setState( { 
                itemToEditId: id,
                itemToEditName: itemToEdit.name,
                itemToEditPomodoro: itemToEdit.pomodoro,
                itemToEditShortBreak: itemToEdit.shortBreak,
                itemToEditLongBreak: itemToEdit.longBreak,
                itemToEditIsDefault: itemToEdit.isDefault,
            } );
        }
        else
            this.setState( { itemToEditId: id } );
    }

    displayOrEdit(item){
    
        if ( this.state.itemToEditId === item.Id ) {
             return  <tr key={item.Id}>
                        <td>
                             <input type="checkbox" 
                                value={this.state.itemToEditIsDefault}
                                onChange={this.handleChangeIsDefault.bind(this)}/>
                        </td>
                        <td>
                            <input className="form-control" 
                                value={this.state.itemToEditName} 
                                onChange={this.handleChangeName.bind(this)}/>                            
                        </td>
                        <td>
                            <input className="form-control" 
                                value={this.state.itemToEditPomodoro} 
                                onChange={this.handleChangePomodoro.bind(this)}/>                            
                        </td>
                        <td>
                            <input className="form-control" 
                                value={this.state.itemToEditShortBreak} 
                                onChange={this.handleChangeShortBreak.bind(this)}/>                            
                        </td>
                        <td>
                            <input className="form-control" 
                                value={this.state.itemToEditLongBreak} 
                                onChange={this.handleChangeLongBreak.bind(this)}/>                            
                        </td>                        
                        <td>
                            <div className="btn-toolbar" role="toolbar">
                                <div className="btn-group" role="group">
                                    <button className="btn btn-success" onClick={this.handleUpdate}>
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
                        <td>{item.isDefault}</td>
                        <td>{item.name}</td>
                        <td>{item.pomodoro}</td>
                        <td>{item.shortBreak}</td>
                        <td>{item.longBreak}</td>                        
                        <td>
                            <div className="btn-toolbar" role="toolbar">
                                <div className="btn-group" role="group">
                                    <button className="btn btn-primary" onClick={() => this.toggleEditing(item.Id)}>
                                        <span className="glyphicon glyphicon-edit"></span>
                                    </button>
                                    <button className="btn btn-danger" onClick={() => this.confirmRemove(item.Id)}>
                                        <span className="glyphicon glyphicon-trash"></span>
                                    </button>
                                </div>
                            </div>                            
                        </td>
                    </tr>;
        }
    }
        
    tablerows() {                
        return  (this.state.tList.map((item) => {           
           return this.displayOrEdit(item);
        }));
    }

    render() {
        return (
            <div className = "panel panel-primary" style={{margin:"20px"}}>
                <div className = "panel-heading">
                    <h3 className = "panel-title">
                        Timer Configurations
                    </h3>
                </div>                
                <div className = "panel-body">
                    <table className = "table table-striped">
                        <thead>
                            <tr>
                                <th>Default</th>
                                <th>Name</th>
                                <th>Pomodoro</th>                                
                                <th>Short Break</th>
                                <th>Long Break</th> 
                            </tr>
                        </thead>
                        <tbody>
                            {this.tablerows()}
                        </tbody>
                    </table> 
                    <div className="row" style={{borderStyle: "solid 1px"}}>
                         <div className="col-md-12">
                            <button className="btn btn-primary" onClick={this.openModal}>Add New</button>
                         </div>
                    </div>
                    <Modal show={this.state.showModal} onHide={this.closeModal}>
                        <Modal.Header closeButton>
                            <Modal.Title>Add New Config</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <TimerConfigForm postAddAction={this.handlePostAddAction} closeForm={this.closeModal} />
                        </Modal.Body>
                    </Modal>
                    <Modal show={this.state.showConfirmModal} onHide={this.closeConfirmModal}>
                        <Modal.Header closeButton>
                            <Modal.Title>Are you sure?</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <p className="">Remove timer config, '{this.state.itemToRemoveName}' from the list?</p>
                        </Modal.Body>
                        <Modal.Footer>
                            <div className="modal-action-buttons">
                                <button onClick={this.handleRemove} className="btn btn-primary">Yes</button>
                                <button onClick={this.closeConfirmModal} className="btn btn-secondary">No</button>
                            </div>
                        </Modal.Footer>
                    </Modal>
                </div>
            </div>            
        );
    }
}

export default TimerConfigs;
