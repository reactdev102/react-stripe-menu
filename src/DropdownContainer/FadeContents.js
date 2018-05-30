import React, { Component } from "react"
import PropTypes from "prop-types"
import styled from "styled-components"
import { tween, styler } from "popmotion"

const FadeContainer = styled.div`
  position: ${props => (props.animatingOut ? "absolute" : "relative")};
  top: 0;
  left: 0;
`

class FadeContents extends Component {
  static propTypes = {
    duration: PropTypes.number,
    direction: PropTypes.oneOfType(["right", "left"]),
    animatingOut: PropTypes.bool,
    children: PropTypes.node,
    innerRef: PropTypes.func
  }

  componentDidMount() {
    const { direction, animatingOut, duration } = this.props
    if (!direction) return
    const from = {
      opacity: animatingOut ? 1 : 0,
      translateX: animatingOut ? 0 : direction === "left" ? 100 : -100
    }
    const to = {
      opacity: animatingOut ? 0 : 1,
      translateX: !animatingOut ? 0 : direction === "left" ? -100 : 100
    }
    tween({
      from,
      to,
      duration
    }).start(transforms => {
      this.el && styler(this.el).set(transforms)
    })
  }

  render() {
    const { children, animatingOut, innerRef } = this.props
    return (
      <FadeContainer
        animatingOut={animatingOut}
        innerRef={el => {
          this.el = el
          innerRef(el)
        }}
      >
        {children}
      </FadeContainer>
    )
  }
}

export default FadeContents
