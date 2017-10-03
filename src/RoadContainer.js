import React from "react";
import { observer } from "mobx-react";
import GoogleMap from "google-map-react";
import { fitBounds } from "google-map-react/utils";
import ColorMarker from "./component/ColorMarker";

class RoadContainer extends React.Component {
  componentDidMount() {
    const { fromLat, fromLng, toLat, toLng } = this.props.params;
    this.props.store.startPoint = {
      lat: parseFloat(fromLat),
      lng: parseFloat(fromLng)
    };
    this.props.store.endPoint = {
      lat: parseFloat(toLat),
      lng: parseFloat(toLng)
    };
  }

  onMapsLoaded = o => {
    const { store } = this.props;
    this.directionsService = new window.google.maps.DirectionsService();
    this.directionsDisplay = new window.google.maps.DirectionsRenderer();
    this.directionsDisplay.setMap(o.map);
    let request = {
      origin: new window.google.maps.LatLng(
        store.startPoint.lat,
        store.startPoint.lng
      ),
      destination: new window.google.maps.LatLng(
        store.endPoint.lat,
        store.endPoint.lng
      ),
      travelMode: "DRIVING"
    };

    this.directionsService.route(request, (response, status) => {
      if (status === "OK") {
        console.log(response);
        this.directionsDisplay.setDirections(response);
        store.setRoute(
          response.routes[0].legs[0],
          response.routes[0].overview_polyline
        );
      }
    });
  };

  render() {
    const { store } = this.props;
    if (!store.startPoint) return <div>Loading</div>;

    let bounds = fitBounds(
      {
        nw: {
          lat: Math.max(store.startPoint.lat, store.endPoint.lat),
          lng: Math.min(store.startPoint.lng, store.endPoint.lng)
        },
        se: {
          lat: Math.min(store.startPoint.lat, store.endPoint.lat),
          lng: Math.max(store.startPoint.lng, store.endPoint.lng)
        }
      },
      { width: 600, height: 900 }
    );

    let markers = [];
    if (store.highlights.length) {
      markers.push(
        ...store.highlights.map((poi, n) =>
          <ColorMarker
            key={poi.id}
            lat={poi.coordinates.latitude}
            lng={poi.coordinates.longitude}
            color={1}
            poi={poi}
          />
        )
      );
    }

    return (
      <div className="road-container">
        {store.isLoading ? <p>Loading</p> : ""}
        <div className="map">
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
      </div>
    );
  }
}

export default observer(RoadContainer);
