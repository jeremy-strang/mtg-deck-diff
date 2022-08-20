import React from 'react'
import './Footer.scss'

interface IProps {
}

interface IState {
}

class Footer extends React.Component<IProps, IState> {
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
      <div className="Footer">
        Check out the source on <a href="https://www.github.com/jeremy-strang/mtg-deck-diff">GitHub</a>
      </div>
    )
  }
}

export default Footer
