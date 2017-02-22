import React from 'react';
import { NavDropdown, MenuItem, OverlayTrigger, Button, Popover } from 'react-bootstrap';
import TaskStore from '../stores/TaskStore';

class PriorityPopOverMenu extends React.Component{
    constructor()
    {
        super();

        this.state = {
            tList : TaskStore.getTasks()
        };

        this.setTasksFromStore = this.setTasksFromStore.bind(this);
    }

    setTasksFromStore() {
        this.setState({ tList: TaskStore.getTasks() });
    }

    componentWillMount(){
        TaskStore.on('change', this.setTasksFromStore);
    }

    componentWillUnmount() {
        TaskStore.removeListener('change', this.setTasksFromStore);
    }

    showPopOver(priority) {

        let priorityId = _.find(TaskStore.getPrioritiesEnum(), { 'Name' : priority }).Id;

        return (
            <Popover id="popover-trigger-hover-focus" title={`${priority} Priority Tasks`}>
                <ul className="list-unstyled">
                    {_.filter(this.state.tList,{ 'Priority' :  priorityId }).map((item) => {
                        return (
                            <li>{item.Name}</li>
                        )
                    })}
                </ul>
            </Popover>
        )
    }

    render(){
        return (
            <NavDropdown eventKey={1} title="Priority" id="basic-nav-dropdown">               
                <OverlayTrigger trigger="focus" placement="left" overlay={this.showPopOver('High')}>
                    <MenuItem eventKey={1.1}>High</MenuItem>
                </OverlayTrigger>
                <OverlayTrigger trigger="focus" placement="left" overlay={this.showPopOver('Medium')}>
                    <MenuItem eventKey={1.2}>Medium</MenuItem>
                </OverlayTrigger>
                <OverlayTrigger trigger="focus" placement="left" overlay={this.showPopOver('Low')}>
                    <MenuItem eventKey={1.3}>Low</MenuItem>
                </OverlayTrigger>
            </NavDropdown> 
        );
    }
}

export default PriorityPopOverMenu;