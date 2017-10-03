import React from "react";
import { apiRequest } from "../utils/apirequest.js";
import Attribution from "./Attribution";

export default class Source extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      source: null
    };
  }

  componentDidMount() {
    this.fetchSource(this.props.source);
  }

  fetchSource(source) {
    apiRequest(`source.json?id=${source.source_id}`).then(json => {
      let result = json.results[0];
      result.attribution_link = source.url;
      this.setState({ source: result });
    });
  }

  render() {
    return (
      <div className="source">
        {this.state.source
          ? <Attribution source={this.state.source} />
          : <span>Loading</span>}
      </div>
    );
  }
}
