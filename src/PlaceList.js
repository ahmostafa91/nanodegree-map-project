import React, { Component } from "react";
import Place from "./Place";

class PlaceList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      locations: "",
      query: "",
      suggestions: true
    };

    this.filter = this.filter.bind(this);
  }

  // filter places

  filter(event) {
    this.props.closeInfoWindow();
    const { value } = event.target;
    var locations = [];
    this.props.locationsArr.forEach(function(location) {
      if (location.fullName.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
        location.marker.setVisible(true);
        locations.push(location);
      } else {
        location.marker.setVisible(false);
      }
    });

    this.setState({
      locations: locations,
      query: value
    });
  }

  componentWillMount() {
    this.setState({
      locations: this.props.locationsArr
    });
  }

  render() {
    var locationlist = this.state.locations.map(function(listItem, index) {
      return (
        <Place
          key={index}
          openInfoWindow={this.props.openInfoWindow.bind(this)}
          data={listItem}
        />
      );
    }, this);

    return (
      <section className="search-sidebar">
        <h3 id="search-sidebar-title">Alexandria Places</h3>
        <input
          role="search"
          id="search-field"
          className="search-filter"
          type="text"
          placeholder="Type Place Name"
          value={this.state.query}
          onChange={this.filter}
        />
        <ul className="location-list" aria-labelledby="search-sidebar-title">
          {this.state.suggestions && locationlist}
        </ul>
      </section>
    );
  }
}

export default PlaceList;
