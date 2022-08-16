import React, { Component } from 'react'

import ReactTooltip from 'react-tooltip'


export default class Tooltip extends Component<any> {

  componentDidMount () {
    if (this.props.showInitial) {
      this.showTooltip()
    }
  }

  showTooltip () {
    let tooltip = document.querySelectorAll(`[data-tip][data-for="${this.props.id}"]`)[0]
    ReactTooltip.show(tooltip)
  }

  render () {
    const { children, showInitial, ...props } = this.props
    if (!children) return null

    return (
      <ReactTooltip {...props}>
        {children}
      </ReactTooltip>
    )
  }
}