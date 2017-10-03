import React from 'react'

export default class Attribution extends React.Component {

  formatSource(o) {
    let attributionLink = `<a href='${o.attribution_link}'>${o.attribution_text}</a>`
    let licenseLink = `<a href=${o.license_link}>${o.license_text}</a>`
    let result = o.format.replace('{attribution}', attributionLink)
    result = result.replace('{license}', licenseLink)
    return result
  }

  render() {
    const {source} = this.props

    return (
      <div className="attribution">
        <p dangerouslySetInnerHTML={{__html: this.formatSource(source)}}></p>
      </div>
    )
  }
}
