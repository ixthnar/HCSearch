import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { actionCreators } from '../store/SearchData';

class FetchData extends Component {
    constructor(props) {
        super(props);
        this.state = {
            startDataPage: 0, /* TODO check the action */
            searchPattern: "",   // TODO Get these
            pageSize: 20,
            isOpen: false
        };
    }

    componentDidMount() {
        // This method is called when the component is first added to the document
        this.ensureDataFetched();
    }

    componentDidUpdate() {
        // This method is called when the route parameters change
        //this.ensureDataFetched();
    }

    ensureDataFetched() {
        let startDataPageNew = this.startDataPage || 1;
        if (this.props.match.params.startDataPage !== undefined) {
            startDataPageNew = parseInt(this.props.match.params.startDataPage, 10) || 1;
            if (isNaN(startDataPageNew))
                startDataPageNew = this.startDataPage;
            else
                this.setState({startDataPage: startDataPageNew});   
        }
        this.props.requestSearchData(this.state.searchPattern, startDataPageNew, this.state.pageSize);
    }

    render() {
        return (
            <div>
                <h1>Search Data</h1>
                <p>This component demonstrates fetching data from the server and working with URL parameters.</p>
                {renderSearchResultTable(this.props)}
                {renderPagination(this.props)}
            </div>
        );
    }
}

function renderSearchResultTable(props) {
    return (
        <table className='table table-striped'>
            <thead>
                <tr>
                    <th>Id</th>
                    <th>First</th>
                    <th>Last</th>
                </tr>
            </thead>
            <tbody>
                {props.searchResult.map(searchResultItem =>
                    <tr key={searchResultItem.id}>
                        <td>{searchResultItem.id}</td>
                        <td>{searchResultItem.nameFirst}</td>
                        <td>{searchResultItem.nameLast}</td>
                    </tr>
                )}
            </tbody>
        </table>
    );
}

function renderPagination(props) {
    const prevStartDataPage = Math.max(1, (props.startDataPage || 0) - 1);
    const nextStartDataPage = Math.max(1, (props.startDataPage || 0) + 1);
    return <p className='clearfix text-center'>
        <Link className='btn btn-default pull-left' to={`/fetch-data/${prevStartDataPage}`}>Previous</Link>
        <Link className='btn btn-default pull-right' to={`/fetch-data/${nextStartDataPage}`}>Next</Link>
        {props.isLoading ? <span>Loading...</span> : []}
    </p>;
}

export default connect(
    state => state.searchData,
    dispatch => bindActionCreators(actionCreators, dispatch)
)(FetchData);
