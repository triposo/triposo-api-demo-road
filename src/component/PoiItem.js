import React from "react";
import { observer } from "mobx-react";
import Poi from "./Poi";
import Portal from "./Portal";
import classNames from "classnames";

import "../style/poiitem.css";

class PoiItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      expand: false
    };
  }

  componentDidMount() {
    if (this.props.showLocation) {
      this.props.poi.fetchLocation().then(loc => {
        if (loc.isCity) loc.fetchCountry();
      });
    }
  }

  findImage(o) {
    if (o.images && o.images.length) {
      if (o.images[0].sizes) {
        if (o.images[0].sizes.medium) return o.images[0].sizes.medium.url;
        if (o.images[0].sizes.thumbnail) return o.images[0].sizes.thumbnail.url;
      }
    }

    return "/static/demo/img/location_placeholder.jpg";
  }

  openAction = e => {
    if (e) e.preventDefault();
    this.setState({ open: true });
  };

  renderPortal = () => {
    return <Poi poiId={this.props.poi.id} />;
  };

  onClosePortal = () => {
    this.setState({ open: false });
  };

  render() {
    const { poi, bookUrl } = this.props;
    const cls = classNames({
      "poi-item": true,
      "poi-item-shown": true,
      "poi-item-use-collapse": this.props.collapsed ? true : false,
      "poi-item-expand": this.state.expand
    });

    return (
      <div className={cls}>

        <div
          className="poi-image"
          style={{ backgroundImage: `url('${this.findImage(poi)}')` }}
          onClick={() => {
            if (!this.props.collapsed) this.setState({ open: true });
          }}
          onMouseOver={() => {
            poi.hover = true;
          }}
          onMouseOut={() => {
            poi.hover = false;
          }}
        >

          <h3>
            <a
              className="title"
              href="#0"
              onClick={e => {
                e.preventDefault();
                this.setState({ open: true });
              }}
            >
              {poi.name}
            </a>
            <a
              className="expand"
              href="#0"
              onClick={e => {
                e.preventDefault();
                this.setState({ expand: !this.state.expand });
              }}
            >
              {!this.state.expand
                ? <svg height="24" viewBox="0 0 24 24" width="24">
                    <path d="M0 0h24v24H0z" fill="none" />
                    <path d="M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4V7zm-1-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                  </svg>
                : <svg height="24" viewBox="0 0 24 24" width="24">
                    <path d="M0 0h24v24H0z" fill="none" />
                    <path d="M7 11v2h10v-2H7zm5-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                  </svg>}
            </a>
          </h3>
        </div>

        <h3>
          <a className="name" href="#" onClick={this.openAction}>{poi.name}</a>

          {bookUrl ? <a href={bookUrl} className="action-book">book</a> : ""}
        </h3>
        {this.props.showLocation
          ? <h4>
              {poi.location ? poi.location.name : "Loading..."}
              {poi.location && poi.location.isCity
                ? poi.location.country
                  ? <span>, {poi.location.country.name}</span>
                  : <span>Loading ...</span>
                : ""}
            </h4>
          : ""}

        {this.state.open
          ? <Portal render={this.renderPortal} onClose={this.onClosePortal} />
          : ""}
      </div>
    );
  }
}

export default observer(PoiItem);
