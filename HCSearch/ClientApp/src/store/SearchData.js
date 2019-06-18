const requestSearchDataType = 'REQUEST_SEARCH_DATA';
const receiveSearchDataType = 'RECEIVE_SEARCH_DATA';
const initialState = { searchResult: [], isLoading: false, pageSize: 20 };

export const actionCreators = {
    requestSearchData: (searchPattern, startDataPage, pageSize) => async (dispatch, getState) => {
        // TODO better way to block re-entry
        const isStillLoading = getState().searchData.isLoading;
        //const isStillLoading = (startDataPage !== undefined && getState().searchData.startDataPage !== undefined && startDataPage === getState().searchData.startDataPage);
        if (isStillLoading) {
            // Don't issue a duplicate request (we already have or are loading the requested data)
            return;
        }

        dispatch({ type: requestSearchDataType, searchPattern, startDataPage, pageSize });

        // First make SQL injection safe then encode it to place in URL
        const searchPatternSafe = encodeURIComponent(searchPattern.replace(/[^a-zA-Z0-9.' ]+/g, ""));
        const url = `api/search/${searchPatternSafe}?page=${startDataPage}&pageSize=${pageSize}`;
        const response = await fetch(url);
        const searchResult = await response.json();

        dispatch({ type: receiveSearchDataType, searchPattern, startDataPage, pageSize, searchResult });
    }
};

export const reducer = (state, action) => {
    state = state || initialState;

    if (action.type === requestSearchDataType) {
        return {
            ...state,
            startDataPage: action.startDataPage, /* TODO check the action */
            searchPattern: "",   // TODO Get these
            pageSize: 20,
            isLoading: true
        };
    }

    if (action.type === receiveSearchDataType) {
        return {
            ...state,
            startDataPage: action.startDataPage, /* TODO Check the action */
            searchPattern: "",   // TODO Get these
            pageSize: 20,
            searchResult: action.searchResult,
            isLoading: false
        };
    }

    return state;
};
