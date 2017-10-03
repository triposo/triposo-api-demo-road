import React from "react";

import Loading from "./Loading";
import Article from "./Article";
import Sources from "./Sources";

import { apiRequest } from "../utils/apirequest.js";

import "../style/poi.css";

export default class Poi extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      poi: null
    };
  }

  componentDidMount() {
    apiRequest(
      `poi.json?id=${this.props
        .poiId}&fields=name,id,content,score,booking_info`
    )
      .then(json => {
        this.setState({ poi: json.results[0] });
      })
      .catch(rejected => {
        console.log("REJECTED: ", rejected);
      });
  }

  render() {
    return (
      <div>
        {this.state.poi ? <PoiBody poi={this.state.poi} /> : <Loading />}
      </div>
    );
  }
}

class PoiBody extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      shown: false
    };
  }

  componentDidMount() {
    this.setState({ shown: true });
  }

  render() {
    const { poi } = this.props;

    return (
      <div className={this.state.shown ? "poi shown" : "poi"}>
        <h1>
          {poi.name}
          {poi.booking_info
            ? <a
                className="action-book"
                href={poi.booking_info.vendor_object_url}
                target="_blank"
              >
                Book
              </a>
            : ""}
        </h1>
        <Article sections={poi.content.sections} />
        {poi.content.attribution
          ? <Sources sources={poi.content.attribution} />
          : ""}
      </div>
    );
  }
}
