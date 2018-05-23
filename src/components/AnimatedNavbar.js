import React, { Component } from "react"
import PropTypes from "prop-types"
import Navbar from "./Navbar"
import NavbarItem from "./Navbar/NavbarItem"
import Flipper from "./Flipper"
import DropdownContainer from "./DropdownContainer"
import CompanyDropdown from "./DropdownContents/CompanyDropdown"
import DevelopersDropdown from "./DropdownContents/DevelopersDropdown"
import ProductsDropdown from "./DropdownContents/ProductsDropdown"
import TransitionContents from "./DropdownContainer/TransitionContents"

const navbarConfig = [
  { title: "Products", dropdown: ProductsDropdown },
  { title: "Developers", dropdown: DevelopersDropdown },
  { title: "Company", dropdown: CompanyDropdown }
]

export default class AnimatedNavbar extends Component {
  static propTypes = {
    tweenConfig: PropTypes.shape({
      duration: PropTypes.number,
      easing: PropTypes.func
    })
  }
  state = {
    activeIndex: undefined,
    prevActiveIndex: undefined,
    animatingOut: false
  }

  resetDropdownState = () => {
    this.setState({
      animatingOut: false,
      activeIndex: undefined,
      prevActiveIndex: undefined
    })
  }

  onMouseEnter = i => {
    if (this.pendingDropdownRemoval) {
      this.resetDropdownState()
      clearTimeout(this.pendingDropdownRemoval)
      delete this.pendingDropdownRemoval
    }
    // set to next tick to make sure that if there was a previous dropdown,
    // it has been removed (setState is async)
    setTimeout(() => {
      this.setState(prevState => ({
        activeIndex: i,
        prevActiveIndex: prevState.activeIndex,
        animatingOut: false
      }))
    })
  }

  onMouseLeave = () => {
    if (this.state.animatingOut) return
    this.setState({
      animatingOut: true
    })
    this.pendingDropdownRemoval = true
    this.pendingDropdownRemoval = setTimeout(
      this.resetDropdownState,
      this.props.tweenConfig.duration
    )
  }

  render() {
    const { tweenConfig } = this.props

    let CurrentDropdown
    if (this.state.activeIndex !== undefined)
      CurrentDropdown = navbarConfig[this.state.activeIndex].dropdown

    let direction
    let PrevDropdown
    if (this.state.prevActiveIndex !== undefined) {
      direction =
        this.state.activeIndex > this.state.prevActiveIndex ? "right" : "left"
      PrevDropdown = navbarConfig[this.state.prevActiveIndex].dropdown
    }

    return (
      <Flipper flipKey={this.state.activeIndex} tweenConfig={tweenConfig}>
        <Navbar onMouseLeave={this.onMouseLeave}>
          {navbarConfig.map((n, index) => {
            return (
              <NavbarItem
                title={n.title}
                index={index}
                onMouseEnter={this.onMouseEnter}
              >
                {this.state.activeIndex === index && (
                  <DropdownContainer
                    direction={direction}
                    animatingOut={this.state.animatingOut}
                    tweenConfig={this.props.tweenConfig}
                  >
                    <TransitionContents
                      direction={direction}
                      tweenConfig={this.props.tweenConfig}
                    >
                      <CurrentDropdown />
                    </TransitionContents>
                    {PrevDropdown && (
                      <TransitionContents
                        animatingOut
                        direction={direction}
                        tweenConfig={this.props.tweenConfig}
                      >
                        <PrevDropdown />
                      </TransitionContents>
                    )}
                  </DropdownContainer>
                )}
              </NavbarItem>
            )
          })}
        </Navbar>
      </Flipper>
    )
  }
}
