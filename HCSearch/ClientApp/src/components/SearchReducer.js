import { SEARCH } from './actions';

const initialState = { contents: ['Mirististica', 'Vet'], value: '', works: [] };

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case SEARCH: {
            const { value } = action;
            const works = state.contents.filter((val) => val.includes(value));
            return { ...state, value, works };
        }
        default:
            return state;
    }
}