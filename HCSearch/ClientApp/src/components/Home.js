import React from 'react';
import { connect } from 'react-redux';
import SearchBar from './SearchBar';
import SearchResult from './SearchResult';

const Home = props => (
  <div>
        <h1>HC Search</h1>
        <SearchBar/>
        <SearchResult/>
  </div>
);

export default connect()(Home);
