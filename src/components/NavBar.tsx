import React from 'react'
import './NavBar.scss'
import icon64 from 'assets/icon64.png'

interface IProps {
}

interface IState {
}

class NavBar extends React.Component<IProps, IState> {
  //
  constructor(props: IProps) {
    super(props)

    this.state = {
    } as IState
  }

  handleChange = (e: any) => {
  }

  render(): React.ReactNode {
    return (
      <div className="NavBar">
        <img src={icon64} className="logo" alt="Logo"></img>
        <div className="buttons">
          <button className="btn-primary">Log In</button>
          <button className="btn-primary">Sign Up</button>
        </div>
      </div>
    )
  }
}

export default NavBar
