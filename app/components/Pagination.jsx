import React from 'react';

class Pagination extends React.Component{
    constructor(props) {
        super(props);

        this.onPageChanged = this.onPageChanged.bind(this);
        this.onRowsPerPageChanged = this.onRowsPerPageChanged.bind(this);
    }

    onPageChanged(page){
        this.props.onPageChanged(page);
    }

    onRowsPerPageChanged(){
        let rPerPage = this.refs['customRowsPerPage'].value;
        this.props.onRowsPerPageChanged(rPerPage);
    }

    render(){

        let lastPage = Math.ceil(this.props.totalRows / this.props.rowsPerPage)

        return <div>
            <div>
                <ul className="pagination">
                    <li><a href = "#" onClick={() => {this.onPageChanged(1)}}>&laquo;</a></li>
                    <li><a href = "#" onClick={() => {if (this.props.currentPage > 1){this.onPageChanged(this.props.currentPage - 1)}}}>&lt;</a></li>               
                    <li><a href = "#" onClick={() => {if (this.props.currentPage < lastPage){this.onPageChanged(this.props.currentPage + 1)}}}>&gt;</a></li>
                    <li><a href = "#" onClick={() => {this.onPageChanged(lastPage)}}>&raquo;</a></li>
                    <li className="disabled"><span>Page {this.props.currentPage} of {lastPage}</span></li>              
                </ul>        
            </div>
            <div>
                <button className="btn btn-sm btn-primary" onClick={this.onRowsPerPageChanged}>Show</button>&nbsp;
                <input ref="customRowsPerPage" style={{maxWidth: "40px"}} defaultValue={this.props.rowsPerPage} /> rows per page 
            </div>
        </div>
    }
}

export default Pagination;