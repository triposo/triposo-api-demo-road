import React from "react";
import { observer } from "mobx-react";
import GoogleMap from "google-map-react";
import { fitBounds } from "google-map-react/utils";
import SpotMarker from "./SpotMarker";
import NumberMarker from "./NumberMarker";

class CityWalkMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stops: [],
      legs: [],
      duration: 0,
      distance: 0
    };
  }

  calculateDistanceAndDuration(legs, max = 0) {
    let distance = 0;
    let duration = 0;
    if (max === 0) max = legs.length;

    for (let i = 0; i < max; i++) {
      let leg = legs[i];
      distance += leg.distance.value;
      duration += leg.duration.value;
    }
    return { distance, duration };
  }

  onMapsLoaded = o => {
    const { store } = this.props;
    if (!store.cityWalk) return;
    let waypoints = store.cityWalk.waypoints;

    this.directionsService = new window.google.maps.DirectionsService();
    this.directionsDisplay = new window.google.maps.DirectionsRenderer({
      suppressMarkers: true
    });
    this.directionsDisplay.setMap(o.map);
    let request = {
      origin: new window.google.maps.LatLng(this.props.lat, this.props.lng),
      destination: new window.google.maps.LatLng(
        this.props.lat,
        this.props.lng
      ),
      travelMode: "WALKING",
      waypoints: waypoints.map(wp => {
        return {
          location: new window.google.maps.LatLng(
            wp.coordinates.latitude,
            wp.coordinates.longitude
          )
        };
      })
    };

    this.directionsService.route(request, (response, status) => {
      if (status === "OK") {
        const { duration, distance } = this.calculateDistanceAndDuration(
          response.routes[0].legs
        );
        this.directionsDisplay.setDirections(response);
        this.setState({
          legs: response.routes[0].legs,
          duration: duration,
          distance: distance
        });
      }
    });
  };

  render() {
    const { store, lat, lng } = this.props;
    let markers = [];

    store.cityWalk.waypoints.forEach((wp, n) => {
      if (wp.poi) {
        markers.push(
          <NumberMarker
            key={wp.poi.id}
            number={wp.number}
            store={store}
            poi={wp.poi}
            lat={wp.coordinates.latitude}
            lng={wp.coordinates.longitude}
          />
        );
      }
    });

    let minMax = store.getMinMaxLatLng();
    let bounds = fitBounds(
      {
        nw: { lat: minMax.maxLat, lng: minMax.minLng },
        se: { lat: minMax.minLat, lng: minMax.maxLng }
      },
      { width: 1000, height: 600 }
    );

    markers.push(<SpotMarker key="spot-marker" lat={lat} lng={lng} />);

    return (
      <div className="city-walk-map">
        <GoogleMap
          defaultZoom={12}
          zoom={bounds.zoom}
          center={bounds.center}
          onGoogleApiLoaded={this.onMapsLoaded}
          yesIWantToUseGoogleMapApiInternals
        >
          {markers}
        </GoogleMap>
      </div>
    );
  }
}

export default observer(CityWalkMap);
