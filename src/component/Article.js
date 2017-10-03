import React from "react";
import TriposoImage from "./TriposoImage";
import "../style/article.css";

export default class Article extends React.Component {
  render() {
    const { sections } = this.props;

    return (
      <div className="article">
        {sections.map((item, n) => <ArticleItem key={n} item={item} />)}
      </div>
    );
  }
}

class ArticleItem extends React.Component {
  render() {
    const { item } = this.props;

    return (
      <div className="article-item">
        {item.title ? <h2>{item.title}</h2> : ""}
        {item.image ? <TriposoImage image={item.image} /> : ""}
        {item.body ? <p dangerouslySetInnerHTML={{ __html: item.body }} /> : ""}
      </div>
    );
  }
}
