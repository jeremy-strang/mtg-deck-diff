import React from 'react'
import './NavBar.scss'
import icon128 from 'assets/icon128.png'

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
        <img src={icon128} className="logo" alt="Logo"></img>
        <div className="buttons">
          <button>Log In</button>
          <button>Sign Up</button>
        </div>
      </div>
    )
  }
}

export default NavBar
