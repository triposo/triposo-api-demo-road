import React from "react";
import Attribution from "./Attribution";

import "../style/triposoimage.css";

export default class TriposoImage extends React.Component {
  findImageSize(sizes) {
    if (sizes) {
      if (sizes.medium) return sizes.medium;
      if (sizes.thumbnail) return sizes.thumbnail;
    }
    return { width: 640, height: 480, url: "/static/demo/img/placeholder.png" };
  }

  render() {
    const { image } = this.props;

    let size = this.findImageSize(image.sizes);
    let height = 700 / (size.width / size.height);
    const style = {
      backgroundImage: `url(${size.url})`,
      height: this.props.height ? this.props.height : `${height}px`
    };

    return (
      <div className="triposo-image" style={style}>
        <div className="meta">
          {image.caption ? <p className="bit caption">{image.caption}</p> : ""}
          <Attribution source={image.attribution} />
        </div>
      </div>
    );
  }
}
