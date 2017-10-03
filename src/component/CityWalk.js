import React from "react";
import { observer } from "mobx-react";
import PoiItem from "./PoiItem";

class CityWalk extends React.Component {
  createGoogleMapsLink() {
    let cw = this.props.cityWalk;

    let p = [];
    p.push("saddr=" + cw.lat + "," + cw.lng);
    p.push(
      "daddr=" +
        cw.waypoints
          .map(wp => wp.coordinates.latitude + "," + wp.coordinates.longitude)
          .join("+to:") +
        "+to:" +
        cw.lat +
        "," +
        cw.lng
    );
    p.push("dirflg=w");
    return "https://www.google.com/maps?" + p.join("&");
  }

  createPermalink() {
    const { cityWalk } = this.props;
    return `https://www.triposo.com/demo/citywalk/${cityWalk.lat}/${cityWalk.lng}/${cityWalk.visit}/${cityWalk.time}/${cityWalk.seed}`;
  }

  render() {
    const { cityWalk } = this.props;
    return (
      <div className="citywalk-list">
        <h2>{cityWalk.location.name} City Walk</h2>
        <ul className="citywalk-info">
          <li>
            <label>Total Duration</label> {cityWalk.totalDuration} minutes
          </li>
          <li>
            <label>Distance</label> {(cityWalk.walkDistance / 1000).toFixed(1)}{" "}
            km
          </li>
          <li>
            <label>Walking duration</label> {cityWalk.walkDuration} minutes
          </li>
          <li>
            <label>Permalink</label> <a href={this.createPermalink()}>link</a>
            <div title="Permalink">
              <div>
                <p>
                  Refreshing this page results in a new City walk each time.
                </p>
                <p>
                  Using the permalink you can send this exact city walk to a
                  friend or save it for later.
                </p>
                <p>
                  <a href={this.createPermalink()}>Permalink</a>
                </p>
              </div>
            </div>
          </li>
        </ul>

        <div className="waypoints">
          {cityWalk.waypoints.map((waypoint, n) =>
            <WayPoint key={n} waypoint={waypoint} />
          )}
          <div className="endpoint"><div>end</div></div>
        </div>

        <br />

        <a className="action" href={this.createGoogleMapsLink()}>
          Open in Google Maps
        </a>
      </div>
    );
  }
}

export default observer(CityWalk);

class WayPoint extends React.Component {
  render() {
    const { waypoint } = this.props;

    return (
      <div className="waypoint">
        <div className="waypoint-info">
          <div className="number">{waypoint.number}</div>
          <div className="duration">&nbsp;</div>
        </div>
        {waypoint.poi ? <PoiItem poi={waypoint.poi} /> : ""}
        <div className="to-next">
          <span className="line" />
          <span className="time">
            {waypoint.walkToNextDuration}
            <em>min</em>
          </span>
          <span className="line" />
        </div>
      </div>
    );
  }
}
