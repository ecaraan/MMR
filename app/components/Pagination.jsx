var React = require('react');

var Pagination = React.createClass({  
    getInitialState(){
        return{
            rowsPerPage: this.props.rowsPerPage,
            totalRows: this.props.totalRows,
            lastPage: Math.ceil(this.props.totalRows / this.props.rowsPerPage)
        };
    },
    onPageChanged(page){
        this.props.onPageChanged(page);
    },
    onRowsPerPageChanged(){
        let rPerPage = this.refs['customRowsPerPage'].value;

        this.props.onRowsPerPageChanged(rPerPage);
        this.setState({rowsPerPage: rPerPage,
            lastPage: Math.ceil(this.props.totalRows / rPerPage)
        });
    },
    render(){
        return <div>
            <div>
                <ul className="pagination">
                    <li><a href = "#" onClick={() => {this.onPageChanged(1)}}>&laquo;</a></li>
                    <li><a href = "#" onClick={() => {if (this.props.currentPage > 1){this.onPageChanged(this.props.currentPage - 1)}}}>&lt;</a></li>               
                    <li><a href = "#" onClick={() => {if (this.props.currentPage < this.state.lastPage){this.onPageChanged(this.props.currentPage + 1)}}}>&gt;</a></li>
                    <li><a href = "#" onClick={() => {this.onPageChanged(this.state.lastPage)}}>&raquo;</a></li>
                    <li className="disabled"><span>Page {this.props.currentPage} of {this.state.lastPage}</span></li>              
                </ul>        
            </div>
            <div>
                <button className="btn btn-sm btn-primary" onClick={this.onRowsPerPageChanged}>Show</button>&nbsp;
                <input ref="customRowsPerPage" style={{maxWidth: "40px"}} defaultValue={this.state.rowsPerPage} /> rows per page 
            </div>
        </div>
    }
})

module.exports = Pagination;