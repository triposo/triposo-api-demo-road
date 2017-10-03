import React from "react";
import {
  unstable_renderSubtreeIntoContainer,
  unmountComponentAtNode
} from "react-dom";

import "../style/portal.css";

export default class Portal extends React.Component {
  disposer = null;

  componentDidMount() {
    this.renderPortal();
  }

  componentDidUpdate() {
    this.renderPortal();
  }

  componentWillUnmount() {
    this.unrenderPortal();
  }

  onClickAway = event => {
    if (event.defaultPrevented) {
      return;
    }

    const el = this.portal;
    if (
      (event.target !== el && event.target === window) ||
      (document.documentElement.contains(event.target) &&
        !this.isDescendant(el, event.target))
    ) {
      this.props.onClose(event);
    }
  };

  unrenderPortal() {
    if (!this.portal) {
      return;
    }
    this.portal.style.position = "relative";
    this.portal.removeEventListener("touchstart", this.onClickAway);
    this.portal.removeEventListener("click", this.onClickAway);

    unmountComponentAtNode(this.portal);
    document.body.removeChild(this.portal);
    document.body.classList.remove("noscroll");
    this.portal = null;

    if (this.disposer) clearTimeout(this.disposer);
  }

  renderPortal() {
    const { render } = this.props;

    if (!this.portal) {
      this.portal = document.createElement("div");
      this.portal.className = "portal";
      document.body.appendChild(this.portal);
      document.body.classList.add("noscroll");
      this.portal.addEventListener("touchstart", this.onClickAway);
      this.portal.addEventListener("click", this.onClickAway);
    }

    const portalElement = render();
    this.portalElement = unstable_renderSubtreeIntoContainer(
      this,
      portalElement,
      this.portal
    );

    document.body.classList.add("noscroll");

    this.disposer = setTimeout(() => {
      this.portal.className = "portal shown";
    }, 10);
  }

  render() {
    return null;
  }

  isDescendant(parent, child) {
    let node = child.parentNode;

    while (node !== null) {
      if (node === parent) return true;
      node = node.parentNode;
    }

    return false;
  }
}
