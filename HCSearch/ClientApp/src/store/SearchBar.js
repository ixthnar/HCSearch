const ResetSearchBarCountType = 'RESET_SEARCH';
const UpdateSearchBarCountType = 'UPDATE_SEARCH';
const SubmitSearchBarCountType = 'SUBMIT_SEARCH';
const initialState = { count: 0 };

export const actionCreators = {
    reset: () => ({ type: ResetSearchBarCountType }),
    update: () => ({ type: UpdateSearchBarCountType }),
    submit: () => ({ type: SubmitSearchBarCountType })
};

export const reducer = (state, action) => {
    state = state || initialState;

    if (action.type === ResetSearchBarCountType) {
        return { ...state, count: state.count + 1 };
    }

    if (action.type === UpdateSearchBarCountType) {
        return { ...state, count: state.count - 1 };
    }

    if (action.type === SubmitSearchBarCountType) {
        return { ...state, count: state.count - 1 };
    }

    return state;
};
