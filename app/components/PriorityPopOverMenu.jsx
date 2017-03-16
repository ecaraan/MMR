import React from 'react';
import { Link } from 'react-router';
import { NavDropdown, MenuItem, OverlayTrigger, Button, Popover } from 'react-bootstrap';
import TaskStore from '../stores/TaskStore';
import _ from 'lodash';

class PriorityPopOverMenu extends React.Component{
    constructor()
    {
        super();

        this.state = {
            tList : TaskStore.getUncompletedTasks()
        };

        this.setTasksFromStore = this.setTasksFromStore.bind(this);
    }

    setTasksFromStore() {
        this.setState({ tList: TaskStore.getUncompletedTasks() });
    }

    componentWillMount(){
        TaskStore.on('change', this.setTasksFromStore);
    }

    componentWillUnmount() {
        TaskStore.removeListener('change', this.setTasksFromStore);
    }

    getIconColor(priority){
        let iconColor = 'black';
        let p = _.find(TaskStore.getPrioritiesEnum(), { 'Id' : priority });

        if (p)
        {
            switch(p.Name){
                case 'High': 
                    iconColor = 'red';
                    break;
                case 'Medium': 
                    iconColor = 'blue';
                    break;
                case 'Low': 
                    iconColor = 'green';
                    break;
            }
        }

        return iconColor;
    }

    constructList(list) {
        return (
            list.map((item) => {
                return (                    
                    <li key={item.Id}>
                        <Link to={{pathname: '/dashboard', query: {'tid': item.Id}}}>
                            <i className="fa fa-clock-o" style={{color : this.getIconColor(item.Priority)}}></i> {item.Name}
                        </Link>
                    </li>
                )
            }) 
        )
    }

    showPopOver(priority) {
        let list;
        
        if(priority != ''){
            let priorityId = _.find(TaskStore.getPrioritiesEnum(), { 'Name' : priority }).Id;   
            list = this.constructList(_.filter(this.state.tList,{ 'Priority' :  priorityId }));          
        }
        else{
            list = this.constructList(this.state.tList);
        }       

        return (
            <Popover id="popover-trigger-hover-focus" title={`${priority} Priority Tasks`}>
                <ul className="list-unstyled">                    
                    { list }             
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
                <OverlayTrigger trigger="focus" placement="left" overlay={this.showPopOver('')}>
                    <MenuItem eventKey={1.4}>All</MenuItem>
                </OverlayTrigger>                 
            </NavDropdown> 
        );
    }
}

export default PriorityPopOverMenu;