import React from 'react';
import TaskPageStore from '../stores/TaskPageStore';
import * as PageAction from '../actions/PageAction';

class Pagination extends React.Component{
    constructor() {
        super();

        this.onPageChanged = this.onPageChanged.bind(this);
        this.onRowsPerPageChanged = this.onRowsPerPageChanged.bind(this);
    }

    onPageChanged(page){
        PageAction.goToPage(page);
    }

    onRowsPerPageChanged(){
        PageAction.setRowsPerPage(parseInt(this.refs['customRowsPerPage'].value));   
    }

    render(){

        let lastPage = Math.ceil(this.props.totalRows / this.props.rowsPerPage)

        return <div>
            <div>
                <ul className="pagination">
                    <li><a href = "#" onClick={() => { PageAction.goToFirstPage() }}>&laquo;</a></li>
                    <li><a href = "#" onClick={() => {if (TaskPageStore.getCurrentPage() > 1){this.onPageChanged(TaskPageStore.getCurrentPage() - 1)}}}>&lt;</a></li>               
                    <li><a href = "#" onClick={() => {if (TaskPageStore.getCurrentPage() < TaskPageStore.getTotalPages()){this.onPageChanged(TaskPageStore.getCurrentPage() + 1)}}}>&gt;</a></li>
                    <li><a href = "#" onClick={() => { PageAction.goToLastPage() }}>&raquo;</a></li>
                    <li className="disabled"><span>Page {TaskPageStore.getCurrentPage()} of {TaskPageStore.getTotalPages()}</span></li>              
                </ul>        
            </div>
            <div>
                <button className="btn btn-sm btn-primary" onClick={this.onRowsPerPageChanged}>Show</button>&nbsp;
                <input ref="customRowsPerPage" style={{maxWidth: "40px"}} defaultValue={TaskPageStore.getRowsPerPage()} /> rows per page 
            </div>
        </div>
    }
}

export default Pagination;