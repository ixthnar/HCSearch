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
            isChangeCatchUpNeeded: false,
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

    handleChange = (currentValue) => {
        this.setState({ value: currentValue });
        console.log("handleChange: currentValue=" + currentValue);
        if (this.state.isLoading) {
            this.setState({ isChangeCatchUpNeeded: true });
        } else {
            this.fetchSearchResult(currentValue);
        }
    }

    handleSubmit = () => {
        const currentValue = this.state.value;
        console.log("handleSubmit: currentValue=" + currentValue);
        if (this.state.isLoading) {
            this.setState({ isChangeCatchUpNeeded: true });
        } else {
            this.fetchSearchResult(currentValue);
        }
    }

    handleItemClick = (itemId) => {
        console.log("Open detail: id=" + itemId);
        this.fetchDetailResult(itemId);
    }

    // Fetch, render, and display search results. If typing was missed, catchup
    fetchSearchResult = (currentValue) => {
        // Doing loading status in the view here, messes up the user experience
        this.setState({ value: currentValue, isLoading: true });
        const searchPatternSafe = encodeURIComponent(currentValue.replace(/[^a-zA-Z0-9.' ]+/g, ""));
        fetch(`api/search/${searchPatternSafe}?page=1&pageSize=20`)
            .then(response => {
                return response.json();
            })
            .then(searchResult => {
                this.setState({ searchResult: searchResult });
                ReactDOM.render(this.renderSearchBarResultTable(searchResult), document.getElementById('ResultDataHere'));
            })
            .then(() => {
                // A delay to simulate slow response time
                if (this.state.delay > 0) {
                    return new Promise(r => setTimeout(r, this.state.delay));
                }
            })
            .then(() => {
                // Catch up for missing changes
                let isChangeCatchUpNeededCurrent = this.state.isChangeCatchUpNeeded;
                this.setState({ isChangeCatchUpNeeded: false, isLoading: false });
                if (isChangeCatchUpNeededCurrent) {
                    let element = document.getElementById('SearchBarControl');
                    setTimeout(e => this.handleChange(element.value), 1);
                }
            })
            .catch((err) => {
                this.setState({ isChangeCatchUpNeeded: false, isLoading: false });
                ReactDOM.render('Loading: search="' + currentValue + '", error=' + err, document.getElementById('ResultDataHere'));
            });
    }

    // Fetch, render, and display details for the selected person
    fetchDetailResult = (id) => {
        ReactDOM.render('Loading: id=' + id, document.getElementById('DetailDataHere'));
        fetch(`api/person/${id}?page=1&pageSize=20`)
            .then(response => {
                return response.json();
            })
            .then(fetchResult => {
                let show = this.renderDetailResultTable(fetchResult);
                ReactDOM.render(show, document.getElementById('DetailDataHere'));
            })
            .catch((err) => {
                console.log('fetchDetailResult exception');
                ReactDOM.render('Loading: id=' + id + ', error=' + err, document.getElementById('DetailDataHere'));
            });
    }

    // Render search 'predictions'.  *Should* a separate React/Redux component 
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

    // Render detail record.  *Should* a separate React/Redux component 
    renderDetailResultTable = (fetchDetailResult) => {
        /* eslint no-useless-escape: 0 */
        return (
            <div>
                <b>{fetchDetailResult.nameFirst + ' ' + fetchDetailResult.nameLast}</b><br />
                {fetchDetailResult.addressStreet + ', ' + fetchDetailResult.addressCity} <br />
                {fetchDetailResult.addressState + '  ' + fetchDetailResult.addressZip + ' ' + fetchDetailResult.addressCountry}<br />
                <em>Age:</em> {fetchDetailResult.age}<br />
                <em>Interests:</em> {fetchDetailResult.interests.replace(/\',\'/g, ", ").replace(/[\'[\]]/g, "")}<br />
                <img alt="the person" style={{ width: 64, height: 64, border: 'solid 1px #bbb' }} src={"data:image/jpg;base64," + fetchDetailResult.pictureBase64} />
                <em>&nbsp;&nbsp;(minimal jpeg for test data)</em> <br />
                <span className="ShowDiscreetly"><em>Id:</em> {fetchDetailResult.id}</span>
            </div>
        );
    }

    // Main render.  The 'components' *should* be React/Redux component 
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
