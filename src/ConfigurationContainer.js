import React from "react";
import ReactDOM from "react-dom";
import { Link } from "react-router-dom";
import GoogleMap from "google-map-react";
import PropTypes from "prop-types";
import { fitBounds } from "google-map-react/utils";
import SpotMarker from "./component/SpotMarker";

export default class ConfigurationContainer extends React.Component {
  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      defaultCenter: { lat: 59.938043, lng: 30.337157 },
      center: null,
      startPoint: null,
      endPoint: null
    };
  }

  componentDidMount() {
    var startInput = ReactDOM.findDOMNode(this.refs.startInput);
    this.startSearchBox = new window.google.maps.places.SearchBox(startInput);
    this.startSearchBox.addListener(
      "places_changed",
      this.onStartPlacesChanged
    );

    var endInput = ReactDOM.findDOMNode(this.refs.endInput);
    this.endSearchBox = new window.google.maps.places.SearchBox(endInput);
    this.endSearchBox.addListener("places_changed", this.onEndPlacesChanged);
  }

  componentWillUnmount() {
    this.searchBox = null;
  }

  onStartPlacesChanged = () => {
    let places = this.startSearchBox.getPlaces();
    let place = places[0];
    this.setState({
      startPoint: {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng()
      }
    });
  };

  onEndPlacesChanged = () => {
    let places = this.endSearchBox.getPlaces();
    let place = places[0];
    this.setState({
      endPoint: {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng()
      }
    });
  };

  render() {
    const { startPoint, endPoint } = this.state;
    let center = this.state.defaultCenter;
    let zoom = 14;
    if (startPoint && !endPoint) center = startPoint;

    if (this.state.startPoint && this.state.endPoint) {
      let result = fitBounds(
        {
          nw: {
            lat: Math.max(startPoint.lat, endPoint.lat),
            lng: Math.min(startPoint.lng, endPoint.lng)
          },
          se: {
            lat: Math.min(startPoint.lat, endPoint.lat),
            lng: Math.max(startPoint.lng, endPoint.lng)
          }
        },
        { width: 700, height: 300 }
      );
      center = result.center;
      zoom = result.zoom;
    }

    return (
      <div className="picker">
        <div className="picker-input">
          <input ref="startInput" placeholder="Starting point" />
          <input ref="endInput" placeholder="Destination" />
          {startPoint && endPoint
            ? <Link
                to={`/trip/${startPoint.lat}/${startPoint.lng}/to/${endPoint.lat}/${endPoint.lng}`}
              >
                Get Route
              </Link>
            : ""}
        </div>
        <div className="picker-map">
          <GoogleMap defaultZoom={12} zoom={zoom} center={center}>
            {startPoint
              ? <SpotMarker lat={startPoint.lat} lng={startPoint.lng} />
              : null}
            {endPoint
              ? <SpotMarker
                  lat={endPoint.lat}
                  lng={endPoint.lng}
                  secondary={true}
                />
              : null}
          </GoogleMap>
        </div>
      </div>
    );
  }
}
