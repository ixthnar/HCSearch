import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import './SearchBar.css';

class SearchBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
            valueSave: '',
            isLoading: false,
            searchPattern: '',
            searchResults: []
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.fetchSearchResult = this.fetchSearchResult.bind(this);
        this.handleItemClick = this.handleItemClick.bind(this);
        this.renderSearchBarResultTable = this.renderSearchBarResultTable.bind(this);
    }

    handleChange(currentValue) {
        this.setState({ value: currentValue });
        console.log("currentValue: " + currentValue);
        if (this.state.isLoading) {
            ReactDOM.render('X', document.getElementById('ShowBlock')); // TODO this better
            this.setState({value: currentValue, valueSave: currentValue});
            // TODO search for this when loading is complete ... use an event queue
        } else {
            this.fetchSearchResult(currentValue);
        }
    }

    handleSubmit = () => {
        const currentValue = this.state.value;
        console.log("Submit currentValue: " + currentValue);
        if (this.state.isLoading) {
            ReactDOM.render('X', document.getElementById('ShowBlock')); // TODO this better
            this.setState({ valueSave: currentValue });
        } else {
            this.fetchSearchResult(currentValue);
        }
    }

    fetchSearchResult = (currentValue) => {
        ReactDOM.render('D', document.getElementById('ShowBlock')); // TODO this better
        ReactDOM.render(currentValue, document.getElementById('ShowSearchPattern')); // TODO this better
        this.setState({ value: currentValue, valueSave: '', isLoading: true });
        const searchPatternSafe = encodeURIComponent(currentValue.replace(/[^a-zA-Z0-9.' ]+/g, ""));
        fetch(`api/search/${searchPatternSafe}?page=1&pageSize=20`)
            .then(response => {
                ReactDOM.render('.', document.getElementById('ShowBlock')); // TODO this better
                return response.json();
            })
            .then(searchResult => {
                ReactDOM.render(' ', document.getElementById('ShowBlock')); // TODO this better
                this.setState({ searchResult: searchResult });
                let show = this.renderSearchBarResultTable(searchResult);
                ReactDOM.render(show, document.getElementById('ResultDataHere')); // TODO this better
            })
            .then(() => {
                // trigger again
                let newValue = this.state.valueSave;
                if (newValue.length > 0) {
                    // TODO re-trigger with this.state.valueSave
                    ReactDOM.render('*', document.getElementById('ShowBlock')); // TODO this better
                } else {
                    ReactDOM.render(' ', document.getElementById('ShowBlock')); // TODO this better
                }
                this.setState({ valueSave: '', isLoading: false });
            })
            .catch(() => {
                this.setState({ valueSave: '', isLoading: false });
                ReactDOM.render('Z', document.getElementById('ShowBlock')); // TODO this better
            })
            .finally(() => {
                this.setState({ valueSave: '', isLoading: false });
            });
    }

    handleItemClick = (itemId) => {
        // TODO get and render full record
        console.log("open: " + itemId);
        ReactDOM.render('Record ' + itemId, document.getElementById('DetailDataHere')); // TODO this better
    }

    renderSearchBarResultTable = (searchResult) => {
        return (
            <div>
                {searchResult.map(searchResultItem =>
                    <div key={searchResultItem.id}>
                        <div className="DisplaySearchId ">{searchResultItem.id}</div>
                        <div className="DisplaySearchName " onClick={(e) => this.handleItemClick(searchResultItem.id)}>{searchResultItem.nameFirst + ' ' + searchResultItem.nameLast}</div>
                    </div>
                )}
            </div>
        );
    }

    render() {
        return (
            <div>
                <div>
                    <input
                        className="SearchBarBox form-control SearchBarBox"
                        placeholder="Search names"
                        onChange={(e) => this.handleChange(e.target.value)}
                        value={this.value} />
                    <button className="SearchBarButton" onClick={(e) => this.handleSubmit()}></button>
                    <div id="ShowBlock" className="ShowBlockStyle"></div>
                    <div id="ShowSearchPattern" className="ShowSearchPatternStyle" ></div>
                </div>
                <div className="ShowSearchResultData" id="ResultDataHere"></div>
                <div className="ShowDetailData" id="DetailDataHere"></div>
            </div>
        );
    }
}

export default connect()(SearchBar);
