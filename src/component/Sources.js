import React from 'react'
import Source from './Source'

export default class Sources extends React.Component {


  render() {
    const {sources} = this.props
    return (
      <div className="sources">
        {sources.map((source, n) => <Source key={'source-'+n} className="source" source={source} />)}
      </div>
    )
  }
}
