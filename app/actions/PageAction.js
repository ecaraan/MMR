import Dispatcher from '../dispatcher';
import PageActionTypes from '../constants/PageActionTypes';

export function goToFirstPage() {
    Dispatcher.dispatch({
        type: PageActionTypes.GOTO_FIRSTPAGE
    });
}

export function goToLastPage() {
    Dispatcher.dispatch({
        type: PageActionTypes.GOTO_LASTPAGE
    });
}

export function goToPage(page) {
    Dispatcher.dispatch({
        type: PageActionTypes.GOTO_PAGE,
        page: page
    });
}

export function setRowsPerPage(rowsPerPage) {
    Dispatcher.dispatch({
        type: PageActionTypes.SET_ROWSPERPAGE,
        rowsPerPage: rowsPerPage
    });
}

export function setCurrentPage(page) {
    Dispatcher.dispatch({
        type: PageActionTypes.SET_CURRENTPAGE,
        page: page
    })
}