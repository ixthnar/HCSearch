import React, { Component } from 'react';
import { connect } from 'react-redux';

class SearchList extends Component {
    render() {
        const { works } = this.props;

        return (
            <table className="table table-hover">
                <thead>
                    <tr>
                        <th>Nome</th>
                    </tr>
                </thead>
                <tbody> works.map((work) => <tr ><td></td></tr></tbody>
            </table>
        );
    }

}

function mapStateToProps({ works }) {
    return {
        works: 'temp' /*works.works*/
    }
}

export default connect(mapStateToProps)(SearchList);