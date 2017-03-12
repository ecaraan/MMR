import React from 'react';
import * as InputFilter from '../utils/InputValidation';

class Pagination extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            rowsPerPage: this.props.rowsPerPage
        }
    }

    handleChangeRowsPerPage(e) {
        this.setState({ rowsPerPage: e.target.value });
    }

    handleFocus(e) {
       e.target.select();
    }

    onPageChanged(page){
        if (page >= 1 && page <= this.getTotalPages())
            this.props.onPageChanged(page);  
    }

    getTotalPages()
    {
        return Math.ceil(this.props.totalRows / this.props.rowsPerPage);
    }

    render(){

        return <div>
            <div>
                <ul className="pagination">
                    <li><a href = "#" onClick={() => {this.onPageChanged(1)}}>&laquo;</a></li>
                    <li><a href = "#" onClick={() => {this.onPageChanged(this.props.currentPage - 1)}}>&lt;</a></li>               
                    <li><a href = "#" onClick={() => {this.onPageChanged(this.props.currentPage + 1)}}>&gt;</a></li>
                    <li><a href = "#" onClick={() => {this.onPageChanged(this.getTotalPages())}}>&raquo;</a></li>
                    <li className="disabled"><span>Page {this.props.currentPage} of {this.getTotalPages()}</span></li>              
                </ul>        
            </div>
            <div>
                <button className="btn btn-sm btn-primary" onClick={() => {this.props.onRowsPerPageChanged(this.state.rowsPerPage)}}>Show</button>&nbsp;
                <input ref="customRowsPerPage"
                        style={{maxWidth: "40px"}} 
                        value={this.state.rowsPerPage}
                        onChange={this.handleChangeRowsPerPage.bind(this)}
                        onKeyPress={(e) => InputFilter.numeric(e)}
                        onFocus={(e) =>this.handleFocus(e)} /> rows per page 
            </div>
        </div>
    }
}

Pagination.defaultProps = {
    totalRows : 0,
    rowsPerPage: 0,
    currentPage: 0
}

export default Pagination;