import React from 'react'
import './App.scss'
import DeckComparer from './components/DeckComparer'
import Footer from './components/Footer'
import NavBar from './components/NavBar'

interface IProps {
}

interface IState {
}

class App extends React.Component<IProps, IState> {

  constructor(props: IProps) {
    super(props)

    this.state = {
    } as IState
  }

  render(): React.ReactNode {
    return (
      <div className="App">
        <NavBar></NavBar>
        <DeckComparer></DeckComparer>
        <Footer></Footer>
      </div>
    )
  }
}

export default App
