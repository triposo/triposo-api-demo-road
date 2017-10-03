import React from "react";
import { observer } from "mobx-react";
import classNames from "classnames";

class ColorMarker extends React.Component {
  render() {
    let cls = classNames({
      "color-marker": true,
      "info-marker": true,
      [`color-marker-${this.props.color}`]: true,
      "marker-active": this.props.poi.hover || this.props.$hover
    });

    return (
      <div className={cls}>
        <h2>
          {this.props.poi.name}
        </h2>
        <div>&nbsp;</div>
      </div>
    );
  }
}

export default observer(ColorMarker);
