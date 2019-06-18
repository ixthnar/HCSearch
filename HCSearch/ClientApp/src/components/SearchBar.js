import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
//import { actionCreators } from '../store/SearchBar';
import { actionCreators } from '../store/SearchData';

class SearchBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
            searchPattern: '',
            searchResults: []
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.getSearchResult = this.getSearchResult.bind(this);
        this.showSearchResult = this.showSearchResult.bind(this);
    }

    handleChange(currentValue) {
        this.setState({ value: currentValue });
        console.log("currentValue: " + currentValue);
        this.getSearchResult();
        this.showSearchResult(this.props.searchResult);
    }

    handleSubmit = () => {
        this.getSearchResult();
        this.showSearchResult(this.props.searchResult);
    }

    getSearchResult = () => {
        const searchPattern = this.state.value;
        this.setState({searchPattern: searchPattern});
        console.log(this.state.searchResults);
        const startDataPage = 1;
        const pageSize = 20;
        this.props.requestSearchData(searchPattern, startDataPage, pageSize);
        this.setState({ searchResult: this.props.searchResult });
        console.log(this.props);
    }

    showSearchResult = (searchResult) => {
        let show = renderSearchBarResultTable(searchResult);
        ReactDOM.render(show, document.getElementById('ResultDataHere')); // TODO this better
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
                <div id="ResultDataHere"></div>
            </div>
        );
    }
}

function renderSearchBarResultTable(searchResult) {
    return (
        <div>
            {searchResult.map(searchResultItem =>
                <div key={searchResultItem.id}>
                    <div style={{width:50,display:'inline-block',color:'#AAA'}}>{searchResultItem.id}</div>
                    <div style={{ display: 'inline-block'}}>{searchResultItem.nameFirst + ' ' + searchResultItem.nameLast}</div>
                </div>
            )}
        </div>
    );
}

export default connect(
    state => state.searchData,
    dispatch => bindActionCreators(actionCreators, dispatch)
)(SearchBar);
