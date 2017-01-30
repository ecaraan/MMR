var React = require('react');
var _ = require('lodash');

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

var taskList = [], priorityList = [];

taskList.push(new TaskItem(1, 'Name 1', 'Description 1', 1, 'To Do'));
taskList.push(new TaskItem(2, 'Name 2', 'Description 2', 2, 'In Progress'));
taskList.push(new TaskItem(3, 'Name 3', 'Description 3', 3, 'Done'));

priorityList.push(new Priority(1, 'High'));
priorityList.push(new Priority(2, 'Medium'));
priorityList.push(new Priority(3, 'Low'));

//move to Initializers and use localStorage. (probably in app.js)
sessionStorage.setItem('tasklist', JSON.stringify(taskList));
sessionStorage.setItem('prioritylist', JSON.stringify(priorityList));

var tList = JSON.parse(sessionStorage.getItem('tasklist') || []);
var pList = JSON.parse(sessionStorage.getItem('prioritylist') || []);

var Tasks = React.createClass({
    tablerows: function() {
       return tList.map(item => {              
            return <tr>
                        <td>
                            {item.Name}<br/>
                            <small>{item.Description}</small>
                        </td>
                        <td>{_.find(pList, ['Id', item.Priority]).Name}</td>
                        <td>{item.Status}</td>
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
                            </tr>
                        </thead>
                        <tbody>
                            {this.tablerows()}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
})

module.exports = Tasks;