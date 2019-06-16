import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { actionCreators } from '../store/SearchBar';

class SearchBar extends Component {
    constructor(props) {
        super(props);
        this.state = { value: '', searchResults: ['(empty)'] };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(currentValue) {
        this.setState(state => ({ searchResults: [...state.searchResults, currentValue] }));
        console.log(this.state.searchResults);
    }

    handleSubmit() {
        this.setState(state => ({ searchResults: [state.searchResults[state.searchResults.length - 1]] }));
        console.log(this.state.searchResults);
    }

    render() {
        return (
            <div>
                <input
                    className="form-control"
                    placeholder="Search names"
                    onChange={(e) => this.handleChange(e.target.value)}
                        value={this.value} />
                <button onClick={(e) => this.handleSubmit()}> Yo </button>
            </div>
        );
    }
}

export default connect(
    state => state.searchBar,
    dispatch => bindActionCreators(actionCreators, dispatch)
)(SearchBar);
