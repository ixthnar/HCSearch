import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import './SearchBar.css';

class SearchBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            delay: 0,       // Set this to 2000 to simulate slow results
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
        this.renderDetailResultTable = this.renderDetailResultTable.bind(this);
    }

    handleChange = (currentValue) =>  {
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

    handleItemClick = (itemId) => {
        // TODO get and render full record
        console.log("open: " + itemId);
        this.fetchDetailResult(itemId);
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
                if (this.state.delay > 0) {
                    return new Promise(r => setTimeout(r, this.state.delay));
                }
            })
            .then(() => {
                // trigger again?
                let newValue = this.state.valueSave;
                this.setState({ valueSave: '', isLoading: false });
                if (newValue.length > 0) {
                    ReactDOM.render('*', document.getElementById('ShowBlock')); // TODO this better
                    let element = document.getElementById('SearchBarControl');
                    setTimeout(e => this.handleChange(element.value), 1);
                } else {
                    ReactDOM.render(' ', document.getElementById('ShowBlock')); // TODO this better
                }
            })
            .catch(() => {
                this.setState({ valueSave: '', isLoading: false });
                ReactDOM.render('Z', document.getElementById('ShowBlock')); // TODO this better
            });
    }

    fetchDetailResult = (id) => {
        ReactDOM.render('Loading ' + id, document.getElementById('DetailDataHere')); // TODO this better
        fetch(`api/person/${id}?page=1&pageSize=20`)
            .then(response => {
                return response.json();
            })
            .then(fetchResult => {
                let show = this.renderDetailResultTable(fetchResult );
                ReactDOM.render(show, document.getElementById('DetailDataHere')); // TODO this better
            })
            .catch(() => {
                console.log('fetchDetailResult exception');
                ReactDOM.render('Error retrieving data for ' + id, document.getElementById('DetailDataHere')); // TODO this better
            });
    }

    renderSearchBarResultTable = (searchResult) => {
        return (
            <div>
                {searchResult.map(searchResultItem =>
                    <div key={searchResultItem.id}>
                        <div className="DisplaySearchId">{searchResultItem.id}</div>
                        <div className="DisplaySearchName" onClick={(e) => this.handleItemClick(searchResultItem.id)}>{searchResultItem.nameFirst + ' ' + searchResultItem.nameLast}</div>
                    </div>
                )}
            </div>
        );
    }

    renderDetailResultTable = (fetchDetailResult) => {
        return (
            <div>
                <b>{fetchDetailResult.nameFirst + ' ' + fetchDetailResult.nameLast}</b><br/>
                {fetchDetailResult.addressStreet + ', ' + fetchDetailResult.addressCity} <br/>
                {fetchDetailResult.addressState + '  ' + fetchDetailResult.addressZip + ' ' + fetchDetailResult.addressCountry}<br/>
                <em>Age:</em> {(new Date().getFullYear() - parseInt(fetchDetailResult.dateOfBirth.substring(0, 4), 10))}<br />
                <em>Interests:</em> {fetchDetailResult.interests.replace(/\',\'/g, ", ").replace(/[\'[\]]/g, "")}<br />
                <img alt="the person" style={{ width: 64, height: 64, border: 'solid 1px #bbb' }} src={"data:image/jpg;base64," + fetchDetailResult.pictureBase64} />
                <em>&nbsp;&nbsp;(minimal jpeg for test data)</em> <br />
                <span className="ShowDiscreetly"><em>Id:</em> {fetchDetailResult.id}</span>
            </div>
        );
    }

    render() {
        return (
            <div>
                <div>
                    <input
                        id="SearchBarControl"
                        className="SearchBarBox form-control SearchBarBox"
                        placeholder="Search names"
                        onChange={(e) => this.handleChange(e.target.value)}
                        value={this.value} />
                    <button className="SearchBarButton" onClick={(e) => this.handleSubmit()}></button>
                    <div id="ShowBlock" className="ShowBlockStyle"></div>
                    <div id="ShowSearchPattern" className="ShowSearchPatternStyle" ></div>
                </div>
                <table>
                    <tr>
                        <td valign="top"><span className="ShowSearchResultData" id="ResultDataHere"></span></td>
                        <td valign="top"><span className="ShowDetailData" id="DetailDataHere"></span></td>
                    </tr>
                </table>
            </div>
        );
    }
}

export default connect()(SearchBar);
