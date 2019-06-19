import React from 'react';
import { connect } from 'react-redux';
import SearchBar from './SearchBar';

const Home = props => (
    <div>
        <h1>HC Search</h1>
        <SearchBar />
    </div>
);

export default connect()(Home);
