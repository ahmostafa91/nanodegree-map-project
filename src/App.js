import React, { Component } from "react";
import PlaceList from "./PlaceList";

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      locationsArr: require("./places.json"), // data from the JSON file
      map: "",
      infowindow: "",
      prevmarker: ""
    };

    this.initMap = this.initMap.bind(this);
    this.openInfoWindow = this.openInfoWindow.bind(this);
    this.closeInfoWindow = this.closeInfoWindow.bind(this);
  }
// hello
  componentDidMount() {
    window.initMap = this.initMap;
    // used to load the google map script asynchronously, passing in the callback reference
    map(
      "https://maps.googleapis.com/maps/api/js?key=AIzaSyADFVSwmTEYHpJYL2saxzXtLdOTrHEah7s&callback=initMap"
    );
  }

  // Initialise the map
   
  initMap() {
    const self = this;
    const alexandria = { lat: 31.215814, lng: 29.916423 };

    const mapContainer = document.getElementById("map");
    const map = new window.google.maps.Map(mapContainer, {
      center: alexandria,
      zoom: 12,
      mapTypeControl: false
    });

    const InfoWindow = new window.google.maps.InfoWindow({});

    window.google.maps.event.addListener(InfoWindow, "closeclick", function() {
      self.closeInfoWindow();
    });

    this.setState({
      map: map,
      infowindow: InfoWindow
    });

    window.google.maps.event.addDomListener(window, "resize", function() {
      var center = map.getCenter();
      window.google.maps.event.trigger(map, "resize");
      self.state.map.setCenter(center);
    });

    window.google.maps.event.addListener(map, "click", function() {
      self.closeInfoWindow();
    });

    var locationsArr = [];
    this.state.locationsArr.forEach((location) => {
      var fullName = location.name;
      var marker = new window.google.maps.Marker({
        position: new window.google.maps.LatLng(
          location.latitude,
          location.longitude
        ),
        animation: window.google.maps.Animation.DROP,
        map: map
      });

      marker.addListener("click", function() {
        self.openInfoWindow(marker);
      });

      location.fullName = fullName;
      location.marker = marker;
      location.display = true;
      locationsArr.push(location);
    });
    this.setState({
      locationsArr: locationsArr
    });
  }

// InfoWindow opening

  openInfoWindow(marker) {
    this.closeInfoWindow();
    this.state.infowindow.open(this.state.map, marker);
    marker.setAnimation(window.google.maps.Animation.BOUNCE);
    this.setState({
      prevmarker: marker
    });
    this.state.infowindow.setContent("Loading Data...");
    this.state.map.setCenter(marker.getPosition());
    this.state.map.panBy(0, -100);
    this.getInfo(marker);
  }

  // get data from foursquare api
  getInfo(info) {
    const self = this;

    // api keys
    const cI = "OFNALL3FUUKKBT1XYWUNL2FU3EVFC1LMWRHZQP4QZTUDVW0W";
    const cS = "E0YGT4AEBC3G530BCP5ZRQQMXSVR3GWFDO5ZOGBZ4DEI3I2D";

    // add info to the url and fetching it
    const url =
      "https://api.foursquare.com/v2/venues/search?client_id=" +
      cI +
      "&client_secret=" +
      cS +
      "&v=20130815&ll=" +
      info.getPosition().lat() +
      "," +
      info.getPosition().lng() +
      "&limit=1";
    fetch(url)
      .then((response) => {
        if (response.status !== 200) {
          self.state.infowindow.setContent("Sorry data failure");
          return;
        }

        // using the responsed data
        response.json().then((data) => {
          console.log(data);

          let fourSData = data.response.venues[0];
          let place = `<h3>${fourSData.name}</h3>`;
          let street = `<p>${fourSData.location.formattedAddress[0]}</p>`;
          let longAddress = `<p><span>${fourSData.location.formattedAddress[1]}</span> <span>${fourSData.location.formattedAddress[2]}</span></p>`;
          let readMore =
            '<a href="https://foursquare.com/v/' +
            fourSData.id +
            '" target="_blank">For Information And Review About The Place</a>';
          self.state.infowindow.setContent(
            place + street + longAddress + readMore
          );
        });
      })
      .catch((err) => {
        self.state.infowindow.setContent("Sorry data can't be loaded");
      });
  }

  closeInfoWindow() {
    if (this.state.prevmarker) {
      this.state.prevmarker.setAnimation(null);
    }
    this.setState({
      prevmarker: ""
    });
    this.state.infowindow.close();
  }

  render() {
    return (
      <div className="app">
        <header className="app-header">
          <h1 className="app-title">Welcome To Alexandria</h1>
        </header>
        <div className="app-body">
          <PlaceList
            key="100"
            locationsArr={this.state.locationsArr}
            openInfoWindow={this.openInfoWindow}
            closeInfoWindow={this.closeInfoWindow}
          />
          <div id="map" role="application"></div>
        </div>
      </div>
    );
  }
}

export default App;

// Load the google map

function map(src) {
  var ref = window.document.getElementsByTagName("script")[0];
  var script = window.document.createElement("script");
  script.src = src;
  script.async = true;
  script.onerror = function() {
    document.write("Google Maps can't be loaded");
  };
  ref.parentNode.insertBefore(script, ref);
}
