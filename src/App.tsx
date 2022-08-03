import React from 'react'
import './App.scss'
import { DeckComparer } from './helpers/deckComparer'

interface IProps {
  deckListStrA: string
  deckListStrB: string
}

interface IState {
  deckListStrA: string
  deckListStrB: string
  diffListStr: string
}

class App extends React.Component<IProps, IState> {
  private deckInputA: React.RefObject<HTMLTextAreaElement>
  private deckInputB: React.RefObject<HTMLTextAreaElement>
  private diffOutput: React.RefObject<HTMLTextAreaElement>

  constructor(props: IProps) {
    super(props)

    this.deckInputA = React.createRef<HTMLTextAreaElement>()
    this.deckInputB = React.createRef<HTMLTextAreaElement>()
    this.diffOutput = React.createRef<HTMLTextAreaElement>()

    let deckListStrA = window.localStorage ? window.localStorage.getItem('deckListStrA') || '' : ''
    this.state = {
      deckListStrA: deckListStrA,
      deckListStrB: '',
      diffListStr: '',
    } as IState
  }

  componentDidUpdate = () => {
    this.resetScroll()
  }

  resetScroll = () => {
    if (this.deckInputA && this.deckInputA.current) {
      this.deckInputA.current.scrollTop = 0
    }
    if (this.deckInputB && this.deckInputB.current) {
      this.deckInputB.current.scrollTop = 0
    }
    if (this.diffOutput && this.diffOutput.current) {
      this.diffOutput.current.scrollTop = 0
    }
    this.diffOutput.current?.focus()
  }

  computeDiffListStr = (deckListStrA: string, deckListStrB: string): string => {
    const deckListA = new DeckComparer(deckListStrA)
    return deckListA.computeDiff(new DeckComparer(deckListStrB)).toString()
  }

  handleChangeA = (e: any) => {
    const deckListStrA = e.target.value || ''
    if (window.localStorage) {
      window.localStorage.setItem('deckListStrA', deckListStrA)
    }
    if (this.state.deckListStrB) {
      this.setState({
        deckListStrA,
        diffListStr: this.computeDiffListStr(e.target.value, this.state.deckListStrB),
      }, () => this.resetScroll())
    } else {
      this.setState({
        deckListStrA,
      })
    }
  }

  handleChangeB = (e: any) => {
    if (this.state.deckListStrA) {
      this.setState({
        deckListStrB: e.target.value,
        diffListStr: this.computeDiffListStr(this.state.deckListStrA, e.target.value),
      })
    } else {
      this.setState({
        deckListStrB: e.target.value,
      })
    }
  }

  render(): React.ReactNode {
    let resultWrap: React.ReactNode

    if (this.state.deckListStrA && this.state.deckListStrB) {
      resultWrap = <div className='Width100'>
        <div className='DeckListWrap'>
          <h4>Results</h4>
          <textarea
            className='DeckList'
            value={this.state.diffListStr}
            ref={this.diffOutput}
            rows={15}
            readOnly={true}></textarea>
        </div>
      </div>
    } else {
      resultWrap = <div className='Width100'>
        <h4 className='TextCenter'>Add two decklists to compute their differences</h4>
      </div>
    }
    return (
      <div className="App">
        <div className='Width100'>
          <div className='DeckListWrap'>
            <h4>Deck A</h4>
            <textarea
              className='DeckList'
              value={this.state.deckListStrA}
              onChange={this.handleChangeA}
              ref={this.deckInputA}
              rows={15}></textarea>
          </div>

          <div className='DeckListWrap'>
            <h4>Deck B</h4>
            <textarea
              className='DeckList'
              value={this.state.deckListStrB}
              ref={this.deckInputB}
              onChange={this.handleChangeB}
              rows={15}></textarea>
          </div>
        </div>
        {resultWrap}
      </div>
    )
  }
}

export default App
