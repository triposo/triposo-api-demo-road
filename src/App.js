import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Store from "./store/Store";

import ConfigurationContainer from "./ConfigurationContainer";
import RoadContainer from "./RoadContainer";

import "./style/core.css";
import "./style/typography.css";
import "./style/map.css";
import "./style/ui.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      store: new Store()
    };
  }

  render() {
    return (
      <Router>
        <div className="app">
          <Route exact path="/" render={() => <ConfigurationContainer />} />
          <Route
            path="/trip/:fromLat/:fromLng/to/:toLat/:toLng"
            render={routeProps =>
              <RoadContainer
                params={routeProps.match.params}
                store={this.state.store}
              />}
          />
        </div>
      </Router>
    );
  }
}

export default App;
