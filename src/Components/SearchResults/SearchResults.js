import "./SearchResults.css";
import TrackList from "../TrackList/TrackList";
import React from "react";

class SearchResults extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="SearchResults">
        <h2>Results</h2>
        <TrackList onAdd={this.props.onAdd} isRemoval={false} tracks={this.props.searchResults} />
      </div>
    );
  }
}

export default SearchResults;
